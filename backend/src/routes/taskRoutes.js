const express = require('express');
const { createTask, getTeamTasks, updateTask, assignUsersToTask, deleteTask } = require('../controllers/taskController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);
router.post('/', createTask);
router.get('/team/:teamId', getTeamTasks);
router.put('/:taskId', updateTask);
router.post('/:taskId/assign', assignUsersToTask);
router.delete('/:taskId', deleteTask);

module.exports = router;
