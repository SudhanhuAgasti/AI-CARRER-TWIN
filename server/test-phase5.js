/**
 * Integration and Service test script for Phase 5: LinkedIn Check & Unified Dashboard.
 * Simulates saving mock data across ATS, GitHub, and Interview collections,
 * runs the LinkedIn LLM assessment, and compiles the Unified Readiness Dashboard.
 * 
 * Run using: node test-phase5.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');

// Models
const Resume = require('./src/models/resume.model');
const AtsReport = require('./src/models/atsReport.model');
const GithubReport = require('./src/models/githubReport.model');
const InterviewSession = require('./src/models/interviewSession.model');
const LinkedinReport = require('./src/models/linkedinReport.model');
const ReadinessDashboard = require('./src/models/readinessDashboard.model');

// Services
const { analyzeLinkedinProfile } = require('./src/services/linkedin.service');
const { compileReadinessDashboard } = require('./src/services/dashboard.service');

const mockLinkedInProfileText = `
John Doe
Lead Backend Engineer at TechCorp | Distributed Systems Specialist
San Francisco, California, United States

About
Passionate engineering lead with 8+ years of experience designing high-performance REST APIs and microservice architectures. Expert in Node.js, Express, databases (PostgreSQL, MongoDB), caching with Redis, and containerized orchestration (Docker, Kubernetes). Proven track record of managing technical debt and scaling developer operations.

Experience
TechCorp
Lead Backend Engineer
January 2021 - Present (5 years 6 months)
- Built highly scalable microservices on AWS using Docker & Kubernetes.
- Spearheaded team architecture reviews reducing database query latency by 45%.

WebSolutions
Software Developer
June 2018 - December 2020 (2 years 7 months)
- Developed and optimized full stack applications using React and Node.js.
- Integrated PostgreSQL databases with optimized index partitioning.

Skills
Node.js, JavaScript, React, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, Systems Architecture, Engineering Management
`;

async function runTest() {
  console.log('====================================================');
  console.log('📊 STARTING PHASE 5 INTEGRATION & SERVICE TEST');
  console.log('====================================================');

  try {
    // 1. Connect to Database
    await connectDB();
    console.log('✅ Connected to MongoDB successfully.');

    // 2. Setup mock Resume
    console.log('\n[Step 1] Creating mock Resume record...');
    const mockResume = new Resume({
      name: 'John Doe',
      email: 'john.doe@email.com',
      skills: ['Node.js', 'JavaScript', 'React', 'PostgreSQL'],
      rawText: 'Mock Resume Raw Content',
    });
    await mockResume.save();
    const resumeId = mockResume._id;
    console.log(`✅ Resume created. ID: ${resumeId}`);

    // 3. Setup mock ATS Report
    console.log('\n[Step 2] Creating mock ATS Report...');
    const mockAts = new AtsReport({
      resumeId,
      overallScore: 85,
      grade: 'A',
      similarityScore: 0.82,
      checklistResults: [
        { name: 'Contact Info Present', passed: true, points: 20 },
        { name: 'Work Experience Present', passed: true, points: 25 },
        { name: 'Has Quantifiable Bullet Points', passed: false, points: 0, detail: 'Need more metric indicators.' },
      ],
    });
    await mockAts.save();
    console.log('✅ Mock ATS Report saved.');

    // 4. Setup mock GitHub Report
    console.log('\n[Step 3] Creating mock GitHub Report...');
    const mockGithub = new GithubReport({
      username: 'johndoe-git',
      profile: {
        name: 'John Doe',
        publicRepos: 15,
        followers: 120,
      },
      heuristics: {
        cleanlinessScore: 90,
        diversityScore: 75,
        consistencyScore: 80,
        overallScore: 82,
        checks: [
          { name: 'README Quality', passed: true, points: 25 },
          { name: 'Has Test Suites', passed: false, points: 0, detail: 'Unit test coverages missing.' },
        ],
      },
      summaries: [
        { name: 'cool-backend-project', summary: 'Scalable Express service using Redis for caching.' },
      ],
    });
    await mockGithub.save();
    console.log('✅ Mock GitHub Report saved.');

    // 5. Setup mock Interview Session
    console.log('\n[Step 4] Creating mock completed Interview Session...');
    const mockSession = new InterviewSession({
      resumeId,
      targetRole: 'Backend Engineer',
      experienceLevel: 'senior',
      status: 'completed',
      maxQuestions: 3,
      questionCount: 3,
      chatHistory: [
        { role: 'agent', content: 'Tell me about Redis caching.' },
        { role: 'candidate', content: 'I use it to store DB responses.' },
      ],
      evaluations: [
        { question: 'Tell me about Redis caching.', answer: 'I use it to store DB responses.', score: 8, feedback: 'Good start.' },
      ],
      finalFeedback: {
        overallScore: 78,
        technicalScore: 82,
        behavioralScore: 74,
        generalFeedback: 'Solid technical skills, communication was standard.',
        strengths: ['caching knowledge', 'database query scaling'],
        improvements: ['detailed distributed systems concepts detail'],
      },
    });
    await mockSession.save();
    console.log('✅ Mock Interview Session saved.');

    // 6. Test LinkedIn Service Analysis
    console.log('\n[Step 5] Triggering Gemini LinkedIn Analysis Service...');
    const linkedinAnalysis = await analyzeLinkedinProfile(mockLinkedInProfileText, 'Senior Backend Developer');
    console.log('✅ LinkedIn analysis generated successfully.');
    console.log(`Score: ${linkedinAnalysis.overallScore}/100`);
    console.log(`Headline Strength: ${linkedinAnalysis.headlineCheck.strength}`);
    console.log('Headline Suggestions:', linkedinAnalysis.headlineCheck.suggestions);
    console.log('LinkedIn Recommendations:', linkedinAnalysis.recommendations);

    // Save LinkedIn Report
    const linkedinReportDoc = new LinkedinReport({
      resumeId,
      overallScore: linkedinAnalysis.overallScore,
      sectionsCheck: linkedinAnalysis.sectionsCheck,
      headlineCheck: linkedinAnalysis.headlineCheck,
      summaryCheck: linkedinAnalysis.summaryCheck,
      recommendations: linkedinAnalysis.recommendations,
    });
    await linkedinReportDoc.save();
    console.log('✅ LinkedIn Report document saved.');

    // 7. Test Dashboard Compilation Service
    console.log('\n[Step 6] Compiling Unified Readiness Dashboard...');
    const dashboard = await compileReadinessDashboard(resumeId, 'johndoe-git');
    console.log('\n====================================================');
    console.log('🏁 DASHBOARD COMPILATION COMPLETE');
    console.log('====================================================');
    console.log(`Unified Score: ${dashboard.unifiedScore}/100`);
    console.log('Breakdown:', dashboard.breakdown);
    console.log('\nLive Actions List:');
    dashboard.liveActionList.forEach((action, i) => {
      console.log(`[${action.priority.toUpperCase()}] ${i + 1}. (${action.category}) ${action.task}`);
      console.log(`   Detail: ${action.description}`);
    });

    // 8. Cleanup test data
    console.log('\n[Step 7] Cleaning up database test records...');
    await Resume.deleteOne({ _id: resumeId });
    await AtsReport.deleteOne({ resumeId });
    await GithubReport.deleteOne({ username: 'johndoe-git' });
    await InterviewSession.deleteOne({ resumeId });
    await LinkedinReport.deleteOne({ resumeId });
    await ReadinessDashboard.deleteOne({ resumeId });
    console.log('✅ Test data cleared.');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED');
    console.error(error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\nDB connection closed. Exiting.');
    process.exit(0);
  }
}

runTest();
