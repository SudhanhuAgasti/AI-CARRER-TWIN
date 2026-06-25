require('dotenv').config();
const express = require('express');
const cors = require('cors');

if (!process.env.GITHUB_TOKEN) {
  console.warn(
    '[Warning] GITHUB_TOKEN is not defined in .env. Public GitHub API requests will be rate-limited to 60 requests/hour.'
  );
}

const { connectDB } = require('./config/db');
const resumeRoutes = require('./routes/resume.routes');
const plannerRoutes = require('./routes/planner.routes');
const githubRoutes = require('./routes/github.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/resume', resumeRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/github', githubRoutes);

// Keep error handler last - catches errors from any route via next(err)
app.use(errorHandler);

// Connect to MongoDB Database
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI Career Twin API running on http://localhost:${PORT}`);
});
