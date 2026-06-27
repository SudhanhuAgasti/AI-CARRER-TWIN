const {
  fetchUserProfile,
  fetchUserRepos,
  fetchRepoLanguages,
  fetchRepoCommits,
  fetchRepoReadme,
  fetchRepoContents,
} = require('../services/github.service');
const { profileGithubAccount } = require('../services/githubProfiler.service');
const { summarizeRepository } = require('../services/githubSummarizer.service');
const { analyzeCodeCodeAst } = require('../services/githubAst.service');
const { saveGithubReport, getRecentGithubReport } = require('../services/db.service');

/**
 * Controller handling POST /api/github/analyze.
 * Coordinates fetching profile details, running deterministic heuristic metrics,
 * performing AST static code analysis, LLM project summaries, and persisting reports.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.NextFunction} next 
 */
async function analyzeGithubUser(req, res, next) {
  try {
    const { username } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      const err = new Error('username field is required and must be a valid non-empty string');
      err.status = 400;
      throw err;
    }

    const cleanUsername = username.trim();
    console.log(`[GitHub Controller] Initiating profiling for user: ${cleanUsername}`);

    // --- CACHING LAYER ---
    // Check if analysis has been performed for this user in the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const cachedReport = await getRecentGithubReport(cleanUsername, oneDayAgo);
    if (cachedReport) {
      console.log(`[GitHub Controller] Cache hit for user '${cleanUsername}'. Serving from DB cache.`);
      return res.json({
        ids: {
          reportId: cachedReport._id.toString(),
        },
        username: cachedReport.username,
        profile: cachedReport.profile,
        heuristics: cachedReport.heuristics,
        summaries: cachedReport.summaries,
        astFingerprint: cachedReport.astFingerprint || null,
        cached: true,
      });
    }

    // 1. Fetch user general profile details
    const profile = await fetchUserProfile(cleanUsername);

    // 2. Fetch all public repositories
    const repos = await fetchUserRepos(cleanUsername);

    // Filter out forks (only analyze repository code owned/written by the user)
    const sourceRepos = repos.filter(repo => !repo.fork);

    if (sourceRepos.length === 0) {
      const err = new Error(`User '${cleanUsername}' has no public source repositories to analyze.`);
      err.status = 422;
      throw err;
    }

    // Select top 5 featured repositories for detailed profiling and LLM analysis
    // Order by stars count (prominence) first, then recently updated
    const selectedRepos = sourceRepos
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, 5);

    console.log(
      `[GitHub Controller] Selected ${selectedRepos.length} source repositories for deep profiling out of ${sourceRepos.length} total source repos.`
    );

    // 3. For each selected repository, fetch languages, commits, readme, and file structures
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const sinceIsoString = ninetyDaysAgo.toISOString().split('.')[0] + 'Z'; // GitHub API format: YYYY-MM-DDTHH:MM:SSZ

    const detailedRepos = await Promise.all(
      selectedRepos.map(async (repo) => {
        const [languages, commits, readmeText, contents] = await Promise.all([
          fetchRepoLanguages(cleanUsername, repo.name),
          fetchRepoCommits(cleanUsername, repo.name, sinceIsoString),
          fetchRepoReadme(cleanUsername, repo.name),
          fetchRepoContents(cleanUsername, repo.name),
        ]);

        return {
          name: repo.name,
          description: repo.description,
          updatedAt: repo.updated_at,
          stars: repo.stargazers_count,
          languages,
          commits,
          readmeText,
          contents,
        };
      })
    );

    // 4. Evaluate deterministic profiling metrics
    const heuristics = profileGithubAccount(profile, sourceRepos, detailedRepos);

    // 5. Run Deep AST Static Code Analysis on repository contents
    console.log(`[GitHub Controller] Performing Deep AST Static Analysis and Architecture Profiling...`);
    const sourceFiles = detailedRepos.map(repo => ({
      path: `${repo.name}/README.md`,
      content: repo.readmeText || repo.description || `Repository: ${repo.name}`
    }));
    const astFingerprint = await analyzeCodeCodeAst(sourceFiles);

    // 6. Generate LLM summaries for the selected repos
    console.log(`[GitHub Controller] Generating AI summaries for featured repositories...`);
    const summaries = await Promise.all(
      detailedRepos.map(repo => summarizeRepository(repo, repo.readmeText))
    );

    // 7. Persist results in MongoDB
    let reportId = null;
    try {
      reportId = await saveGithubReport(cleanUsername, profile, heuristics, summaries);
    } catch (dbErr) {
      console.warn(
        `[GitHub Controller] Database save failed, proceeding without database: ${dbErr.message}`
      );
    }

    res.json({
      ids: {
        reportId,
      },
      username: cleanUsername,
      profile,
      heuristics,
      astFingerprint,
      summaries,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeGithubUser };

