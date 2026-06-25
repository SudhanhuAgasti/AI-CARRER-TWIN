/**
 * GitHub API client service.
 * Interacts with the public GitHub REST API using native fetch.
 * 
 * DESIGN RATIONALE:
 * - Uses native fetch (available in Node.js 18+) to avoid adding external request library overhead.
 * - Requires a User-Agent header (mandatory for all GitHub API requests).
 * - Optionally authenticates via `process.env.GITHUB_TOKEN` to prevent rate limit starvation.
 * - Implements strict error handling (such as 404 for missing users or 403 for rate limits).
 */

const GITHUB_API_URL = 'https://api.github.com';

/**
 * Helper to prepare default headers for the GitHub API.
 * @returns {HeadersInit}
 */
function getHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'ai-career-twin-server-agent',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  
  return headers;
}

/**
 * Handles parsing Response. Handles rate-limiting or not found errors gracefully.
 * @param {Response} response 
 * @param {string} errorContext 
 */
async function handleResponse(response, errorContext) {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`${errorContext}: Resource not found (404).`);
    }
    if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
      throw new Error(
        `${errorContext}: GitHub API rate limit exceeded (403). Please configure GITHUB_TOKEN in your environment.`
      );
    }
    const errMsg = await response.text().catch(() => '');
    throw new Error(`${errorContext} failed with status ${response.status}: ${errMsg || response.statusText}`);
  }
  return response.json();
}

/**
 * Fetches basic public profile information for a GitHub user.
 * @param {string} username 
 * @returns {Promise<Object>} User details
 */
async function fetchUserProfile(username) {
  const url = `${GITHUB_API_URL}/users/${encodeURIComponent(username)}`;
  const response = await fetch(url, { headers: getHeaders() });
  const data = await handleResponse(response, `Fetching profile for user '${username}'`);
  
  return {
    username: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    publicRepos: data.public_repos,
    followers: data.followers,
  };
}

/**
 * Fetches the user's public repositories, sorted by most recently updated.
 * @param {string} username 
 * @returns {Promise<Array<Object>>} Repositories array
 */
async function fetchUserRepos(username) {
  const url = `${GITHUB_API_URL}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;
  const response = await fetch(url, { headers: getHeaders() });
  return handleResponse(response, `Fetching repositories for user '${username}'`);
}

/**
 * Fetches the language stats breakdown for a repository.
 * @param {string} owner 
 * @param {string} repo 
 * @returns {Promise<Object>} Object with languages and byte count (e.g. { JavaScript: 1234 })
 */
async function fetchRepoLanguages(owner, repo) {
  const url = `${GITHUB_API_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`;
  const response = await fetch(url, { headers: getHeaders() });
  return handleResponse(response, `Fetching languages for '${owner}/${repo}'`);
}

/**
 * Fetches commits of a repository since a specific ISO date string.
 * @param {string} owner 
 * @param {string} repo 
 * @param {string} sinceIsoString 
 * @returns {Promise<Array<Object>>} Commits array
 */
async function fetchRepoCommits(owner, repo, sinceIsoString) {
  const url = `${GITHUB_API_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?since=${sinceIsoString}&per_page=100`;
  try {
    const response = await fetch(url, { headers: getHeaders() });
    return await handleResponse(response, `Fetching commits for '${owner}/${repo}'`);
  } catch (err) {
    // If repository is empty (has no commits), GitHub API returns 409 conflict or similar.
    // We treat empty repos gracefully as having 0 commits.
    console.warn(`[GitHub Service] Graceful fallback on commits fetch for '${owner}/${repo}':`, err.message);
    return [];
  }
}

/**
 * Fetches the raw README text of a repository if it exists.
 * @param {string} owner 
 * @param {string} repo 
 * @returns {Promise<string|null>} README plain text, or null if not found
 */
async function fetchRepoReadme(owner, repo) {
  const url = `${GITHUB_API_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
  try {
    const response = await fetch(url, {
      headers: {
        ...getHeaders(),
        // Request raw plain text instead of JSON payload containing base64 data
        'Accept': 'application/vnd.github.v3.raw',
      },
    });
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }
    
    return await response.text();
  } catch (err) {
    console.warn(`[GitHub Service] README fetch failed for '${owner}/${repo}':`, err.message);
    return null;
  }
}

/**
 * Fetches the top-level directory contents of a repository to check structure indicators.
 * @param {string} owner 
 * @param {string} repo 
 * @returns {Promise<Array<Object>>} File/folder content array
 */
async function fetchRepoContents(owner, repo) {
  const url = `${GITHUB_API_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents`;
  try {
    const response = await fetch(url, { headers: getHeaders() });
    return await handleResponse(response, `Fetching contents for '${owner}/${repo}'`);
  } catch (err) {
    console.warn(`[GitHub Service] Contents fetch failed for '${owner}/${repo}':`, err.message);
    return [];
  }
}

module.exports = {
  fetchUserProfile,
  fetchUserRepos,
  fetchRepoLanguages,
  fetchRepoCommits,
  fetchRepoReadme,
  fetchRepoContents,
};
