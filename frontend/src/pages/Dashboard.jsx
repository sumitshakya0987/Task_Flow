import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { PlusCircle, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      const data = await api.getTeams();
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTeam(e) {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    
    try {
      setIsCreating(true);
      setError('');
      await api.createTeam(newTeamName);
      setNewTeamName('');
      toast.success('Team created successfully!');
      loadTeams();
    } catch (err) {
      setError('Failed to create team: ' + err.message);
      toast.error('Failed to create team');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-gray-200/60 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Workspaces</h1>
          <p className="text-slate-500 mt-2">Manage your teams and collaborate on tasks.</p>
        </div>
      </div>

      {error && <div className="bg-red-50/80 backdrop-blur text-red-600 p-4 rounded-xl border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Create Team Card */}
        <div className="bg-white/40 backdrop-blur-sm shadow-sm rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-white/60 transition-all duration-300 group">
          <div className="p-6 flex flex-col h-full justify-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <PlusCircle className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Create New Team</h3>
            <p className="text-sm text-slate-500 mb-6">Start a new workspace for a new project.</p>
            
            <form onSubmit={handleCreateTeam} className="space-y-3 mt-auto">
              <input
                type="text"
                placeholder="e.g. Design Team"
                className="appearance-none block w-full px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              <button
                type="submit"
                disabled={isCreating || !newTeamName.trim()}
                className="w-full inline-flex justify-center items-center px-4 py-2.5 shadow-sm text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              >
                Create Workspace
              </button>
            </form>
          </div>
        </div>

        {/* Existing Teams */}
        {loading ? (
            <div className="bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-white animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-5 bg-slate-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            </div>
        ) : (
            teams.map((team, i) => (
            <Link 
                key={team.id} 
                to={`/teams/${team.id}`}
                className="bg-white/70 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 rounded-2xl border border-white hover:border-indigo-100 transition-all duration-300 group flex flex-col cursor-pointer transform hover:-translate-y-1 relative"
            >
                {/* Decorative gradient blob */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-40 ${i % 2 === 0 ? 'bg-indigo-400' : 'bg-blue-400'}`}></div>
                
                <div className="p-6 flex-1 flex flex-col relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl flex items-center justify-center mb-4 border border-indigo-100/50 group-hover:scale-110 transition-transform duration-300">
                     <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors truncate">
                      {team.name}
                  </h3>
                  
                  <div className="mt-auto pt-6 flex items-center justify-between text-sm text-slate-500 font-medium">
                      <span className="flex items-center">
                        Open Board
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
            </Link>
            ))
        )}
      </div>
    </div>
  );
}
