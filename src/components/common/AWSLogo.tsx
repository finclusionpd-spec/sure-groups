import React from 'react';

interface AWSLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const AWSLogo: React.FC<AWSLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-20 h-8',
    md: 'w-24 h-10',
    lg: 'w-28 h-12',
    xl: 'w-32 h-14'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* AWS Logo */}
      <div className="flex flex-col items-start">
        <span className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Arial, sans-serif' }}>
          aws
        </span>
        <svg
          width="60"
          height="8"
          viewBox="0 0 60 8"
          className="mt-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 4 Q30 0 60 4"
            stroke="#FF9900"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Separator Line */}
      <div className="w-px h-8 bg-gray-300"></div>

      {/* Security Text */}
      {showText && (
        <div className="flex items-center space-x-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-600"
          >
            <path
              d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"
              fill="currentColor"
            />
            <path
              d="M9 12L11 14L15 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={`text-gray-600 font-medium uppercase tracking-wide ${textSizeClasses[size]}`}>
            DATA SECURITY
          </span>
        </div>
      )}
    </div>
  );
};
