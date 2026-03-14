const supabase = require('../config/supabase');

const createTask = async (req, res) => {
  const { title, description, priority, deadline, team_id, assignees } = req.body;
  try {
    if (!team_id) return res.status(400).json({ error: 'team_id is required' });

    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        title,
        description,
        priority: priority || 'Medium',
        deadline,
        team_id,
        created_by: req.user.id
      })
      .select()
      .single();

    if (taskError) throw taskError;

    if (assignees && assignees.length > 0) {
      const assigneeData = assignees.map(user_id => ({ task_id: task.id, user_id }));
      const { error: assignError } = await supabase
        .from('task_assignees')
        .insert(assigneeData);
      
      if (assignError) throw assignError;
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTeamTasks = async (req, res) => {
  const { teamId } = req.params;
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_assignees (
          users (id, full_name, email)
        )
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { status, title, description, priority, deadline } = req.body;
  
  try {
    // Rule enforcement: Workflow tracking
    const { data: currentTask, error: fetchError } = await supabase
      .from('tasks')
      .select('status, team_id')
      .eq('id', taskId)
      .single();

    if (fetchError) throw fetchError;
    
    if (currentTask.status === 'Done' && status && status !== 'Done') {
      return res.status(400).json({ error: 'Completed tasks cannot be modified.' });
    }

    if (status === 'In Progress' && currentTask.status === 'Todo') {
      // Rule: Only assigned users can move task to In Progress
      const { data: assignees, error: assignError } = await supabase
        .from('task_assignees')
        .select('user_id')
        .eq('task_id', taskId);
      
      if (assignError) throw assignError;

      const isAssigned = assignees.some(a => a.user_id === req.user.id);
      if (!isAssigned) {
        return res.status(403).json({ error: 'Only assigned users can move tasks to In Progress.' });
      }
    }

    if (status === 'Done' && currentTask.status !== 'In Progress') {
       // Requirement says: "Only In Progress tasks can be marked as Done"
       return res.status(400).json({ error: 'Tasks must be In Progress before being marked as Done.' });
    }

    // Perform Update
    const updateData = {};
    if (status) updateData.status = status;
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (deadline !== undefined) updateData.deadline = deadline;
    updateData.updated_at = new Date().toISOString();

    const { data: task, error: updateError } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (updateError) throw updateError;
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const assignUsersToTask = async (req, res) => {
  const { taskId } = req.params;
  const { assignees } = req.body; 
  
  try {
    // First, clear existing assignees
    await supabase.from('task_assignees').delete().eq('task_id', taskId);
    
    // Add new ones
    if (assignees && assignees.length > 0) {
      const assigneeData = assignees.map(user_id => ({ task_id: taskId, user_id }));
      const { error: assignError } = await supabase
        .from('task_assignees')
        .insert(assigneeData);
        
      if (assignError) throw assignError;
    }
    
    res.json({ message: 'Assignees updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) throw error;
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTask, getTeamTasks, updateTask, assignUsersToTask, deleteTask };
