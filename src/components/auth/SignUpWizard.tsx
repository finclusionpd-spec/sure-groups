import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { kycService } from '../../services/kyc';
import { UserRole } from '../../types';

type StepKey = 'role' | 'basic' | 'password' | 'otp' | 'kyc';

const passwordIsStrong = (value: string): boolean => {
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  return value.length >= 8 && hasLetter && hasNumber && hasSymbol;
};

export const SignUpWizard: React.FC = () => {
  const navigate = useNavigate();
  const { completeSignup } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'member';
  const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';

  const [current, setCurrent] = useState<StepKey>('role');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [basic, setBasic] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [password, setPassword] = useState({ password: '', confirm: '', agreed: false });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Clear any stale local auth when entering signup in demo, to avoid locked state
  React.useEffect(()=>{
    if (isDemo) {
      try {
        localStorage.removeItem('sure-groups-user');
        localStorage.removeItem('sure-groups-demo');
      } catch {}
    }
  }, [isDemo]);

  const canContinuePassword = useMemo(() => {
    return password.password.length > 0 && password.password === password.confirm && password.agreed && passwordIsStrong(password.password);
  }, [password]);

  const generateStrongPassword = (): string => {
    // 12+ chars including letters, numbers, and symbols
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}<>?';
    let out = '';
    for (let i = 0; i < 14; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  };

  const go = (next: StepKey) => setCurrent(next);

  const handleRoleSelect = (selected: UserRole) => {
    setRole(selected);
    setSearchParams({ role: selected });
    go('basic');
  };

  const handleSubmitOtp = async () => {
    setError('');
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      if (otp.trim().length < 4) {
        setError('Invalid OTP code.');
        return;
      }
      go('kyc');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteKyc = async (skip: boolean) => {
    setError('');
    setIsLoading(true);
    try {
      const ok = await completeSignup({
        role,
        firstName: basic.firstName,
        middleName: basic.middleName || undefined,
        lastName: basic.lastName,
        email: basic.email,
        phone: basic.phone,
        password: password.password,
      });
      if (!ok) {
        setError('Could not complete signup.');
        return;
      }
      navigate(`/dashboard?role=${encodeURIComponent(role)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 md:p-8">
        {current === 'role' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select your role</h2>
            <p className="text-gray-600 mb-6">Choose a user type to continue.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['member','vendor','developer','product-admin','group-admin','super-admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                  className={`border rounded-lg p-4 text-sm hover:border-blue-500 ${role===r?'border-blue-600 ring-1 ring-blue-200':''}`}
                >
                  {r.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        )}

        {current === 'basic' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">First Name</label>
                <input className="w-full border rounded-lg px-3 py-2" value={basic.firstName} onChange={e=>setBasic({...basic, firstName:e.target.value})} required />
              </div>
              <div>
                <label className="text-sm text-gray-700">Middle Name (optional)</label>
                <input className="w-full border rounded-lg px-3 py-2" value={basic.middleName} onChange={e=>setBasic({...basic, middleName:e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-gray-700">Last Name</label>
                <input className="w-full border rounded-lg px-3 py-2" value={basic.lastName} onChange={e=>setBasic({...basic, lastName:e.target.value})} required />
              </div>
              <div>
                <label className="text-sm text-gray-700">Email Address</label>
                <input type="email" className="w-full border rounded-lg px-3 py-2" value={basic.email} onChange={e=>setBasic({...basic, email:e.target.value})} required />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-700">Phone Number</label>
                <input className="w-full border rounded-lg px-3 py-2" value={basic.phone} onChange={e=>setBasic({...basic, phone:e.target.value})} required />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  const gen = generateStrongPassword();
                  setPassword({ password: gen, confirm: gen, agreed: true });
                  go('kyc');
                }}
                disabled={!basic.firstName || !basic.lastName || !basic.email || !basic.phone}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {current === 'password' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Create Password</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Password</label>
                <input type="password" className="w-full border rounded-lg px-3 py-2" value={password.password} onChange={e=>setPassword({...password, password:e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-gray-700">Confirm Password</label>
                <input type="password" className="w-full border rounded-lg px-3 py-2" value={password.confirm} onChange={e=>setPassword({...password, confirm:e.target.value})} />
              </div>
              <div className="flex items-center space-x-2">
                <input id="agree" type="checkbox" checked={password.agreed} onChange={e=>setPassword({...password, agreed:e.target.checked})} />
                <label htmlFor="agree" className="text-sm text-gray-700">Agree to Terms & Conditions</label>
              </div>
              <p className={`text-sm ${password.password && !passwordIsStrong(password.password)?'text-red-600':'text-gray-600'}`}>Password must be 8+ chars and include letters, numbers, and symbols.</p>
            </div>
            <div className="flex justify-between mt-6">
              <button className="px-4 py-2 rounded-lg border" onClick={()=>go('basic')}>← Back</button>
              <div className="flex gap-2">
                {isDemo && (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border"
                    onClick={() => {
                      const gen = generateStrongPassword();
                      setPassword({ password: gen, confirm: gen, agreed: true });
                      go('otp');
                    }}
                  >
                    Skip (Demo)
                  </button>
                )}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50" onClick={()=>go('otp')} disabled={!canContinuePassword}>Continue →</button>
              </div>
            </div>
          </div>
        )}

        {current === 'otp' && (
          <div>
            <h2 className="text-2xl font-bold mb-2">OTP Verification</h2>
            <p className="text-gray-600 mb-4">Enter the OTP sent to your email/phone.</p>
            {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
            <input className="w-full border rounded-lg px-3 py-2" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter code" />
            <div className="flex justify-between mt-6">
              <button className="px-4 py-2 rounded-lg border" onClick={()=>go('password')}>← Back</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={handleSubmitOtp} disabled={isLoading}>{isLoading? 'Verifying...' : 'Verify & Continue'}</button>
            </div>
          </div>
        )}

        {current === 'kyc' && (
          <KycTiered role={role} onDone={(skip)=>handleCompleteKyc(skip)} />
        )}
      </div>
    </div>
  );
};

export default SignUpWizard;

const KycTiered: React.FC<{ role: UserRole; onDone: (skip: boolean)=>void }>=({ role, onDone })=>{
  const [bvn, setBvn] = useState('');
  const [nin, setNin] = useState('');
  const [cac, setCac] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<null | 'tier1' | 'tier2' | 'tier3'>(null);
  const showTier3 = role === 'vendor' || role === 'group-admin';

  const [tier1Verified, setTier1Verified] = useState(false);
  const [tier2Verified, setTier2Verified] = useState(false);
  const [tier3Verified, setTier3Verified] = useState(false);

  const verifyTier1 = async ()=>{
    try{
      setError(''); setLoading('tier1');
      await kycService.verifyBVN(bvn);
      // Simulate liveness/selfie prompt success
      await new Promise(r=>setTimeout(r,500));
      setTier1Verified(true);
    }catch(e:any){ setError(e.message || 'Tier 1 verification failed'); }
    finally{ setLoading(null); }
  };
  const verifyTier2 = async ()=>{
    try{
      setError(''); setLoading('tier2');
      await kycService.verifyNIN(nin);
      setTier2Verified(true);
    }catch(e:any){ setError(e.message || 'Tier 2 verification failed'); }
    finally{ setLoading(null); }
  };
  const verifyTier3 = async ()=>{
    try{
      setError(''); setLoading('tier3');
      await kycService.verifyCAC(cac);
      setTier3Verified(true);
    }catch(e:any){ setError(e.message || 'Tier 3 verification failed'); }
    finally{ setLoading(null); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">KYC Verification</h2>
      <p className="text-gray-600 mb-4">Complete the required tiers to unlock full access.</p>
      {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Tier 1 (Required)</h3>
          <label className="text-sm text-gray-700">BVN</label>
          <input className="w-full border rounded-lg px-3 py-2 mb-2" placeholder="Enter 11-digit BVN" value={bvn} onChange={e=>setBvn(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={verifyTier1} disabled={loading==='tier1' || tier1Verified}>{loading==='tier1'?'Verifying...': tier1Verified?'Verified ✓':'Verify BVN + Liveness'}</button>
        </div>

        <div className="border rounded-lg p-4 opacity-100">
          <h3 className="font-semibold mb-2">Tier 2 (Optional)</h3>
          <label className="text-sm text-gray-700">NIN</label>
          <input className="w-full border rounded-lg px-3 py-2 mb-2" placeholder="Enter 11-digit NIN" value={nin} onChange={e=>setNin(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={verifyTier2} disabled={loading==='tier2' || tier2Verified}>{loading==='tier2'?'Verifying...': tier2Verified?'Verified ✓':'Verify NIN'}</button>
        </div>

        {showTier3 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Tier 3 (Required for Vendors & Group Admins)</h3>
            <label className="text-sm text-gray-700">CAC Registration Number</label>
            <input className="w-full border rounded-lg px-3 py-2 mb-2" placeholder="Enter CAC number" value={cac} onChange={e=>setCac(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={verifyTier3} disabled={loading==='tier3' || tier3Verified}>{loading==='tier3'?'Verifying...': tier3Verified?'Verified ✓':'Verify CAC'}</button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
        <button className="px-4 py-2 rounded-lg border" onClick={()=>onDone(true)}>Skip for Later</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={()=>onDone(false)} disabled={!tier1Verified || (showTier3 && !tier3Verified)}>Finish →</button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Your access will be limited until all required tiers are complete.</p>
    </div>
  );
};

