import React, { useMemo, useState } from 'react';
import { Search, Plus, Edit, Trash2, Shield, UserX, Eye, MoreHorizontal, Download, Crown, UserPlus, Mail } from 'lucide-react';
import { AdminUser, UserRole } from '../../types';

export const AdminUserManagement: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: '1',
      fullName: 'John Smith',
      email: 'john.smith@suregroups.com',
      role: 'super-admin',
      status: 'active',
      region: 'North America',
      lastLogin: '2025-01-14T10:30:00Z',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@suregroups.com',
      role: 'product-admin',
      status: 'active',
      region: 'Europe',
      lastLogin: '2025-01-14T09:15:00Z',
      createdAt: '2025-01-02T00:00:00Z'
    },
    {
      id: '3',
      fullName: 'Mike Wilson',
      email: 'mike.wilson@suregroups.com',
      role: 'group-admin',
      status: 'suspended',
      region: 'Asia Pacific',
      lastLogin: '2025-01-13T16:45:00Z',
      createdAt: '2025-01-03T00:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [regionFilter, setRegionFilter] = useState<'all' | string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [bulkActions, setBulkActions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'status' | 'region' | 'lastLogin' | 'createdAt'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [newAdmin, setNewAdmin] = useState({
    fullName: '',
    email: '',
    role: 'group-admin' as UserRole,
    region: 'North America',
    phone: '',
    department: '',
    permissions: [] as string[],
    sendWelcomeEmail: true,
    requirePasswordChange: false,
    notes: ''
  });

  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa', 'Middle East'];
  const departments = ['Administration', 'Technical', 'Support', 'Sales', 'Marketing', 'Finance', 'Operations'];
  const availablePermissions = [
    'user_management',
    'admin_management', 
    'system_settings',
    'security_management',
    'audit_logs',
    'backup_recovery',
    'api_management',
    'content_moderation'
  ];

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
    const matchesRegion = regionFilter === 'all' || admin.region === regionFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesRegion;
  });

  const sortedAdmins = useMemo(() => {
    const list = [...filteredAdmins];
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName) * dir;
        case 'role':
          return a.role.localeCompare(b.role) * dir;
        case 'status':
          return a.status.localeCompare(b.status) * dir;
        case 'region':
          return a.region.localeCompare(b.region) * dir;
        case 'lastLogin':
          return (new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()) * dir;
        case 'createdAt':
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
        default:
          return 0;
      }
    });
    return list;
  }, [filteredAdmins, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedAdmins.length / pageSize));
  const pagedAdmins = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedAdmins.slice(start, start + pageSize);
  }, [sortedAdmins, page]);

  const setSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const handleAddAdmin = () => {
    // Basic validation
    if (!newAdmin.fullName.trim() || !newAdmin.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const admin: AdminUser = {
      id: Date.now().toString(),
      fullName: newAdmin.fullName,
      email: newAdmin.email,
      role: newAdmin.role,
      region: newAdmin.region,
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    setAdmins([...admins, admin]);
    setNewAdmin({ 
      fullName: '', 
      email: '', 
      role: 'group-admin', 
      region: 'North America',
      phone: '',
      department: '',
      permissions: [],
      sendWelcomeEmail: true,
      requirePasswordChange: false,
      notes: ''
    });
    setShowAddModal(false);
    
    if (newAdmin.sendWelcomeEmail) {
      alert(`Welcome email sent to ${newAdmin.email}`);
    }
  };

  const handleUpdateAdmin = (updatedAdmin: AdminUser) => {
    setAdmins(admins.map(admin => admin.id === updatedAdmin.id ? updatedAdmin : admin));
    setEditingAdmin(null);
  };

  const handleSuspendAdmin = (adminId: string) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === 'active' ? 'suspended' : 'active' }
        : admin
    ));
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      setAdmins(admins.filter(admin => admin.id !== adminId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (bulkActions.length === 0) {
      alert('Please select admins first');
      return;
    }

    switch (action) {
      case 'activate':
        setAdmins(admins.map(admin => 
          bulkActions.includes(admin.id) ? { ...admin, status: 'active' } : admin
        ));
        break;
      case 'suspend':
        setAdmins(admins.map(admin => 
          bulkActions.includes(admin.id) ? { ...admin, status: 'suspended' } : admin
        ));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${bulkActions.length} admins?`)) {
          setAdmins(admins.filter(admin => !bulkActions.includes(admin.id)));
        }
        break;
    }
    setBulkActions([]);
  };

  const handleToggleBulkSelection = (adminId: string) => {
    setBulkActions(prev => 
      prev.includes(adminId) 
        ? prev.filter(id => id !== adminId)
        : [...prev, adminId]
    );
  };

  const handleSelectAll = () => {
    setBulkActions(bulkActions.length === sortedAdmins.length ? [] : sortedAdmins.map(a => a.id));
  };

  const exportAdmins = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Region', 'Status', 'Last Login', 'Created'].join(','),
      ...sortedAdmins.map(admin => [
        admin.fullName,
        admin.email,
        admin.role,
        admin.region,
        admin.status,
        new Date(admin.lastLogin).toLocaleDateString(),
        new Date(admin.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin-users-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super-admin': return 'bg-red-100 text-red-700';
      case 'product-admin': return 'bg-purple-100 text-purple-700';
      case 'group-admin': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super-admin': return <Crown className="w-4 h-4" />;
      case 'product-admin': return <Shield className="w-4 h-4" />;
      case 'group-admin': return <UserPlus className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin User Management</h1>
        <p className="text-gray-600">Manage administrative users and their permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
            </div>
            <Shield className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Admins</p>
              <p className="text-2xl font-bold text-emerald-600">
                {admins.filter(admin => admin.status === 'active').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Super Admins</p>
              <p className="text-2xl font-bold text-red-600">
                {admins.filter(admin => admin.role === 'super-admin').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regions</p>
              <p className="text-2xl font-bold text-blue-600">{regions.length}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="super-admin">Super Admin</option>
            <option value="product-admin">Product Admin</option>
            <option value="group-admin">Group Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <button
            onClick={exportAdmins}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {bulkActions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-blue-900">
                {bulkActions.length} admin{bulkActions.length > 1 ? 's' : ''} selected
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
                onClick={() => handleBulkAction('delete')}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
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

      {/* Admins Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={bulkActions.length === sortedAdmins.length && sortedAdmins.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th onClick={() => setSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">Admin {sortBy==='name' ? (sortDir==='asc'?'▲':'▼') : ''}</th>
                <th onClick={() => setSort('role')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">Role {sortBy==='role' ? (sortDir==='asc'?'▲':'▼') : ''}</th>
                <th onClick={() => setSort('region')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">Region {sortBy==='region' ? (sortDir==='asc'?'▲':'▼') : ''}</th>
                <th onClick={() => setSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">Status {sortBy==='status' ? (sortDir==='asc'?'▲':'▼') : ''}</th>
                <th onClick={() => setSort('lastLogin')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none">Last Login {sortBy==='lastLogin' ? (sortDir==='asc'?'▲':'▼') : ''}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagedAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={bulkActions.includes(admin.id)}
                      onChange={() => handleToggleBulkSelection(admin.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {admin.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{admin.fullName}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(admin.role)}`}>
                      {getRoleIcon(admin.role)}
                      <span className="ml-1">{admin.role.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {admin.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(admin.status)}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(admin.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAdmin(admin)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingAdmin(admin)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSuspendAdmin(admin.id)}
                        className={admin.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-emerald-600 hover:text-emerald-900'}
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
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
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages} • Showing {pagedAdmins.length} of {sortedAdmins.length}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Admin Details Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Admin Details</h3>
              <button
                onClick={() => setSelectedAdmin(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedAdmin.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedAdmin.fullName}</h4>
                  <p className="text-gray-600">{selectedAdmin.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedAdmin.role)}`}>
                      {getRoleIcon(selectedAdmin.role)}
                      <span className="ml-1">{selectedAdmin.role.replace('-', ' ')}</span>
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAdmin.status)}`}>
                      {selectedAdmin.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Admin ID</h4>
                  <p className="text-gray-600">{selectedAdmin.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Region</h4>
                  <p className="text-gray-600">{selectedAdmin.region}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Last Login</h4>
                  <p className="text-gray-600">{new Date(selectedAdmin.lastLogin).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Account Created</h4>
                  <p className="text-gray-600">{new Date(selectedAdmin.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  onClick={() => {
                    setEditingAdmin(selectedAdmin);
                    setSelectedAdmin(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Admin
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Send Message
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  View Activity
                </button>
                <button
                  onClick={() => {
                    const newStatus = selectedAdmin.status === 'active' ? 'suspended' : 'active';
                    handleUpdateAdmin({ ...selectedAdmin, status: newStatus });
                    setSelectedAdmin(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    selectedAdmin.status === 'active' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedAdmin.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Add New Admin User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAdmin.fullName}
                    onChange={(e) => setNewAdmin({...newAdmin, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={newAdmin.department}
                    onChange={(e) => setNewAdmin({...newAdmin, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role & Permissions */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b pb-2">Role & Access</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value as UserRole})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="group-admin">Group Admin</option>
                    <option value="product-admin">Product Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newAdmin.region}
                    onChange={(e) => setNewAdmin({...newAdmin, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {availablePermissions.map(permission => (
                      <label key={permission} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newAdmin.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAdmin({...newAdmin, permissions: [...newAdmin.permissions, permission]});
                            } else {
                              setNewAdmin({...newAdmin, permissions: newAdmin.permissions.filter(p => p !== permission)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {permission.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mt-6 space-y-4">
              <h4 className="text-md font-medium text-gray-900 border-b pb-2">Additional Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sendWelcomeEmail"
                    checked={newAdmin.sendWelcomeEmail}
                    onChange={(e) => setNewAdmin({...newAdmin, sendWelcomeEmail: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sendWelcomeEmail" className="text-sm text-gray-700">
                    Send welcome email with login credentials
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requirePasswordChange"
                    checked={newAdmin.requirePasswordChange}
                    onChange={(e) => setNewAdmin({...newAdmin, requirePasswordChange: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="requirePasswordChange" className="text-sm text-gray-700">
                    Require password change on first login
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newAdmin.notes}
                  onChange={(e) => setNewAdmin({...newAdmin, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes about this admin user..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdmin}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Admin User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Admin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingAdmin.fullName}
                  onChange={(e) => setEditingAdmin({...editingAdmin, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingAdmin.email}
                  onChange={(e) => setEditingAdmin({...editingAdmin, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editingAdmin.role}
                  onChange={(e) => setEditingAdmin({...editingAdmin, role: e.target.value as UserRole})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="group-admin">Group Admin</option>
                  <option value="product-admin">Product Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select
                  value={editingAdmin.region}
                  onChange={(e) => setEditingAdmin({...editingAdmin, region: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingAdmin(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateAdmin(editingAdmin)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};