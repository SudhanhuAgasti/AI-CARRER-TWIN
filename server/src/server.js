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
const cookieParser = require('cookie-parser');
const authenticate = require('./middleware/auth/authentication.middleware');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

const { geminiApiKeyStore } = require('./config/gemini');

// CORS configuration supporting HttpOnly credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any origin during dev, or specify local hostnames
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// Middleware to inject user's custom Gemini API key from client headers into async context
app.use((req, res, next) => {
  const customKey = req.headers['x-gemini-key'];
  if (customKey && typeof customKey === 'string' && customKey.trim().length > 0) {
    geminiApiKeyStore.run(customKey.trim(), next);
  } else {
    next();
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth routes (unprotected / rate-limited)
app.use('/api/auth', authRoutes);

// Protected routes (require valid JWT access token)
app.use('/api/resume', authenticate, resumeRoutes);
app.use('/api/planner', authenticate, plannerRoutes);
app.use('/api/github', authenticate, githubRoutes);
app.use('/api/interview', authenticate, interviewRoutes);
app.use('/api/linkedin', authenticate, linkedinRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/copilot', authenticate, copilotRoutes);
app.use('/api/telemetry', authenticate, telemetryRoutes);
app.use('/api/sandbox', authenticate, sandboxRoutes);

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

let server;
if (require.main === module) {
  server = app.listen(config.port, () => {
    console.log(`AI Career Twin API running on http://localhost:${config.port}`);
  });
}

// Graceful Shutdown Handler
const gracefulShutdown = (signal) => {
  console.log(`\n[Process] Received ${signal}. Starting graceful shutdown...`);
  
  const runShutdown = async () => {
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
  };

  if (server) {
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      runShutdown();
    });
  } else {
    runShutdown();
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
