require('dotenv').config();
const { generateColdOutreach } = require('./src/services/outreachGenerator.service');

async function testOutreachService() {
  console.log('🧪 Starting Cold Outreach Generator Test...\n');

  const sampleCandidateData = {
    name: 'Sudhanshu Agasti',
    targetRole: 'Senior Fullstack Engineer',
    skills: ['Node.js', 'React', 'Kafka', 'System Design'],
    astScore: 92,
    topProject: 'EventStream Order Fulfillment Pipeline with Kafka & Redis caching'
  };

  try {
    const result = await generateColdOutreach(sampleCandidateData, 'Uber', 'VP of Engineering');
    console.log('✅ Outreach Messages Generated Successfully!\n');
    console.log('--------------------------------------------------');
    console.log('LinkedIn Subject:\n', result.linkedInInMailSubject);
    console.log('\nLinkedIn Body:\n', result.linkedInInMailBody);
    console.log('\nCold Email Subject:\n', result.coldEmailSubject);
    console.log('\nCold Email Body:\n', result.coldEmailBody);
    console.log('\nOutreach Strategy Tips:\n', result.outreachStrategyTips);
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('❌ Outreach Test Failed:', err);
  }
}

testOutreachService();
