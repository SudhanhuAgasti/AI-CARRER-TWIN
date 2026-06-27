const express = require('express');
const upload = require('../middleware/upload.middleware');
const { analyzeResume, morphResumeController } = require('../controllers/resume.controller');

const router = express.Router();

// multipart/form-data: file=<resume>, jobDescription=<text, optional>
router.post('/analyze', upload.single('file'), analyzeResume);

// application/json: { resumeData: object, jobDescription: string }
router.post('/morph', morphResumeController);

module.exports = router;

