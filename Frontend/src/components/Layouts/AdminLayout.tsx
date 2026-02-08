import { useState } from 'react';
import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  FileText,
  LogOut,
  Menu,
  X,
  Home,
  Banknote,
  Heart,
  Settings,
  ChevronDown,
  Phone,
  MoonStar
} from 'lucide-react';
import ProfileSettings from '../../pages/admin/ProfileSetting';
import { GlobalToast } from '../UI/GlobalToast';

export const AdminLayout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();


  const [profileOpen, setProfileOpen] = useState(false);
  const [isDropdownClosing, setIsDropdownClosing] = useState(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const closeDropdown = () => {
    if (isDropdownClosing) return;
    setIsDropdownClosing(true);
    setTimeout(() => {
      setProfileOpen(false);
      setIsDropdownClosing(false);
    }, 200);
  };

  const toggleDropdown = () => {
    if (profileOpen) {
      closeDropdown();
    } else {
      setProfileOpen(true);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Clock, label: 'Prayer Times', path: '/admin/prayer-times' },
    { icon: Calendar, label: 'Manage Events', path: '/admin/events' },
    { icon: Banknote, label: 'Keuangan', path: '/admin/finance' },
    { icon: Heart, label: 'Info Donasi', path: '/admin/donation' },
    { icon: Phone, label: 'Info Kontak', path: '/admin/contact' },
    { icon: FileText, label: 'About Content', path: '/admin/content' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      <style>{`
        @keyframes adminPageEnter {
          from { 
            opacity: 0; 
            transform: translateY(10px) scale(0.99); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        @keyframes dropdownEnter {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        @keyframes dropdownExit {
          from { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
          to { 
            opacity: 0; 
            transform: scale(0.95) translateY(-10px); 
          }
        }
        .animate-admin-enter {
          animation: adminPageEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-dropdown-enter {
          animation: dropdownEnter 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-dropdown-exit {
          animation: dropdownExit 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>


      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-emerald-900 text-white shadow-xl transform transition-transform duration-300 ease-in-out border-r border-emerald-800
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="h-full flex flex-col">

          <div className="p-6 border-b border-emerald-800 flex justify-between items-center bg-emerald-900">
            <div className="flex items-center gap-3">

              <div className="w-8 h-8 bg-emerald-800 rounded-full flex items-center justify-center shadow-lg ring-1 ring-emerald-700">
                <MoonStar size={16} className="text-amber-400" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">Admin Panel</h1>
                <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Masjid Raya</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-emerald-100 hover:text-amber-400 transition-colors p-1 rounded">
              <X size={24} />
            </button>
          </div>


          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
                    ? 'bg-emerald-800/50 text-amber-400 shadow-sm border-r-4 border-amber-400'
                    : 'text-emerald-100 hover:bg-emerald-800 hover:text-white hover:translate-x-1'
                    }`}
                >
                  <Icon size={20} className={active ? "text-amber-400" : "text-emerald-300 group-hover:text-white"} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>


          <div className="p-4 border-t border-emerald-800 bg-emerald-900">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-emerald-800 hover:text-white transition-colors mb-2 group"
            >
              <Home size={20} className="text-emerald-300 group-hover:text-white" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-100 bg-red-900/20 hover:bg-red-900/50 transition-colors border border-red-900/30 group"
            >
              <LogOut size={20} className="text-red-300 group-hover:text-red-100" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>


      <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">

        <header className="sticky top-0 z-30 bg-emerald-900 border-b border-amber-500 shadow-md">
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mr-4 text-emerald-100 hover:text-amber-400 md:hidden p-1 rounded-md transition-colors"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-lg font-semibold text-white tracking-wide">
                Dashboard
              </h2>
            </div>


            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-3 hover:bg-emerald-800 p-2 rounded-xl transition-all border border-transparent hover:border-emerald-700 focus:outline-none group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-white group-hover:text-amber-50 transition-colors">{user?.name}</p>
                  <p className="text-xs text-emerald-300">Administrator</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-800 flex items-center justify-center text-amber-400 font-bold border border-emerald-700 shadow-sm group-hover:scale-105 transition-transform">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-emerald-300 group-hover:text-white transition-transform duration-200 ${profileOpen && !isDropdownClosing ? 'rotate-180' : ''}`}
                />
              </button>


              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={closeDropdown} />
                  <div
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-40 transform origin-top-right ${isDropdownClosing ? 'animate-dropdown-exit' : 'animate-dropdown-enter'}`}
                  >
                    <div className="px-4 py-3 border-b border-gray-50 mb-2 sm:hidden bg-emerald-50">
                      <p className="text-sm font-bold text-emerald-900">{user?.name}</p>
                      <p className="text-xs text-emerald-600">Administrator</p>
                    </div>
                    <button
                      onClick={() => {
                        closeDropdown();
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
                    >
                      <Settings size={18} />
                      <span>Pengaturan Akun</span>
                    </button>
                    <div className="my-1 border-t border-gray-50" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                    >
                      <LogOut size={18} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>


        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">

            <div key={location.pathname} className="animate-admin-enter">
              <Outlet />
            </div>
          </div>
        </main>


        <ProfileSettings
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </div>
      <GlobalToast />
    </div>
  );
};