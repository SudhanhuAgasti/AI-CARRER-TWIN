require('dotenv').config();
const express = require('express');
const cors = require('cors');

const resumeRoutes = require('./routes/resume.routes');
const plannerRoutes = require('./routes/planner.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/resume', resumeRoutes);
app.use('/api/planner', plannerRoutes);

// Keep error handler last - catches errors from any route via next(err)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI Career Twin API running on http://localhost:${PORT}`);
});
