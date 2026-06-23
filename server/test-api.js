const dotenv = require('dotenv');
dotenv.config();

const { computeAtsScore } = require('./src/services/ats.service');
const { extractStructuredResume } = require('./src/services/extraction.service');
const { computeMatchScore } = require('./src/services/match.service');
const { generateRoadmap } = require('./src/services/planner.service');

const mockRawText = `
John Doe
Software Engineer
Email: john.doe@email.com | Phone: 123-456-7890
Location: San Francisco, CA

SUMMARY
Experienced software engineer with 8 years of experience building scalable web applications.

SKILLS
JavaScript, Node.js, React, Express, PostgreSQL, AWS, Docker, Kubernetes, Git, REST APIs.

EXPERIENCE
Lead Backend Engineer at TechCorp (January 2021 - Present)
- Architected and deployed microservices on AWS using Docker and Kubernetes, improving system reliability by 99.9%.
- Led a team of 4 engineers to rebuild the legacy API platform, reducing latency by 45%.
- Implemented automated testing pipeline, cutting release cycle time in half.

Software Developer at WebSolutions (June 2018 - December 2020)
- Built 12 responsive web applications using React and Node.js.
- Optimized database queries for PostgreSQL, resulting in a 30% speedup for core search endpoints.
- Collaborated with product managers to define system specifications.

EDUCATION
Bachelor of Science in Computer Science
State University, 2014 - 2018
`;

const mockJobDescription = `
We are looking for a Senior Software Engineer with strong experience in Node.js, PostgreSQL, AWS, and Docker.
The candidate will build scalable APIs, lead architectural designs, and optimize query performance.
Experience with Kubernetes and frontend frameworks like React is a plus.
`;

async function testServices() {
  try {
    console.log('Testing extraction.service...');
    const structured = await extractStructuredResume(mockRawText);
    console.log('Extracted Resume (Skills):', structured.skills);

    console.log('\nTesting ats.service...');
    const atsResult = computeAtsScore(mockRawText, structured, mockJobDescription);
    console.log('ATS Score:', atsResult.score);

    console.log('\nTesting match.service...');
    const matchResult = await computeMatchScore(mockRawText, mockJobDescription);
    console.log('Match Score similarity:', matchResult.similarityScore);

    console.log('\nTesting Phase 2 planner.service...');
    // We intentionally pass a subset of skills to force gaps
    const testSkills = ['JavaScript', 'React', 'Git'];
    const roadmapResult = await generateRoadmap({
      resumeSkills: testSkills,
      targetRole: 'backend-engineer',
      availableHoursPerDay: 2,
    });
    console.log('Roadmap target:', roadmapResult.targetRole);
    console.log('Identified Skill Gaps:', roadmapResult.skillGaps);
    console.log('Roadmap Summary:', roadmapResult.roadmap.summary);
    console.log('Roadmap Weeks Count:', roadmapResult.roadmap.weeks.length);
    console.log('Validation Errors:', roadmapResult.validationErrors);
    if (roadmapResult.roadmap.weeks.length > 0) {
      console.log('First Week plan:', JSON.stringify(roadmapResult.roadmap.weeks[0], null, 2));
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testServices();
