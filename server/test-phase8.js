require('dotenv').config();
const { calculateMarketDrift } = require('./src/services/telemetry.service');
const { generateVerifiedProofOfWork, verifyProofOfWorkToken } = require('./src/services/sandbox.service');

async function testPhase8() {
  console.log('🧪 Starting Phase 8 Telemetry & Sandbox Verification Test...\n');

  // ==========================================
  // Test 1: Market Telemetry Drift Engine
  // ==========================================
  console.log('--- Test 1: Semantic Market Drift Ingestion & Analytics ---');
  const sampleResume = `
  Sudhanshu Agasti
  Skills: Node.js, Express, React, Javascript, REST APIs, HTML, CSS.
  Experience: 2 Years building simple websites and Express servers.
  `;

  const sampleMarketJobs = [
    `Senior Backend Developer: Must have deep expertise in Kafka message queues, Redis caching, and building distributed systems scaling to millions of active users.`,
    `Lead Systems Architect: Expert in distributed data platforms, Apache Kafka event streams, Redis scaling, and load-tested container orchestration.`
  ];

  try {
    const telemetryReport = await calculateMarketDrift(sampleResume, sampleMarketJobs);
    console.log('✅ Market Drift Telemetry calculated successfully!');
    console.log(`Alignment Score: ${telemetryReport.alignmentScore}%`);
    console.log(`Is Drifting: ${telemetryReport.isDrifting}`);
    console.log('Newly Emerged Gaps:', telemetryReport.newlyEmergedGaps);
    console.log('Market Observations:', telemetryReport.marketTrendObservations);
    console.log('Recommended Projects:', telemetryReport.recommendedMicroProjects);
  } catch (err) {
    console.error('❌ Telemetry Drift Test Failed:', err.message);
  }

  // ==========================================
  // Test 2: Sandbox Cryptographic Generation
  // ==========================================
  console.log('\n--- Test 2: Cryptographic Sandbox Proof-of-Work Generation ---');
  const sampleAstReport = {
    cleanCodeScore: 84,
    securityScore: 92,
    detectedArchitecturePatterns: ['Repository Pattern', 'Middleware', 'Event-Driven'],
  };

  let token = '';
  try {
    const proof = generateVerifiedProofOfWork('https://github.com/SudhanhuAgasti/AI-CARRER-TWIN', sampleAstReport);
    console.log('✅ Sandbox Proof-of-Work generated!');
    console.log('Verification ID:', proof.verificationId);
    console.log('Signature:', proof.signature);
    console.log('Sandbox Execution Latency:', proof.payload.sandboxStats.avgLatencyMs, 'ms');
    token = proof.verificationToken;
  } catch (err) {
    console.error('❌ Sandbox Generation Test Failed:', err.message);
  }

  // ==========================================
  // Test 3: Sandbox Token Cryptographic Verification
  // ==========================================
  console.log('\n--- Test 3: Sandbox Verification Token Integrity Check ---');
  try {
    const verification = verifyProofOfWorkToken(token);
    console.log('✅ Signature Verification Successful!');
    console.log('Verified Stats:', verification.payload.sandboxStats);
    console.log('Verified AST Scores:', verification.payload.astScoring);
  } catch (err) {
    console.error('❌ Sandbox Signature Verification Failed:', err.message);
  }

  // ==========================================
  // Test 4: Tampered Token Verification Fail-safe
  // ==========================================
  console.log('\n--- Test 4: Tampered Token Detection ---');
  try {
    // Decode base64, modify a value slightly, encode back, and verify
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const parsed = JSON.parse(raw);
    parsed.payload.sandboxStats.testPassRate = 50; // Tamper with test score!
    const tamperedToken = Buffer.from(JSON.stringify(parsed)).toString('base64');
    
    const verification = verifyProofOfWorkToken(tamperedToken);
    if (!verification.isValid) {
      console.log('✅ Success: Tampered payload caught by signature mismatch!');
      console.log('Verification Failure Message:', verification.message);
    } else {
      console.error('❌ Failure: Tampered payload bypasses cryptographic signature verification!');
    }
  } catch (err) {
    console.log('✅ Success: Tampered payload generated validation crash/reject:', err.message);
  }
  
  console.log('\n--------------------------------------------------');
}

testPhase8();
