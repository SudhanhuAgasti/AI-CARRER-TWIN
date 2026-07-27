const mongoose = require('mongoose');

/**
 * Schema defining the candidates work history details.
 */
const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  durationMonths: { type: Number, default: null },
  bulletPoints: { type: [String], default: [] },
});

/**
 * Schema defining the candidates education history.
 */
const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, default: null },
});

/**
 * Root Resume Schema storing parsed, structured data alongside raw text content.
 * Built for quick retrieval, filtering, and extension in Phase 2 and 3.
 */
const ResumeSchema = new mongoose.Schema(
  {
    name: { type: String, default: null, trim: true },
    email: { type: String, default: null, trim: true, lowercase: true, index: true },
    phone: { type: String, default: null, trim: true },
    totalYearsExperience: { type: Number, default: null },
    skills: { type: [String], default: [], index: true },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    certifications: { type: [String], default: [] },
    rawText: { type: String, required: true },
    filePath: { type: String, default: null },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt properties
    versionKey: false, // Disables __v field mapping
  }
);

module.exports = mongoose.model('Resume', ResumeSchema);
