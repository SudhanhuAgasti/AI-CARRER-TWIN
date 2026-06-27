require('dotenv').config();
const { evaluateSystemDesign } = require('./src/services/systemDesignEvaluator.service');
const { analyzeSpeechTelemetry } = require('./src/services/speechTelemetry.service');

async function testInterviewUpgrades() {
  console.log('🧪 Starting System Design Canvas & Vocal Telemetry Tests...\n');

  // 1. Test Vocal Telemetry
  const sampleSpeech = "Um, basically we can use, you know, Redis as a caching layer to reduce database load and improve response times.";
  const telemetry = analyzeSpeechTelemetry(sampleSpeech, 10);
  console.log('✅ Vocal Telemetry Results:\n', telemetry);
  console.log('--------------------------------------------------');

  // 2. Test System Design Evaluator
  const sampleNodes = [
    { id: '1', label: 'API Gateway' },
    { id: '2', label: 'Driver Tracking Microservice' },
    { id: '3', label: 'Kafka Event Bus' },
    { id: '4', label: 'MongoDB Database' }
  ];
  const sampleEdges = [
    { source: 'API Gateway', target: 'Driver Tracking Microservice' },
    { source: 'Driver Tracking Microservice', target: 'Kafka Event Bus' },
    { source: 'Kafka Event Bus', target: 'MongoDB Database' }
  ];

  try {
    const evaluation = await evaluateSystemDesign('Uber Real-Time Driver Location Tracking', sampleNodes, sampleEdges);
    console.log('✅ System Design Evaluation Results:\n');
    console.log('Topology Score:', evaluation.topologyScore);
    console.log('Scalability Score:', evaluation.scalabilityScore);
    console.log('Detected Components:', evaluation.detectedComponents);
    console.log('Single Points of Failure:', evaluation.singlePointsOfFailure);
    console.log('Architectural Critique:\n', evaluation.architecturalCritique);
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('❌ System Design Test Failed:', err);
  }
}

testInterviewUpgrades();
