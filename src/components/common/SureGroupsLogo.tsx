import React from 'react';

interface SureGroupsLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const SureGroupsLogo: React.FC<SureGroupsLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Shield Logo */}
      <div className={`${sizeClasses[size]} relative`}>
        <img
          src="/logo.jpeg"
          alt="Sure Groups Logo"
          className={`${sizeClasses[size]} object-contain`}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-brand-dark ${textSizeClasses[size]}`}>
            Sure Groups
          </span>
        </div>
      )}
    </div>
  );
};
