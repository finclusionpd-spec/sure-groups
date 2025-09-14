import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Bell, Globe, Eye, EyeOff, Smartphone, Key, CreditCard, Banknote, Trash2, Download, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  pinLoginEnabled: boolean;
  biometricEnabled: boolean;
  loginNotifications: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'members' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  allowDirectMessages: boolean;
}

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const storageKey = (k: string) => `settings:${user?.id || 'anon'}:${k}`;
  const read = <T,>(k: string, fb: T): T => {
    try { const raw = localStorage.getItem(storageKey(k)); return raw ? (JSON.parse(raw) as T) : fb; } catch { return fb; }
  };
  const write = (k: string, v: any) => { try { localStorage.setItem(storageKey(k), JSON.stringify(v)); } catch {} };

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy' | 'notifications' | 'language' | 'payments' | 'wallet-settings' | 'data'>('profile');
  
  const [profile, setProfile] = useState<ProfileData>(read('profile', {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: 'Lagos, Nigeria',
    bio: 'Active community member passionate about youth ministry and community service.',
    avatar: 'JD'
  }));

  const [security, setSecurity] = useState<SecuritySettings>(read('security', {
    twoFactorEnabled: true,
    pinLoginEnabled: false,
    biometricEnabled: true,
    loginNotifications: true
  }));

  const [privacy, setPrivacy] = useState<PrivacySettings>(read('privacy', {
    profileVisibility: 'members',
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true
  }));

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const [language, setLanguage] = useState(read('language', 'english'));
  const [timezone, setTimezone] = useState(read('timezone', 'America/New_York'));
  const [currency, setCurrency] = useState(read('currency', 'NGN'));

  const [paymentMethods, setPaymentMethods] = useState<{ id: string; type: 'card' | 'bank'; label: string; last4?: string }[]>(read('payments', []));
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '' });
  const [newBank, setNewBank] = useState({ bank: '', account: '' });

  useEffect(() => { write('profile', profile); }, [profile]);
  useEffect(() => { write('security', security); }, [security]);
  useEffect(() => { write('privacy', privacy); }, [privacy]);
  useEffect(() => { write('language', language); }, [language]);
  useEffect(() => { write('timezone', timezone); }, [timezone]);
  useEffect(() => { write('currency', currency); }, [currency]);
  useEffect(() => { write('payments', paymentMethods); }, [paymentMethods]);

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'spanish', name: 'Español' },
    { code: 'french', name: 'Français' },
    { code: 'portuguese', name: 'Português' }
  ];

  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const currencies = ['NGN', 'USD', 'EUR', 'GBP', 'CAD'];

  const handleProfileUpdate = () => {
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSecurityToggle = (setting: keyof SecuritySettings) => {
    setSecurity(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handlePrivacyToggle = (setting: keyof PrivacySettings, value?: any) => {
    setPrivacy(prev => ({ ...prev, [setting]: value !== undefined ? value : !prev[setting] }));
  };

  const handleEnable2FA = () => {
    alert('2FA setup initiated. Check your email for verification code.');
  };

  const handleSetupPIN = () => {
    const pin = prompt('Enter a 4-digit PIN:');
    if (pin && pin.length === 4 && /^\d+$/.test(pin)) {
      setSecurity(prev => ({ ...prev, pinLoginEnabled: true }));
      alert('PIN login enabled successfully!');
    } else {
      alert('Please enter a valid 4-digit PIN');
    }
  };

  const handleBiometricSetup = () => {
    if ('navigator' in window && 'credentials' in navigator) {
      alert('Biometric authentication setup initiated.');
    } else {
      alert('Biometric authentication not supported on this device.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'privacy'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveTab('language')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'language'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Language & Region
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab('wallet-settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'wallet-settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Wallet Settings
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'data'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Privacy & Data
            </button>
          </nav>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{profile.avatar}</span>
              </div>
              <div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Change Photo
                </button>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="mt-6">
              <button
                onClick={handleProfileUpdate}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="max-w-2xl space-y-6">
          {/* Password Change */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSecurityToggle('twoFactorEnabled')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                  {!security.twoFactorEnabled && (
                    <button
                      onClick={handleEnable2FA}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Setup
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">PIN Login</p>
                    <p className="text-xs text-gray-500">Quick login with 4-digit PIN</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSecurityToggle('pinLoginEnabled')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.pinLoginEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      security.pinLoginEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                  {!security.pinLoginEnabled && (
                    <button
                      onClick={handleSetupPIN}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Setup
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Biometric Login</p>
                    <p className="text-xs text-gray-500">Use fingerprint or face recognition</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSecurityToggle('biometricEnabled')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.biometricEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      security.biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                  {!security.biometricEnabled && (
                    <button
                      onClick={handleBiometricSetup}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Setup
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Login Notifications</p>
                    <p className="text-xs text-gray-500">Get notified of new login attempts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSecurityToggle('loginNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    security.loginNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    security.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyToggle('profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="public">Public - Anyone can see</option>
                    <option value="members">Members Only - Only group members</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Show Email Address</p>
                    <p className="text-xs text-gray-500">Allow others to see your email</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('showEmail')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy.showEmail ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Show Phone Number</p>
                    <p className="text-xs text-gray-500">Allow others to see your phone</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('showPhone')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy.showPhone ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.showPhone ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Allow Direct Messages</p>
                    <p className="text-xs text-gray-500">Let others send you direct messages</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('allowDirectMessages')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy.allowDirectMessages ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.allowDirectMessages ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Language & Region Tab */}
          {activeTab === 'language' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies.map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment Methods */}
      {activeTab === 'payments' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Methods</h2>
            <div className="space-y-2">
              {paymentMethods.map(pm => (
                <div key={pm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    {pm.type === 'card' ? <CreditCard className="w-5 h-5 text-blue-600" /> : <Banknote className="w-5 h-5 text-green-600" />}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pm.label}</div>
                      {pm.last4 && <div className="text-xs text-gray-500">•••• {pm.last4}</div>}
                    </div>
                  </div>
                  <button onClick={() => setPaymentMethods(paymentMethods.filter(x => x.id !== pm.id))} className="text-red-600 text-sm inline-flex items-center"><Trash2 className="w-4 h-4 mr-1" /> Remove</button>
                </div>
              ))}
              {paymentMethods.length === 0 && <div className="text-sm text-gray-500">No payment methods saved.</div>}
            </div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Card</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="px-3 py-2 border rounded" placeholder="Card Number" value={newCard.number} onChange={e => setNewCard({ ...newCard, number: e.target.value })} />
              <input className="px-3 py-2 border rounded" placeholder="Name on Card" value={newCard.name} onChange={e => setNewCard({ ...newCard, name: e.target.value })} />
              <input className="px-3 py-2 border rounded" placeholder="MM/YY" value={newCard.expiry} onChange={e => setNewCard({ ...newCard, expiry: e.target.value })} />
            </div>
            <div className="mt-3 text-right">
              <button onClick={() => {
                if (!newCard.number || newCard.number.length < 12) return alert('Enter valid card');
                const last4 = newCard.number.slice(-4);
                setPaymentMethods([{ id: `pm-${Date.now()}`, type: 'card', label: `${newCard.name} • ${newCard.expiry}`, last4 }, ...paymentMethods]);
                setNewCard({ number: '', name: '', expiry: '' });
              }} className="px-4 py-2 bg-blue-600 text-white rounded">Save Card</button>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Link Bank</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="px-3 py-2 border rounded" placeholder="Bank Name" value={newBank.bank} onChange={e => setNewBank({ ...newBank, bank: e.target.value })} />
              <input className="px-3 py-2 border rounded" placeholder="Account Number" value={newBank.account} onChange={e => setNewBank({ ...newBank, account: e.target.value })} />
            </div>
            <div className="mt-3 text-right">
              <button onClick={() => {
                if (!newBank.bank || !newBank.account) return alert('Enter bank and account');
                setPaymentMethods([{ id: `pm-${Date.now()}`, type: 'bank', label: `${newBank.bank} • ${newBank.account}` }, ...paymentMethods]);
                setNewBank({ bank: '', account: '' });
              }} className="px-4 py-2 bg-blue-600 text-white rounded">Link Bank</button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Settings */}
      {activeTab === 'wallet-settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Wallet Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-3 py-2 border rounded">
                  {currencies.map(c => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-accept Payouts</label>
                <select className="w-full px-3 py-2 border rounded">
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">These preferences are used across SureBanker and SureEscrow experiences.</p>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl space-y-4 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h2>
          {[{ id: 'orders', label: 'Order Updates' }, { id: 'payments', label: 'Payments & Payouts' }, { id: 'reviews', label: 'New Reviews' }].map(n => (
            <div key={n.id} className="flex items-center justify-between">
              <div className="text-sm text-gray-700">{n.label}</div>
              <button onClick={() => write(`notif:${n.id}`, !(read(`notif:${n.id}`, true)))} className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Privacy & Data */}
      {activeTab === 'data' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded mb-2">
              <div className="text-sm text-gray-700 inline-flex items-center"><Download className="w-4 h-4 mr-2" /> Export My Data</div>
              <button onClick={() => alert('Export requested')} className="px-3 py-2 bg-gray-900 text-white rounded text-sm">Export</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="text-sm text-red-700 inline-flex items-center"><Lock className="w-4 h-4 mr-2" /> Delete My Account</div>
              <button onClick={() => confirm('Are you sure?') && alert('Deletion requested')} className="px-3 py-2 bg-red-600 text-white rounded text-sm">Request Deletion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};