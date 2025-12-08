const express = require('express');
const router = express.Router();
const { listLogs } = require('../controllers/logController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

router.use(authenticateJWT);
router.use(authorizeRoles(ROLES.ADMIN));

router.get('/', listLogs);

module.exports = router;
