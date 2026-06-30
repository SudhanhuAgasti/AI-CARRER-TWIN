const config = require('./config');
const express = require('express');
const cors = require('cors');

const { connectDB } = require('./config/db');
const InterviewSession = require('./models/interviewSession.model');
const resumeRoutes = require('./routes/resume.routes');
const plannerRoutes = require('./routes/planner.routes');
const githubRoutes = require('./routes/github.routes');
const interviewRoutes = require('./routes/interview.routes');
const linkedinRoutes = require('./routes/linkedin.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const copilotRoutes = require('./routes/copilot.routes');
const telemetryRoutes = require('./routes/telemetry.routes');
const sandboxRoutes = require('./routes/sandbox.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/resume', resumeRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/linkedin', linkedinRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/sandbox', sandboxRoutes);

// Keep error handler last - catches errors from any route via next(err)
app.use(errorHandler);


// Connect to MongoDB Database and clear locks
const mongoose = require('mongoose');
connectDB().then(async () => {
  try {
    const res = await InterviewSession.updateMany({ isLocked: true }, { isLocked: false }).exec();
    if (res.modifiedCount > 0) {
      console.log(`[Server Boot] Cleared ${res.modifiedCount} dangling concurrency locks.`);
    }
  } catch (err) {
    console.error('[Server Boot] Failed to clear dangling concurrency locks:', err.message);
  }
});

const server = app.listen(config.port, () => {
  console.log(`AI Career Twin API running on http://localhost:${config.port}`);
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal) => {
  console.log(`\n[Process] Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log('[Database] MongoDB connection closed cleanly.');
      }
      process.exit(0);
    } catch (err) {
      console.error('[Shutdown Error] Failed to close DB connection cleanly:', err.message);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
