require('dotenv').config();
const { generatePublicCandidateBadge, searchVerifiedCandidates } = require('./src/services/recruiterMarketplace.service');

async function testMarketplace() {
  console.log('🧪 Starting Recruiter Marketplace & Verified Candidate Badge Test...\n');

  try {
    // Test recruiter marketplace search
    const candidates = await searchVerifiedCandidates({ minScore: 50 });
    console.log('✅ Recruiter Marketplace Search Executed Successfully!');
    console.log(`Found ${candidates.length} pre-vetted candidate profiles.\n`);

    console.log('--------------------------------------------------');
    console.log('Candidate Results Preview:\n', candidates);
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('❌ Marketplace Test Failed:', err);
  }
}

testMarketplace();
