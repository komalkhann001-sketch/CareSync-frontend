import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  UserSquare2, 
  CalendarCheck, 
  FileText, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, staggerChildren: 0.1, ease: 'easeOut' } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    ...(user?.role === 'Admin' ? [
      { name: 'Doctors', path: '/doctors', icon: UserSquare2 },
      { name: 'Patients', path: '/patients', icon: Users },
    ] : []),
    { name: 'Appointments', path: '/appointments', icon: CalendarCheck },
    { name: 'Prescriptions', path: '/prescriptions', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-screen w-64 obsidian-gradient text-white flex flex-col fixed left-0 top-0 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)] z-50 border-r border-accent/10"
    >
      <motion.div className="p-10 text-3xl font-black tracking-tighter border-b border-white/5 text-center bg-white/5 backdrop-blur-sm">
        <span className="text-accent underline decoration-accent/30 underline-offset-8">Care</span>Sync
      </motion.div>
      
      <nav className="flex-1 mt-10 space-y-3 px-6 text-sm">
        {links.map((link) => (
          <motion.div key={link.path} variants={itemVariants}>
            <NavLink
              to={link.path}
              className={({ isActive }) => 
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-400 group ${
                  isActive 
                  ? 'bg-accent text-primary font-black shadow-[0_10px_20px_-5px_rgba(212,175,55,0.4)] scale-[1.03]' 
                  : 'text-secondary/60 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`
              }
            >
              <link.icon size={22} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="uppercase tracking-widest font-semibold">{link.name}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>


      <div className="p-6 mt-auto border-t border-white/5 bg-black/10">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full gold-gradient flex items-center justify-center font-bold text-primary">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-tighter">Connected as</p>
            <p className="text-sm font-bold text-accent truncate w-32">{user?.name || 'Admin'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl bg-white/5 hover:bg-error/20 hover:text-error transition-all duration-300 cursor-pointer group border border-white/5"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
