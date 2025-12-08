const express = require('express');
const router = express.Router();
const { listRoles } = require('../controllers/roleController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

router.use(authenticateJWT);
router.use(authorizeRoles(ROLES.ADMIN));

router.get('/', listRoles);

module.exports = router;
