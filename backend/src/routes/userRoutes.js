const express = require('express');
const { getCurrentUser, getAllUsers } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);
router.get('/me', getCurrentUser);
router.get('/', getAllUsers);

module.exports = router;
