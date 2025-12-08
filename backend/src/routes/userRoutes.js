const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

router.use(authenticateJWT);
router.use(authorizeRoles(ROLES.ADMIN));

router.get('/', userController.listUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.patch('/:id/status', userController.changeUserStatus);

module.exports = router;
