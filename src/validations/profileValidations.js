const { body } = require('express-validator');

const analyzeValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('GitHub username is required')
    .isString()
    .withMessage('Username must be a string')
    .matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
    .withMessage('Invalid GitHub username format')
];

module.exports = {
  analyzeValidation
};
