require('dotenv').config();
const { generateNegotiationStrategy } = require('./src/services/negotiation.service');

async function testNegotiationService() {
  console.log('🧪 Starting AI Salary & Compensation Negotiation Copilot Test...\n');

  const sampleCandidateData = {
    name: 'Sudhanshu Agasti',
    targetRole: 'Senior Fullstack Engineer',
    location: 'Bangalore, India',
    verifiedSkills: ['Node.js', 'System Design', 'Kafka', 'Redis'],
    verifiedAstScore: 88,
    atsMatchScore: 92
  };

  const sampleOffer = {
    baseSalary: 2400000,
    equity: 500000,
    performanceBonus: 300000,
    currency: 'INR'
  };

  try {
    const result = await generateNegotiationStrategy(
      'Senior Fullstack Engineer',
      'Bangalore, India',
      sampleOffer,
      sampleCandidateData
    );

    console.log('✅ Negotiation Strategy and Benchmarks Generated Successfully!\n');
    console.log('--------------------------------------------------');
    console.log('Benchmarks:');
    console.log(`25th Percentile: ${result.benchmarks.percentile25} ${result.benchmarks.currency}`);
    console.log(`50th Percentile (Median): ${result.benchmarks.percentile50} ${result.benchmarks.currency}`);
    console.log(`75th Percentile: ${result.benchmarks.percentile75} ${result.benchmarks.currency}`);
    console.log(`90th Percentile: ${result.benchmarks.percentile90} ${result.benchmarks.currency}`);
    console.log(`Breakdown Context:\n${result.benchmarks.breakdownText}\n`);
    
    console.log('--- Strategy Blueprint ---');
    result.negotiationStrategyBlueprint.forEach((step, idx) => {
      console.log(`${idx + 1}. ${step}`);
    });

    console.log('\n--- Written Counter-Offer Emails ---');
    console.log('\n[Polite Increase Request]:\n', result.counterOfferEmails.politeIncreaseEmail);
    console.log('\n[Using Competing Offer Leverage]:\n', result.counterOfferEmails.competingOfferEmail);

    console.log('\n--- Spoken Conversation Scripts ---');
    result.negotiationScripts.forEach((script, idx) => {
      console.log(`\nScenario ${idx + 1}: ${script.scenario}`);
      console.log(`Verbatim Response: "${script.spokenResponse}"`);
    });
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('❌ Negotiation Test Failed:', err);
  }
}

testNegotiationService();
