import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 ml-64 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
      <div className="text-charcoal font-medium text-lg">
        Welcome back, <span className="font-bold text-primary">{user?.name}</span>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-charcoal hover:text-primary transition-colors">
          <Bell size={24} />
        </button>
        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
          <UserCircle size={32} className="text-primary" />
          <div className="text-sm">
            <p className="font-bold text-charcoal">{user?.name}</p>
            <p className="text-gray-500 text-xs">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
