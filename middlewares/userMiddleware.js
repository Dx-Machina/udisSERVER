//===================================================================
// User middleware to check for authorization and validate token
//===================================================================

const { verifyToken } = require('../services/userService');

exports.protect = async (req, res, next) => {
  console.log('[userMiddleware] Checking authorization header...');
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    console.error('[userMiddleware] Authorization header missing or invalid');
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  try {
    const token = authHeader.split(' ')[1];
    console.log('[userMiddleware] Extracted token:', token);

    const user = await verifyToken(token);
    req.user = user;
    console.log('[userMiddleware] User authenticated:', user);
    next();
  } catch (error) {
    console.error('[userMiddleware] Error authenticating user:', error.message);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};
