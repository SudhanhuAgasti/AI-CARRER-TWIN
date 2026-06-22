const express = require('express');
const { createRoadmap, listRoles } = require('../controllers/planner.controller');

const router = express.Router();

// GET /api/planner/roles -> list all roles supported by the system taxonomy
router.get('/roles', listRoles);

// POST /api/planner/roadmap -> request structured curriculum gap planner
router.post('/roadmap', createRoadmap);

module.exports = router;
