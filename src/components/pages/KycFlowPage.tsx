import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { kycService } from '../../services/kyc';

export const KycFlowPage: React.FC = () => {
  const { user, updateKycTier } = useAuth();
  const [bvn, setBvn] = React.useState('');
  const [nin, setNin] = React.useState('');
  const [cac, setCac] = React.useState('');
  const [loading, setLoading] = React.useState<null | 'tier1' | 'tier2' | 'tier3'>(null);
  const [error, setError] = React.useState('');

  if (!user) return null;
  const requiresTier3 = user.role === 'vendor' || user.role === 'group-admin';

  const run = async (tier: 'tier1' | 'tier2' | 'tier3') => {
    try {
      setError(''); setLoading(tier);
      if (tier === 'tier1') await kycService.verifyBVN(bvn);
      if (tier === 'tier2') await kycService.verifyNIN(nin);
      if (tier === 'tier3') await kycService.verifyCAC(cac);
      updateKycTier(tier, 'verified');
    } catch (e: any) {
      setError(e.message || 'Verification failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl border p-6">
        <h1 className="text-2xl font-bold mb-2">Complete Your KYC</h1>
        <p className="text-gray-600 mb-4">Finish required tiers to unlock full access.</p>
        {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Tier 1 (Required)</h3>
            <input className="w-full border rounded-lg px-3 py-2 mb-2" placeholder="BVN" value={bvn} onChange={e=>setBvn(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={()=>run('tier1')} disabled={loading==='tier1'}>{loading==='tier1'?'Verifying...':'Verify Tier 1'}</button>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Tier 2 (Optional)</h3>
            <input className="w-full border rounded-lg px-3 py-2 mb-2" placeholder="NIN" value={nin} onChange={e=>setNin(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={()=>run('tier2')} disabled={loading==='tier2'}>{loading==='tier2'?'Verifying...':'Verify Tier 2'}</button>
          </div>

          {requiresTier3 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Tier 3 (Required)</h3>
              <input className="w-full border rounded-lg px-3 py-2 mb-2" placeholder="CAC Registration Number" value={cac} onChange={e=>setCac(e.target.value)} />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={()=>run('tier3')} disabled={loading==='tier3'}>{loading==='tier3'?'Verifying...':'Verify Tier 3'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycFlowPage;

