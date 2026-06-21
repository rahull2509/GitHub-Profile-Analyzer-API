const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const GithubProfile = sequelize.define('GithubProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  github_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profile_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  blog: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitter_username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  public_repos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  following: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_stars: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_forks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_watchers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  most_starred_repo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  most_forked_repo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  account_age_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  avg_stars_per_repo: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  avg_forks_per_repo: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  languages_used: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  analysis_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
}, {
  tableName: 'github_profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = GithubProfile;
