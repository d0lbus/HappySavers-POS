const { Log, User } = require('../../models');

async function listLogs(req, res) {
  try {
    const logs = await Log.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 200, // adjust if you want more
    });

    res.json(logs);
  } catch (err) {
    console.error('Log fetch error:', err);
    res.status(500).json({ message: 'Error fetching logs' });
  }
}

module.exports = { listLogs };
