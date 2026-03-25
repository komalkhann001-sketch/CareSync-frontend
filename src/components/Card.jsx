import React from 'react';

const Card = ({ children, title, icon: Icon, className = "" }) => {
  return (
    <div className={`luxury-glass rounded-[2rem] p-8 card-hover transition-all duration-500 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="p-3 obsidian-gradient rounded-xl text-accent shadow-lg shadow-accent/20">
                <Icon size={22} />
              </div>
            )}
            <h3 className="text-xl font-black text-primary tracking-tighter uppercase">{title}</h3>
          </div>
          <div className="h-1 w-12 bg-accent rounded-full opacity-30"></div>
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
