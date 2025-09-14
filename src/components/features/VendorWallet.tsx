import React from 'react';
import { WalletManagement } from './WalletManagement';
import { useAuth } from '../../contexts/AuthContext';

export const VendorWallet: React.FC = () => {
  const { user } = useAuth();
  return <WalletManagement actorId={user?.id} allowAllRoles heading="Vendor Wallet" />;
};

