const supabase = require('../config/supabase');

const createTeam = async (req, res) => {
  const { name } = req.body;
  try {
    // 1. Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({ name, created_by: req.user.id })
      .select()
      .single();
      
    if (teamError) throw teamError;

    // 2. Add creator as admin
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({ team_id: team.id, user_id: req.user.id, role: 'admin' });
      
    if (memberError) throw memberError;

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyTeams = async (req, res) => {
  try {
    // Get teams where user is a member
    const { data: teams, error } = await supabase
      .from('team_members')
      .select('teams(*)')
      .eq('user_id', req.user.id);
      
    if (error) throw error;
    res.json(teams.map(t => t.teams));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTeamMembers = async (req, res) => {
  const { teamId } = req.params;
  try {
    const { data: members, error } = await supabase
      .from('team_members')
      .select('role, users(id, email, full_name)')
      .eq('team_id', teamId);
      
    if (error) throw error;
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addMember = async (req, res) => {
  const { teamId } = req.params;
  const { userId, role = 'member' } = req.body;
  try {
    // Optional: check if requester is admin
    const { data: newMember, error } = await supabase
      .from('team_members')
      .insert({ team_id: teamId, user_id: userId, role })
      .select();
      
    if (error) throw error;
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeMember = async (req, res) => {
  const { teamId, userId } = req.params;
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .match({ team_id: teamId, user_id: userId });
      
    if (error) throw error;
    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTeam, getMyTeams, getTeamMembers, addMember, removeMember };
