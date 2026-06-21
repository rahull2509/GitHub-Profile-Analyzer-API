const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle specific Axios GitHub API errors
  if (err.status === 404 && message === 'GitHub user not found') {
    statusCode = 404;
  } else if (err.response && err.response.status === 403 && err.response.headers['x-ratelimit-remaining'] === '0') {
    statusCode = 429;
    message = 'GitHub API rate limit exceeded';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
