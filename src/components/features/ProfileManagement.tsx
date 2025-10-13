import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Edit, Trash2, Eye, Shield, UserX, Lock, Unlock, 
  Download, Filter, MoreHorizontal, Settings, UserCheck, AlertTriangle,
  Mail, Phone, MapPin, Calendar, Clock, CheckCircle, XCircle, Ban
} from 'lucide-react';
import { UserRole } from '../../types';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'banned';
  avatar: string;
  bio: string;
  location: string;
  organization: string;
  department: string;
  position: string;
  joinDate: string;
  lastLogin: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'not_required';
  restrictions: {
    canLogin: boolean;
    canPost: boolean;
    canComment: boolean;
    canMessage: boolean;
    canJoinGroups: boolean;
    canCreateGroups: boolean;
    canAccessMarketplace: boolean;
    canAccessWallet: boolean;
  };
  privacySettings: {
    profileVisibility: 'public' | 'members' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowDirectMessages: boolean;
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    loginNotifications: boolean;
  };
  activityStats: {
    totalPosts: number;
    totalComments: number;
    totalGroups: number;
    totalEvents: number;
    loginCount: number;
  };
}

interface SystemSettings {
  globalProfileSettings: {
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    requireKYC: boolean;
    allowProfileCustomization: boolean;
    defaultProfileVisibility: 'public' | 'members' | 'private';
    maxBioLength: number;
    allowedFileTypes: string[];
    maxFileSize: number;
  };
  restrictionPolicies: {
    autoSuspendAfterDays: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    contentModerationEnabled: boolean;
    autoApproveProfiles: boolean;
  };
  notificationSettings: {
    profileUpdateNotifications: boolean;
    securityAlertNotifications: boolean;
    adminActionNotifications: boolean;
    systemMaintenanceNotifications: boolean;
  };
}

export const ProfileManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'restrictions' | 'settings' | 'analytics'>('profiles');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending' | 'suspended' | 'banned'>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified' | 'pending'>('all');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [bulkActions, setBulkActions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'status' | 'lastLogin' | 'joinDate'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Sample data
  const [profiles, setProfiles] = useState<UserProfile[]>([
    {
      id: '1',
      fullName: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      role: 'super-admin',
      status: 'active',
      avatar: 'JS',
      bio: 'Platform administrator with full system access',
      location: 'New York, NY',
      organization: 'SureGroups Inc',
      department: 'Administration',
      position: 'Super Administrator',
      joinDate: '2024-01-01',
      lastLogin: '2025-01-15T10:30:00Z',
      emailVerified: true,
      phoneVerified: true,
      kycStatus: 'verified',
      restrictions: {
        canLogin: true,
        canPost: true,
        canComment: true,
        canMessage: true,
        canJoinGroups: true,
        canCreateGroups: true,
        canAccessMarketplace: true,
        canAccessWallet: true,
      },
      privacySettings: {
        profileVisibility: 'public',
        showEmail: true,
        showPhone: false,
        showLocation: true,
        allowDirectMessages: true,
      },
      securitySettings: {
        twoFactorEnabled: true,
        biometricEnabled: true,
        loginNotifications: true,
      },
      activityStats: {
        totalPosts: 45,
        totalComments: 123,
        totalGroups: 8,
        totalEvents: 12,
        loginCount: 156,
      },
    },
    {
      id: '2',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 234-5678',
      role: 'product-admin',
      status: 'active',
      avatar: 'SJ',
      bio: 'Product management specialist focused on user experience',
      location: 'San Francisco, CA',
      organization: 'SureGroups Inc',
      department: 'Product',
      position: 'Product Manager',
      joinDate: '2024-02-15',
      lastLogin: '2025-01-15T09:15:00Z',
      emailVerified: true,
      phoneVerified: true,
      kycStatus: 'verified',
      restrictions: {
        canLogin: true,
        canPost: true,
        canComment: true,
        canMessage: true,
        canJoinGroups: true,
        canCreateGroups: true,
        canAccessMarketplace: true,
        canAccessWallet: true,
      },
      privacySettings: {
        profileVisibility: 'members',
        showEmail: false,
        showPhone: false,
        showLocation: true,
        allowDirectMessages: true,
      },
      securitySettings: {
        twoFactorEnabled: true,
        biometricEnabled: false,
        loginNotifications: true,
      },
      activityStats: {
        totalPosts: 23,
        totalComments: 67,
        totalGroups: 5,
        totalEvents: 8,
        loginCount: 89,
      },
    },
    {
      id: '3',
      fullName: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      phone: '+1 (555) 345-6789',
      role: 'member',
      status: 'suspended',
      avatar: 'MW',
      bio: 'Community member with restricted access due to policy violations',
      location: 'Chicago, IL',
      organization: 'Tech Solutions',
      department: 'Engineering',
      position: 'Software Developer',
      joinDate: '2024-03-10',
      lastLogin: '2025-01-10T14:20:00Z',
      emailVerified: true,
      phoneVerified: false,
      kycStatus: 'pending',
      restrictions: {
        canLogin: false,
        canPost: false,
        canComment: false,
        canMessage: false,
        canJoinGroups: false,
        canCreateGroups: false,
        canAccessMarketplace: false,
        canAccessWallet: false,
      },
      privacySettings: {
        profileVisibility: 'private',
        showEmail: false,
        showPhone: false,
        showLocation: false,
        allowDirectMessages: false,
      },
      securitySettings: {
        twoFactorEnabled: false,
        biometricEnabled: false,
        loginNotifications: false,
      },
      activityStats: {
        totalPosts: 8,
        totalComments: 34,
        totalGroups: 2,
        totalEvents: 3,
        loginCount: 45,
      },
    },
  ]);

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    globalProfileSettings: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      requireKYC: true,
      allowProfileCustomization: true,
      defaultProfileVisibility: 'members',
      maxBioLength: 500,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif'],
      maxFileSize: 5242880, // 5MB
    },
    restrictionPolicies: {
      autoSuspendAfterDays: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      contentModerationEnabled: true,
      autoApproveProfiles: false,
    },
    notificationSettings: {
      profileUpdateNotifications: true,
      securityAlertNotifications: true,
      adminActionNotifications: true,
      systemMaintenanceNotifications: true,
    },
  });

  // Filtered and sorted profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || profile.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || profile.status === statusFilter;
      const matchesVerification = verificationFilter === 'all' || 
        (verificationFilter === 'verified' && profile.emailVerified && profile.phoneVerified) ||
        (verificationFilter === 'unverified' && (!profile.emailVerified || !profile.phoneVerified)) ||
        (verificationFilter === 'pending' && profile.kycStatus === 'pending');
      
      return matchesSearch && matchesRole && matchesStatus && matchesVerification;
    });
  }, [profiles, searchTerm, roleFilter, statusFilter, verificationFilter]);

  const sortedProfiles = useMemo(() => {
    const list = [...filteredProfiles];
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName) * dir;
        case 'role':
          return a.role.localeCompare(b.role) * dir;
        case 'status':
          return a.status.localeCompare(b.status) * dir;
        case 'lastLogin':
          return (new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()) * dir;
        case 'joinDate':
          return (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()) * dir;
        default:
          return 0;
      }
    });
    return list;
  }, [filteredProfiles, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedProfiles.length / pageSize));
  const pagedProfiles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedProfiles.slice(start, start + pageSize);
  }, [sortedProfiles, page]);

  const setSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = profiles.length;
    const active = profiles.filter(p => p.status === 'active').length;
    const suspended = profiles.filter(p => p.status === 'suspended').length;
    const verified = profiles.filter(p => p.emailVerified && p.phoneVerified).length;
    const pendingKYC = profiles.filter(p => p.kycStatus === 'pending').length;
    
    return { total, active, suspended, verified, pendingKYC };
  }, [profiles]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super-admin': return 'bg-red-100 text-red-800';
      case 'product-admin': return 'bg-purple-100 text-purple-800';
      case 'group-admin': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      case 'vendor': return 'bg-orange-100 text-orange-800';
      case 'developer': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBulkAction = (action: string) => {
    if (bulkActions.length === 0) {
      alert('Please select profiles first');
      return;
    }

    switch (action) {
      case 'activate':
        setProfiles(profiles.map(profile =>
          bulkActions.includes(profile.id) ? { ...profile, status: 'active' } : profile
        ));
        break;
      case 'suspend':
        setProfiles(profiles.map(profile =>
          bulkActions.includes(profile.id) ? { ...profile, status: 'suspended' } : profile
        ));
        break;
      case 'ban':
        setProfiles(profiles.map(profile =>
          bulkActions.includes(profile.id) ? { ...profile, status: 'banned' } : profile
        ));
        break;
      case 'verify':
        setProfiles(profiles.map(profile =>
          bulkActions.includes(profile.id) ? { 
            ...profile, 
            emailVerified: true, 
            phoneVerified: true,
            kycStatus: 'verified' as const
          } : profile
        ));
        break;
    }
    setBulkActions([]);
  };

  const handleToggleBulkSelection = (profileId: string) => {
    setBulkActions(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSelectAll = () => {
    setBulkActions(bulkActions.length === sortedProfiles.length ? [] : sortedProfiles.map(p => p.id));
  };

  const exportProfiles = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Organization', 'Last Login', 'Email Verified', 'Phone Verified', 'KYC Status'].join(','),
      ...sortedProfiles.map(profile => [
        profile.fullName,
        profile.email,
        profile.role,
        profile.status,
        profile.organization,
        new Date(profile.lastLogin).toLocaleDateString(),
        profile.emailVerified ? 'Yes' : 'No',
        profile.phoneVerified ? 'Yes' : 'No',
        profile.kycStatus
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-profiles-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Management</h1>
        <p className="text-gray-600">Comprehensive user profile management and system settings</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Profiles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">{stats.suspended}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending KYC</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingKYC}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'profiles', label: 'User Profiles', icon: UserCheck },
              { id: 'restrictions', label: 'Restrictions', icon: Ban },
              { id: 'settings', label: 'System Settings', icon: Settings },
              { id: 'analytics', label: 'Analytics', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profiles Tab */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              {/* Filters and Search */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search profiles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="super-admin">Super Admin</option>
                    <option value="product-admin">Product Admin</option>
                    <option value="group-admin">Group Admin</option>
                    <option value="member">Member</option>
                    <option value="vendor">Vendor</option>
                    <option value="developer">Developer</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                  <select
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Verification</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                    <option value="pending">Pending</option>
                  </select>
                  <button
                    onClick={exportProfiles}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              {bulkActions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-blue-900">
                        {bulkActions.length} profile{bulkActions.length > 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction('activate')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleBulkAction('suspend')}
                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                      >
                        Suspend
                      </button>
                      <button
                        onClick={() => handleBulkAction('ban')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Ban
                      </button>
                      <button
                        onClick={() => handleBulkAction('verify')}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => setBulkActions([])}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Profiles Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={bulkActions.length === sortedProfiles.length && sortedProfiles.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th onClick={() => setSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                          Profile {sortBy==='name' ? (sortDir==='asc'?'▲':'▼') : ''}
                        </th>
                        <th onClick={() => setSort('role')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                          Role {sortBy==='role' ? (sortDir==='asc'?'▲':'▼') : ''}
                        </th>
                        <th onClick={() => setSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                          Status {sortBy==='status' ? (sortDir==='asc'?'▲':'▼') : ''}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                        <th onClick={() => setSort('lastLogin')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">
                          Last Login {sortBy==='lastLogin' ? (sortDir==='asc'?'▲':'▼') : ''}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pagedProfiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={bulkActions.includes(profile.id)}
                              onChange={() => handleToggleBulkSelection(profile.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {profile.avatar}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{profile.fullName}</div>
                                <div className="text-sm text-gray-500">{profile.email}</div>
                                <div className="text-xs text-gray-400">{profile.organization}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(profile.role)}`}>
                              {profile.role.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(profile.status)}`}>
                              {profile.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {profile.emailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {profile.phoneVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {profile.kycStatus === 'verified' && <Shield className="w-4 h-4 text-blue-500" />}
                              {profile.kycStatus === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="text-xs">
                              <div>Posts: {profile.activityStats.totalPosts}</div>
                              <div>Groups: {profile.activityStats.totalGroups}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(profile.lastLogin).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedProfile(profile)}
                                className="text-blue-600 hover:text-blue-900"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowEditModal(true)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Edit Profile"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowRestrictionModal(true)}
                                className="text-orange-600 hover:text-orange-900"
                                title="Manage Restrictions"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, sortedProfiles.length)} of {sortedProfiles.length} profiles
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Restrictions Tab */}
          {activeTab === 'restrictions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Restriction Management</h2>
                <button
                  onClick={() => setShowRestrictionModal(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                >
                  <Ban className="w-4 h-4" />
                  <span>Manage Restrictions</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.filter(p => p.status === 'suspended' || p.status === 'banned').map((profile) => (
                  <div key={profile.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">{profile.avatar}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{profile.fullName}</h3>
                          <p className="text-sm text-gray-500">{profile.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(profile.status)}`}>
                        {profile.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Restrictions:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(profile.restrictions).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-1">
                            {value ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-500" />
                            )}
                            <span className={value ? 'text-green-700' : 'text-red-700'}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        <Unlock className="w-3 h-3 inline mr-1" />
                        Restore
                      </button>
                      <button className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                        <Ban className="w-3 h-3 inline mr-1" />
                        Ban
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Global Profile Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Profile Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Require Email Verification</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        systemSettings.globalProfileSettings.requireEmailVerification 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {systemSettings.globalProfileSettings.requireEmailVerification ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Require Phone Verification</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        systemSettings.globalProfileSettings.requirePhoneVerification 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {systemSettings.globalProfileSettings.requirePhoneVerification ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Require KYC</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        systemSettings.globalProfileSettings.requireKYC 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {systemSettings.globalProfileSettings.requireKYC ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Default Profile Visibility</span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {systemSettings.globalProfileSettings.defaultProfileVisibility}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Max Bio Length</span>
                      <span className="text-sm text-gray-900">{systemSettings.globalProfileSettings.maxBioLength} characters</span>
                    </div>
                  </div>
                </div>

                {/* Restriction Policies */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Restriction Policies</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto Suspend After (Days)</span>
                      <span className="text-sm text-gray-900">{systemSettings.restrictionPolicies.autoSuspendAfterDays}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Max Login Attempts</span>
                      <span className="text-sm text-gray-900">{systemSettings.restrictionPolicies.maxLoginAttempts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Lockout Duration (Minutes)</span>
                      <span className="text-sm text-gray-900">{systemSettings.restrictionPolicies.lockoutDuration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Content Moderation</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        systemSettings.restrictionPolicies.contentModerationEnabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {systemSettings.restrictionPolicies.contentModerationEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto Approve Profiles</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        systemSettings.restrictionPolicies.autoApproveProfiles 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {systemSettings.restrictionPolicies.autoApproveProfiles ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Profile Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Profile Completion Rate</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">87%</div>
                  <div className="text-sm text-green-600">+5% from last month</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Verification Rate</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">92%</div>
                  <div className="text-sm text-green-600">+3% from last month</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Active Profiles</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">2,847</div>
                  <div className="text-sm text-green-600">+12% from last month</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Restriction Rate</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">3.2%</div>
                  <div className="text-sm text-red-600">+0.5% from last month</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Activity Trends</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};








