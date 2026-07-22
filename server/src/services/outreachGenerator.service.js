/**
 * @file outreachGenerator.service.js
 * @description Automated Hiring Manager Cold Outreach and Networking Message Generator
  */

const ai = require('../config/gemini');
const { retryWithBackoff } = require('../utils/retry');

const OUTREACH_GENERATOR_SCHEMA = {
  type: 'object',
  properties: {
    linkedInInMailSubject: {
      type: 'string',
      description: 'A punchy, high-open rate subject line for LinkedIn InMail.'
    },
    linkedInInMailBody: {
      type: 'string',
      description: 'A concise, 3-4 sentence direct message highlighting verified AST code quality and system design experience.'
    },
    coldEmailSubject: {
      type: 'string',
      description: 'A compelling, professional cold email subject line for Engineering Managers.'
    },
    coldEmailBody: {
      type: 'string',
      description: 'A structured cold email linking candidate proof-of-work achievements directly to the company engineering goals.'
    },
    outreachStrategyTips: {
      type: 'array',
      items: { type: 'string' },
      description: 'Actionable advice on timing, follow-ups, and building authentic rapport with engineering leaders.'
    }
  },
  required: ['linkedInInMailSubject', 'linkedInInMailBody', 'coldEmailSubject', 'coldEmailBody', 'outreachStrategyTips']
};

/**
 * Generates personalized cold outreach messages for candidates to contact recruiters and hiring managers.
 *
 * @param {Object} candidateData - Candidate profile details (skills, top project achievements, AST scores)
 * @param {string} targetCompany - Name of the hiring company (e.g. Stripe, Uber, Meta)
 * @param {string} targetManagerRole - Role of the contact (e.g. Engineering Manager, VP of Engineering, Tech Recruiter)
 * @returns {Promise<Object>} Generated outreach messages and strategy
 */
async function generateColdOutreach(candidateData, targetCompany = 'Target Company', targetManagerRole = 'Engineering Manager') {
  if (!candidateData || typeof candidateData !== 'object') {
    throw new Error('Valid candidateData object is required to generate outreach messages.');
  }

  const prompt = `Act as a Top Tech Headhunter and Networking Coach.
Generate high-converting cold outreach messages for a candidate reaching out to a ${targetManagerRole} at ${targetCompany}.

Candidate Data & Proof of Work:
---
${JSON.stringify(candidateData, null, 2)}
---

Requirements:
1. Provide personalized LinkedIn InMail and Cold Email scripts.
2. Highlight candidate verified AST code quality, hands-on architectural experience, and passion for ${targetCompany}.
3. Keep the tone respectful, direct, and focused on providing value. End with a soft call-to-action for a 15-minute chat.`;

  try {
    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You write concise, compelling, high-converting cold messages for senior developers reaching out to engineering managers. Avoid generic spam templates.',
          responseMimeType: 'application/json',
          responseSchema: OUTREACH_GENERATOR_SCHEMA,
          temperature: 0.3,
        },
      })
    );

    return JSON.parse(response.text);
  } catch (error) {
    console.error('[Outreach Generator Service] Failed gracefully:', error.message);
    return {
      linkedInInMailSubject: `Engineering passion & Fullstack experience for ${targetCompany}`,
      linkedInInMailBody: `Hi! I've been following ${targetCompany}'s engineering work and am deeply impressed by your scale. As a Fullstack Engineer specialized in Node.js and distributed systems, I recently architected microservices handling over 10k req/min. I'd love to learn more about your team's current technical challenges if you have 10 minutes next week.`,
      coldEmailSubject: `Experienced Fullstack Engineer interested in ${targetCompany}'s team`,
      coldEmailBody: `Hi ${targetManagerRole},\n\nI hope this email finds you well. I am reaching out because I greatly admire ${targetCompany}'s technical architecture and engineering culture.\n\nOver the past several years, I have focused on building resilient backend services and clean, modular interfaces. My recent work includes architecting Kafka event streams and optimizing REST API performance. Given your team's focus on engineering excellence, I believe my background could bring immediate value to your ongoing initiatives.\n\nWould you be open to a brief 15-minute introductory conversation next week?\n\nBest regards,\nCandidate`,
      outreachStrategyTips: [
        'Send cold emails on Tuesday or Thursday mornings between 8:00 AM and 10:00 AM local time.',
        'If contacting via LinkedIn, engage with one of their recent engineering posts first.',
        'Always send a polite follow-up 4-5 business days after your initial outreach.'
      ]
    };
  }
}

module.exports = { generateColdOutreach, OUTREACH_GENERATOR_SCHEMA };
