import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Database,
  Server,
  Globe,
  Shield,
  Zap,
  BarChart3,
  RefreshCw
} from 'lucide-react';

export const SystemHealthCheck: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    overallHealth: 'Healthy',
    uptime: '99.9%',
    responseTime: '120ms',
    errorRate: '0.1%',
    activeUsers: 1247,
    totalRequests: 2450000
  });

  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Web Application',
      status: 'Healthy',
      uptime: '99.9%',
      responseTime: '95ms',
      lastCheck: '2024-01-15 14:30:15',
      dependencies: ['Database', 'Redis', 'CDN']
    },
    {
      id: 2,
      name: 'API Gateway',
      status: 'Healthy',
      uptime: '99.8%',
      responseTime: '45ms',
      lastCheck: '2024-01-15 14:30:12',
      dependencies: ['Load Balancer', 'Authentication Service']
    },
    {
      id: 3,
      name: 'Database',
      status: 'Warning',
      uptime: '99.5%',
      responseTime: '180ms',
      lastCheck: '2024-01-15 14:30:08',
      dependencies: ['Storage', 'Backup Service']
    },
    {
      id: 4,
      name: 'Payment Processing',
      status: 'Healthy',
      uptime: '99.9%',
      responseTime: '200ms',
      lastCheck: '2024-01-15 14:30:10',
      dependencies: ['Stripe API', 'Fraud Detection']
    },
    {
      id: 5,
      name: 'Email Service',
      status: 'Healthy',
      uptime: '99.7%',
      responseTime: '300ms',
      lastCheck: '2024-01-15 14:30:05',
      dependencies: ['SendGrid API', 'Queue Service']
    },
    {
      id: 6,
      name: 'File Storage',
      status: 'Healthy',
      uptime: '99.9%',
      responseTime: '150ms',
      lastCheck: '2024-01-15 14:30:18',
      dependencies: ['AWS S3', 'CDN']
    }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Database Response Time High',
      message: 'Database response time is above normal threshold (180ms vs 150ms)',
      timestamp: '2024-01-15 14:25:30',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'Scheduled Maintenance Complete',
      message: 'Database optimization completed successfully',
      timestamp: '2024-01-15 12:00:00',
      severity: 'low'
    },
    {
      id: 3,
      type: 'success',
      title: 'High Traffic Handled',
      message: 'System successfully handled 50% increase in traffic',
      timestamp: '2024-01-15 10:30:00',
      severity: 'low'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'text-green-600 bg-green-100';
      case 'Warning': return 'text-yellow-600 bg-yellow-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'Unknown': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Healthy': return <CheckCircle className="w-5 h-5" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5" />;
      case 'Critical': return <XCircle className="w-5 h-5" />;
      case 'Unknown': return <Clock className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">System Health Check (Analytics)</h1>
            <p className="text-gray-600">Monitor system performance and health metrics</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overall Health Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Overall System Health</h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(systemMetrics.overallHealth)}`}>
            {getStatusIcon(systemMetrics.overallHealth)}
            <span className="font-medium">{systemMetrics.overallHealth}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemMetrics.uptime}</p>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemMetrics.responseTime}</p>
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemMetrics.errorRate}</p>
            <p className="text-sm text-gray-600">Error Rate</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemMetrics.activeUsers.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h2>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                    <p className="text-xs text-gray-500">Last check: {service.lastCheck}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{service.uptime}</div>
                  <div className="text-xs text-gray-500">Uptime</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Response Time</p>
                  <p className="text-sm font-medium text-gray-900">{service.responseTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Dependencies</p>
                  <div className="flex flex-wrap gap-1">
                    {service.dependencies.map((dep, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                    {service.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}>
              <div className="flex-shrink-0 mt-1">
                {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                {alert.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
                {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                <p className="text-xs text-gray-500">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1">{alert.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400">Last 24 hours: 120ms avg</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Rate Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingDown className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400">Last 24 hours: 0.1% avg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
