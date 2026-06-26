const express = require('express');
const upload = require('../middleware/upload.middleware');
const { analyzeLinkedin, getLinkedinReport } = require('../controllers/linkedin.controller');

const router = express.Router();

// POST /api/linkedin/analyze -> ingest text or file and generate report
router.post('/analyze', upload.single('file'), analyzeLinkedin);

// GET /api/linkedin/:resumeId -> fetch saved report for resume
router.get('/:resumeId', getLinkedinReport);

module.exports = router;
