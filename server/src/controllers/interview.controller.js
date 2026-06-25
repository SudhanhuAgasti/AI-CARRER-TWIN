const InterviewSession = require('../models/interviewSession.model');
const Resume = require('../models/resume.model');
const { transcribeAudio } = require('../services/audio.service');
const {
  containsPromptInjection,
  runQuestionGeneratorNode,
  runEvaluatorNode,
  runFinalScorerNode,
} = require('../services/interviewAgent.service');

/**
 * Controller handling POST /api/interview/start.
 * Creates a new interview session and generates the first question.
 */
async function startInterview(req, res, next) {
  try {
    const { resumeId, targetRole, experienceLevel, maxQuestions } = req.body;

    if (!targetRole || typeof targetRole !== 'string' || targetRole.trim().length === 0) {
      const err = new Error('targetRole is required');
      err.status = 400;
      throw err;
    }

    const level = experienceLevel || 'senior';
    const limit = maxQuestions ? Number(maxQuestions) : 5;

    // Fetch candidate resume info if resumeId is provided
    let resume = null;
    if (resumeId) {
      resume = await Resume.findById(resumeId).exec();
      if (!resume) {
        const err = new Error('Associated resume not found');
        err.status = 404;
        throw err;
      }
    }

    // Initialize the interview session database entry
    const session = new InterviewSession({
      resumeId: resumeId || null,
      targetRole: targetRole.trim(),
      experienceLevel: level,
      maxQuestions: limit,
      status: 'in_progress',
    });

    // Run Node 1: Question Generator to yield the opening question
    console.log(`[Interview Controller] Launching interview session for role: ${targetRole}`);
    const firstQuestion = await runQuestionGeneratorNode(session, resume);

    // Save initial message in history
    session.chatHistory.push({
      role: 'agent',
      content: firstQuestion,
    });

    await session.save();

    res.json({
      sessionId: session._id.toString(),
      status: session.status,
      question: firstQuestion,
      chatHistory: session.chatHistory,
      questionCount: session.questionCount,
      maxQuestions: session.maxQuestions,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller handling POST /api/interview/:id/answer.
 * Accepts candidate response (text or audio), checks safety guards, runs turn evaluation,
 * handles topic transitions, and triggers final compilation when limits are reached.
 */
async function submitAnswer(req, res, next) {
  const { id } = req.params;
  let session = null;

  try {
    session = await InterviewSession.findById(id).exec();
    if (!session) {
      const err = new Error('Interview session not found');
      err.status = 404;
      throw err;
    }

    if (session.status === 'completed') {
      const err = new Error('This interview session has already been completed.');
      err.status = 400;
      throw err;
    }

    // --- CONCURRENCY PROTECTION (RACE CONDITION) ---
    if (session.isLocked) {
      const err = new Error('Another answer submission is currently processing for this session.');
      err.status = 409; // Conflict
      throw err;
    }

    // Set lock
    session.isLocked = true;
    await session.save();

    // 1. Determine the candidate response text (Text or Voice)
    let candidateAnswer = '';
    if (req.file) {
      // Audio transcription fallback
      candidateAnswer = await transcribeAudio(req.file.buffer, req.file.mimetype);
    } else {
      candidateAnswer = req.body.answer || '';
    }

    if (!candidateAnswer || candidateAnswer.trim().length === 0) {
      session.isLocked = false;
      await session.save();
      const err = new Error('Answer content cannot be empty');
      err.status = 400;
      throw err;
    }

    const cleanAnswer = candidateAnswer.trim();

    // --- PROMPT INJECTION GUARD ---
    if (containsPromptInjection(cleanAnswer)) {
      session.isLocked = false;
      await session.save();
      const err = new Error('Answer rejected: potential prompt injection pattern identified.');
      err.status = 400;
      throw err;
    }

    // 2. Fetch the last interviewer question asked
    const lastMessage = session.chatHistory[session.chatHistory.length - 1];
    if (!lastMessage || lastMessage.role !== 'agent') {
      session.isLocked = false;
      await session.save();
      const err = new Error('Invalid conversation sequence. Interviewer must ask a question first.');
      err.status = 400;
      throw err;
    }

    const lastQuestion = lastMessage.content;

    // Push candidate answer to chat history
    session.chatHistory.push({
      role: 'candidate',
      content: cleanAnswer,
    });

    // 3. Run Node 2 & 3: Evaluator Node
    console.log(`[Interview Controller] Evaluating candidate response...`);
    const evaluation = await runEvaluatorNode(lastQuestion, cleanAnswer);

    // Save critique details
    session.evaluations.push({
      question: lastQuestion,
      answer: cleanAnswer,
      score: evaluation.score,
      feedback: evaluation.feedback,
    });

    session.questionCount += 1;

    // 4. Determine state transitions & check termination condition
    if (session.questionCount >= session.maxQuestions) {
      // Node 4: Final Scorer Node
      console.log(`[Interview Controller] Limit reached (${session.questionCount}/${session.maxQuestions}). Summarizing results.`);
      session.status = 'completed';
      
      const finalReport = await runFinalScorerNode(session);
      session.finalFeedback = finalReport;
      session.isLocked = false;
      await session.save();

      return res.json({
        sessionId: session._id.toString(),
        status: session.status,
        questionCount: session.questionCount,
        maxQuestions: session.maxQuestions,
        evaluations: session.evaluations,
        finalFeedback: session.finalFeedback,
        chatHistory: session.chatHistory,
      });
    }

    // Update topic transition based on evaluation decision
    if (!evaluation.shouldFollowUp && evaluation.suggestedNextTopic) {
      console.log(`[Interview Controller] Pivoting topic from "${session.currentTopic}" -> "${evaluation.suggestedNextTopic}"`);
      session.currentTopic = evaluation.suggestedNextTopic;
    } else {
      console.log(`[Interview Controller] Continuing follow-up questions in topic "${session.currentTopic}"`);
    }

    // Generate the next question
    let resume = null;
    if (session.resumeId) {
      resume = await Resume.findById(session.resumeId).exec();
    }
    
    const nextQuestion = await runQuestionGeneratorNode(session, resume);

    // Save next question in history
    session.chatHistory.push({
      role: 'agent',
      content: nextQuestion,
    });

    // Release lock
    session.isLocked = false;
    await session.save();

    res.json({
      sessionId: session._id.toString(),
      status: session.status,
      question: nextQuestion,
      chatHistory: session.chatHistory,
      questionCount: session.questionCount,
      maxQuestions: session.maxQuestions,
    });
  } catch (err) {
    if (session) {
      try {
        session.isLocked = false;
        await session.save();
      } catch (dbErr) {
        console.error('[Interview Controller] Failed to release lock in catch block:', dbErr.message);
      }
    }
    next(err);
  }
}

/**
 * Controller handling GET /api/interview/:id.
 * Retrieves current state of the interview session.
 */
async function getInterviewSession(req, res, next) {
  try {
    const session = await InterviewSession.findById(req.params.id).exec();
    if (!session) {
      const err = new Error('Interview session not found');
      err.status = 404;
      throw err;
    }

    res.json(session);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  startInterview,
  submitAnswer,
  getInterviewSession,
};
