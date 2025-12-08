const { Role } = require('../../models');

async function listRoles(req, res) {
  try {
    const roles = await Role.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['id', 'ASC']],
    });

    res.json(roles);
  } catch (err) {
    console.error('Role fetch error:', err);
    res.status(500).json({ message: 'Error fetching roles' });
  }
}

module.exports = { listRoles };
