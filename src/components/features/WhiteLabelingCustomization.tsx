import React, { useState } from 'react';
import { 
  Palette, 
  Settings, 
  Eye, 
  Save, 
  Upload, 
  Download, 
  Trash2, 
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Image,
  Type,
  Layout,
  Circle
} from 'lucide-react';

export const WhiteLabelingCustomization: React.FC = () => {
  const [customizations, setCustomizations] = useState([
    {
      id: 1,
      name: 'Corporate Branding',
      client: 'Acme Corporation',
      status: 'Active',
      lastModified: '2024-01-15 14:30',
      createdBy: 'Super Admin',
      logo: 'acme-logo.png',
      primaryColor: '#1E40AF',
      secondaryColor: '#3B82F6',
      fontFamily: 'Inter',
      customDomain: 'acme.suregroups.com'
    },
    {
      id: 2,
      name: 'Non-Profit Theme',
      client: 'Green Earth Foundation',
      status: 'Draft',
      lastModified: '2024-01-14 10:15',
      createdBy: 'Super Admin',
      logo: 'green-earth-logo.png',
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      fontFamily: 'Roboto',
      customDomain: 'greenearth.suregroups.com'
    },
    {
      id: 3,
      name: 'Educational Platform',
      client: 'Tech University',
      status: 'Active',
      lastModified: '2024-01-13 16:45',
      createdBy: 'Super Admin',
      logo: 'tech-uni-logo.png',
      primaryColor: '#7C3AED',
      secondaryColor: '#8B5CF6',
      fontFamily: 'Open Sans',
      customDomain: 'techuniversity.suregroups.com'
    },
    {
      id: 4,
      name: 'Healthcare Portal',
      client: 'MediCare Plus',
      status: 'Inactive',
      lastModified: '2024-01-12 09:20',
      createdBy: 'Super Admin',
      logo: 'medicare-logo.png',
      primaryColor: '#DC2626',
      secondaryColor: '#EF4444',
      fontFamily: 'Lato',
      customDomain: 'medicare.suregroups.com'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('customizations');

  const filteredCustomizations = customizations.filter(customization => {
    const matchesSearch = customization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customization.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || customization.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />;
      case 'Draft': return <Clock className="w-4 h-4" />;
      case 'Inactive': return <AlertTriangle className="w-4 h-4" />;
      case 'Archived': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">White Labelling & Platform Customization Management</h1>
        <p className="text-gray-600">Manage white-label customizations and platform branding for clients</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('customizations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'customizations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Customizations
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Assets
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {activeTab === 'customizations' && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Archived">Archived</option>
                </select>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                New {activeTab === 'customizations' ? 'Customization' : activeTab === 'templates' ? 'Template' : 'Asset'}
              </button>
            </div>
          </div>

          {/* Customizations Tab */}
          {activeTab === 'customizations' && (
            <div className="space-y-4">
              {filteredCustomizations.map((customization) => (
                <div key={customization.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{customization.name}</h3>
                      <p className="text-gray-600">{customization.client}</p>
                      <p className="text-xs text-gray-500">By {customization.createdBy} • {customization.lastModified}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customization.status)}`}>
                        {getStatusIcon(customization.status)}
                        {customization.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Brand Colors</h4>
                      <div className="flex gap-2">
                        <div 
                          className="w-6 h-6 rounded border border-gray-300" 
                          style={{ backgroundColor: customization.primaryColor }}
                        ></div>
                        <div 
                          className="w-6 h-6 rounded border border-gray-300" 
                          style={{ backgroundColor: customization.secondaryColor }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Typography</h4>
                      <p className="text-sm text-gray-600">{customization.fontFamily}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Logo</h4>
                      <p className="text-sm text-gray-600">{customization.logo}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Domain</h4>
                      <p className="text-sm text-gray-600">{customization.customDomain}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-900 p-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-2">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-2">
                      <Save className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Layout className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Corporate Theme</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Professional corporate branding template with clean design</p>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Use Template
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Preview
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Palette className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Non-Profit Theme</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Warm and welcoming design for non-profit organizations</p>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Use Template
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Preview
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Type className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Educational Theme</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Modern design perfect for educational institutions</p>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Use Template
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Logos</h4>
                  <p className="text-xs text-gray-500">12 files</p>
                </div>
                
                 <div className="border border-gray-200 rounded-lg p-4 text-center">
                   <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                     <Circle className="w-8 h-8 text-gray-400" />
                   </div>
                   <h4 className="text-sm font-medium text-gray-900 mb-1">Color Palettes</h4>
                   <p className="text-xs text-gray-500">8 files</p>
                 </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Type className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Fonts</h4>
                  <p className="text-xs text-gray-500">15 files</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Layout className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Templates</h4>
                  <p className="text-xs text-gray-500">6 files</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Palette className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customizations</p>
              <p className="text-2xl font-bold text-gray-900">{customizations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {customizations.filter(c => c.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {customizations.filter(c => c.status === 'Draft').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Templates</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
