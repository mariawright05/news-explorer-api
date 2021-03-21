const jwt = require('jsonwebtoken');
const config = require('config');
const ApiError = require('./errors/ApiError');

const { authError, validationError } = ApiError;

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    next(authError('No token, authorization denied'));
    return;
  }

  try {
    // Verify token and pull out payload
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    // Gives access to token inside the route
    req.user = decoded.user;
    next();
  } catch (err) {
    next(validationError('Wrong token, authorization denied'));
  }
};
