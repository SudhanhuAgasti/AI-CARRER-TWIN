const ai = require('../config/gemini');
const { retryWithBackoff } = require('../utils/retry');

/**
 * Service handling audio capabilities.
 * 
 * DESIGN RATIONALE:
 * - Uses Gemini's native multimodal capabilities to transcribe audio buffers.
 * - This avoids the need to sign up for separate audio transcription services (like Whisper or AssemblyAI),
 *   saving API key configurations and setup friction for developers.
 */

/**
 * Transcribes audio buffer content using Gemini multimodal integration.
 * 
 * @param {Buffer} buffer - Raw audio file buffer
 * @param {string} mimetype - e.g. 'audio/wav', 'audio/mp3', 'audio/webm'
 * @returns {Promise<string>} Transcribed text content
 */
async function transcribeAudio(buffer, mimetype) {
  if (!buffer || buffer.length === 0) {
    throw new Error('Audio buffer is empty or missing');
  }

  // Supported mime-types by Gemini native audio
  const supportedTypes = ['audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm', 'audio/mpeg', 'audio/x-wav'];
  const cleanMimetype = supportedTypes.includes(mimetype) ? mimetype : 'audio/wav';

  console.log(`[Audio Service] Transcribing audio with type: ${cleanMimetype}`);

  const prompt = 'Transcribe the following audio accurately. Output only the verbatim transcription text. Do not add annotations, remarks, or metadata.';

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: cleanMimetype,
            data: buffer.toString('base64'),
          },
        },
        prompt,
      ],
      config: {
        temperature: 0.0, // Strict deterministic transcription
      },
    })
  );

  return response.text ? response.text.trim() : '';
}

module.exports = { transcribeAudio };
