import React from 'react';
import { UserAvatar } from './UserAvatar';
import { Shield, AlertCircle } from 'lucide-react';
import { User } from '../../types';

interface ProfilePictureDisplayProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showInfo?: boolean;
  className?: string;
}

export const ProfilePictureDisplay: React.FC<ProfilePictureDisplayProps> = ({ 
  user, 
  size = 'xl',
  showInfo = true,
  className = ''
}) => {
  const isVerified = () => {
    if (!user.kycTiers) return false;
    
    const requiredTiers = user.kycTiers.tier1 === 'verified';
    const isBusinessAccount = user.role === 'vendor' || user.role === 'group-admin';
    const businessTiers = !isBusinessAccount || user.kycTiers.tier3 === 'verified';
    
    return requiredTiers && businessTiers;
  };

  const hasLivenessPhoto = () => {
    return user.kycData?.livenessPhoto || user.profileImage;
  };

  const verified = isVerified();
  const hasPhoto = hasLivenessPhoto();

  return (
    <div className={`text-center ${className}`}>
      <div className="relative inline-block">
        <UserAvatar 
          user={user} 
          size={size} 
          showVerification={true}
        />
      </div>
      
      {showInfo && (
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {user.fullName}
          </h3>
          
          {verified ? (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Verified Identity</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Identity Pending</span>
            </div>
          )}
          
          {hasPhoto ? (
            <p className="text-xs text-gray-500">
              Profile photo from identity verification
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Complete identity verification to set your profile photo
            </p>
          )}
        </div>
      )}
    </div>
  );
};

