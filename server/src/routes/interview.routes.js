const express = require('express');
const audioUpload = require('../middleware/audioUpload.middleware');
const {
  startInterview,
  submitAnswer,
  evaluateSystemDesignController,
  getInterviewSession,
} = require('../controllers/interview.controller');

const router = express.Router();

// POST /api/interview/start -> initialize session and ask the first question
router.post('/start', startInterview);

// POST /api/interview/system-design -> evaluate interactive whiteboard architecture canvas
router.post('/system-design', evaluateSystemDesignController);

// POST /api/interview/:id/answer -> submit response (handles optional multipart voice file or JSON text body)
router.post('/:id/answer', audioUpload.single('file'), submitAnswer);

// GET /api/interview/:id -> fetch session state
router.get('/:id', getInterviewSession);

module.exports = router;

