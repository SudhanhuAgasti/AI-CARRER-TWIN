require('dotenv').config();
const { generateElevatorPitch } = require('./src/services/elevatorPitch.service');

async function testElevatorPitchService() {
  console.log('🧪 Starting Spoken Elevator Pitch Generator Test...\n');

  const sampleResumeData = {
    name: 'Sudhanshu Agasti',
    skills: ['Node.js', 'Express', 'React', 'Kafka', 'Redis', 'MongoDB', 'System Design'],
    experience: [
      {
        title: 'Senior Fullstack Engineer',
        company: 'Tech Innovations Corp',
        bulletPoints: [
          'Architected high-throughput microservices handling 10k requests per minute using Node.js and Redis caching.',
          'Designed event-driven order processing pipelines with Apache Kafka.',
          'Mentored mid-level developers and enforced clean code, CI/CD, and zero-downtime deployments.'
        ]
      }
    ]
  };

  try {
    const result = await generateElevatorPitch(sampleResumeData, 'Senior Fullstack Engineer', 'senior');
    console.log('✅ Elevator Pitch Scripts Generated Successfully!\n');
    console.log('--------------------------------------------------');
    console.log('Key Hook Statement:\n', result.keyHookStatement);
    console.log('\n--- 30-Second Elevator Pitch ---\n', result.pitch30Sec);
    console.log('\n--- 60-Second Interview Opener ("Tell me about yourself") ---\n', result.pitch60Sec);
    console.log('\n--- 2-Minute Deep-Dive Spoken Script ---\n', result.pitch2Min);
    console.log('\nVocal Delivery Tips:\n', result.vocalDeliveryTips);
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('❌ Elevator Pitch Test Failed:', err);
  }
}

testElevatorPitchService();
