import React from 'react';
import { CheckCircle, User } from 'lucide-react';
import { User as UserType } from '../../types';

interface UserAvatarProps {
  user: UserType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showVerification?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  showVerification = true,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'md':
        return 'w-12 h-12';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-24 h-24';
      default:
        return 'w-12 h-12';
    }
  };

  const getVerificationBadgeSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'md':
        return 'w-4 h-4';
      case 'lg':
        return 'w-5 h-5';
      case 'xl':
        return 'w-6 h-6';
      default:
        return 'w-4 h-4';
    }
  };

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

  const getProfileImage = () => {
    // Use liveness check photo from KYC data if available (primary source)
    if (user.kycData?.livenessPhoto) {
      return user.kycData.livenessPhoto;
    }
    
    // Fallback to profile image only if no liveness photo exists
    if (user.profileImage && !user.kycData?.livenessPhoto) {
      return user.profileImage;
    }
    
    return null;
  };

  const profileImage = getProfileImage();
  const verified = isVerified();

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${getSizeClasses()} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}>
        {profileImage ? (
          <img
            src={profileImage}
            alt={`${user.fullName}'s profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : 'w-12 h-12'} text-gray-400`} />
        )}
      </div>
      
      {showVerification && verified && (
        <div className={`absolute -bottom-1 -right-1 ${getVerificationBadgeSize()} bg-green-500 rounded-full flex items-center justify-center border-2 border-white`}>
          <CheckCircle className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
        </div>
      )}
    </div>
  );
};
