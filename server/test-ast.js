require('dotenv').config();
const { analyzeCodeAst } = require('./src/services/githubAst.service');

async function testAstService() {
  console.log('🧪 Starting Deep AST Static Code Analysis Test...\n');

  const sampleSourceFiles = [
    {
      path: 'src/server.js',
      content: `
const express = require('express');
const app = express();
app.use(express.json());

// Repository Pattern & Middleware Architecture
app.post('/api/users', async (req, res) => {
  try {
    const user = await userRepository.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
`
    },
    {
      path: 'src/services/eventBus.js',
      content: `
const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'app', brokers: ['localhost:9092'] });
const producer = kafka.producer();
// Event-Driven Architecture pattern implementation
`
    }
  ];

  try {
    const result = await analyzeCodeAst(sampleSourceFiles);

    console.log('✅ AST Fingerprint Generated Successfully!\n');
    console.log('--------------------------------------------------');
    console.log('Clean Code Score:', result.cleanCodeScore);
    console.log('Security Score:', result.securityScore);
    console.log('Detected Architecture Patterns:\n', result.detectedArchitecturePatterns);
    console.log('\nStatic Analysis Checklist:\n', JSON.stringify(result.staticAnalysisChecklist, null, 2));
    console.log('\nSeniority Credibility Summary:\n', result.seniorityCredibilitySummary);
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('❌ AST Test Failed:', err);
  }
}

testAstService();
