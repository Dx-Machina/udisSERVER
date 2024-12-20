// rbacMiddleware.js

const { ROLE_PERMISSIONS } = require('../constants/roles');

/**
 * Middleware for Role-Based Access Control (RBAC).
 * @param {String} resource - The resource being accessed.
 * @param {String} action - The action being performed (e.g., 'read', 'update').
 * @returns {Function} Middleware function.
 */
const rbacMiddleware = (resource, action) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!ROLE_PERMISSIONS[userRole]) {
      return res.status(403).json({ message: 'Access denied: role not recognized' });
    }

    const permissions = ROLE_PERMISSIONS[userRole];
    if (!permissions[resource] || !permissions[resource].includes(action)) {
      return res.status(403).json({
        message: `Access denied for role: ${userRole} on resource: ${resource} with action: ${action}`,
      });
    }

    next();
  };
};

module.exports = rbacMiddleware;