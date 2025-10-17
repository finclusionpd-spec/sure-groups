import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const KycBanner: React.FC = () => {
  const { user } = useAuth();
  if (!user || user.kycStatus === 'verified') return null;
  return (
    <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-yellow-800 text-sm flex items-center justify-between">
      <div>
        <strong>KYC {user.kycStatus === 'pending' ? 'Pending' : 'Skipped'}:</strong> Your access is limited until KYC is complete.
      </div>
      <a href="/kyc" className="text-yellow-900 underline">Complete KYC</a>
    </div>
  );
};

export default KycBanner;

