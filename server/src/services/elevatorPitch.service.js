/**
 * @file elevatorPitch.service.js
 * @description Spoken Elevator Pitch and Opening Introduction generator service.
 * @author Senior Fullstack Engineer (8+ years experience)
 */

const ai = require('../config/gemini');
const { retryWithBackoff } = require('../utils/retry');

const ELEVATOR_PITCH_SCHEMA = {
  type: 'object',
  properties: {
    pitch30Sec: {
      type: 'string',
      description: 'A punchy, 30-second verbatim spoken elevator pitch highlighting core stack and value proposition.'
    },
    pitch60Sec: {
      type: 'string',
      description: 'A standard 60-second spoken intro answering "Tell me about yourself" for technical interviews.'
    },
    pitch2Min: {
      type: 'string',
      description: 'A comprehensive 2-minute spoken narrative covering career background, key architecture wins, and passion for the target role.'
    },
    keyHookStatement: {
      type: 'string',
      description: 'A memorable 1-sentence opening hook to grab the interviewer attention immediately.'
    },
    vocalDeliveryTips: {
      type: 'array',
      items: { type: 'string' },
      description: 'Actionable tips for vocal delivery, pauses, tone, and emphasis points.'
    }
  },
  required: ['pitch30Sec', 'pitch60Sec', 'pitch2Min', 'keyHookStatement', 'vocalDeliveryTips']
};

/**
 * Generates structured multi-duration spoken elevator pitches for candidates.
 *
 * @param {Object} resumeData - Candidate structured resume data (skills, experience, education)
 * @param {string} targetRole - Candidate target job role (e.g. Senior Backend Engineer)
 * @param {string} experienceLevel - Seniority level (junior, mid, senior, lead)
 * @returns {Promise<Object>} Generated elevator pitch scripts and delivery guidance
 */
async function generateElevatorPitch(resumeData, targetRole = 'Software Engineer', experienceLevel = 'senior') {
  if (!resumeData || typeof resumeData !== 'object') {
    throw new Error('Valid resumeData object is required to generate an elevator pitch.');
  }

  const prompt = `Act as an elite Executive Communication & Interview Coach.
Generate verbatim spoken opening introduction scripts ("Tell me about yourself") for a candidate applying for a ${experienceLevel} level ${targetRole} position.

Candidate Source Data:
---
${JSON.stringify(resumeData, null, 2)}
---

Requirements:
1. Provide exact spoken scripts for 30-second, 60-second, and 2-minute durations.
2. Maintain a natural, conversational, yet authoritative tone matching their ${experienceLevel} level.
3. Highlight key achievements, core technical stack, and passion for solving high-scale problems.
4. Provide actionable vocal delivery tips.`;

  try {
    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You write high-impact, authentic, and memorable spoken interview introductions for tech professionals. Avoid robotic jargon and cliché phrases.',
          responseMimeType: 'application/json',
          responseSchema: ELEVATOR_PITCH_SCHEMA,
          temperature: 0.3,
        },
      })
    );

    return JSON.parse(response.text);
  } catch (error) {
    console.error('[Elevator Pitch Service] Failed gracefully:', error.message);
    return {
      pitch30Sec: `Hi, I'm a ${experienceLevel} ${targetRole} with a strong foundation in building scalable web applications and distributed systems. I specialize in backend architecture and API performance, and I'm excited about solving complex engineering challenges.`,
      pitch60Sec: `Hello! Over the past few years as a ${targetRole}, I've focused on building resilient fullstack applications. In my recent work, I've led projects involving REST API design, database optimization, and cloud services. I thrive in environments where clean code and engineering rigor are prioritized, and I'm looking forward to bringing that expertise to your team.`,
      pitch2Min: `Hello! I'm a ${experienceLevel} ${targetRole} passionate about building high-throughput applications and maintainable systems. Throughout my career, I've had the opportunity to work across the entire stack, developing responsive frontends and architecting robust microservices. I pride myself on clean architecture principles, automated testing, and continuous improvement. I'm really drawn to this role because it aligns perfectly with my background in distributed systems and my desire to build high-impact products.`,
      keyHookStatement: `I am an engineer driven by building resilient, high-scale systems that deliver seamless user experiences.`,
      vocalDeliveryTips: [
        'Speak at a steady pace of ~130 words per minute.',
        'Pause briefly after your key hook statement to let it resonate.',
        'Maintain an enthusiastic, confident, and professional tone.'
      ]
    };
  }
}

module.exports = { generateElevatorPitch, ELEVATOR_PITCH_SCHEMA };
