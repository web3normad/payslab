import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  onClick,
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#8b61c2] text-white hover:bg-[#7952a8] focus:ring-[#8b61c2] shadow-sm hover:shadow-md',
    secondary: 'bg-[#373941] text-white hover:bg-[#2a2c33] focus:ring-[#373941] shadow-sm hover:shadow-md',
    outline: 'bg-white border-2 border-[#8b61c2] text-[#8b61c2] hover:bg-[#8b61c2] hover:text-white focus:ring-[#8b61c2]',
    ghost: 'bg-transparent text-[#373941] hover:bg-gray-100 focus:ring-gray-300'
  };
  
  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-sm',
    large: 'px-6 py-4 text-base'
  };
  
  return (
    <button 
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;