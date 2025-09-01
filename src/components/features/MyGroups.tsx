import React, { useState } from 'react';
import { Search, Users, Plus, MessageSquare, Settings, Eye } from 'lucide-react';

interface MyGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  location: string;
  tier: 'basic' | 'premium' | 'enterprise';
  isJoined: boolean;
  role: 'admin' | 'moderator' | 'member';
  joinDate?: string;
  lastActivity: string;
  unreadMessages: number;
  upcomingEvents: number;
  imageUrl: string;
  tags: string[];
  isVerified: boolean;
  isActive: boolean;
}

interface AvailableGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  location: string;
  rating: number;
  isPrivate: boolean;
  requiresApproval: boolean;
  tags: string[];
  adminName: string;
  createdDate: string;
  profileImage: string;
}

export const MyGroups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover' | 'invites'>('my-groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [myGroups] = useState<MyGroup[]>([
    {
      id: '1',
      name: 'Tech Workers Union',
      description: 'Advocating for fair wages and working conditions in the tech industry',
      category: 'Professional',
      memberCount: 1247,
      location: 'Lagos, Nigeria',
      tier: 'enterprise',
      isJoined: true,
      role: 'member',
      joinDate: '2024-12-01',
      lastActivity: '2025-01-14T10:30:00Z',
      unreadMessages: 5,
      upcomingEvents: 2,
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Verified', 'Premium', 'Active'],
      isVerified: true,
      isActive: true
    },
    {
      id: '2',
      name: 'Neighborhood Watch',
      description: 'Keeping our community safe and connected',
      category: 'Residential',
      memberCount: 89,
      location: 'Abuja, Nigeria',
      tier: 'basic',
      isJoined: true,
      role: 'moderator',
      joinDate: '2024-12-15',
      lastActivity: '2025-01-14T08:15:00Z',
      unreadMessages: 3,
      upcomingEvents: 1,
      imageUrl: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Local', 'Active'],
      isVerified: false,
      isActive: true
    },
    {
      id: '3',
      name: 'St. Matthews Church',
      description: 'Faith community serving downtown area',
      category: 'Church',
      memberCount: 342,
      location: 'Port Harcourt, Nigeria',
      tier: 'premium',
      isJoined: true,
      role: 'member',
      joinDate: '2025-01-05',
      lastActivity: '2025-01-13T16:45:00Z',
      unreadMessages: 1,
      upcomingEvents: 3,
      imageUrl: 'https://images.pexels.com/photos/208359/pexels-photo-208359.jpeg?auto=compress&cs=tinysrgb&w=600',
      tags: ['Verified', 'Community'],
      isVerified: true,
      isActive: true
    }
  ]);

  const [availableGroups] = useState<AvailableGroup[]>([
    {
      id: '4',
      name: 'Tech Innovators Hub',
      description: 'A community for technology professionals and entrepreneurs',
      category: 'Professional',
      memberCount: 234,
      location: 'Lagos, Nigeria',
      rating: 4.8,
      isPrivate: false,
      requiresApproval: true,
      tags: ['Technology', 'Innovation', 'Networking'],
      adminName: 'John Doe',
      createdDate: '2024-12-01',
      profileImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: '5',
      name: 'Fitness Warriors',
      description: 'Stay fit and healthy with our supportive fitness community',
      category: 'Health',
      memberCount: 156,
      location: 'Abuja, Nigeria',
      rating: 4.6,
      isPrivate: false,
      requiresApproval: false,
      tags: ['Fitness', 'Health', 'Motivation'],
      adminName: 'Sarah Johnson',
      createdDate: '2024-11-15',
      profileImage: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ]);

  const [joinRequests, setJoinRequests] = useState<string[]>([]);

  const filteredMyGroups = myGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || group.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredAvailableGroups = availableGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || group.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleJoinGroup = (groupId: string) => {
    setJoinRequests([...joinRequests, groupId]);
  };

  const handleLeaveGroup = (groupId: string) => {
    console.log('Leaving group:', groupId);
    alert('Left group successfully');
  };

  const categories = ['all', 'Professional', 'Residential', 'Church', 'Health', 'Community Service', 'Sports'];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-100 text-purple-700';
      case 'premium': return 'bg-blue-100 text-blue-700';
      case 'basic': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'verified': return 'bg-blue-100 text-blue-700';
      case 'premium': return 'bg-purple-100 text-purple-700';
      case 'active': return 'bg-green-100 text-green-700';
      case 'local': return 'bg-orange-100 text-orange-700';
      case 'community': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const totalUnreadMessages = myGroups.reduce((sum, group) => sum + group.unreadMessages, 0);
  const totalUpcomingEvents = myGroups.reduce((sum, group) => sum + group.upcomingEvents, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Groups</h1>
            <p className="text-gray-600">Manage and organize your community groups</p>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-200 flex items-center space-x-2 shadow-lg">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Group</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Groups</p>
              <p className="text-2xl font-bold text-blue-600">{myGroups.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-2xl font-bold text-green-600">{totalUnreadMessages}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-purple-600">{totalUpcomingEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Groups</p>
              <p className="text-2xl font-bold text-orange-600">{availableGroups.length}</p>
            </div>
            <Plus className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-groups')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-groups'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Groups ({myGroups.length})
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discover'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discover Groups ({availableGroups.length})
            </button>
            <button
              onClick={() => setActiveTab('invites')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Invitations
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* My Groups Tab */}
      {activeTab === 'my-groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMyGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group">
              {/* Group Image with Overlay */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={group.imageUrl} 
                  alt={group.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Tier Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTierColor(group.tier)} backdrop-blur-sm`}>
                    {group.tier}
                  </span>
                </div>

                {/* Group Icon/Logo */}
                {group.category === 'Church' && (
                  <div className="absolute top-4 left-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">⛪</span>
                    </div>
                  </div>
                )}
                {group.category === 'Professional' && (
                  <div className="absolute top-4 left-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">💼</span>
                    </div>
                  </div>
                )}
                {group.category === 'Residential' && (
                  <div className="absolute top-4 left-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🏠</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Group Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{group.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{group.description}</p>
                  </div>
                </div>

                {/* Member Count and Category */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="font-medium">{group.memberCount} members</span>
                  <span className="mx-2">•</span>
                  <span>{group.category}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.tags.map((tag, index) => (
                    <span key={index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Discover Groups Tab */}
      {activeTab === 'discover' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAvailableGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={group.profileImage} 
                  alt={group.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {group.isPrivate && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                      Private
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="font-medium">{group.memberCount} members</span>
                  <span className="mx-2">•</span>
                  <span>{group.category}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {group.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Admin: {group.adminName}
                  {group.requiresApproval && (
                    <span className="block mt-1 text-orange-600">Requires approval to join</span>
                  )}
                </div>

                <button
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={joinRequests.includes(group.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    joinRequests.includes(group.id)
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {joinRequests.includes(group.id) 
                    ? (group.requiresApproval ? 'Request Sent' : 'Joined') 
                    : (group.requiresApproval ? 'Request to Join' : 'Join Group')
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invitations Tab */}
      {activeTab === 'invites' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Invitations</h3>
          <p className="text-gray-500">You don't have any pending group invitations at the moment.</p>
        </div>
      )}
    </div>
  );
};