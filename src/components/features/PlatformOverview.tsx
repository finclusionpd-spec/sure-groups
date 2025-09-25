import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Server, 
  Database, 
  TrendingUp,
  BarChart3,
  Activity,
  DollarSign,
  MessageSquare,
  Calendar,
  ShoppingCart,
  Shield,
  Settings,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface PlatformMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  icon: React.ReactNode;
}

interface FeatureStatus {
  name: string;
  version: string;
  status: 'live' | 'testing' | 'development' | 'deprecated';
  description: string;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export const PlatformOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<PlatformMetric[]>([]);
  const [features, setFeatures] = useState<FeatureStatus[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock data for platform metrics
    const mockMetrics: PlatformMetric[] = [
      {
        title: 'Total Users',
        value: '24,891',
        change: '+12% growth',
        trend: 'up',
        color: 'bg-blue-500',
        icon: <Users className="w-6 h-6" />
      },
      {
        title: 'System Uptime',
        value: '99.9%',
        change: 'Above SLA',
        trend: 'up',
        color: 'bg-green-500',
        icon: <Server className="w-6 h-6" />
      },
      {
        title: 'API Requests',
        value: '2.4M',
        change: '+15% increase',
        trend: 'up',
        color: 'bg-purple-500',
        icon: <Database className="w-6 h-6" />
      },
      {
        title: 'Active Groups',
        value: '1,247',
        change: '+8% this month',
        trend: 'up',
        color: 'bg-orange-500',
        icon: <BarChart3 className="w-6 h-6" />
      },
      {
        title: 'Total Revenue',
        value: '₦2.4M',
        change: '+23% growth',
        trend: 'up',
        color: 'bg-green-500',
        icon: <DollarSign className="w-6 h-6" />
      },
      {
        title: 'Messages Today',
        value: '15,432',
        change: '+5% vs yesterday',
        trend: 'up',
        color: 'bg-blue-500',
        icon: <MessageSquare className="w-6 h-6" />
      },
      {
        title: 'Events This Week',
        value: '89',
        change: '+12 new events',
        trend: 'up',
        color: 'bg-purple-500',
        icon: <Calendar className="w-6 h-6" />
      },
      {
        title: 'Marketplace Orders',
        value: '342',
        change: '+18% this week',
        trend: 'up',
        color: 'bg-orange-500',
        icon: <ShoppingCart className="w-6 h-6" />
      }
    ];

    const mockFeatures: FeatureStatus[] = [
      {
        name: 'Enhanced Messaging',
        version: 'Version 2.1',
        status: 'live',
        description: 'Advanced messaging features with file sharing and reactions'
      },
      {
        name: 'Marketplace V3',
        version: 'Version 3.0',
        status: 'testing',
        description: 'Next-generation marketplace with improved vendor experience'
      },
      {
        name: 'Analytics Dashboard',
        version: 'Version 1.5',
        status: 'live',
        description: 'Comprehensive analytics and reporting tools'
      },
      {
        name: 'Mobile App',
        version: 'Version 2.0',
        status: 'development',
        description: 'Native mobile application for iOS and Android'
      },
      {
        name: 'Legacy API',
        version: 'Version 1.0',
        status: 'deprecated',
        description: 'Old API endpoints scheduled for removal'
      }
    ];

    const mockAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'info',
        message: 'Scheduled maintenance window: 2:00 AM - 4:00 AM UTC',
        timestamp: '2024-01-20 10:30',
        resolved: false
      },
      {
        id: '2',
        type: 'success',
        message: 'Database optimization completed successfully',
        timestamp: '2024-01-20 09:15',
        resolved: true
      },
      {
        id: '3',
        type: 'warning',
        message: 'High CPU usage detected on server-03',
        timestamp: '2024-01-20 08:45',
        resolved: false
      }
    ];

    setMetrics(mockMetrics);
    setFeatures(mockFeatures);
    setAlerts(mockAlerts);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate data refresh
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value.includes('%') ? metric.value : 
               metric.value.includes('₦') ? metric.value :
               (parseInt(metric.value.replace(/,/g, '')) + Math.floor(Math.random() * 100)).toLocaleString()
      })));
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-700';
      case 'testing': return 'bg-blue-100 text-blue-700';
      case 'development': return 'bg-yellow-100 text-yellow-700';
      case 'deprecated': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'info': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Overview</h1>
            <p className="text-gray-600">Monitor platform performance and key metrics</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Metrics Grid - Standardized Card Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <div className="flex items-center mt-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : metric.trend === 'down' ? (
                    <TrendingUp className="w-4 h-4 text-red-500 mr-1 rotate-180" />
                  ) : (
                    <Activity className="w-4 h-4 text-gray-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center text-white`}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Management and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Feature Rollout Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Rollout Status</h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{feature.name}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feature.status)}`}>
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{feature.version}</p>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start p-3 rounded-lg ${
                alert.resolved ? 'bg-gray-50' : 'bg-yellow-50'
              }`}>
                <div className="flex-shrink-0 mr-3 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                </div>
                {alert.resolved && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      Resolved
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Users className="w-6 h-6 text-blue-600 mr-3" />
            <span className="font-medium text-blue-900">Manage Users</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Shield className="w-6 h-6 text-green-600 mr-3" />
            <span className="font-medium text-green-900">Security Settings</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
            <span className="font-medium text-purple-900">View Analytics</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Settings className="w-6 h-6 text-orange-600 mr-3" />
            <span className="font-medium text-orange-900">System Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
