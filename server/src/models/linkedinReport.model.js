const mongoose = require('mongoose');

/**
 * Sub-schema for checks on specific LinkedIn profile sections.
 */
const SectionCheckSchema = new mongoose.Schema({
  section: { type: String, required: true },
  present: { type: Boolean, required: true },
  qualityScore: { type: Number, required: true, min: 0, max: 10 },
  feedback: { type: String, required: true },
});

/**
 * Mongoose Schema storing LinkedIn evaluations.
 */
const LinkedinReportSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    sectionsCheck: {
      type: [SectionCheckSchema],
      default: [],
    },
    headlineCheck: {
      currentHeadline: { type: String, default: null },
      strength: { type: String, default: null },
      suggestions: { type: [String], default: [] },
    },
    summaryCheck: {
      qualityScore: { type: Number, min: 0, max: 10, default: null },
      analysis: { type: String, default: null },
      missingKeywords: { type: [String], default: [] },
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('LinkedinReport', LinkedinReportSchema);
