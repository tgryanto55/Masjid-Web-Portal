import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = "rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    secondary: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500"
  };

  return (
    <button className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`} {...props} />
  );
};