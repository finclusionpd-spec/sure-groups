import React from 'react';
import { UserAvatar } from './UserAvatar';
import { CheckCircle } from 'lucide-react';
import { User } from '../../types';

interface UserInfoProps {
  user: User;
  showVerification?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({ 
  user, 
  showVerification = true, 
  size = 'md',
  className = ''
}) => {
  const isVerified = () => {
    if (!user.kycTiers) return false;
    
    // Check if user has completed all required tiers
    const requiredTiers = user.kycTiers.tier1 === 'verified';
    const optionalTiers = user.kycTiers.tier2 === 'verified';
    
    // For business accounts, also check tier 3
    const isBusinessAccount = user.role === 'vendor' || user.role === 'group-admin';
    const businessTiers = !isBusinessAccount || user.kycTiers.tier3 === 'verified';
    
    return requiredTiers && businessTiers;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  const verified = isVerified();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <UserAvatar 
        user={user} 
        size={size} 
        showVerification={showVerification}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className={`font-semibold text-gray-900 truncate ${getSizeClasses()}`}>
            {user.fullName}
          </h3>
          {showVerification && verified && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {user.email}
        </p>
        {user.role && (
          <p className="text-xs text-gray-400 capitalize">
            {user.role.replace('-', ' ')}
          </p>
        )}
      </div>
    </div>
  );
};

