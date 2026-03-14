import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import TaskBoard from '../components/TaskBoard';
import TaskModal from '../components/TaskModal';
import TeamMembersModal from '../components/TeamMembersModal';
import { Users, Plus } from 'lucide-react';

export default function TeamView() {
  const { teamId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [teamId]);

  async function loadTasks() {
    try {
      const data = await api.getTeamTasks(teamId);
      setTasks(data);
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleTaskClick(task) {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-slate-200/60 gap-4">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Project Board</h1>
           <p className="text-slate-500 mt-1 font-medium">Manage tasks and track project progress</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setIsMembersModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <Users className="h-4 w-4 mr-2" />
            Team Roster
          </button>
          <button
            onClick={() => handleTaskClick(null)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5 mr-1" />
            New Task
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50/80 backdrop-blur text-red-600 p-4 rounded-xl border border-red-100">{error}</div>}

      <div className="flex-1 flex flex-col min-h-0 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-3xl">
             <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <TaskBoard tasks={tasks} onTaskClick={handleTaskClick} />
        )}
      </div>

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          task={selectedTask}
          teamId={teamId}
          onRefresh={loadTasks}
        />
      )}

      {isMembersModalOpen && (
        <TeamMembersModal
          isOpen={isMembersModalOpen}
          onClose={() => setIsMembersModalOpen(false)}
          teamId={teamId}
        />
      )}
    </div>
  );
}
