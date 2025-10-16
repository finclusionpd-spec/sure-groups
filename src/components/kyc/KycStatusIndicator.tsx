import React from 'react';
import { CheckCircle, AlertCircle, Clock, Shield, Building, User } from 'lucide-react';
import { UserRole } from '../../types';

interface KycStatusIndicatorProps {
  role: UserRole;
  kycTiers: {
    tier1: 'pending' | 'verified' | 'skipped';
    tier2: 'pending' | 'verified' | 'skipped';
    tier3: 'pending' | 'verified' | 'skipped';
  };
  onVerifyClick?: () => void;
}

export const KycStatusIndicator: React.FC<KycStatusIndicatorProps> = ({
  role,
  kycTiers,
  onVerifyClick
}) => {
  const isBusinessAccount = role === 'vendor' || role === 'group-admin';
  const totalTiers = isBusinessAccount ? 3 : 2;
  
  const getOverallStatus = () => {
    if (kycTiers.tier1 === 'verified' && kycTiers.tier2 === 'verified' && 
        (!isBusinessAccount || kycTiers.tier3 === 'verified')) {
      return 'verified';
    } else if (kycTiers.tier1 === 'verified' || kycTiers.tier2 === 'verified' || kycTiers.tier3 === 'verified') {
      return 'partial';
    } else {
      return 'pending';
    }
  };

  const getStatusIcon = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'verified':
        return 'KYC Verified';
      case 'partial':
        return 'KYC Partially Verified';
      default:
        return 'KYC Pending';
    }
  };

  const getStatusColor = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'verified':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'partial':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  const getCompletedTiers = () => {
    let completed = 0;
    if (kycTiers.tier1 === 'verified') completed++;
    if (kycTiers.tier2 === 'verified') completed++;
    if (isBusinessAccount && kycTiers.tier3 === 'verified') completed++;
    return completed;
  };

  const getTierStatus = (tier: 'tier1' | 'tier2' | 'tier3') => {
    const status = kycTiers[tier];
    switch (status) {
      case 'verified':
        return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: 'Verified', color: 'text-green-600' };
      case 'skipped':
        return { icon: <Clock className="w-4 h-4 text-gray-400" />, text: 'Skipped', color: 'text-gray-500' };
      default:
        return { icon: <AlertCircle className="w-4 h-4 text-red-500" />, text: 'Pending', color: 'text-red-600' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <h3 className="text-lg font-semibold text-gray-900">KYC Status</h3>
        </div>
        {onVerifyClick && getOverallStatus() !== 'verified' && (
          <button
            onClick={onVerifyClick}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Complete Verification
          </button>
        )}
      </div>

      <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{getStatusText()}</span>
          <span className="text-sm">
            {getCompletedTiers()}/{totalTiers} tiers completed
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getCompletedTiers() / totalTiers) * 100}%` }}
          />
        </div>

        <div className="space-y-3">
          {/* Tier 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Identity Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              {getTierStatus('tier1').icon}
              <span className={`text-sm ${getTierStatus('tier1').color}`}>
                {getTierStatus('tier1').text}
              </span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">NIN Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              {getTierStatus('tier2').icon}
              <span className={`text-sm ${getTierStatus('tier2').color}`}>
                {getTierStatus('tier2').text}
              </span>
            </div>
          </div>

          {/* Tier 3 - Only for business accounts */}
          {isBusinessAccount && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Business Verification</span>
              </div>
              <div className="flex items-center space-x-2">
                {getTierStatus('tier3').icon}
                <span className={`text-sm ${getTierStatus('tier3').color}`}>
                  {getTierStatus('tier3').text}
                </span>
              </div>
            </div>
          )}
        </div>

        {getOverallStatus() !== 'verified' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {getOverallStatus() === 'pending' 
                ? 'Complete your KYC verification to unlock full access to all platform features.'
                : 'Complete the remaining verification tiers to unlock full access to all platform features.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

