const express = require('express');
const { createRoadmap, createMicroProjectController, listRoles } = require('../controllers/planner.controller');

const router = express.Router();

// GET /api/planner/roles -> list all roles supported by the system taxonomy
router.get('/roles', listRoles);

// POST /api/planner/roadmap -> request structured curriculum gap planner
router.post('/roadmap', createRoadmap);

// POST /api/planner/micro-project -> generate dynamic micro-project repository specification
router.post('/micro-project', createMicroProjectController);

module.exports = router;

