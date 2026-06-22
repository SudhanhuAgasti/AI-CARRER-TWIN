const mongoose = require('mongoose');

/**
 * Schema defining the weekly study objectives, projects, and reference materials.
 */
const WeeklyModuleSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  theme: { type: String, required: true },
  topics: { type: [String], default: [] },
  estimatedHours: { type: Number, default: 0 },
  practicalTask: { type: String, required: true },
  learningResources: { type: [String], default: [] },
});

/**
 * Schema defining the overall generated learning path curriculum.
 */
const CurriculumSchema = new mongoose.Schema({
  summary: { type: String, required: true },
  estimatedWeeks: { type: Number, required: true },
  weeks: { type: [WeeklyModuleSchema], default: [] },
});

/**
 * Root Schema for learning roadmaps customized around skill gaps and hourly constraints.
 */
const RoadmapSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
      index: true,
    },
    targetRole: { type: String, required: true, trim: true },
    availableHoursPerDay: { type: Number, default: 2 },
    skillGaps: { type: [String], default: [] },
    curriculum: { type: CurriculumSchema, required: true },
    validationErrors: { type: [String], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Roadmap', RoadmapSchema);
