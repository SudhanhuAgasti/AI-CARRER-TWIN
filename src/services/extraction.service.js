const ai = require('../config/gemini');

const RESUME_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: ['string', 'null'] },
    email: { type: ['string', 'null'] },
    phone: { type: ['string', 'null'] },
    totalYearsExperience: { type: ['number', 'null'] },
    skills: { type: 'array', items: { type: 'string' } },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          company: { type: 'string' },
          durationMonths: { type: ['number', 'null'] },
          bulletPoints: { type: 'array', items: { type: 'string' } },
        },
        required: ['title', 'company'],
      },
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          degree: { type: 'string' },
          institution: { type: 'string' },
          year: { type: ['string', 'null'] },
        },
        required: ['degree', 'institution'],
      },
    },
    certifications: { type: 'array', items: { type: 'string' } },
  },
  required: ['skills', 'experience', 'education'],
};

async function extractStructuredResume(rawText) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: rawText,
    config: {
      systemInstruction:
        'You extract structured data from resumes. Only use information present in the text - never invent or guess details. If a field is not present, use null or an empty array.',
      responseMimeType: 'application/json',
      responseSchema: RESUME_SCHEMA,
      temperature: 0,
    },
  });

  return JSON.parse(response.text);
}

module.exports = { extractStructuredResume, RESUME_SCHEMA };