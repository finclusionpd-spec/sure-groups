import React, { useState } from 'react';
import { 
  Wrench, 
  Code, 
  Play, 
  Square, 
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
  Database,
  Zap,
  Shield,
  Activity,
  Terminal
} from 'lucide-react';

export const DeveloperToolsSandboxManagement: React.FC = () => {
  const [sandboxEnvironments, setSandboxEnvironments] = useState([
    {
      id: 1,
      name: 'Development Sandbox',
      description: 'Primary development environment for testing',
      status: 'Running',
      version: 'v2.1.0',
      lastActivity: '2024-01-15 14:30',
      users: 12,
      resources: '2 CPU, 4GB RAM',
      health: 'Healthy'
    },
    {
      id: 2,
      name: 'Staging Sandbox',
      description: 'Pre-production testing environment',
      status: 'Running',
      version: 'v2.1.0',
      lastActivity: '2024-01-15 13:45',
      users: 8,
      resources: '4 CPU, 8GB RAM',
      health: 'Healthy'
    },
    {
      id: 3,
      name: 'API Testing Sandbox',
      description: 'Dedicated environment for API testing',
      status: 'Stopped',
      version: 'v2.0.5',
      lastActivity: '2024-01-14 09:20',
      users: 0,
      resources: '1 CPU, 2GB RAM',
      health: 'Unknown'
    },
    {
      id: 4,
      name: 'Load Testing Sandbox',
      description: 'High-performance testing environment',
      status: 'Maintenance',
      version: 'v2.1.0',
      lastActivity: '2024-01-15 10:15',
      users: 3,
      resources: '8 CPU, 16GB RAM',
      health: 'Degraded'
    }
  ]);

  const [developerTools, setDeveloperTools] = useState([
    {
      id: 1,
      name: 'API Explorer',
      description: 'Interactive API testing and documentation tool',
      category: 'Testing',
      status: 'Active',
      users: 25,
      lastUpdated: '2024-01-15 14:30'
    },
    {
      id: 2,
      name: 'Code Generator',
      description: 'Generate SDKs and client libraries',
      category: 'Development',
      status: 'Active',
      users: 18,
      lastUpdated: '2024-01-15 13:45'
    },
    {
      id: 3,
      name: 'Debug Console',
      description: 'Real-time debugging and logging tool',
      category: 'Debugging',
      status: 'Active',
      users: 32,
      lastUpdated: '2024-01-15 12:20'
    },
    {
      id: 4,
      name: 'Performance Monitor',
      description: 'Monitor API performance and metrics',
      category: 'Monitoring',
      status: 'Maintenance',
      users: 15,
      lastUpdated: '2024-01-14 16:30'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('sandboxes');

  const filteredSandboxes = sandboxEnvironments.filter(sandbox =>
    sandbox.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sandbox.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTools = developerTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return 'bg-green-100 text-green-800';
      case 'Stopped': return 'bg-gray-100 text-gray-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Running': return <Play className="w-4 h-4" />;
      case 'Stopped': return <Square className="w-4 h-4" />;
      case 'Maintenance': return <Clock className="w-4 h-4" />;
      case 'Active': return <CheckCircle className="w-4 h-4" />;
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Developer Tools and Sandbox Management</h1>
        <p className="text-gray-600">Manage development environments and developer tools</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('sandboxes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sandboxes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sandbox Environments
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tools'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Developer Tools
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
                  placeholder={`Search ${activeTab === 'sandboxes' ? 'sandboxes' : 'tools'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {activeTab === 'sandboxes' && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Running">Running</option>
                  <option value="Stopped">Stopped</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add {activeTab === 'sandboxes' ? 'Sandbox' : 'Tool'}
              </button>
            </div>
          </div>

          {/* Sandboxes Tab */}
          {activeTab === 'sandboxes' && (
            <div className="space-y-4">
              {filteredSandboxes.map((sandbox) => (
                <div key={sandbox.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{sandbox.name}</h3>
                      <p className="text-gray-600">{sandbox.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Version {sandbox.version}</div>
                      <div className="text-sm text-gray-500">{sandbox.users} active users</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sandbox.status)}`}>
                        {getStatusIcon(sandbox.status)}
                        {sandbox.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Health</h4>
                      <span className={`text-sm font-medium ${getHealthColor(sandbox.health)}`}>
                        {sandbox.health}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Resources</h4>
                      <p className="text-sm text-gray-600">{sandbox.resources}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Last Activity</h4>
                      <p className="text-sm text-gray-600">{sandbox.lastActivity}</p>
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

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                      <p className="text-gray-600">{tool.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{tool.category}</div>
                      <div className="text-sm text-gray-500">{tool.users} users</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tool.status)}`}>
                        {getStatusIcon(tool.status)}
                        {tool.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Category</h4>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {tool.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Last Updated</h4>
                      <p className="text-sm text-gray-600">{tool.lastUpdated}</p>
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
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sandbox Environments</p>
              <p className="text-2xl font-bold text-gray-900">{sandboxEnvironments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Running</p>
              <p className="text-2xl font-bold text-gray-900">
                {sandboxEnvironments.filter(s => s.status === 'Running').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Wrench className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Developer Tools</p>
              <p className="text-2xl font-bold text-gray-900">{developerTools.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {sandboxEnvironments.reduce((sum, s) => sum + s.users, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
