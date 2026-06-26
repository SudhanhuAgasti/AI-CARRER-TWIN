const mongoose = require('mongoose');

/**
 * Root Schema for learning/readiness dashboards customized around all assessments.
 */
const ReadinessDashboardSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      unique: true,
      index: true,
    },
    unifiedScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    breakdown: {
      atsScore: { type: Number, default: 0 },
      matchScore: { type: Number, default: 0 },
      githubScore: { type: Number, default: 0 },
      interviewScore: { type: Number, default: 0 },
      linkedinScore: { type: Number, default: 0 },
    },
    liveActionList: [
      {
        priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
        task: { type: String, required: true },
        category: { type: String, required: true }, // e.g. 'Resume', 'GitHub', 'Interview', 'LinkedIn', 'Skills'
        description: { type: String, required: true },
      }
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('ReadinessDashboard', ReadinessDashboardSchema);
