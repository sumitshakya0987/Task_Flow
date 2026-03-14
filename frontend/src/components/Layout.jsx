import { useAuth } from '../contexts/AuthContext';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, signOut } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background blur shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg border-b border-gray-100/50 shadow-sm supports-[backdrop-filter]:bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center group cursor-pointer hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-1.5 rounded-lg shadow-md group-hover:shadow-blue-500/30 transition-shadow">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 tracking-tight">TaskFlow</span>
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link to="/" className="border-transparent text-slate-500 hover:text-indigo-600 hover:border-indigo-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-indigo-50/50 border border-indigo-100/50">
                <span className="text-sm font-medium text-indigo-800">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
