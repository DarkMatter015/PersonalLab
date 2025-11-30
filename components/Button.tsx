import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseStyles = "h-12 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212]";
  
  const variants = {
    primary: "bg-accent text-black hover:bg-accentHover shadow-[0_0_15px_rgba(222,255,154,0.2)] focus:ring-accent",
    secondary: "bg-surface text-white border border-gray-700 hover:border-accent hover:text-accent focus:ring-gray-500",
    danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20 focus:ring-red-500"
  };

  return (
    <button 
      type={type}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};