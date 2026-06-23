const mongoose = require('mongoose');

/**
 * Schema defining the individual ATS validation checks.
 */
const CheckResultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  passed: { type: Boolean, required: true },
  points: { type: Number, required: true },
  detail: { type: String, default: null },
});

/**
 * Root Schema for candidate ATS analysis report.
 * Keeps history of ATS runs and semantic job matching scores.
 */
const AtsReportSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    overallScore: { type: Number, required: true },
    grade: { type: String, required: true, uppercase: true },
    checklistResults: { type: [CheckResultSchema], default: [] },
    jobDescription: { type: String, default: null },
    similarityScore: { type: Number, default: null },
    keywordOverlap: {
      matchedKeywords: { type: [String], default: [] },
      overlapPercent: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('AtsReport', AtsReportSchema);
