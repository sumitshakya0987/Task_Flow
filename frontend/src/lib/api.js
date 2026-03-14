import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchWithAuth(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMessage = 'An error occurred';
    try {
        const errorData = await response.json();
        errMessage = errorData.error || errMessage;
    } catch(e) {}
    throw new Error(errMessage);
  }

  // Handle empty responses (like 204 No Content or simple OK text)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
      return response.json();
  }
  return response.text();
}

export const api = {
  // Users
  getMe: () => fetchWithAuth('/users/me'),
  getAllUsers: () => fetchWithAuth('/users'),

  // Teams
  getTeams: () => fetchWithAuth('/teams'),
  createTeam: (name) => fetchWithAuth('/teams', { method: 'POST', body: JSON.stringify({ name }) }),
  getTeamMembers: (teamId) => fetchWithAuth(`/teams/${teamId}/members`),
  addTeamMember: (teamId, userId) => fetchWithAuth(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify({ userId }) }),

  // Tasks
  getTeamTasks: (teamId) => fetchWithAuth(`/tasks/team/${teamId}`),
  createTask: (data) => fetchWithAuth('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (taskId, data) => fetchWithAuth(`/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (taskId) => fetchWithAuth(`/tasks/${taskId}`, { method: 'DELETE' }),
  assignUsers: (taskId, assignees) => fetchWithAuth(`/tasks/${taskId}/assign`, { method: 'POST', body: JSON.stringify({ assignees }) }),
};
