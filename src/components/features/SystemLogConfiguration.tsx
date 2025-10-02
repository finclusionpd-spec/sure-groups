import React, { useState } from 'react';
import { 
  FileText, 
  Settings, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Database,
  Server,
  Shield,
  Activity,
  RefreshCw
} from 'lucide-react';

export const SystemLogConfiguration: React.FC = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '2024-01-15 14:30:15.123',
      level: 'INFO',
      service: 'Web Application',
      message: 'User authentication successful',
      userId: 'USR001',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      requestId: 'req_abc123'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:30:12.456',
      level: 'WARN',
      service: 'Database',
      message: 'Connection pool near capacity',
      userId: null,
      ipAddress: '10.0.0.5',
      userAgent: null,
      requestId: 'req_def456'
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:30:08.789',
      level: 'ERROR',
      service: 'Payment Processing',
      message: 'Payment gateway timeout',
      userId: 'USR002',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0...',
      requestId: 'req_ghi789'
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:30:05.012',
      level: 'DEBUG',
      service: 'API Gateway',
      message: 'Request processed successfully',
      userId: 'USR003',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0...',
      requestId: 'req_jkl012'
    },
    {
      id: 5,
      timestamp: '2024-01-15 14:29:58.345',
      level: 'INFO',
      service: 'Email Service',
      message: 'Email sent successfully',
      userId: 'USR001',
      ipAddress: '10.0.0.3',
      userAgent: null,
      requestId: 'req_mno345'
    }
  ]);

  const [configurations, setConfigurations] = useState([
    {
      id: 1,
      name: 'Web Application Logs',
      service: 'Web Application',
      level: 'INFO',
      retention: '30 days',
      enabled: true,
      lastModified: '2024-01-15 10:30'
    },
    {
      id: 2,
      name: 'Database Logs',
      service: 'Database',
      level: 'WARN',
      retention: '90 days',
      enabled: true,
      lastModified: '2024-01-14 16:45'
    },
    {
      id: 3,
      name: 'API Gateway Logs',
      service: 'API Gateway',
      level: 'DEBUG',
      retention: '7 days',
      enabled: false,
      lastModified: '2024-01-13 14:20'
    },
    {
      id: 4,
      name: 'Security Logs',
      service: 'Security',
      level: 'ERROR',
      retention: '1 year',
      enabled: true,
      lastModified: '2024-01-12 09:15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterService, setFilterService] = useState('All');
  const [activeTab, setActiveTab] = useState('logs');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'All' || log.level === filterLevel;
    const matchesService = filterService === 'All' || log.service === filterService;
    return matchesSearch && matchesLevel && matchesService;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-600 bg-red-100';
      case 'WARN': return 'text-yellow-600 bg-yellow-100';
      case 'INFO': return 'text-blue-600 bg-blue-100';
      case 'DEBUG': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <AlertTriangle className="w-4 h-4" />;
      case 'WARN': return <AlertTriangle className="w-4 h-4" />;
      case 'INFO': return <Info className="w-4 h-4" />;
      case 'DEBUG': return <Activity className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">System Log & Configuration</h1>
        <p className="text-gray-600">Monitor system logs and configure logging settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              System Logs
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'config'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Log Configuration
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
                  placeholder={`Search ${activeTab === 'logs' ? 'logs' : 'configurations'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {activeTab === 'logs' && (
                <>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Levels</option>
                    <option value="ERROR">ERROR</option>
                    <option value="WARN">WARN</option>
                    <option value="INFO">INFO</option>
                    <option value="DEBUG">DEBUG</option>
                  </select>
                  <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Services</option>
                    <option value="Web Application">Web Application</option>
                    <option value="Database">Database</option>
                    <option value="API Gateway">API Gateway</option>
                    <option value="Payment Processing">Payment Processing</option>
                    <option value="Email Service">Email Service</option>
                  </select>
                </>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(log.level)}`}>
                        {getLevelIcon(log.level)}
                        {log.level}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{log.service}</span>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-900">{log.message}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">User ID:</span> {log.userId || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">IP:</span> {log.ipAddress}
                    </div>
                    <div>
                      <span className="font-medium">Request ID:</span> {log.requestId}
                    </div>
                    <div>
                      <span className="font-medium">User Agent:</span> {log.userAgent ? 'Present' : 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              {configurations.map((config) => (
                <div key={config.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                      <p className="text-gray-600">{config.service}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        config.enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {config.enabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Log Level</h4>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {config.level}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Retention</h4>
                      <p className="text-sm text-gray-600">{config.retention}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Last Modified</h4>
                      <p className="text-sm text-gray-600">{config.lastModified}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-900 p-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-2">
                      <Settings className="w-4 h-4" />
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
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
              </div>
            </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Errors</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(l => l.level === 'ERROR').length}
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
              <p className="text-sm font-medium text-gray-500">Warnings</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(l => l.level === 'WARN').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Configurations</p>
              <p className="text-2xl font-bold text-gray-900">{configurations.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
