import React, { useState } from 'react';
import { 
  Code, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Key,
  Activity,
  Shield,
  Zap,
  Database
} from 'lucide-react';

export const APIIntegrationManagement: React.FC = () => {
  const [apiIntegrations, setApiIntegrations] = useState([
    {
      id: 1,
      name: 'User Management API',
      description: 'Complete user CRUD operations and authentication',
      version: 'v2.1.0',
      status: 'Active',
      endpoints: 15,
      requests: 125000,
      lastUpdated: '2024-01-15 14:30',
      rateLimit: '1000/hour',
      health: 'Healthy'
    },
    {
      id: 2,
      name: 'Payment Processing API',
      description: 'Secure payment handling and transaction management',
      version: 'v1.8.2',
      status: 'Active',
      endpoints: 8,
      requests: 89000,
      lastUpdated: '2024-01-15 13:45',
      rateLimit: '500/hour',
      health: 'Healthy'
    },
    {
      id: 3,
      name: 'Analytics Data API',
      description: 'Real-time analytics and reporting data access',
      version: 'v3.0.1',
      status: 'Maintenance',
      endpoints: 12,
      requests: 45000,
      lastUpdated: '2024-01-14 09:20',
      rateLimit: '200/hour',
      health: 'Degraded'
    },
    {
      id: 4,
      name: 'Legacy Integration API',
      description: 'Backward compatibility for legacy systems',
      version: 'v1.0.0',
      status: 'Deprecated',
      endpoints: 6,
      requests: 5000,
      lastUpdated: '2024-01-10 16:15',
      rateLimit: '100/hour',
      health: 'Unknown'
    }
  ]);

  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API Key',
      key: 'sk_live_...a1b2c3',
      environment: 'Production',
      permissions: ['read', 'write'],
      lastUsed: '2024-01-15 14:25',
      requests: 45000,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'sk_test_...x9y8z7',
      environment: 'Development',
      permissions: ['read'],
      lastUsed: '2024-01-15 10:30',
      requests: 12000,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Staging API Key',
      key: 'sk_staging_...m5n6o7',
      environment: 'Staging',
      permissions: ['read', 'write', 'admin'],
      lastUsed: '2024-01-14 16:45',
      requests: 8500,
      status: 'Inactive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('apis');

  const filteredAPIs = apiIntegrations.filter(api =>
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Deprecated': return 'bg-gray-100 text-gray-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />;
      case 'Maintenance': return <Clock className="w-4 h-4" />;
      case 'Deprecated': return <AlertTriangle className="w-4 h-4" />;
      case 'Inactive': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy': return 'text-green-600';
      case 'Degraded': return 'text-yellow-600';
      case 'Unknown': return 'text-gray-600';
      case 'Unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">API Integration Management</h1>
        <p className="text-gray-600">Manage internal APIs, endpoints, and API key access</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('apis')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'apis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              API Endpoints
            </button>
            <button
              onClick={() => setActiveTab('keys')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'keys'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              API Keys
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
                  placeholder={`Search ${activeTab === 'apis' ? 'APIs' : 'API keys'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {activeTab === 'apis' && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Deprecated">Deprecated</option>
                </select>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add {activeTab === 'apis' ? 'API' : 'Key'}
              </button>
            </div>
          </div>

          {/* APIs Tab */}
          {activeTab === 'apis' && (
            <div className="space-y-4">
              {filteredAPIs.map((api) => (
                <div key={api.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{api.name}</h3>
                      <p className="text-gray-600">{api.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Version {api.version}</div>
                      <div className="text-sm text-gray-500">{api.endpoints} endpoints</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(api.status)}`}>
                        {getStatusIcon(api.status)}
                        {api.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Health</h4>
                      <span className={`text-sm font-medium ${getHealthColor(api.health)}`}>
                        {api.health}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Rate Limit</h4>
                      <p className="text-sm text-gray-600">{api.rateLimit}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Requests</h4>
                      <p className="text-sm text-gray-600">{api.requests.toLocaleString()}</p>
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
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'keys' && (
            <div className="space-y-4">
              {filteredKeys.map((key) => (
                <div key={key.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{key.name}</h3>
                      <p className="text-gray-600 font-mono text-sm">{key.key}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{key.environment}</div>
                      <div className="text-sm text-gray-500">{key.requests.toLocaleString()} requests</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions</h4>
                      <div className="flex gap-1">
                        {key.permissions.map((permission, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        key.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {key.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Last Used</h4>
                      <p className="text-sm text-gray-600">{key.lastUsed}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-900 p-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-2">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total APIs</p>
              <p className="text-2xl font-bold text-gray-900">{apiIntegrations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active APIs</p>
              <p className="text-2xl font-bold text-gray-900">
                {apiIntegrations.filter(api => api.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Key className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">API Keys</p>
              <p className="text-2xl font-bold text-gray-900">{apiKeys.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {apiIntegrations.reduce((sum, api) => sum + api.requests, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
