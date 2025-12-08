const { User, RefreshToken, Log, Role } = require('../../models');
const { signAccessToken, signRefreshToken, verifyToken } = require('../utils/jwt');

async function login(req, res) {
  try {
    const { username, password, pin } = req.body;

    if (!username || (!password && !pin)) {
      return res.status(400).json({ message: 'Username and password or PIN are required' });
    }

    const user = await User.findOne({
        where: { username },
        include: [{ model: Role, as: 'role' }],
    });

    if (!user || user.status !== 'active') {
      await Log.create({
        userId: user ? user.id : null,
        action: 'LOGIN_FAILED',
        details: 'Invalid username or inactive account',
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let valid = false;

    if (password) valid = await user.validatePassword(password);
    if (!valid && pin) valid = await user.validatePin(pin);

    if (!valid) {
      await Log.create({
        userId: user.id,
        action: 'LOGIN_FAILED',
        details: 'Wrong password or PIN',
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      revoked: false,
    });

    await Log.create({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      details: 'User logged in',
    });

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          roleId: user.roleId,
          roleName: user.role ? user.role.name : null,
          status: user.status,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login error' });
  }
}

async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const stored = await RefreshToken.findOne({ where: { token, revoked: false } });
    if (!stored) return res.status(401).json({ message: 'Invalid refresh token' });

    const payload = verifyToken(token);
    const user = await User.findByPk(payload.id);
    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    const accessToken = signAccessToken(user);

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await RefreshToken.update(
        { revoked: true },
        { where: { token } }
      );
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Logout error' });
  }
}

module.exports = {
  login,
  refresh,
  logout,
};
