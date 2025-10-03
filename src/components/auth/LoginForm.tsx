import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Users, Mail, Phone, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SureGroupsLogo } from '../common/SureGroupsLogo';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || '';
  const typeParam = searchParams.get('type') || '';
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const identifier = loginMethod === 'email' ? formData.email : formData.phone;
      
      // Basic validation
      if (!identifier.trim()) {
        setError(`Please enter your ${loginMethod}.`);
        setIsLoading(false);
        return;
      }
      
      if (!formData.password.trim()) {
        setError('Please enter your password.');
        setIsLoading(false);
        return;
      }

      console.log('Attempting login with:', { identifier, loginMethod });
      
      const success = await login(identifier, formData.password);
      console.log('Login result:', success);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError(`Invalid ${loginMethod} or password.`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <SureGroupsLogo size="xl" showText={true} />
          </div>
          <h1 className="text-3xl font-brand-bold text-brand-dark mb-2">Welcome Back</h1>
          <p className="text-brand-body">
            Sign in to your SureGroups account
            {roleParam && ` as ${roleParam.replace('-', ' ')}`}
            {typeParam && ` - ${typeParam.replace('-', ' ')}`}
          </p>
        </div>

        {/* Main Form Container */}
        <div className="card-brand shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  loginMethod === 'email'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  loginMethod === 'phone'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </button>
            </div>

            {/* Email/Phone Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {loginMethod === 'email' ? 'Email Address' : 'Phone Number'} *
              </label>
              <input
                type={loginMethod === 'email' ? 'email' : 'tel'}
                name={loginMethod}
                required
                value={loginMethod === 'email' ? formData.email : formData.phone}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder={loginMethod === 'email' ? 'Enter your email address' : 'Enter your phone number'}
                autoComplete={loginMethod === 'email' ? 'email' : 'tel'}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Test Login Button - Remove this in production */}
            <button
              type="button"
              onClick={async () => {
                console.log('Test login clicked');
                setError('');
                setIsLoading(true);
                try {
                  const success = await login('test@example.com', 'password123');
                  console.log('Test login result:', success);
                  if (success) {
                    navigate('/dashboard');
                  } else {
                    setError('Test login failed');
                  }
                } catch (err) {
                  console.error('Test login error:', err);
                  setError('Test login error');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl mt-2"
            >
              Test Login (Remove in Production)
            </button>
          </form>

          {/* Demo User Option */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <Link
              to="/demo"
              className="mt-4 w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-center block font-medium"
            >
              Continue as Demo User
            </Link>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to={`/signup${roleParam ? `?role=${roleParam}&type=${typeParam}` : ''}`} 
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Back to Home Link */}
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};