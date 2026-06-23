const express = require('express');
const upload = require('../middleware/upload.middleware');
const { analyzeResume } = require('../controllers/resume.controller');

const router = express.Router();

// multipart/form-data: file=<resume>, jobDescription=<text, optional>
router.post('/analyze', upload.single('file'), analyzeResume);

module.exports = router;
