/**
 * Analyzes GitHub user and repositories data to extract required insights
 * @param {Object} userData GitHub user profile data
 * @param {Array} reposData List of user repositories
 * @returns {Object} Analyzed profile data ready for database insertion
 */
const analyzeProfileData = (userData, reposData) => {
  const public_repos = userData.public_repos || 0;
  const followers = userData.followers || 0;
  const following = userData.following || 0;

  let total_stars = 0;
  let total_forks = 0;
  let total_watchers = 0;

  let mostStarredRepo = null;
  let maxStars = -1;

  let mostForkedRepo = null;
  let maxForks = -1;

  const languages = {};

  reposData.forEach(repo => {
    total_stars += repo.stargazers_count || 0;
    total_forks += repo.forks_count || 0;
    total_watchers += repo.watchers_count || 0;

    // Track most starred repo
    if ((repo.stargazers_count || 0) > maxStars) {
      maxStars = repo.stargazers_count || 0;
      mostStarredRepo = repo.name;
    }

    // Track most forked repo
    if ((repo.forks_count || 0) > maxForks) {
      maxForks = repo.forks_count || 0;
      mostForkedRepo = repo.name;
    }

    // Tally languages
    if (repo.language) {
      if (languages[repo.language]) {
        languages[repo.language] += 1;
      } else {
        languages[repo.language] = 1;
      }
    }
  });

  const account_age_days = calculateAccountAgeInDays(userData.created_at);
  const avg_stars_per_repo = public_repos > 0 ? (total_stars / public_repos) : 0;
  const avg_forks_per_repo = public_repos > 0 ? (total_forks / public_repos) : 0;

  const analysis_score = calculateScore(public_repos, followers, total_stars, total_forks);

  return {
    github_id: userData.id,
    username: userData.login,
    name: userData.name,
    bio: userData.bio,
    avatar_url: userData.avatar_url,
    profile_url: userData.html_url,
    company: userData.company,
    location: userData.location,
    blog: userData.blog,
    twitter_username: userData.twitter_username,
    
    public_repos,
    followers,
    following,

    total_stars,
    total_forks,
    total_watchers,

    most_starred_repo: mostStarredRepo,
    most_forked_repo: mostForkedRepo,

    account_age_days,
    avg_stars_per_repo,
    avg_forks_per_repo,

    languages_used: languages,

    analysis_score,
  };
};

/**
 * Calculates the account age in days based on the created_at timestamp
 * @param {string} createdAt GitHub created_at string
 * @returns {number} Age in days
 */
const calculateAccountAgeInDays = (createdAt) => {
  if (!createdAt) return 0;
  const createdDate = new Date(createdAt);
  const today = new Date();
  const diffTime = Math.abs(today - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
};

/**
 * Custom Score Formula:
 * analysis_score = (public_repos * 2) + (followers * 3) + (total_stars * 5) + (total_forks * 2)
 */
const calculateScore = (public_repos, followers, total_stars, total_forks) => {
  return (public_repos * 2) + (followers * 3) + (total_stars * 5) + (total_forks * 2);
};

module.exports = {
  analyzeProfileData,
  calculateAccountAgeInDays,
  calculateScore
};
