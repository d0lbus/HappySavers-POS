const jwt = require('jsonwebtoken');

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES || '7d';
const JWT_SECRET = process.env.JWT_SECRET;

function signAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    roleId: user.roleId,
    role: user.role ? user.role.name : null,
    status: user.status,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}


function signRefreshToken(user) {
  const payload = {
    id: user.id,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
};
