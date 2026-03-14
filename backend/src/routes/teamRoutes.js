const express = require('express');
const { createTeam, getMyTeams, getTeamMembers, addMember, removeMember } = require('../controllers/teamController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);
router.post('/', createTeam);
router.get('/', getMyTeams);
router.get('/:teamId/members', getTeamMembers);
router.post('/:teamId/members', addMember);
router.delete('/:teamId/members/:userId', removeMember);

module.exports = router;
