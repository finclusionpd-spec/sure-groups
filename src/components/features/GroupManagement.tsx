import React, { useState, useRef } from 'react';
import { Search, Users, Calendar, Settings, Eye, Edit, Trash2, Plus, Upload, X, CheckCircle } from 'lucide-react';
import { GroupData } from '../../types';
import { GroupDetailView } from './GroupDetailView';

export const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<GroupData[]>([
    {
      id: '1',
      name: 'Community Church',
      description: 'Main church community group for worship and fellowship',
      type: 'church',
      memberCount: 245,
      status: 'active',
      createdBy: 'Pastor John',
      createdAt: '2025-01-01T00:00:00Z',
      profileImage: 'https://images.pexels.com/photos/208359/pexels-photo-208359.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Youth Ministry',
      description: 'Youth group for teenagers and young adults',
      type: 'church',
      memberCount: 67,
      status: 'active',
      createdBy: 'Youth Pastor Sarah',
      createdAt: '2025-01-05T00:00:00Z',
      profileImage: 'https://images.pexels.com/photos/270789/pexels-photo-270789.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Local Union Chapter',
      description: 'Workers union for local manufacturing employees',
      type: 'union',
      memberCount: 156,
      status: 'active',
      createdBy: 'Union Rep Mike',
      createdAt: '2025-01-10T00:00:00Z',
      profileImage: 'https://images.pexels.com/photos/3182822/pexels-photo-3182822.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'church' | 'union' | 'association' | 'community'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    type: 'community' as GroupData['type'],
    rules: '',
    logo: null as File | null
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || group.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newGroup.name.trim()) {
      errors.name = 'Group name is required';
    }
    if (!newGroup.description.trim()) {
      errors.description = 'Group description is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogoSelect = (file: File) => {
    setNewGroup({ ...newGroup, logo: file });
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateGroup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const group: GroupData = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      type: newGroup.type,
      memberCount: 0,
      status: 'active',
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      profileImage: logoPreview || 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=640'
    };
    
    setGroups([group, ...groups]);
    setNewGroup({ name: '', description: '', type: 'community', rules: '', logo: null });
    setLogoPreview(null);
    setShowCreateModal(false);
    setShowSuccess(true);
    setIsCreating(false);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resetForm = () => {
    setNewGroup({ name: '', description: '', type: 'community', rules: '', logo: null });
    setLogoPreview(null);
    setValidationErrors({});
  };

  const handleViewGroup = (group: GroupData) => {
    setSelectedGroup(group);
    setShowDetailView(true);
  };

  const handleUpdateGroup = (updatedGroup: GroupData) => {
    setGroups(groups.map(group => 
      group.id === updatedGroup.id ? updatedGroup : group
    ));
    setSelectedGroup(updatedGroup);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedGroup(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

  const toggleGroupStatus = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, status: group.status === 'active' ? 'inactive' : 'active' }
        : group
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'church': return 'bg-blue-100 text-blue-700';
      case 'union': return 'bg-red-100 text-red-700';
      case 'association': return 'bg-purple-100 text-purple-700';
      case 'community': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const totalMembers = groups.reduce((sum, group) => sum + group.memberCount, 0);
  const activeGroups = groups.filter(g => g.status === 'active').length;

  // Show detail view if a group is selected
  if (showDetailView && selectedGroup) {
    return (
      <GroupDetailView
        group={selectedGroup}
        onBack={handleBackToList}
        onUpdateGroup={handleUpdateGroup}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Group Management</h1>
            <p className="text-gray-600">Create and manage community groups</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700">Your group has been created successfully.</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Groups</p>
              <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
            </div>
            <Users className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Groups</p>
              <p className="text-2xl font-bold text-emerald-600">{activeGroups}</p>
            </div>
            <Users className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-blue-600">{totalMembers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Members/Group</p>
              <p className="text-2xl font-bold text-purple-600">
                {groups.length > 0 ? Math.round(totalMembers / groups.length) : 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="church">Church</option>
            <option value="union">Union</option>
            <option value="association">Association</option>
            <option value="community">Community</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {groups.length === 0 ? "You haven't created any groups yet" : "No groups found"}
          </h3>
          <p className="text-gray-600 mb-6">
            {groups.length === 0 
              ? "Click 'Create Group' to get started with your first community group."
              : "Try adjusting your search or filter criteria to see more results."
            }
          </p>
          {groups.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={group.profileImage || 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=640'}
                alt={`${group.name} profile`}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(group.type)}`}>
                      {group.type}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(group.status)}`}>
                      {group.status}
                    </span>
                  </div>
                </div>
              </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4 px-6">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{group.memberCount} members</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="text-xs text-gray-400 mb-4 px-6">Created by {group.createdBy}</div>

            <div className="flex items-center justify-between px-6 pb-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewGroup(group)}
                  className="text-blue-600 hover:text-blue-900"
                  title="View Group Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => toggleGroupStatus(group.id)}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  group.status === 'active' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                {group.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Group</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Group Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter group name"
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                  )}
                </div>

                {/* Group Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Type *
                  </label>
                  <select
                    value={newGroup.type}
                    onChange={(e) => setNewGroup({...newGroup, type: e.target.value as GroupData['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="community">Community</option>
                    <option value="church">Church</option>
                    <option value="union">Union</option>
                    <option value="association">Association</option>
                    <option value="cooperative">Cooperative</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>

                {/* Group Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Description *
                  </label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    rows={4}
                    placeholder="Describe the group's purpose and activities"
                  />
                  {validationErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                  )}
                </div>

                {/* Group Rules/Guidelines */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Rules/Guidelines (Optional)
                  </label>
                  <textarea
                    value={newGroup.rules}
                    onChange={(e) => setNewGroup({...newGroup, rules: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter group rules, guidelines, or expectations"
                  />
                </div>

                {/* Group Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Logo/Image (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoSelect(file);
                        }}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </button>
                    </div>
                    {logoPreview && (
                      <div className="flex items-center space-x-2">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setLogoPreview(null);
                            setNewGroup({...newGroup, logo: null});
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended size: 400x400px. Supports JPG, PNG, and GIF formats.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={isCreating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};