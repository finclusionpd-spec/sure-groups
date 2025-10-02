import React, { useState } from 'react';
import { 
  Plug, 
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
  Shield
} from 'lucide-react';

export const ThirdPartyIntegrationManagement: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Stripe Payment Gateway',
      description: 'Payment processing and subscription management',
      provider: 'Stripe Inc.',
      category: 'Payment',
      status: 'Active',
      lastSync: '2024-01-15 14:30',
      apiVersion: 'v2020-08-27',
      endpoints: 12,
      health: 'Healthy'
    },
    {
      id: 2,
      name: 'SendGrid Email Service',
      description: 'Transactional and marketing email delivery',
      provider: 'Twilio SendGrid',
      category: 'Communication',
      status: 'Active',
      lastSync: '2024-01-15 13:45',
      apiVersion: 'v3',
      endpoints: 8,
      health: 'Healthy'
    },
    {
      id: 3,
      name: 'AWS S3 Storage',
      description: 'File storage and content delivery',
      provider: 'Amazon Web Services',
      category: 'Storage',
      status: 'Warning',
      lastSync: '2024-01-14 09:20',
      apiVersion: '2006-03-01',
      endpoints: 15,
      health: 'Degraded'
    },
    {
      id: 4,
      name: 'Google Analytics',
      description: 'Website and app analytics tracking',
      provider: 'Google LLC',
      category: 'Analytics',
      status: 'Inactive',
      lastSync: '2024-01-10 16:15',
      apiVersion: 'v4',
      endpoints: 6,
      health: 'Unknown'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || integration.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || integration.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />;
      case 'Warning': return <AlertTriangle className="w-4 h-4" />;
      case 'Inactive': return <Clock className="w-4 h-4" />;
      case 'Error': return <AlertTriangle className="w-4 h-4" />;
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Third Party Integration Management</h1>
        <p className="text-gray-600">Manage external service integrations and API connections</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Warning">Warning</option>
              <option value="Inactive">Inactive</option>
              <option value="Error">Error</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              <option value="Payment">Payment</option>
              <option value="Communication">Communication</option>
              <option value="Storage">Storage</option>
              <option value="Analytics">Analytics</option>
              <option value="Security">Security</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Integration
            </button>
          </div>
        </div>
      </div>

      {/* Integrations List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Integration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sync
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIntegrations.map((integration) => (
                <tr key={integration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{integration.name}</div>
                      <div className="text-sm text-gray-500">{integration.description}</div>
                      <div className="text-xs text-gray-400">API v{integration.apiVersion} • {integration.endpoints} endpoints</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {integration.provider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {integration.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integration.status)}`}>
                      {getStatusIcon(integration.status)}
                      {integration.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getHealthColor(integration.health)}`}>
                      {integration.health}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {integration.lastSync}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Health Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Health Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                <span className={`w-3 h-3 rounded-full ${
                  integration.health === 'Healthy' ? 'bg-green-500' :
                  integration.health === 'Degraded' ? 'bg-yellow-500' :
                  integration.health === 'Unknown' ? 'bg-gray-500' : 'bg-red-500'
                }`}></span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{integration.provider}</p>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Status: {integration.status}</span>
                <span>{integration.endpoints} endpoints</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plug className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Integrations</p>
              <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
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
                {integrations.filter(i => i.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Issues</p>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.filter(i => i.status === 'Warning' || i.health === 'Degraded').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Endpoints</p>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.reduce((sum, i) => sum + i.endpoints, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
