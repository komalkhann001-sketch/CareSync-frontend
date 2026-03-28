import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  UserSquare2, 
  CalendarCheck, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const containerVariants = {
    hidden: { x: -300 },
    visible: { 
      x: 0, 
      transition: { duration: 0.6, staggerChildren: 0.1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Doctors', path: '/doctors', icon: UserSquare2 },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Appointments', path: '/appointments', icon: CalendarCheck },
    { name: 'Prescriptions', path: '/prescriptions', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 right-6 z-[100] p-4 obsidian-gradient text-accent rounded-full shadow-2xl border border-white/10 active:scale-95 transition-transform"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ x: -300 }}
            className={`h-screen w-72 obsidian-gradient text-white flex flex-col fixed left-0 top-0 shadow-[10px_0_50px_rgba(0,0,0,0.4)] z-[90] border-r border-accent/10 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-500`}
          >
            <motion.div className="p-10 text-3xl font-black tracking-tighter border-b border-white/5 text-center bg-white/5 backdrop-blur-md">
              <span className="text-accent underline decoration-accent/30 underline-offset-8">Care</span>Sync
            </motion.div>
            
            <nav className="flex-1 mt-10 space-y-3 px-6 text-sm overflow-y-auto custom-scrollbar">
              {links.map((link) => (
                <motion.div key={link.path} variants={itemVariants}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-400 group ${
                        isActive 
                        ? 'bg-accent text-primary font-black shadow-[0_15px_30px_-5px_rgba(212,175,55,0.4)] scale-[1.03] border border-white/20' 
                        : 'text-secondary/60 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <link.icon size={22} className="group-hover:rotate-12 transition-transform duration-300" />
                    <span className="uppercase tracking-widest font-bold">{link.name}</span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="p-8 mt-auto border-t border-white/5 bg-black/20">
              <div className="mb-8 flex items-center gap-3 px-2">
                <div className="h-12 w-12 rounded-2xl gold-gradient flex items-center justify-center font-black text-primary shadow-lg shadow-accent/20">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest leading-none mb-1">Chief Executive</p>
                  <p className="text-sm font-black text-accent truncate w-32">{user?.name || 'Admin User'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl bg-white/5 hover:bg-error/30 hover:text-white transition-all duration-300 cursor-pointer group border border-white/5 active:scale-95"
              >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-black text-xs uppercase tracking-widest">Seal Session</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
        />
      )}
    </>
  );
};


export default Sidebar;
