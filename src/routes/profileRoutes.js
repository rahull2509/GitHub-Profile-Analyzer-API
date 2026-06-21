const express = require('express');
const router = express.Router();

const {
  analyzeProfile,
  getProfiles,
  getProfile,
  deleteProfile,
  reanalyzeProfile,
  getLeaderboard,
  getStats
} = require('../controllers/profileController');

const { analyzeValidation } = require('../validations/profileValidations');
const validate = require('../middlewares/validate');

// Get statistics
router.get('/stats', getStats);

// Get leaderboard
router.get('/top', getLeaderboard);

// Analyze a profile
router.post('/analyze', analyzeValidation, validate, analyzeProfile);

// Get all profiles
router.get('/profiles', getProfiles);

// Get a single profile
router.get('/profiles/:username', getProfile);

// Delete a profile
router.delete('/profiles/:username', deleteProfile);

// Reanalyze a profile
router.put('/reanalyze/:username', reanalyzeProfile);

module.exports = router;
