import React from 'react';

const Button = ({ children, onClick, type = "button", variant = "primary", className = "" }) => {
  const baseStyles = "px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90",
    accent: "bg-accent text-charcoal hover:shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    danger: "bg-error text-white hover:bg-opacity-90"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
