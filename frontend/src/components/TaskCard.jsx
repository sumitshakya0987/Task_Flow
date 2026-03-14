import { format } from 'date-fns';
import { CalendarIcon, AlertCircle, Clock } from 'lucide-react';

export default function TaskCard({ task, onClick }) {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'Done';
  
  const priorityColors = {
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
    Medium: 'bg-blue-50 text-blue-700 border-blue-200',
    High: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div 
      onClick={() => onClick(task)}
      className={`bg-white p-5 rounded-2xl shadow-sm border ${isOverdue ? 'border-red-400 shadow-red-100' : 'border-slate-200/60'} hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer mb-4 relative group`}
    >
      {isOverdue && (
        <AlertCircle className="absolute -top-2 -right-2 h-6 w-6 text-red-500 bg-white rounded-full p-0.5 shadow-sm" title="Overdue" />
      )}
      <div className="flex justify-between items-start mb-3 pr-4">
        <h4 className="font-semibold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{task.title}</h4>
      </div>
      
      <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-normal">{task.description || <span className="italic text-slate-400">No description</span>}</p>
      
      <div className="flex flex-wrap items-center gap-2 justify-between mt-auto">
        <div className="flex space-x-2">
          <span className={`px-2.5 py-1 text-[11px] rounded-full font-semibold border ${priorityColors[task.priority]} uppercase tracking-wider`}>
            {task.priority}
          </span>
        </div>
        
        {task.deadline && (
          <div className={`flex items-center text-[12px] font-medium px-2.5 py-1 rounded-full ${isOverdue ? 'text-red-700 bg-red-50 border border-red-100' : 'text-slate-600 bg-slate-50 border border-slate-200'}`}>
            <Clock className="h-3 w-3 mr-1.5 opacity-70" />
            {format(new Date(task.deadline), 'MMM d')}
          </div>
        )}
      </div>

      {task.task_assignees && task.task_assignees.length > 0 && (
         <div className="mt-4 pt-3 border-t border-slate-100 flex -space-x-2 overflow-hidden">
            {task.task_assignees.map(ta => (
               <div key={ta.users.id} className="inline-flex h-7 w-7 rounded-full ring-2 ring-white bg-gradient-to-br from-indigo-500 to-purple-500 text-white items-center justify-center text-[11px] font-bold shadow-sm" title={ta.users.full_name || ta.users.email}>
                 {(ta.users.full_name || ta.users.email).charAt(0).toUpperCase()}
               </div>
            ))}
         </div>
      )}
    </div>
  );
}
