/**
 * Heuristic profiling engine for developer GitHub accounts.
 * Calculates deterministic scores for code cleanliness, language diversity, and commit consistency.
 * 
 * DESIGN RATIONALE:
 * - Employs rule-based scoring (similar to ats.service) so it's consistent, cheap, and unit-testable.
 * - Structuring individual checks as objects with clear labels, pass/fail state, and points,
 *   making it trivial for a new developer to modify scoring weight or introduce new heuristics.
 */

/**
 * Profiles a user based on metadata from all repositories and detailed metadata from analyzed repositories.
 * 
 * @param {Object} profile - Basic GitHub profile stats.
 * @param {Array<Object>} allRepos - Summary data of all repositories.
 * @param {Array<Object>} detailedRepos - Full data (languages, contents, commits) for analyzed repositories.
 * @returns {Object} Heuristics result object with detailed scores and check status.
 */
function profileGithubAccount(profile, allRepos, detailedRepos) {
  const checks = [];
  
  // ==========================================
  // 1. Cleanliness & Project Structure (max 100)
  // ==========================================
  let cleanlinessScore = 0;
  
  if (detailedRepos.length === 0) {
    cleanlinessScore = 0;
  } else {
    let readmeCount = 0;
    let gitignoreCount = 0;
    let configCount = 0;
    let testFolderCount = 0;
    let srcLayoutCount = 0;
    
    detailedRepos.forEach(repo => {
      const files = repo.contents || [];
      const fileNames = files.map(f => f.name.toLowerCase());
      
      // Check README presence
      if (fileNames.includes('readme.md') || fileNames.includes('readme')) {
        readmeCount++;
      }
      // Check Gitignore presence
      if (fileNames.includes('.gitignore')) {
        gitignoreCount++;
      }
      // Check for config files (e.g. package.json, eslint, prettier, tsconfig, gemfile, requirements.txt, cargo.toml)
      const hasConfig = fileNames.some(name => 
        name.includes('config') || 
        name === 'package.json' || 
        name === 'tsconfig.json' || 
        name.startsWith('.eslintrc') || 
        name.startsWith('.prettier') ||
        name === 'requirements.txt' ||
        name === 'gemfile' ||
        name === 'cargo.toml' ||
        name === 'go.mod'
      );
      if (hasConfig) configCount++;
      
      // Check for test folders or files (test coverage indicator)
      const hasTests = fileNames.some(name => 
        name === 'test' || 
        name === 'tests' || 
        name === '__tests__' || 
        name === 'spec' ||
        name.includes('.test.') ||
        name.includes('.spec.')
      );
      if (hasTests) testFolderCount++;
      
      // Check for clean layout (e.g. src, lib, app, components, pkg, cmd)
      const hasCleanLayout = fileNames.some(name => 
        name === 'src' || 
        name === 'lib' || 
        name === 'app' || 
        name === 'components' || 
        name === 'pkg' || 
        name === 'cmd'
      );
      if (hasCleanLayout) srcLayoutCount++;
    });

    const totalAnalysed = detailedRepos.length;
    
    // Convert counts to percentages
    const readmeRatio = readmeCount / totalAnalysed;
    const gitignoreRatio = gitignoreCount / totalAnalysed;
    const configRatio = configCount / totalAnalysed;
    const testRatio = testFolderCount / totalAnalysed;
    const srcRatio = srcLayoutCount / totalAnalysed;

    // Calculate individual points for cleanliness (weights sum up to 100)
    const readmePoints = Math.round(readmeRatio * 20);
    const gitignorePoints = Math.round(gitignoreRatio * 20);
    const configPoints = Math.round(configRatio * 20);
    const testPoints = Math.round(testRatio * 20);
    const srcPoints = Math.round(srcRatio * 20);
    
    cleanlinessScore = readmePoints + gitignorePoints + configPoints + testPoints + srcPoints;

    checks.push({
      name: 'Repository Documentation (README presence)',
      passed: readmeRatio >= 0.8,
      points: readmePoints,
      detail: `${readmeCount}/${totalAnalysed} repositories have a README`,
    });
    
    checks.push({
      name: 'VCS Configurations (.gitignore presence)',
      passed: gitignoreRatio >= 0.8,
      points: gitignorePoints,
      detail: `${gitignoreCount}/${totalAnalysed} repositories have a .gitignore`,
    });
    
    checks.push({
      name: 'Standard Package Configurations (config files)',
      passed: configRatio >= 0.6,
      points: configPoints,
      detail: `${configCount}/${totalAnalysed} repositories contain package/config files`,
    });
    
    checks.push({
      name: 'Test Coverage Indicators (test directories/files)',
      passed: testRatio >= 0.4,
      points: testPoints,
      detail: `${testFolderCount}/${totalAnalysed} repositories contain dedicated test paths`,
    });
    
    checks.push({
      name: 'Structured Source Layout (src/lib directory presence)',
      passed: srcRatio >= 0.6,
      points: srcPoints,
      detail: `${srcLayoutCount}/${totalAnalysed} repositories utilize structured layouts`,
    });
  }

  // ==========================================
  // 2. Repository Diversity (max 100)
  // ==========================================
  let diversityScore = 0;
  
  // Aggregate all unique languages across the user's analyzed repositories
  const languageSet = new Set();
  detailedRepos.forEach(repo => {
    Object.keys(repo.languages || {}).forEach(lang => languageSet.add(lang));
  });
  
  const distinctLanguages = languageSet.size;
  if (distinctLanguages >= 3) {
    diversityScore = 100;
  } else if (distinctLanguages === 2) {
    diversityScore = 70;
  } else if (distinctLanguages === 1) {
    diversityScore = 40;
  } else {
    diversityScore = 10;
  }

  checks.push({
    name: 'Tech Stack Diversity (multiple languages used)',
    passed: distinctLanguages >= 2,
    points: Math.round(diversityScore * 0.5), // weights 50% of diversity contribution for audit log representation
    detail: `${distinctLanguages} unique languages identified across analyzed repos: ${[...languageSet].join(', ') || 'None'}`,
  });

  // Repository count contribution
  const repoCount = profile.publicRepos || 0;
  let repoCountScore = 0;
  if (repoCount >= 10) {
    repoCountScore = 100;
  } else if (repoCount >= 5) {
    repoCountScore = 75;
  } else if (repoCount >= 2) {
    repoCountScore = 50;
  } else {
    repoCountScore = 20;
  }

  checks.push({
    name: 'Repository Volume (public repository count)',
    passed: repoCount >= 5,
    points: Math.round(repoCountScore * 0.5),
    detail: `${repoCount} public repositories on profile`,
  });

  // Calculate final diversity score (equal weight to language variety and repo volume)
  diversityScore = Math.round((diversityScore + repoCountScore) / 2);

  // ==========================================
  // 3. Commit Consistency (max 100)
  // ==========================================
  // Calculate total commits in the last 90 days across all analyzed repositories
  let totalCommits90Days = 0;
  detailedRepos.forEach(repo => {
    totalCommits90Days += (repo.commits || []).length;
  });

  let consistencyScore = 0;
  if (totalCommits90Days >= 40) {
    consistencyScore = 100;
  } else if (totalCommits90Days >= 20) {
    consistencyScore = 80;
  } else if (totalCommits90Days >= 8) {
    consistencyScore = 50;
  } else if (totalCommits90Days >= 1) {
    consistencyScore = 20;
  } else {
    consistencyScore = 0;
  }

  checks.push({
    name: 'Recent Dev Activity (commits in last 90 days across featured repos)',
    passed: totalCommits90Days >= 8,
    points: consistencyScore,
    detail: `${totalCommits90Days} commits detected`,
  });

  // ==========================================
  // 4. Overall Weighted Score (max 100)
  // ==========================================
  const overallScore = Math.round(
    cleanlinessScore * 0.4 + // Cleanliness structure is highly weighted (40%)
    diversityScore * 0.3 +   // Languages/repos variety (30%)
    consistencyScore * 0.3   // Activity frequency (30%)
  );

  return {
    cleanlinessScore,
    diversityScore,
    consistencyScore,
    overallScore,
    checks,
  };
}

module.exports = { profileGithubAccount };
