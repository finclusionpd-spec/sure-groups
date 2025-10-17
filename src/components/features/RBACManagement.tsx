import React, { useState, useMemo } from 'react';
import { 
  Shield, Save, RotateCcw, Check, X, Plus, Edit, Trash2, Users, 
  Eye, Search, Filter, Download, Clock, UserCheck, AlertTriangle,
  Crown, Settings, Key, Lock, Unlock
} from 'lucide-react';
import { UserRole } from '../../types';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermissions {
  [key: string]: boolean;
}

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: RolePermissions;
  userCount: number;
  createdAt: string;
  isActive: boolean;
}

interface UserRoleAssignment {
  userId: string;
  userName: string;
  userEmail: string;
  role: UserRole | string;
  assignedBy: string;
  assignedAt: string;
  expiresAt?: string;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  permission?: string;
  timestamp: string;
  details: string;
}

export const RBACManagement: React.FC = () => {
  const permissions: Permission[] = [
    // System & User Management
    { id: 'admin_users_manage', name: 'Manage Admin Users', description: 'Create, edit, and delete admin users', category: 'System & User Management' },
    { id: 'users_manage', name: 'Manage All Users', description: 'Full user management across all types', category: 'System & User Management' },
    { id: 'rbac_manage', name: 'Manage Roles & Permissions', description: 'Configure role-based access control', category: 'System & User Management' },
    { id: 'dashboard_manage', name: 'Dashboard Management', description: 'Customize dashboard layouts and widgets', category: 'System & User Management' },
    { id: 'regional_manage', name: 'Regional Management', description: 'Manage regional settings and assignments', category: 'System & User Management' },
    
    // Compliance & Governance
    { id: 'kyc_manage', name: 'KYC/KYB Management', description: 'Review and approve identity verifications', category: 'Compliance & Governance' },
    { id: 'approval_workflows', name: 'Approval Workflows', description: 'Create and manage approval processes', category: 'Compliance & Governance' },
    { id: 'background_checks', name: 'Background Checks', description: 'Manage background verification processes', category: 'Compliance & Governance' },
    { id: 'white_labeling', name: 'White Labeling', description: 'Customize platform branding and appearance', category: 'Compliance & Governance' },
    
    // Financial & Transactions
    { id: 'transactions_manage', name: 'Transaction Management', description: 'View and manage all transactions', category: 'Financial & Transactions' },
    { id: 'wallets_manage', name: 'Wallet Management', description: 'Manage user wallets and balances', category: 'Financial & Transactions' },
    { id: 'escrow_manage', name: 'Escrow Management', description: 'Handle escrow transactions and releases', category: 'Financial & Transactions' },
    { id: 'subscriptions_manage', name: 'Subscription Management', description: 'Manage pricing plans and fees', category: 'Financial & Transactions' },
    { id: 'disputes_manage', name: 'Dispute Management', description: 'Handle transaction disputes and resolutions', category: 'Financial & Transactions' },
    
    // Integrations & Developer Tools
    { id: 'integrations_manage', name: 'Third-Party Integrations', description: 'Manage external service integrations', category: 'Integrations & Developer Tools' },
    { id: 'api_manage', name: 'API Management', description: 'Generate and manage API keys', category: 'Integrations & Developer Tools' },
    { id: 'developer_tools', name: 'Developer Tools', description: 'Access sandbox and development tools', category: 'Integrations & Developer Tools' },
    { id: 'marketplace_system', name: 'Marketplace System', description: 'Manage marketplace vendors and products', category: 'Integrations & Developer Tools' },
    
    // Data & Analytics
    { id: 'database_manage', name: 'Database Management', description: 'Manage database operations and queries', category: 'Data & Analytics' },
    { id: 'system_health', name: 'System Health Analytics', description: 'Monitor system performance and health', category: 'Data & Analytics' },
    { id: 'reports_analytics', name: 'Reports & Analytics', description: 'Generate and export system reports', category: 'Data & Analytics' },
    { id: 'system_logs', name: 'System Logs', description: 'Access and configure system logs', category: 'Data & Analytics' },
    
    // Communication & Support
    { id: 'chat_manage', name: 'Chat Management', description: 'Monitor and manage chat conversations', category: 'Communication & Support' },
    { id: 'email_templates', name: 'Email Templates', description: 'Create and manage email templates', category: 'Communication & Support' },
    { id: 'notifications_manage', name: 'Notification Management', description: 'Send and schedule notifications', category: 'Communication & Support' },
    { id: 'ticketing_manage', name: 'Ticketing System', description: 'Manage support tickets and assignments', category: 'Communication & Support' },
    
    // Group & Event Management
    { id: 'groups_manage', name: 'Group Management', description: 'Create and manage groups', category: 'Group & Event Management' },
    { id: 'events_manage', name: 'Event Management', description: 'Create and manage events', category: 'Group & Event Management' },
    { id: 'members_manage', name: 'Member Management', description: 'Manage group members', category: 'Group & Event Management' },
    
    // Product Features
    { id: 'features_manage', name: 'Feature Management', description: 'Control feature rollouts and toggles', category: 'Product Features' },
    { id: 'marketplace_access', name: 'Marketplace Access', description: 'Access marketplace functionality', category: 'Product Features' },
    { id: 'wallet_access', name: 'Wallet Access', description: 'Access wallet functionality', category: 'Product Features' }
  ];

  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, RolePermissions>>({
    'super-admin': {
      // Super Admin has all permissions
      ...permissions.reduce((acc, perm) => ({ ...acc, [perm.id]: true }), {})
    },
    'product-admin': {
      // Product Admin permissions
      features_manage: true,
      marketplace_system: true,
      integrations_manage: true,
      api_manage: true,
      developer_tools: true,
      system_health: true,
      reports_analytics: true,
      marketplace_access: true,
      admin_users_manage: true,
      users_manage: true,
      wallets_manage: true,
      transactions_manage: true,
      chat_manage: true,
      events_manage: true,
      database_manage: true,
      ticketing_manage: true,
      // Default others to false
      ...permissions.reduce((acc, perm) => ({ 
        ...acc, 
        [perm.id]: ['features_manage', 'marketplace_system', 'integrations_manage', 'api_manage', 'developer_tools', 'system_health', 'reports_analytics', 'marketplace_access', 'admin_users_manage', 'users_manage', 'wallets_manage', 'transactions_manage', 'chat_manage', 'events_manage', 'database_manage', 'ticketing_manage'].includes(perm.id)
      }), {})
    },
    'group-admin': {
      // Group Admin permissions
      groups_manage: true,
      events_manage: true,
      members_manage: true,
      chat_manage: true,
      marketplace_access: true,
      // Default others to false
      ...permissions.reduce((acc, perm) => ({ 
        ...acc, 
        [perm.id]: ['groups_manage', 'events_manage', 'members_manage', 'chat_manage', 'marketplace_access'].includes(perm.id)
      }), {})
    },
    'member': {
      // Member permissions
      marketplace_access: true,
      wallet_access: true,
      // Default others to false
      ...permissions.reduce((acc, perm) => ({ 
        ...acc, 
        [perm.id]: ['marketplace_access', 'wallet_access'].includes(perm.id)
      }), {})
    }
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('super-admin');
  const [activeTab, setActiveTab] = useState<'roles' | 'assignments' | 'audit' | 'permissions'>('roles');
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showUserAssignment, setShowUserAssignment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<UserRoleAssignment | null>(null);

  // Custom roles state
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([
    {
      id: 'custom-1',
      name: 'Support Manager',
      description: 'Manages support tickets and customer service',
      permissions: {
        ticketing_manage: true,
        chat_manage: true,
        notifications_manage: true,
        users_manage: true
      },
      userCount: 3,
      createdAt: '2024-01-15',
      isActive: true
    },
    {
      id: 'custom-2',
      name: 'Financial Analyst',
      description: 'Access to financial data and reporting',
      permissions: {
        transactions_manage: true,
        wallets_manage: true,
        reports_analytics: true,
        subscriptions_manage: true
      },
      userCount: 2,
      createdAt: '2024-01-20',
      isActive: true
    }
  ]);

  // User role assignments
  const [userAssignments, setUserAssignments] = useState<UserRoleAssignment[]>([
    {
      userId: 'user-1',
      userName: 'John Smith',
      userEmail: 'john@company.com',
      role: 'super-admin',
      assignedBy: 'System',
      assignedAt: '2024-01-01',
    },
    {
      userId: 'user-2',
      userName: 'Sarah Johnson',
      userEmail: 'sarah@company.com',
      role: 'product-admin',
      assignedBy: 'John Smith',
      assignedAt: '2024-01-15',
    },
    {
      userId: 'user-3',
      userName: 'Mike Wilson',
      userEmail: 'mike@company.com',
      role: 'Support Manager',
      assignedBy: 'Sarah Johnson',
      assignedAt: '2024-01-20',
      expiresAt: '2024-12-31'
    }
  ]);

  // Audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'audit-1',
      action: 'Role Assigned',
      user: 'John Smith',
      role: 'product-admin',
      timestamp: '2024-01-15 10:30:00',
      details: 'Assigned product-admin role to Sarah Johnson'
    },
    {
      id: 'audit-2',
      action: 'Permission Modified',
      user: 'Sarah Johnson',
      role: 'product-admin',
      permission: 'api_manage',
      timestamp: '2024-01-16 14:20:00',
      details: 'Granted api_manage permission to product-admin role'
    },
    {
      id: 'audit-3',
      action: 'Custom Role Created',
      user: 'John Smith',
      role: 'Support Manager',
      timestamp: '2024-01-20 09:15:00',
      details: 'Created new custom role: Support Manager'
    }
  ]);

  const handlePermissionChange = (permissionId: string, granted: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [permissionId]: granted
      }
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    console.log('Saving role permissions:', rolePermissions);
    setHasChanges(false);
    // Show success message
  };

  const handleResetChanges = () => {
    // Reset to original state
    setHasChanges(false);
    // In a real app, this would reload from the backend
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super-admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'product-admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'group-admin': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'member': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const getPermissionCount = (role: UserRole | string) => {
    if (role === 'Support Manager' || role === 'Financial Analyst') {
      const customRole = customRoles.find(r => r.name === role);
      return customRole ? Object.values(customRole.permissions).filter(Boolean).length : 0;
    }
    return Object.values(rolePermissions[role as UserRole]).filter(Boolean).length;
  };

  // Filtered data
  const filteredUserAssignments = useMemo(() => {
    return userAssignments.filter(assignment => {
      const matchesSearch = assignment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || assignment.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [userAssignments, searchTerm, filterRole]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [auditLogs, searchTerm]);

  // New role creation
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: {} as RolePermissions
  });

  const handleCreateRole = () => {
    if (!newRole.name.trim()) {
      alert('Please enter a role name');
      return;
    }

    const role: CustomRole = {
      id: `custom-${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    };

    setCustomRoles([...customRoles, role]);
    setNewRole({ name: '', description: '', permissions: {} });
    setShowCreateRole(false);
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      setCustomRoles(customRoles.filter(role => role.id !== roleId));
    }
  };

  const handleAssignUser = (userId: string, role: string) => {
    // In a real app, this would make an API call
    console.log(`Assigning role ${role} to user ${userId}`);
    setShowUserAssignment(false);
  };

  const exportAuditLogs = () => {
    const csvContent = [
      ['Action', 'User', 'Role', 'Permission', 'Timestamp', 'Details'].join(','),
      ...auditLogs.map(log => [
        log.action,
        log.user,
        log.role,
        log.permission || '',
        log.timestamp,
        log.details
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rbac-audit-logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">RBAC - Roles & Permissions</h1>
        <p className="text-gray-600">Comprehensive role-based access control management</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'roles', label: 'Roles', icon: Shield },
              { id: 'assignments', label: 'User Assignments', icon: Users },
              { id: 'audit', label: 'Audit Trail', icon: Clock },
              { id: 'permissions', label: 'Permission Matrix', icon: Key }
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
          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Role Management</h2>
                <button
                  onClick={() => setShowCreateRole(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Role</span>
                </button>
              </div>

              {/* System Roles */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">System Roles</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(['super-admin', 'product-admin', 'group-admin', 'member'] as UserRole[]).map((role) => (
                    <div
                      key={role}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedRole === role 
                          ? getRoleColor(role) + ' ring-2 ring-blue-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Shield className="w-6 h-6" />
                      </div>
                      <h4 className="font-semibold text-sm capitalize text-center">{role.replace('-', ' ')}</h4>
                      <p className="text-xs mt-1 text-center">
                        {getPermissionCount(role)} permissions
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Roles */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Custom Roles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customRoles.map((role) => (
                    <div key={role.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-gray-900">{role.name}</h4>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setSelectedUser(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{getPermissionCount(role.name)} permissions</span>
                        <span>{role.userCount} users</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* User Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">User Role Assignments</h2>
                <button
                  onClick={() => setShowUserAssignment(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign Role</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="super-admin">Super Admin</option>
                  <option value="product-admin">Product Admin</option>
                  <option value="group-admin">Group Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>

              {/* Assignments Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUserAssignments.map((assignment) => (
                      <tr key={assignment.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{assignment.userName}</div>
                            <div className="text-sm text-gray-500">{assignment.userEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(assignment.role as UserRole)}`}>
                            {assignment.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assignment.assignedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.assignedAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.expiresAt || 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedUser(assignment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Audit Trail</h2>
                <button
                  onClick={exportAuditLogs}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Audit Logs */}
              <div className="space-y-4">
                {filteredAuditLogs.map((log) => (
                  <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            log.action === 'Role Assigned' ? 'bg-green-100 text-green-800' :
                            log.action === 'Permission Modified' ? 'bg-blue-100 text-blue-800' :
                            log.action === 'Custom Role Created' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-sm text-gray-500">{log.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-900 mb-1">
                          <span className="font-medium">{log.user}</span> {log.details}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Role: {log.role}</span>
                          {log.permission && <span>Permission: {log.permission}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permission Matrix Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Permission Matrix</h2>
                <div className="text-sm text-gray-600">
                  Select a role to configure permissions
                </div>
              </div>

              {/* Role Selection */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(['super-admin', 'product-admin', 'group-admin', 'member'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === role 
                        ? getRoleColor(role) + ' ring-2 ring-blue-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-sm capitalize">{role.replace('-', ' ')}</h3>
                    <p className="text-xs mt-1">
                      {getPermissionCount(role)} permissions
                    </p>
                  </button>
                ))}
              </div>

              {/* Save/Reset Actions */}
              {hasChanges && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm text-yellow-800">You have unsaved changes</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleResetChanges}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Permissions Matrix */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Permissions for {selectedRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure what this role can access and manage
                  </p>
                </div>

                <div className="p-6">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category} className="mb-8 last:mb-0">
                      <h4 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                            <button
                              onClick={() => handlePermissionChange(
                                permission.id, 
                                !rolePermissions[selectedRole][permission.id]
                              )}
                              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                rolePermissions[selectedRole][permission.id]
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {rolePermissions[selectedRole][permission.id] && (
                                <Check className="w-3 h-3" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium text-gray-900">{permission.name}</h5>
                              <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Custom Role</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe this role's purpose"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {permissions.map(permission => (
                    <label key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newRole.permissions[permission.id] || false}
                        onChange={(e) => {
                          setNewRole({
                            ...newRole,
                            permissions: {
                              ...newRole.permissions,
                              [permission.id]: e.target.checked
                            }
                          });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm text-gray-700">{permission.name}</span>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateRole(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};