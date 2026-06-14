import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCircle,
  Settings,
  LogOut,
  ShieldAlert,
  MessageSquare,
  Terminal,
  Bell,
  ClipboardList,
  Code2
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Announcements', path: '/announcements', icon: Bell },
    { name: 'Developers', path: '/developers', icon: Code2 },
    { name: 'Blog & Feedback', path: '/blog', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Organization', path: '/organization', icon: Users },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: ShieldAlert },
    { name: 'Manage Events', path: '/admin/events', icon: Calendar },
    { name: 'Manage Teams', path: '/admin/teams', icon: Users },
    { name: 'Manage Members', path: '/admin/members', icon: UserCircle },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Registration Requests', path: '/admin/registrations', icon: ClipboardList },
    { name: 'Manage Announcements', path: '/admin/announcements', icon: Bell },
    { name: 'Manage Developers', path: '/admin/developers', icon: Code2 },
    { name: 'Queries', path: '/admin/queries', icon: MessageSquare },
    { name: 'Manage Feedback', path: '/admin/feedback', icon: MessageSquare },
  ];

  const links = user?.role === 'Admin' ? [...userLinks, ...adminLinks] : userLinks;

  return (
    <div className={`w-64 bg-[#050505]/95 backdrop-blur-3xl border-r border-white/[0.05] h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-500 ease-[0.16,1,0.3,1] md:translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.5)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 flex items-center gap-3 border-b border-white/[0.05] h-16 md:h-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center overflow-hidden border border-white/[0.08] hidden md:flex shadow-inner relative group">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img src="/logo.jpeg" alt="CCS Logo" className="w-full h-full object-contain relative z-10" onError={(e) => {
            // Fallback if logo.jpeg is not found
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }} />
          <Terminal className="w-5 h-5 text-indigo-400 hidden relative z-10" />
        </div>
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-bold tracking-tight text-[#EDEDED] hidden md:block relative z-10"
        >
          CCS Portal
        </motion.span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar relative">
        <nav className="space-y-1.5 px-4 relative z-10">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? 'text-white shadow-[0_0_20px_rgba(255,255,255,0.02)]'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-white/[0.08] border border-white/[0.05] rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
                )}
                <Icon className={`w-4 h-4 transition-colors duration-300 relative z-10 ${isActive ? 'text-indigo-400' : 'text-[#888888] group-hover:text-[#EDEDED]'}`} />
                <span className="font-medium text-[14px] tracking-wide relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-5 pb-24 md:pb-5 border-t border-white/[0.05] bg-white/[0.01] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 px-2 mb-4 relative z-10">
          <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            {user?.profile_pic ? (
              <img src={user.profile_pic} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-5 h-5 text-[#888888]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-[#EDEDED] truncate tracking-tight">{user?.name}</p>
            <p className="text-[12px] text-[#888888] truncate font-light">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            if (onClose) onClose();
          }}
          className="relative w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-rose-400/80 hover:text-rose-400 transition-all duration-300 border border-rose-500/10 hover:border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 group overflow-hidden z-10"
        >
          <div className="absolute inset-0 bg-rose-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <LogOut className="w-4 h-4 relative z-10" />
          <span className="font-medium text-[14px] tracking-wide relative z-10">Logout</span>
        </button>
      </div>
    </div>
  );
}
