import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserMinus } from 'lucide-react';
import { api } from '../lib/api';

export default function TeamMembersModal({ isOpen, onClose, teamId }) {
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, teamId]);

  async function loadData() {
    try {
      setLoading(true);
      const [membersData, usersData] = await Promise.all([
        api.getTeamMembers(teamId),
        api.getAllUsers()
      ]);
      setMembers(membersData);
      setAllUsers(usersData);
    } catch (err) {
      setError('Failed to load members: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMember(e) {
    e.preventDefault();
    if (!selectedUserId) return;
    try {
      setLoading(true);
      await api.addTeamMember(teamId, selectedUserId);
      setSelectedUserId('');
      loadData();
    } catch (err) {
      setError('Failed to add member: ' + err.message);
      setLoading(false);
    }
  }

  async function handleRemoveMember(userId) {
    if (!window.confirm('Remove this member?')) return;
    try {
      setLoading(true);
      await api.removeMember(teamId, userId);
      loadData();
    } catch(err) {
       setError('Failed to remove member: ' + err.message);
       setLoading(false);
    }
  }

  if (!isOpen) return null;

  const memberIds = members.map(m => m.users.id);
  const availableUsers = allUsers.filter(u => !memberIds.includes(u.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
           <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>
        
        <h3 className="text-xl font-medium text-gray-900 mb-4">Team Members</h3>
        
        {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

        <div className="mb-6">
           <form onSubmit={handleAddMember} className="flex space-x-2">
              <select 
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
              >
                 <option value="">Select a user to add...</option>
                 {availableUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
                 ))}
              </select>
              <button
                type="submit"
                disabled={loading || !selectedUserId}
                className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
              >
                <UserPlus className="h-4 w-4" />
              </button>
           </form>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {members.map(m => (
            <div key={m.users.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">{m.users.full_name || 'No Name'}</p>
                <p className="text-xs text-gray-500">{m.users.email}</p>
                <span className="text-[10px] uppercase font-bold text-gray-500">{m.role}</span>
              </div>
              <button
                onClick={() => handleRemoveMember(m.users.id)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                title="Remove Member"
              >
                <UserMinus className="h-4 w-4" />
              </button>
            </div>
          ))}
          {members.length === 0 && <p className="text-gray-500 text-sm text-center">No members yet.</p>}
        </div>
      </div>
    </div>
  );
}
