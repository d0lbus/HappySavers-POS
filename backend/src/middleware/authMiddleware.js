// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { Log } = require('../../models');

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // contains id, username, roleId, role, status
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// allowedRoles = ['Admin', 'Manager'] etc.
function authorizeRoles(...allowedRoles) {
  return async (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      await Log.create({
        userId: req.user.id || null,
        action: 'FORBIDDEN_ACCESS',
        details: `Attempt to access ${req.originalUrl} with role ${req.user.role}`,
      });

      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}

module.exports = { authenticateJWT, authorizeRoles };
