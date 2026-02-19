import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') || 'Admin User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Helper function to style the active link in the sidebar
  const navLinkClasses = ({ isActive }) => 
    `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-indigo-600 text-white border-l-4 border-white' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
    }`;

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* 1. Left Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col shadow-xl z-20">
        {/* Brand Logo Area */}
        <div className="h-16 flex items-center px-6 bg-slate-950">
          <Building2 className="w-6 h-6 text-indigo-400 mr-3" />
          <span className="text-white font-bold text-lg tracking-wide">Society SaaS</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 space-y-1">
          <NavLink to="/dashboard" className={navLinkClasses}>
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/complaints" className={navLinkClasses}>
            <AlertTriangle className="w-5 h-5 mr-3" />
            Complaints
          </NavLink>
          <NavLink to="/users" className={navLinkClasses}>
            <Users className="w-5 h-5 mr-3" />
            Residents
          </NavLink>
          <NavLink to="/settings" className={navLinkClasses}>
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 bg-slate-950">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          
          {/* Search Bar */}
          <div className="flex items-center text-slate-400 focus-within:text-indigo-600 w-96">
            <Search className="w-5 h-5 absolute ml-3 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search complaints, users..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-slate-700"
            />
          </div>

          {/* Right side Profile & Notifications */}
          <div className="flex items-center space-x-6">
            <button className="text-slate-400 hover:text-indigo-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </button>
            
            <div className="flex items-center border-l border-slate-200 pl-6">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                {fullName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-700">{fullName}</span>
            </div>
          </div>
        </header>

        {/* 3. The "Hole" where actual page content loads */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet /> {/* <-- React Router injects the DashboardPage here! */}
        </div>

      </main>
    </div>
  );
}