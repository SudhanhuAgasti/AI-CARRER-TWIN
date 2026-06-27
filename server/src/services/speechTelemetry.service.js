/**
 * @file speechTelemetry.service.js
 * @description Vocal telemetry and speech analytics service evaluating WPM, filler-words, and confidence indicators.
 * @author Senior Fullstack Engineer (8+ years experience)
 */

/**
 * Analyzes transcribed text and audio duration to compute speech performance telemetry.
 *
 * @param {string} transcriptText - Transcribed speech text
 * @param {number} durationSeconds - Audio recording length in seconds
 * @returns {Object} Vocal telemetry metrics
 */
function analyzeSpeechTelemetry(transcriptText, durationSeconds = 10) {
  if (!transcriptText || typeof transcriptText !== 'string' || transcriptText.trim().length === 0) {
    return {
      wordCount: 0,
      wordsPerMinute: 0,
      fillerWordsDetected: [],
      fillerWordRatio: 0,
      confidenceIndex: 50,
      pacingEvaluation: 'No speech detected.'
    };
  }

  const cleanText = transcriptText.trim();
  const words = cleanText.split(/\s+/);
  const wordCount = words.length;

  // Calculate Words Per Minute (WPM)
  const safeDuration = durationSeconds > 0 ? durationSeconds : 10;
  const wordsPerMinute = Math.round((wordCount / safeDuration) * 60);

  // Common vocal filler words in technical interviews
  const fillerPatterns = ['um', 'umm', 'uh', 'uhh', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of'];
  const lowerText = cleanText.toLowerCase();
  
  const fillerWordsDetected = [];
  let totalFillerCount = 0;

  fillerPatterns.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      fillerWordsDetected.push({ word: filler, count: matches.length });
      totalFillerCount += matches.length;
    }
  });

  const fillerWordRatio = Number(((totalFillerCount / wordCount) * 100).toFixed(1));

  // Pacing evaluation (ideal conversational interview pace: 120-160 WPM)
  let pacingEvaluation = 'Ideal Conversational Pace';
  let pacingScore = 90;

  if (wordsPerMinute < 90) {
    pacingEvaluation = 'Slightly Slow / Hesitant Pace';
    pacingScore = 70;
  } else if (wordsPerMinute > 170) {
    pacingEvaluation = 'Fast / Rushed Pace';
    pacingScore = 75;
  }

  // Confidence Index formula combining pacing stability and low filler ratio
  const fillerPenalty = Math.min(30, totalFillerCount * 5);
  const confidenceIndex = Math.max(10, Math.min(100, Math.round(pacingScore - fillerPenalty)));

  return {
    wordCount,
    wordsPerMinute,
    totalFillerCount,
    fillerWordsDetected,
    fillerWordRatio,
    confidenceIndex,
    pacingEvaluation
  };
}

module.exports = { analyzeSpeechTelemetry };
