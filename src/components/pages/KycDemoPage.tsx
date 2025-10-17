import React, { useState } from 'react';
import { KycStatusIndicator } from '../kyc/KycStatusIndicator';
import { EnhancedKycVerification } from '../kyc/EnhancedKycVerification';
import { UserRole } from '../../types';

export const KycDemoPage: React.FC = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('member');
  const [kycTiers, setKycTiers] = useState({
    tier1: 'pending' as 'pending' | 'verified' | 'skipped',
    tier2: 'pending' as 'pending' | 'verified' | 'skipped',
    tier3: 'pending' as 'pending' | 'verified' | 'skipped'
  });

  const handleKycComplete = (tier: 'tier1' | 'tier2' | 'tier3', status: 'verified' | 'pending') => {
    setKycTiers(prev => ({
      ...prev,
      [tier]: status
    }));
    setShowVerification(false);
  };

  const handleKycSkip = () => {
    setShowVerification(false);
  };

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'member', label: 'Member', description: 'Individual user - requires Tier 1 & 2' },
    { value: 'vendor', label: 'Vendor', description: 'Business user - requires all 3 tiers' },
    { value: 'group-admin', label: 'Group Admin', description: 'Business user - requires all 3 tiers' },
    { value: 'developer', label: 'Developer', description: 'Individual user - requires Tier 1 & 2' }
  ];

  if (showVerification) {
    return (
      <EnhancedKycVerification
        role={selectedRole}
        onComplete={handleKycComplete}
        onSkip={handleKycSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC/KYB Verification Demo</h1>
          <p className="text-gray-600 text-lg">Test the enhanced KYC verification flow for different user types</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Role Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select User Role</h2>
            <div className="space-y-3">
              {roles.map(role => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedRole === role.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{role.label}</div>
                  <div className="text-sm text-gray-600">{role.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* KYC Status */}
          <div>
            <KycStatusIndicator
              role={selectedRole}
              kycTiers={kycTiers}
              onVerifyClick={() => setShowVerification(true)}
            />
          </div>
        </div>

        {/* Demo Controls */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Demo Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setKycTiers({ tier1: 'pending', tier2: 'pending', tier3: 'pending' })}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={() => setKycTiers({ tier1: 'verified', tier2: 'verified', tier3: 'pending' })}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Partial Verification
            </button>
            <button
              onClick={() => setKycTiers({ tier1: 'verified', tier2: 'verified', tier3: 'verified' })}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Full Verification
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Demo Instructions</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Select different user roles to see how KYC requirements change</li>
            <li>• Click "Complete Verification" to test the full KYC flow</li>
            <li>• Use demo controls to simulate different verification states</li>
            <li>• Business accounts (Vendor, Group Admin) require all 3 tiers</li>
            <li>• Individual accounts (Member, Developer) only require Tier 1 & 2</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

