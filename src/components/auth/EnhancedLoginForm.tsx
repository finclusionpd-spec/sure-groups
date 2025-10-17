import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail, Phone, AlertCircle, Users, Building, Code, Settings, Shield, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SureGroupsLogo } from '../common/SureGroupsLogo';
import { UserRole } from '../../types';

const roleIcons = {
  'member': Users,
  'vendor': ShoppingCart,
  'developer': Code,
  'product-admin': Settings,
  'group-admin': Building,
  'super-admin': Shield
};

export const EnhancedLoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') as UserRole || '';
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(roleParam || null);
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

      if (!selectedRole) {
        setError('Please select your role.');
        setIsLoading(false);
        return;
      }

      console.log('Attempting login with:', { identifier, loginMethod, role: selectedRole });
      
      const success = await login(identifier, formData.password);
      console.log('Login result:', success);
      
      if (success) {
        // Navigate to appropriate dashboard based on role
        const dashboardRoutes = {
          'member': '/dashboard',
          'vendor': '/dashboard',
          'group-admin': '/dashboard',
          'product-admin': '/dashboard',
          'super-admin': '/superadmin/dashboard',
          'developer': '/dashboard'
        };
        
        const route = dashboardRoutes[selectedRole] || '/dashboard';
        navigate(route);
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

  const allRoles: UserRole[] = ['member', 'vendor', 'group-admin', 'product-admin', 'super-admin', 'developer'];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <SureGroupsLogo size="xl" showText={true} />
          </div>
          <h1 className="text-3xl font-brand-bold text-brand-dark mb-2">Welcome Back</h1>
          <p className="text-brand-body text-lg">Sign in to your SureGroups account</p>
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
            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Your Role</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allRoles.map(role => {
                  const Icon = roleIcons[role];
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`
                        group relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${isSelected 
                          ? 'border-brand-light bg-gradient-to-br from-blue-50 to-indigo-50 ring-4 ring-blue-100 shadow-lg' 
                          : 'border-gray-200 bg-white hover:border-brand-light hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                          ${isSelected 
                            ? 'bg-brand-light text-white' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-brand-light group-hover:text-white'
                          }
                        `}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {role === 'member' && 'Join groups and participate in community activities'}
                        {role === 'vendor' && 'Sell products and services to community members'}
                        {role === 'group-admin' && 'Create and manage community groups'}
                        {role === 'product-admin' && 'Manage product catalogs and vendor relationships'}
                        {role === 'super-admin' && 'Full platform administration and management'}
                        {role === 'developer' && 'Build integrations and custom solutions'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

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
              disabled={isLoading || !selectedRole}
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
                to="/signup"
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
