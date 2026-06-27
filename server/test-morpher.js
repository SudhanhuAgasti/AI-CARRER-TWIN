require('dotenv').config();
const { morphResume } = require('./src/services/resumeMorpher.service');


async function testMorpher() {
  console.log('🧪 Starting Resume Morpher Service Test...\n');

  const sampleResumeData = {
    name: 'Sudhanshu Agasti',
    skills: ['JavaScript', 'Node.js', 'Express', 'React', 'MongoDB', 'REST APIs'],
    experience: [
      {
        title: 'Fullstack Developer',
        company: 'Tech Solutions Inc',
        bulletPoints: [
          'Built responsive web applications using React and Node.js.',
          'Created backend APIs and connected MongoDB database.',
          'Improved website performance and fixed user reported bugs.'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Technology in Computer Science',
        institution: 'State University'
      }
    ]
  };

  const sampleJobDescription = `
Senior Node.js Fullstack Engineer needed. Must be proficient in building scalable microservices, high-throughput REST APIs, performance optimization, and clean architecture. Experience with React frontend integration and database design is essential. Strong focus on zero-downtime deployments and test coverage.
`;

  try {
    const result = await morphResume(sampleResumeData, sampleJobDescription);
    console.log('✅ Morpher Execution Successful!\n');
    console.log('--------------------------------------------------');
    console.log('Tailored Summary:\n', result.tailoredSummary);
    console.log('\nTailored Skills:\n', result.tailoredSkills);
    console.log('\nTailored Experience Bullets:\n', JSON.stringify(result.tailoredExperience, null, 2));
    console.log('\nATS Keyword Match Highlights:\n', result.atsKeywordMatchHighlights);
    console.log('\nATS Alignment Tips:\n', result.atsAlignmentTips);
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('❌ Morpher Execution Failed:', err);
  }
}

testMorpher();
