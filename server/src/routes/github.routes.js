const express = require('express');
const { analyzeGithubUser } = require('../controllers/github.controller');

const router = express.Router();

// POST /api/github/analyze -> orchestrate full developer profiling
router.post('/analyze', analyzeGithubUser);

module.exports = router;
