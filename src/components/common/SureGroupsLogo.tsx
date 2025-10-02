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
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Shield Logo */}
      <div className={`${sizeClasses[size]} relative`}>
      <img
                src="/logo.jpeg"
                alt="Vibrant community gathering of women in traditional African attire, representing the diverse and engaged community that SureGroups serves"
                className="w-[50px] aspect-square h-10 "
                
              />
      </div>

      {/* Text */}
      
    </div>
  );
};
