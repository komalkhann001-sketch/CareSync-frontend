import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, UserCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="h-24 bg-white/40 border-b border-accent/10 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 backdrop-blur-xl transition-all duration-300">
      <div className="text-primary font-medium text-sm md:text-xl tracking-tight">
        Welcome <span className="font-black text-accent">{user?.name}</span>
      </div>
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={() => toast.info('No new notifications')}
          className="text-primary hover:text-accent transition-all hover:scale-110 active:scale-90 relative"
        >
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full border-2 border-white animate-pulse"></span>
        </button>
        <div className="flex items-center gap-4 border-l pl-4 md:pl-8 border-accent/10">
          <div className="hidden md:block text-right">
            <p className="font-black text-xs text-primary uppercase tracking-widest">{user?.name}</p>
            <p className="text-secondary/50 text-[10px] font-bold uppercase">{user?.role}</p>
          </div>
          <div className="h-10 w-10 rounded-full obsidian-gradient border-2 border-accent/30 flex items-center justify-center text-accent font-black text-xs shadow-lg">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
