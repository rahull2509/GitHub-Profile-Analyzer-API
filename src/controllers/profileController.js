const GithubProfile = require('../models/GithubProfile');
const { fetchUserProfile, fetchUserRepositories } = require('../services/githubService');
const { analyzeProfileData } = require('../services/analysisService');
const { Op } = require('sequelize');

/**
 * @desc    Analyze a new GitHub profile
 * @route   POST /api/github/analyze
 * @access  Public
 */
const analyzeProfile = async (req, res, next) => {
  try {
    const { username } = req.body;

    // Check if profile already exists
    let existingProfile = await GithubProfile.findOne({ where: { username } });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already analyzed. Use PUT /api/github/reanalyze/:username to update.',
      });
    }

    // Fetch from GitHub
    const userData = await fetchUserProfile(username);
    const reposData = await fetchUserRepositories(username);

    // Analyze data
    const analyzedData = analyzeProfileData(userData, reposData);

    // Save to DB
    const newProfile = await GithubProfile.create(analyzedData);

    res.status(201).json({
      success: true,
      message: 'Profile analyzed successfully',
      data: newProfile
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all analyzed profiles with pagination, search, and sorting
 * @route   GET /api/github/profiles
 * @access  Public
 */
const getProfiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const sort = req.query.sort || 'created_at'; // score, followers, etc.
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

    // Map sort parameter to database column
    let sortColumn = 'created_at';
    if (sort === 'score') sortColumn = 'analysis_score';
    if (sort === 'followers') sortColumn = 'followers';

    const whereClause = search ? {
      [Op.or]: [
        { username: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await GithubProfile.findAndCountAll({
      where: whereClause,
      order: [[sortColumn, order]],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single analyzed profile
 * @route   GET /api/github/profiles/:username
 * @access  Public
 */
const getProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const profile = await GithubProfile.findOne({ where: { username } });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an analyzed profile
 * @route   DELETE /api/github/profiles/:username
 * @access  Public
 */
const deleteProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const deletedCount = await GithubProfile.destroy({ where: { username } });

    if (deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, message: 'Profile deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reanalyze an existing GitHub profile
 * @route   PUT /api/github/reanalyze/:username
 * @access  Public
 */
const reanalyzeProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    let existingProfile = await GithubProfile.findOne({ where: { username } });
    if (!existingProfile) {
      return res.status(404).json({ success: false, message: 'Profile not found. Please analyze it first.' });
    }

    // Fetch from GitHub
    const userData = await fetchUserProfile(username);
    const reposData = await fetchUserRepositories(username);

    // Analyze data
    const analyzedData = analyzeProfileData(userData, reposData);

    // Update in DB
    await existingProfile.update(analyzedData);

    res.status(200).json({
      success: true,
      message: 'Profile reanalyzed successfully',
      data: existingProfile
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Top 10 Leaderboard
 * @route   GET /api/github/top
 * @access  Public
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const topProfiles = await GithubProfile.findAll({
      order: [['analysis_score', 'DESC']],
      limit: 10
    });

    res.status(200).json({ success: true, data: topProfiles });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get system statistics
 * @route   GET /api/github/stats
 * @access  Public
 */
const getStats = async (req, res, next) => {
  try {
    const total_profiles = await GithubProfile.count();
    
    // Fallback if no profiles
    if (total_profiles === 0) {
       return res.status(200).json({
         success: true,
         data: {
           total_profiles: 0,
           average_followers: 0,
           average_repositories: 0,
           highest_score_profile: null
         }
       });
    }

    const followersSum = await GithubProfile.sum('followers');
    const reposSum = await GithubProfile.sum('public_repos');
    
    const highest_score_profile = await GithubProfile.findOne({
      order: [['analysis_score', 'DESC']],
      attributes: ['username', 'analysis_score']
    });

    res.status(200).json({
      success: true,
      data: {
        total_profiles,
        average_followers: Math.round(followersSum / total_profiles),
        average_repositories: Math.round(reposSum / total_profiles),
        highest_score_profile: highest_score_profile ? highest_score_profile.username : null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeProfile,
  getProfiles,
  getProfile,
  deleteProfile,
  reanalyzeProfile,
  getLeaderboard,
  getStats
};
