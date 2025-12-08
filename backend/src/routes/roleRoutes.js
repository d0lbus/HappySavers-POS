const express = require('express');
const router = express.Router();

const { listRoles } = require('../controllers/roleController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

// Ensure user is logged in
router.use(authenticateJWT);

// Allow ONLY Admin to fetch roles list
router.use(authorizeRoles(ROLES.ADMIN));

router.get('/', listRoles);

module.exports = router;
