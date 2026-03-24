const { sendError } = require('../utils/apiResponse');

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, `Access denied. Required role: ${allowedRoles.join(' or ')}`);
    }

    next();
  };
};

module.exports = { checkRole };
