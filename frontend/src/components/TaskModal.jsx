import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function TaskModal({ isOpen, onClose, task, teamId, onRefresh }) {
  const isEditing = !!task;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    deadline: '',
    assignees: []
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTeamMembers();
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          deadline: task.deadline ? task.deadline.split('T')[0] : '',
          assignees: task.task_assignees ? task.task_assignees.map(a => a.users.id) : []
        });
      } else {
        setFormData({
          title: '',
          description: '',
          status: 'Todo',
          priority: 'Medium',
          deadline: '',
          assignees: []
        });
      }
      setError('');
    }
  }, [isOpen, task, teamId]);

  async function loadTeamMembers() {
    try {
      const ms = await api.getTeamMembers(teamId);
      setTeamMembers(ms.map(m => m.users));
    } catch(err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        // Send updates
        await api.updateTask(task.id, {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          deadline: formData.deadline || null
        });
        // Update assignees if needed
        await api.assignUsers(task.id, formData.assignees);
        toast.success('Task updated successfully!');
      } else {
        await api.createTask({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          deadline: formData.deadline || null,
          team_id: teamId,
          assignees: formData.assignees
        });
        toast.success('Task created successfully!');
      }
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if(!window.confirm('Delete this task?')) return;
    try {
      await api.deleteTask(task.id);
      toast.success('Task deleted');
      onRefresh();
      onClose();
    } catch(err) {
      setError(err.message);
      toast.error('Failed to delete task');
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
        <div className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
           <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>
        
        <h3 className="text-xl font-medium text-gray-900 mb-4">{isEditing ? 'Edit Task' : 'New Task'}</h3>
        
        {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              required
              type="text" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Description</label>
             <textarea 
               rows={3}
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Deadline</label>
             <input 
               type="date" 
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
               value={formData.deadline}
               onChange={e => setFormData({...formData, deadline: e.target.value})}
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Assignees (Team Members)</label>
             <div className="max-h-32 overflow-y-auto space-y-1 bg-gray-50 p-2 rounded border border-gray-200">
               {teamMembers.map(member => (
                 <label key={member.id} className="flex items-center space-x-2 text-sm text-gray-700">
                   <input 
                     type="checkbox" 
                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                     checked={formData.assignees.includes(member.id)}
                     onChange={(e) => {
                       const checked = e.target.checked;
                       if (checked) {
                         setFormData({...formData, assignees: [...formData.assignees, member.id]});
                       } else {
                         setFormData({...formData, assignees: formData.assignees.filter(id => id !== member.id)});
                       }
                     }}
                   />
                   <span>{member.full_name || member.email}</span>
                 </label>
               ))}
               {teamMembers.length === 0 && <span className="text-sm text-gray-500">No members loaded</span>}
             </div>
          </div>

          <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
            {isEditing ? (
              <button 
                type="button" 
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            ) : <div></div>}
            
            <div className="flex space-x-3">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
