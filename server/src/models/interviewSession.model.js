const mongoose = require('mongoose');

/**
 * Sub-schema for individual turns in the interview chat history.
 */
const ChatMessageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    required: true, 
    enum: ['agent', 'candidate'] 
  },
  content: { 
    type: String, 
    required: true 
  },
  audioUrl: { 
    type: String, 
    default: null 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

/**
 * Sub-schema for evaluations performed on each candidate response.
 */
const TurnEvaluationSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  score: { type: Number, required: true, min: 0, max: 10 },
  feedback: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

/**
 * Root Interview Session Schema.
 * Coordinates conversation state, topic transition variables, score aggregation,
 * and lock mechanics to prevent simultaneous API request races.
 */
const InterviewSessionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      trim: true,
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ['junior', 'mid', 'senior', 'lead'],
      default: 'senior',
    },
    status: {
      type: String,
      required: true,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
      index: true,
    },
    currentTopic: {
      type: String,
      default: 'Introduction',
    },
    maxQuestions: {
      type: Number,
      default: 5,
      min: 3,
      max: 10,
    },
    questionCount: {
      type: Number,
      default: 0,
    },
    chatHistory: {
      type: [ChatMessageSchema],
      default: [],
    },
    evaluations: {
      type: [TurnEvaluationSchema],
      default: [],
    },
    finalFeedback: {
      overallScore: { type: Number, min: 0, max: 100, default: null },
      technicalScore: { type: Number, min: 0, max: 100, default: null },
      behavioralScore: { type: Number, min: 0, max: 100, default: null },
      generalFeedback: { type: String, default: null },
      strengths: { type: [String], default: [] },
      improvements: { type: [String], default: [] },
    },
    isLocked: {
      type: Boolean,
      default: false,
      description: 'Concurrency lock to prevent overlapping request race conditions.',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
