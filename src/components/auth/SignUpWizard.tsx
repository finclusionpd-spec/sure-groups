import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { kycService } from '../../services/kyc';
import { UserRole } from '../../types';
import { 
  CheckCircle, 
  ArrowLeft, 
  Users, 
  Building, 
  Code, 
  Settings, 
  Shield, 
  ShoppingCart,
  Eye,
  EyeOff,
  AlertCircle,
  Check
} from 'lucide-react';
import { SureGroupsLogo } from '../common/SureGroupsLogo';

type StepKey = 'role' | 'basic' | 'password' | 'otp' | 'kyc';

const passwordIsStrong = (value: string): boolean => {
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  return value.length >= 8 && hasLetter && hasNumber && hasSymbol;
};

const steps = [
  { key: 'role', label: 'Select Role', icon: Users },
  { key: 'basic', label: 'Basic Info', icon: Users },
  { key: 'password', label: 'Create Password', icon: Shield },
  { key: 'otp', label: 'Verify OTP', icon: CheckCircle },
  { key: 'kyc', label: 'KYC Verification', icon: Building }
];

const roleIcons = {
  'member': Users,
  'vendor': ShoppingCart,
  'developer': Code,
  'product-admin': Settings,
  'group-admin': Building,
  'super-admin': Shield
};

const ProgressIndicator: React.FC<{ currentStep: StepKey }> = ({ currentStep }) => {
  const currentIndex = steps.findIndex(step => step.key === currentStep);
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                ${isCompleted 
                  ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' 
                  : isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white ring-4 ring-blue-100' 
                    : 'bg-gray-200 text-gray-400'
                }
              `}>
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${isActive ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-gradient-to-r from-blue-500 to-teal-500' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
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
  const [showPassword, setShowPassword] = useState(false);
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

  const handleCompleteKyc = async (_skip: boolean) => {
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <SureGroupsLogo size="xl" showText={true} />
          </div>
          <h1 className="text-4xl font-brand-bold text-brand-dark mb-2">Join SureGroups</h1>
          <p className="text-brand-body text-lg">Create your account and start building amazing communities</p>
        </div>

        {/* Main Form Container */}
        <div className="card-brand shadow-xl p-8 md:p-10">
          <ProgressIndicator currentStep={current} />
        {current === 'role' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-brand-bold text-brand-dark mb-3">Choose Your Role</h2>
              <p className="text-brand-body text-lg">Select the role that best describes your position in the community</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(['member','vendor','developer','product-admin','group-admin','super-admin'] as UserRole[]).map(r => {
                const Icon = roleIcons[r];
                const isSelected = role === r;
                return (
                <button
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                            className={`
                              group relative p-6 rounded-xl border-2 transition-all duration-200 text-left
                              ${isSelected 
                                ? 'border-brand-light bg-gradient-to-br from-blue-50 to-indigo-50 ring-4 ring-blue-100 shadow-lg' 
                                : 'border-gray-200 bg-white hover:border-brand-light hover:shadow-md'
                              }
                            `}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
                        ${isSelected 
                          ? 'bg-brand-light text-white' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-brand-light group-hover:text-white'
                        }
                      `}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {isSelected && (
                        <div className="ml-auto">
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                            <h3 className="text-lg font-brand-bold text-brand-dark mb-2">
                              {r.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h3>
                            <p className="text-sm text-brand-body">
                      {r === 'member' && 'Join groups and participate in community activities'}
                      {r === 'vendor' && 'Sell products and services to community members'}
                      {r === 'developer' && 'Build integrations and custom solutions'}
                      {r === 'product-admin' && 'Manage product catalogs and vendor relationships'}
                      {r === 'group-admin' && 'Create and manage community groups'}
                      {r === 'super-admin' && 'Full platform administration and management'}
                    </p>
                </button>
                );
              })}
            </div>
          </div>
        )}

        {current === 'basic' && (
                  <div>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-brand-bold text-brand-dark mb-3">Basic Information</h2>
                      <p className="text-brand-body text-lg">Tell us a bit about yourself to get started</p>
                    </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="label-brand">First Name *</label>
                        <input 
                          className="input-brand" 
                          placeholder="Enter your first name"
                          value={basic.firstName} 
                          onChange={e=>setBasic({...basic, firstName:e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="label-brand">Middle Name</label>
                        <input 
                          className="input-brand" 
                          placeholder="Enter your middle name (optional)"
                          value={basic.middleName} 
                          onChange={e=>setBasic({...basic, middleName:e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="label-brand">Last Name *</label>
                        <input 
                          className="input-brand" 
                          placeholder="Enter your last name"
                          value={basic.lastName} 
                          onChange={e=>setBasic({...basic, lastName:e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="label-brand">Email Address *</label>
                        <input 
                          type="email" 
                          className="input-brand" 
                          placeholder="Enter your email address"
                          value={basic.email} 
                          onChange={e=>setBasic({...basic, email:e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="label-brand">Phone Number *</label>
                        <input 
                          className="input-brand" 
                          placeholder="Enter your phone number"
                          value={basic.phone} 
                          onChange={e=>setBasic({...basic, phone:e.target.value})} 
                          required 
                        />
                      </div>
                    </div>
            
            <div className="flex justify-between items-center mt-8">
              <button 
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={() => go('role')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
                      <button
                        className="btn-primary px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        onClick={() => {
                          const gen = generateStrongPassword();
                          setPassword({ password: gen, confirm: gen, agreed: true });
                          go('kyc');
                        }}
                        disabled={!basic.firstName || !basic.lastName || !basic.email || !basic.phone}
                      >
                        Continue
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </button>
            </div>
          </div>
        )}

        {current === 'password' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Create Password</h2>
              <p className="text-gray-600 text-lg">Set up a secure password for your account</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Password *</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400" 
                    placeholder="Enter your password"
                    value={password.password} 
                    onChange={e=>setPassword({...password, password:e.target.value})} 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Confirm Password *</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400" 
                    placeholder="Confirm your password"
                    value={password.confirm} 
                    onChange={e=>setPassword({...password, confirm:e.target.value})} 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              <div className="space-y-3">
              <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${
                      password.password.length === 0 ? 'w-0' :
                      password.password.length < 4 ? 'w-1/4 bg-red-500' :
                      password.password.length < 8 ? 'w-1/2 bg-yellow-500' :
                      passwordIsStrong(password.password) ? 'w-full bg-green-500' : 'w-3/4 bg-yellow-500'
                    }`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    password.password.length === 0 ? 'text-gray-400' :
                    password.password.length < 4 ? 'text-red-500' :
                    password.password.length < 8 ? 'text-yellow-500' :
                    passwordIsStrong(password.password) ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {password.password.length === 0 ? 'Enter password' :
                     password.password.length < 4 ? 'Weak' :
                     password.password.length < 8 ? 'Fair' :
                     passwordIsStrong(password.password) ? 'Strong' : 'Good'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className={`flex items-center space-x-2 ${password.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                    <Check className="w-4 h-4" />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${/[A-Za-z]/.test(password.password) ? 'text-green-600' : 'text-gray-400'}`}>
                    <Check className="w-4 h-4" />
                    <span>Letters</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${/[0-9]/.test(password.password) ? 'text-green-600' : 'text-gray-400'}`}>
                    <Check className="w-4 h-4" />
                    <span>Numbers</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <input 
                  id="agree" 
                  type="checkbox" 
                  checked={password.agreed} 
                  onChange={e=>setPassword({...password, agreed:e.target.checked})}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="agree" className="text-sm text-gray-700">
                  I agree to the <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Terms & Conditions</a> and <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Privacy Policy</a>
                </label>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <button 
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={()=>go('basic')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <div className="flex gap-3">
                {isDemo && (
                  <button
                    type="button"
                    className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors duration-200"
                    onClick={() => {
                      const gen = generateStrongPassword();
                      setPassword({ password: gen, confirm: gen, agreed: true });
                      go('otp');
                    }}
                  >
                    Skip (Demo)
                  </button>
                )}
                <button 
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center" 
                  onClick={()=>go('otp')} 
                  disabled={!canContinuePassword}
                >
                  Continue
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {current === 'otp' && (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Verify Your Email</h2>
              <p className="text-gray-600 text-lg">We've sent a verification code to <span className="font-semibold text-gray-900">{basic.email}</span></p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}

            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700">Verification Code</label>
                <input 
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-widest focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400" 
                  value={otp} 
                  onChange={e=>setOtp(e.target.value)} 
                  placeholder="000000"
                  maxLength={6}
                />
                <p className="text-sm text-gray-500 text-center">
                  Didn't receive the code? <button className="text-blue-600 hover:text-blue-800 font-medium">Resend</button>
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <button 
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={()=>go('password')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button 
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center" 
                onClick={handleSubmitOtp} 
                disabled={isLoading || otp.length < 4}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {current === 'kyc' && (
          <KycTiered role={role} onDone={(skip)=>handleCompleteKyc(skip)} />
        )}
        </div>
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
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Identity Verification</h2>
        <p className="text-gray-600 text-lg">Complete the required verification tiers to unlock full access</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Tier 1 */}
        <div className={`border-2 rounded-xl p-6 transition-all duration-200 ${tier1Verified ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tier1Verified ? 'bg-green-500' : 'bg-gray-200'}`}>
                {tier1Verified ? <Check className="w-5 h-5 text-white" /> : <span className="text-sm font-bold text-gray-600">1</span>}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Tier 1 (Required)</h3>
            </div>
            {tier1Verified && <CheckCircle className="w-6 h-6 text-green-500" />}
          </div>
          <p className="text-sm text-gray-600 mb-4">Verify your identity with BVN and complete liveness check</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Bank Verification Number (BVN)</label>
              <input 
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400" 
                placeholder="Enter 11-digit BVN" 
                value={bvn} 
                onChange={e=>setBvn(e.target.value)} 
                disabled={tier1Verified}
              />
            </div>
            <button 
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" 
              onClick={verifyTier1} 
              disabled={loading==='tier1' || tier1Verified || bvn.length !== 11}
            >
              {loading==='tier1' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : tier1Verified ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Verified
                </>
              ) : (
                'Verify BVN + Liveness Check'
              )}
            </button>
          </div>
        </div>

        {/* Tier 2 */}
        <div className={`border-2 rounded-xl p-6 transition-all duration-200 ${tier2Verified ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tier2Verified ? 'bg-green-500' : 'bg-gray-200'}`}>
                {tier2Verified ? <Check className="w-5 h-5 text-white" /> : <span className="text-sm font-bold text-gray-600">2</span>}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Tier 2 (Optional)</h3>
            </div>
            {tier2Verified && <CheckCircle className="w-6 h-6 text-green-500" />}
          </div>
          <p className="text-sm text-gray-600 mb-4">Additional verification with National Identification Number</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">National Identification Number (NIN)</label>
              <input 
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400" 
                placeholder="Enter 11-digit NIN" 
                value={nin} 
                onChange={e=>setNin(e.target.value)} 
                disabled={tier2Verified}
              />
            </div>
            <button 
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" 
              onClick={verifyTier2} 
              disabled={loading==='tier2' || tier2Verified || nin.length !== 11}
            >
              {loading==='tier2' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : tier2Verified ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Verified
                </>
              ) : (
                'Verify NIN'
              )}
            </button>
          </div>
        </div>

        {/* Tier 3 */}
        {showTier3 && (
          <div className={`border-2 rounded-xl p-6 transition-all duration-200 ${tier3Verified ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tier3Verified ? 'bg-green-500' : 'bg-gray-200'}`}>
                  {tier3Verified ? <Check className="w-5 h-5 text-white" /> : <span className="text-sm font-bold text-gray-600">3</span>}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tier 3 (Required for {role === 'vendor' ? 'Vendors' : 'Group Admins'})</h3>
              </div>
              {tier3Verified && <CheckCircle className="w-6 h-6 text-green-500" />}
            </div>
            <p className="text-sm text-gray-600 mb-4">Business verification with Corporate Affairs Commission registration</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">CAC Registration Number</label>
                <input 
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400" 
                  placeholder="Enter CAC number" 
                  value={cac} 
                  onChange={e=>setCac(e.target.value)} 
                  disabled={tier3Verified}
                />
              </div>
              <button 
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" 
                onClick={verifyTier3} 
                disabled={loading==='tier3' || tier3Verified || !cac.trim()}
              >
                {loading==='tier3' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : tier3Verified ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Verified
                  </>
                ) : (
                  'Verify CAC Registration'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
        <button 
          className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors duration-200" 
          onClick={()=>onDone(true)}
        >
          Skip for Later
        </button>
        <button 
          className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center" 
          onClick={()=>onDone(false)} 
          disabled={!tier1Verified || (showTier3 && !tier3Verified)}
        >
          Complete Registration
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
        </button>
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        Your access will be limited until all required tiers are complete.
      </p>
    </div>
  );
};

