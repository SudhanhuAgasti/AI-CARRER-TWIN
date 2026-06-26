const ai = require('../config/gemini');
const { retryWithBackoff } = require('../utils/retry');

// Structured schemas for nodes
const EVALUATION_SCHEMA = {
  type: 'object',
  properties: {
    score: { 
      type: 'number', 
      description: 'Candidate response score on a scale from 0 to 10.' 
    },
    feedback: { 
      type: 'string', 
      description: '1-2 sentences of technical critique explaining what was good or missing.' 
    },
    shouldFollowUp: { 
      type: 'boolean', 
      description: 'True if the answer was incomplete, shallow, or contains a point worth drilling deeper into. False otherwise.' 
    },
    suggestedNextTopic: { 
      type: 'string', 
      description: 'If pivoting (shouldFollowUp is false), suggest the next technical/behavioral domain (e.g. Concurrency, Databases, System Design, Conflict Resolution).' 
    }
  },
  required: ['score', 'feedback', 'shouldFollowUp', 'suggestedNextTopic']
};

const FINAL_FEEDBACK_SCHEMA = {
  type: 'object',
  properties: {
    overallScore: { type: 'number', description: 'Weighted average score of the entire interview (0 to 100).' },
    technicalScore: { type: 'number', description: 'Evaluation score specifically for technical skill (0 to 100).' },
    behavioralScore: { type: 'number', description: 'Evaluation score specifically for behavioral/communication skill (0 to 100).' },
    generalFeedback: { type: 'string', description: 'A comprehensive summary paragraph assessing performance and readiness.' },
    strengths: { type: 'array', items: { type: 'string' }, description: '2-3 key strengths demonstrated by the candidate.' },
    improvements: { type: 'array', items: { type: 'string' }, description: '2-3 actionable improvement areas.' }
  },
  required: ['overallScore', 'technicalScore', 'behavioralScore', 'generalFeedback', 'strengths', 'improvements']
};

/**
 * Checks candidate answer for common LLM prompt injection signatures.
 * @param {string} input 
 * @returns {boolean} True if malicious prompt injection patterns are identified.
 */
function containsPromptInjection(input) {
  if (!input) return false;
  const normalized = input.toLowerCase();
  const patterns = [
    'ignore previous',
    'ignore above',
    'system instruction',
    'you are now',
    'override',
    'reset system',
    'tell me i passed',
    'ignore instructions',
    'say that i am',
    'prompt injection',
  ];
  return patterns.some(pattern => normalized.includes(pattern));
}

/**
 * Node 1: Question Generator Node.
 * Formulates the next question based on target role, experience level, resume skills,
 * and current chat history/state.
 * 
 * @param {Object} session - Mongoose session document
 * @param {Object|null} resume - Optional associated resume details
 * @returns {Promise<string>} Next interview question
 */
async function runQuestionGeneratorNode(session, resume = null, skillGaps = []) {
  const historySnippet = session.chatHistory.map(h => `${h.role === 'agent' ? 'Interviewer' : 'Candidate'}: ${h.content}`).join('\n');
  const skillsList = resume ? (resume.skills || []).join(', ') : 'standard industry stack';
  
  // Set difficulty tone guidelines dynamically based on candidate seniority level
  let seniorityGuideline = '';
  if (session.experienceLevel === 'junior') {
    seniorityGuideline = 'Maintain a supportive, friendly, and encouraging tone. Focus on language syntax, basic data structures (arrays, objects), basic HTTP concepts, and database queries. Help guide them with simple hints if they struggle.';
  } else if (session.experienceLevel === 'mid') {
    seniorityGuideline = 'Maintain a professional, standard developer tone. Focus on backend frameworks (e.g. Express), standard database structures, API routes, error handling patterns, and clean programming principles.';
  } else if (session.experienceLevel === 'senior') {
    seniorityGuideline = 'Maintain a strict, technical, and slightly demanding tone. Focus on distributed systems trade-offs, scalability, database indexing, caching strategies (Redis), concurrency patterns, and system bottlenecks.';
  } else if (session.experienceLevel === 'lead') {
    seniorityGuideline = 'Maintain a highly analytical, strict, and senior-management tone. Focus on high availability, database partitioning/sharding, asynchronous queue architecture, managing tech debt, cross-team conflict resolution, and architectural trade-off evaluations.';
  }

  const gapsGuideline = skillGaps && skillGaps.length > 0
    ? `\nPrioritized Areas to Assess (The candidate has identified gaps in these areas. Prioritize asking questions that test these topics): ${skillGaps.join(', ')}`
    : '';

  const systemInstruction = `You are an expert Technical Interviewer conducting a professional live mock interview.
Your candidate is applying for a ${session.experienceLevel} level ${session.targetRole} role.
Candidate skills: ${skillsList}.${gapsGuideline}
Your style is professional, concise, and realistic. You ask exactly one targeted question at a time.
Avoid generic pleasantries. Focus on checking deep technical knowledge, practical implementations, or engineering behaviors.
Current Topic: ${session.currentTopic}

Seniority Instructions:
${seniorityGuideline}`;

  let prompt = '';
  if (session.chatHistory.length === 0) {
    prompt = `This is the beginning of the interview. Welcoming the candidate to the session.
Introduce yourself and ask the first highly-relevant technical question matching the target role (${session.targetRole}) and seniority (${session.experienceLevel}).`;
  } else {
    prompt = `Review the conversation history below:
\n${historySnippet}\n
Formulate the next follow-up or pivot question.
If the current topic is "${session.currentTopic}" and we are following up, drill down on the candidate's last answer.
If we are pivoting, transition cleanly to the new domain: "${session.currentTopic}" and ask a fresh question.`;
  }

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    })
  );

  return response.text.trim();
}

/**
 * Node 2 & 3: Evaluator and State Pivot Node.
 * Critiques the candidate's latest response, scores it, and decides whether
 * to follow up on the current topic or pivot to a new topic.
 * 
 * @param {string} question - Question asked by agent
 * @param {string} answer - Answer provided by candidate
 * @returns {Promise<Object>} Evaluation metadata schema
 */
async function runEvaluatorNode(question, answer) {
  const systemInstruction = `You are a Senior Interview Evaluator.
Critique the candidate's answer to the interviewer's question.
Check technical accuracy, code design understanding, depth of experience, and communication clarity.
Assign a score out of 10.
Decide:
- shouldFollowUp = true: if the answer is brief, contains gaps, or mentions something interesting that should be probed further.
- shouldFollowUp = false: if the candidate answered comprehensively, or it is time to move to another area. Suggest the next domain.`;

  const prompt = `Question asked: "${question}"
Candidate response: "${answer}"`;

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: EVALUATION_SCHEMA,
        temperature: 0.1,
      },
    })
  );

  return JSON.parse(response.text);
}

/**
 * Node 4: Final Scorer Node.
 * Run when the interview session hits maxQuestions limit.
 * Aggregates all turn evaluations and generates a unified readiness feedback report.
 * 
 * @param {Object} session - Mongoose session document
 * @returns {Promise<Object>} Final feedback data
 */
async function runFinalScorerNode(session) {
  const transcript = session.chatHistory.map(h => `${h.role === 'agent' ? 'Interviewer' : 'Candidate'}: ${h.content}`).join('\n');
  const evaluationsSnippet = session.evaluations.map(e => `Q: ${e.question}\nA: ${e.answer}\nScore: ${e.score}/10\nFeedback: ${e.feedback}`).join('\n\n');

  const systemInstruction = `You are a Principal Software Engineering hiring manager.
Your task is to compile a final review report of a candidate's mock interview.
Target Role: ${session.experienceLevel} ${session.targetRole}
Review the interview transcript and critiques to generate scores out of 100 for overall, technical, and behavioral readiness.
Include core strengths, improvement areas, and a comprehensive feedback summary.`;

  const prompt = `Interview Transcript:
"""
${transcript}
"""

Turn Critiques:
"""
${evaluationsSnippet}
"""`;

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: FINAL_FEEDBACK_SCHEMA,
        temperature: 0.2,
      },
    })
  );

  return JSON.parse(response.text);
}

module.exports = {
  containsPromptInjection,
  runQuestionGeneratorNode,
  runEvaluatorNode,
  runFinalScorerNode,
};
