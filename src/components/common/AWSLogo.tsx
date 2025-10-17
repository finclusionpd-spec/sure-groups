import React from 'react';
import { Lock } from 'lucide-react';

interface AWSLogoProps {
  showSecurityText?: boolean;
  className?: string;
}

export const AWSLogo: React.FC<AWSLogoProps> = ({ 
  showSecurityText = true,
  className = ''
}) => {
  return (
    <div className={`flex items-center bg-white px-3 py-1.5 rounded-md ${className}`}>
      {/* AWS Logo Section */}
      <div className="flex items-center">
        {/* AWS Text */}
        <span className="text-gray-800 font-normal text-sm">
          aws
        </span>
        
        {/* Amazon Smile */}
        <svg
          className="ml-0.5"
          width="18"
          height="8"
          viewBox="0 0 18 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 5C5 1 13 1 16 5"
            stroke="#FF9900"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {showSecurityText && (
        <>
          {/* Vertical Separator */}
          <div className="h-5 w-px bg-gray-300 mx-2"></div>

          {/* Data Security Section */}
          <div className="flex items-center space-x-1.5">
            <Lock className="h-4 w-4 text-gray-700" />
            <span className="text-gray-800 font-semibold uppercase text-sm tracking-normal">
              DATA SECURITY
            </span>
          </div>
        </>
      )}
    </div>
  );
};