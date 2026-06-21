const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com/users';

const getHeaders = () => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

/**
 * Fetches user profile from GitHub API
 * @param {string} username
 * @returns {Promise<Object>} Profile data
 */
const fetchUserProfile = async (username) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/${username}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const notFoundError = new Error('GitHub user not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    throw new Error(`Error fetching GitHub user profile: ${error.message}`);
  }
};

/**
 * Fetches all repositories for a user
 * @param {string} username
 * @returns {Promise<Array>} List of repositories
 */
const fetchUserRepositories = async (username) => {
  try {
    let repos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(`${GITHUB_API_BASE}/${username}/repos`, {
        headers: getHeaders(),
        params: {
          per_page: 100,
          page: page,
        },
      });

      repos = repos.concat(response.data);
      if (response.data.length < 100) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return repos;
  } catch (error) {
    throw new Error(`Error fetching GitHub user repositories: ${error.message}`);
  }
};

module.exports = {
  fetchUserProfile,
  fetchUserRepositories,
};
