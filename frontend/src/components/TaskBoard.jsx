import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

export default function TaskBoard({ tasks, onTaskClick }) {
  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full px-2 pb-6 overflow-x-auto min-h-[600px] animate-in slide-in-from-bottom-4 duration-500">
      {columns.map(status => {
        const columnTasks = tasks.filter(t => t.status === status);
        return (
          <div key={status} className="flex-1 w-full lg:w-1/3 min-w-[280px] bg-slate-100/50 backdrop-blur-sm rounded-3xl flex flex-col border border-slate-200/60 shadow-sm overflow-hidden mix-blend-multiply">
            {/* Column Header */}
            <div className="p-4 border-b border-slate-200/50 bg-white/40 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <span className={`w-3 h-3 rounded-full ${status === 'Todo' ? 'bg-slate-400' : status === 'In Progress' ? 'bg-indigo-500' : 'bg-green-500'}`}></span>
                <h3 className="font-bold text-slate-700 tracking-tight">{status}</h3>
                <span className="bg-white/80 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
                  {columnTasks.length}
                </span>
              </div>
              <button 
                onClick={() => onTaskClick(null)}
                className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shadow-sm border border-transparent hover:border-slate-200" title="Add Task">
                  <Plus className="w-5 h-5"/>
              </button>
            </div>
            
            {/* Column Content */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                  {columnTasks.length === 0 ? (
                    <div className="h-24 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm italic font-medium">
                      No tasks
                    </div>
                  ) : (
                    columnTasks.map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onClick={() => onTaskClick(task)}
                        />
                    ))
                  )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
