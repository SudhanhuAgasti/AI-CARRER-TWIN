/**
 * Integration test script for Phase 3: GitHub Analyzer.
 * Hits the running local server endpoint to verify integration.
 * Run this using: node test-github.js
 */

async function runTest() {
  const PORT = process.env.PORT || 4000;
  const url = `http://localhost:${PORT}/api/github/analyze`;
  const testUsername = 'octocat'; // Famous GitHub user with small active repositories

  console.log(`[Test] Sending POST request to ${url} for user '${testUsername}'...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: testUsername }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    console.log('\n=========================================');
    console.log('✅ TEST PASSED - GITHUB ANALYSIS SUCCESSFUL');
    console.log('=========================================');
    console.log(`Report ID: ${data.ids.reportId}`);
    console.log(`Username: ${data.username}`);
    console.log(`Served From Cache: ${data.cached ? 'Yes (⚡)' : 'No (Fresh API Calls)'}`);
    console.log(`Profile:`, data.profile);
    console.log('\n--- Heuristics Scores ---');
    console.log(`Overall Score: ${data.heuristics.overallScore}/100`);
    console.log(`Cleanliness: ${data.heuristics.cleanlinessScore}/100`);
    console.log(`Diversity: ${data.heuristics.diversityScore}/100`);
    console.log(`Consistency: ${data.heuristics.consistencyScore}/100`);
    
    console.log('\n--- Failed/Passed Checks ---');
    data.heuristics.checks.forEach(check => {
      console.log(`[${check.passed ? 'PASS' : 'FAIL'}] ${check.name} (+${check.points} pts) - ${check.detail || ''}`);
    });

    console.log('\n--- Featured Repositories Summaries ---');
    data.summaries.forEach(repo => {
      console.log(`\n• Repo: ${repo.name}`);
      console.log(`  Tech Stack: ${repo.techStack.join(', ') || 'N/A'}`);
      console.log(`  Architecture Patterns: ${repo.architecturePatterns.join(', ') || 'N/A'}`);
      console.log(`  Summary: ${repo.summary}`);
    });

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error(error.message);
    console.error('Make sure the server is running on port 4000 (npm run dev) and you have internet access.');
  }
}

runTest();
