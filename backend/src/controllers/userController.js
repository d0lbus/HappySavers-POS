const { User, Role, Log } = require('../../models');
async function listUsers(req, res) {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
      attributes: ['id', 'name', 'username', 'status', 'roleId', 'createdAt'],
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
}

async function createUser(req, res) {
  try {
    const { name, username, password, pin, roleId, status } = req.body;

    if (!name || !username || !password || !roleId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = await User.create({
      name,
      username,
      passwordHash: password,
      pinPassword: pin || null,
      roleId,
      status: status || 'active',
    });

    await Log.create({
      userId: req.user.id,
      action: 'USER_CREATED',
      details: `Created user ${user.username} (ID: ${user.id})`,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      username: user.username,
      roleId: user.roleId,
      status: user.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, roleId, status } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (roleId !== undefined) user.roleId = roleId;
    if (status !== undefined) user.status = status;

    await user.save();

    await Log.create({
      userId: req.user.id,
      action: 'USER_UPDATED',
      details: `Updated user ${user.username} (ID: ${user.id})`,
    });

    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      roleId: user.roleId,
      status: user.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
}

async function changeUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = status;
    await user.save();

    await Log.create({
      userId: req.user.id,
      action: 'USER_STATUS_CHANGED',
      details: `Changed status of ${user.username} (ID: ${user.id}) to ${status}`,
    });

    res.json({ message: 'Status updated', status: user.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error changing user status' });
  }
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
  changeUserStatus,
};
