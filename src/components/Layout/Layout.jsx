import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, GraduationCap, Menu, X, ArrowLeft } from 'lucide-react';
import GroqChat from '../common/GroqChat';
import NotificationBell from '../common/NotificationBell';
import { NotificationProvider } from '../../context/NotificationContext';
import { MeetingProvider } from '../../context/MeetingContext';

const LayoutContent = ({ user, logout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role;

  const mainDashboardPaths = ['/', '/student', '/lecturer', '/admin'];
  const showBackButton = !mainDashboardPaths.includes(location.pathname);

  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { name: 'Book Appointment', path: '/book-appointment', icon: '📅' },
          { name: 'View Requests', path: '/view-requests', icon: '📋' },
          { name: 'Live Session', path: '/live-session', icon: '🎥' },
          { name: 'Total Consults', path: '/total-consults', icon: '📊' },
          { name: 'Progress Bar', path: '/progress', icon: '📈' }
        ];
      case 'lecturer':
        return [
          { name: 'View Students', path: '/view-students', icon: '👥' },
          { name: 'View Appointments', path: '/view-appointments', icon: '📅' },
          { name: 'Live Session', path: '/live-session', icon: '🎥' },
          { name: 'Total Consults', path: '/total-consults', icon: '📊' },
          { name: 'Progress Bar', path: '/progress', icon: '📈' }
        ];
      case 'admin':
        return [
          { name: 'Edit Users', path: '/edit-users', icon: '✏️' },
          { name: 'All Consultations', path: '/admin/consultations', icon: '📋' },
          { name: 'Pending Actions', path: '/admin/pending', icon: '⏳' },
          { name: 'Total Stats', path: '/total-stats', icon: '📊' },
          { name: 'Live Sessions (Weekly)', path: '/live-sessions-weekly', icon: '🎥' }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <div className="flex h-screen bg-honey-50">
        <aside className={`bg-white shadow-xl flex flex-col justify-between border-r border-honey-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
          <div>
            <div className="p-2 flex justify-end border-b border-honey-100">
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-honey-100 transition">
                {isCollapsed ? <Menu className="w-5 h-5 text-tomato-500" /> : <X className="w-5 h-5 text-tomato-500" />}
              </button>
            </div>
            <div className="p-4 border-b border-honey-100">
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center w-full text-left focus:outline-none hover:bg-honey-50 p-2 rounded-lg transition ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-honey-400 to-tomato-500 flex items-center justify-center text-white flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                  )}
                  {!isCollapsed && <span className="text-gray-400 text-xs">▼</span>}
                </button>
                {isProfileOpen && !isCollapsed && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-honey-200 rounded-lg shadow-lg z-20 p-3">
                    <p className="text-sm"><strong>Name:</strong> {user?.name}</p>
                    <p className="text-sm"><strong>Email:</strong> {user?.email || 'user@example.com'}</p>
                    <p className="text-sm"><strong>Role:</strong> {role}</p>
                  </div>
                )}
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg transition ${
                      isActive
                        ? 'bg-gradient-to-r from-honey-500 to-tomato-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-honey-100'
                    } ${isCollapsed ? 'justify-center p-2' : 'px-4 py-2 space-x-3'}`
                  }
                  title={isCollapsed ? item.name : ''}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className={`p-4 border-t border-honey-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={logout}
              className={`flex items-center gap-2 text-tomato-600 hover:bg-tomato-50 rounded-lg transition ${
                isCollapsed ? 'p-2 justify-center w-full' : 'px-4 py-2 w-full'
              }`}
              title={isCollapsed ? 'Logout' : ''}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-honey-50">
          <div className="sticky top-0 z-10 bg-honey-50/95 backdrop-blur-sm border-b border-honey-200 py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center w-32"></div> {/* empty spacer left */}
              <div className="flex items-center justify-center gap-2 flex-1">
                <GraduationCap className="w-7 h-7 text-tomato-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-honey-600 to-tomato-600 bg-clip-text text-transparent">AuraConsult</h1>
              </div>
              <div className="flex items-center gap-2 w-32 justify-end">
                <NotificationBell />
              </div>
            </div>
          </div>
          <div className="p-6">
            {showBackButton && (
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-tomato-600 hover:text-tomato-700 transition"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <div></div>
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>
      <GroqChat />
    </>
  );
};

const Layout = ({ user, logout }) => (
  <NotificationProvider currentUserId={user?.id}>
    <MeetingProvider>
      <LayoutContent user={user} logout={logout} />
    </MeetingProvider>
  </NotificationProvider>
);

export default Layout;