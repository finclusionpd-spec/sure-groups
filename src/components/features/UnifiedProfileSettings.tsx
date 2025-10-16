import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Shield, Bell, Globe, Eye, EyeOff, 
  Smartphone, Key, CreditCard, Banknote, Trash2, Download, Lock,
  Edit, Save, X, CheckCircle, AlertTriangle, Clock, Monitor, Smartphone as PhoneIcon,
  Shield as ShieldIcon, Settings as SettingsIcon, UserCheck, LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserAvatar } from '../common/UserAvatar';
import { UserRole } from '../../types';

interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
}

interface AccountSettings {
  username: string;
  role: UserRole;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  pinLoginEnabled: boolean;
  biometricEnabled: boolean;
  loginNotifications: boolean;
  recoveryEmail: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
}

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  current: boolean;
}

export const UnifiedProfileSettings: React.FC = () => {
  const { user, updateKycData } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState('');
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    dateOfBirth: '',
    address: ''
  });

  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    username: user?.email?.split('@')[0] || '',
    role: user?.role || 'member',
    language: 'en',
    timezone: 'UTC',
    theme: 'light'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    pinLoginEnabled: false,
    biometricEnabled: false,
    loginNotifications: true,
    recoveryEmail: user?.email || ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    inAppNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    marketingEmails: false
  });

  const [loginSessions] = useState<LoginSession[]>([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'Lagos, Nigeria',
      ipAddress: '192.168.1.1',
      lastActive: '2024-01-15T10:30:00Z',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'Lagos, Nigeria',
      ipAddress: '192.168.1.2',
      lastActive: '2024-01-14T15:45:00Z',
      current: false
    }
  ]);

  const sections = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'account', label: 'Account Settings', icon: SettingsIcon },
    { id: 'security', label: 'Security & Privacy', icon: ShieldIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'activity', label: 'Activity & Login', icon: Clock }
  ];

  // Add role-specific sections
  if (user?.role === 'group-admin') {
    sections.push({ id: 'team', label: 'Team Information', icon: UserCheck });
  } else if (user?.role === 'vendor') {
    sections.push({ id: 'business', label: 'Business Information', icon: CreditCard });
  } else if (user?.role === 'developer') {
    sections.push({ id: 'api', label: 'API Keys & Sandbox', icon: Key });
  }

  const handleSave = async (section: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (section === 'personal') {
        // Update user data
        updateKycData({
          firstName: personalInfo.firstName,
          middleName: personalInfo.middleName,
          lastName: personalInfo.lastName,
          phone: personalInfo.phone,
          email: personalInfo.email,
          dateOfBirth: personalInfo.dateOfBirth,
          address: personalInfo.address
        });
      }
      
      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setShowError('Failed to save changes. Please try again.');
      setTimeout(() => setShowError(''), 5000);
    }
  };

  const isVerified = () => {
    if (!user?.kycTiers) return false;
    
    const requiredTiers = user.kycTiers.tier1 === 'verified';
    const isBusinessAccount = user.role === 'vendor' || user.role === 'group-admin';
    const businessTiers = !isBusinessAccount || user.kycTiers.tier3 === 'verified';
    
    return requiredTiers && businessTiers;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Success/Error Messages */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-green-700 font-medium">Changes saved successfully!</span>
        </div>
      )}
      
      {showError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
          <span className="text-red-700 font-medium">{showError}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <UserAvatar user={user!} size="xl" showVerification={true} />
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.fullName || 'User Name'}
                </h1>
                {isVerified() && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-1">{user?.email}</p>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {user?.role?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                {user?.kycData?.livenessPhoto && (
                  <span className="text-sm text-gray-500">
                    Profile photo from identity verification
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Details'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Personal Information */}
            {activeSection === 'personal' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  {isEditing && (
                    <button
                      onClick={() => handleSave('personal')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                    <input
                      type="text"
                      value={personalInfo.middleName}
                      onChange={(e) => setPersonalInfo({...personalInfo, middleName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={personalInfo.address}
                      onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={accountSettings.username}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed for verified accounts</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={accountSettings.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={accountSettings.language}
                      onChange={(e) => setAccountSettings({...accountSettings, language: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={accountSettings.timezone}
                      onChange={(e) => setAccountSettings({...accountSettings, timezone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UTC">UTC</option>
                      <option value="Africa/Lagos">Africa/Lagos</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={accountSettings.theme}
                      onChange={(e) => setAccountSettings({...accountSettings, theme: e.target.value as 'light' | 'dark' | 'auto'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security & Privacy */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Security & Privacy</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">PIN Login</h3>
                      <p className="text-sm text-gray-500">Use a PIN for quick access</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      {securitySettings.pinLoginEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Biometric Authentication</h3>
                      <p className="text-sm text-gray-500">Use fingerprint or face recognition</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      {securitySettings.biometricEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    {loginSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Monitor className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{session.device}</p>
                            <p className="text-sm text-gray-500">{session.location} • {session.ipAddress}</p>
                            <p className="text-xs text-gray-400">{new Date(session.lastActive).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {session.current && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Current
                            </span>
                          )}
                          {!session.current && (
                            <button className="text-red-600 hover:text-red-800 text-sm">
                              Logout
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'inAppNotifications' && 'Show notifications in the app'}
                          {key === 'transactionAlerts' && 'Get alerts for transactions'}
                          {key === 'securityAlerts' && 'Receive security-related notifications'}
                          {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({
                          ...notificationSettings,
                          [key]: !value
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity & Login History */}
            {activeSection === 'activity' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Activity & Login History</h2>
                
                <div className="space-y-4">
                  {loginSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Login from {session.device}</p>
                          <p className="text-sm text-gray-500">{session.location} • {session.ipAddress}</p>
                          <p className="text-xs text-gray-400">{new Date(session.lastActive).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.current && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Current Session
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Role-specific sections */}
            {activeSection === 'team' && user?.role === 'group-admin' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Team Information</h2>
                <p className="text-gray-600">Team management features will be available here.</p>
              </div>
            )}

            {activeSection === 'business' && user?.role === 'vendor' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
                <p className="text-gray-600">Business profile and settings will be available here.</p>
              </div>
            )}

            {activeSection === 'api' && user?.role === 'developer' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">API Keys & Sandbox Access</h2>
                <p className="text-gray-600">API management features will be available here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

