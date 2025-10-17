import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../common/Header';
import { KycBanner } from '../common/KycBanner';
import { Sidebar } from '../common/Sidebar';
import { MetricCard } from '../common/MetricCard';
import { FeatureRouter } from '../common/FeatureRouter';
import { getSuperAdminNavigation } from '../../config/navigation';
import { DashboardMetric } from '../../types';
import { 
  Users, 
  Shield, 
  Server,
  Database,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Settings,
  FileText,
  BarChart3,
  ArrowRight,
  Bell,
  Clock,
  Activity,
  Crown,
  UserCheck,
  DollarSign,
  Wallet,
  AlertCircle,
  PieChart,
  TrendingDown,
  Eye,
  Key,
  Search,
  Globe,
  Layers
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const navigation = getSuperAdminNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Handle URL-based routing
  useEffect(() => {
    const path = location.pathname;
    if (path === '/superadmin/dashboard' || path === '/superadmin') {
      setActiveFeature(null);
    } else {
      const featureId = path.replace('/superadmin/', '');
      if (featureId && featureId !== 'dashboard') {
        setActiveFeature(featureId);
      }
    }
  }, [location.pathname]);

  // Handle dashboard navigation specifically
  const handleDashboardClick = () => {
    setActiveFeature(null);
    navigate('/superadmin/dashboard');
  };

  // Handle feature selection with URL updates
  const handleFeatureSelect = (featureId: string) => {
    if (featureId === 'dashboard') {
      handleDashboardClick();
    } else {
      setActiveFeature(featureId);
      navigate(`/superadmin/${featureId}`);
    }
  };
  
  const metrics: DashboardMetric[] = [
    { title: 'Total Users', value: '24,891', change: '+12%', trend: 'up' },
    { title: 'Active Vendors', value: '1,247', change: '+8%', trend: 'up' },
    { title: 'Pending Approvals', value: '156', change: '-5%', trend: 'down' },
    { title: 'Total Transactions', value: '$2.4M', change: '+18%', trend: 'up' },
    { title: 'Wallet Balances', value: '$847K', change: '+15%', trend: 'up' },
    { title: 'Disputes Logged', value: '23', change: '-12%', trend: 'down' },
    { title: 'System Health', value: '99.9%', change: '+0.1%', trend: 'up' },
    { title: 'Reports Generated', value: '1,847', change: '+25%', trend: 'up' }
  ];

  const quickActions = [
    { 
      id: 'view-all-users', 
      label: 'View All Users', 
      icon: Users, 
      color: 'bg-[#098DCF] hover:bg-[#0F2A75]',
      action: () => handleFeatureSelect('user-management')
    },
    { 
      id: 'manage-roles', 
      label: 'Manage Roles & Permissions', 
      icon: Key, 
      color: 'bg-[#098DCF] hover:bg-[#0F2A75]',
      action: () => handleFeatureSelect('rbac-management')
    },
    { 
      id: 'review-kyc', 
      label: 'Review KYC/KYB', 
      icon: UserCheck, 
      color: 'bg-[#098DCF] hover:bg-[#0F2A75]',
      action: () => handleFeatureSelect('kyc-management')
    },
    { 
      id: 'approve-requests', 
      label: 'Approve Pending Requests', 
      icon: CheckCircle, 
      color: 'bg-[#098DCF] hover:bg-[#0F2A75]',
      action: () => handleFeatureSelect('approval-workflow')
    },
    { 
      id: 'system-health', 
      label: 'Check System Health', 
      icon: Server, 
      color: 'bg-[#098DCF] hover:bg-[#0F2A75]',
      action: () => handleFeatureSelect('system-health')
    },
    { 
      id: 'access-reports', 
      label: 'Access Reports', 
      icon: BarChart3, 
      color: 'bg-[#098DCF] hover:bg-[#0F2A75]',
      action: () => handleFeatureSelect('analytics-reports')
    }
  ];

  const systemAlerts = [
    {
      id: '1',
      type: 'warning',
      title: 'High Memory Usage Detected',
      message: 'Server memory usage at 78% - consider scaling',
      time: '2 hours ago',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      severity: 'medium'
    },
    {
      id: '2',
      type: 'info',
      title: 'Scheduled Maintenance Complete',
      message: 'Database optimization completed successfully',
      time: '4 hours ago',
      icon: CheckCircle,
      color: 'text-green-600',
      severity: 'low'
    },
    {
      id: '3',
      type: 'critical',
      title: 'Security Incident Resolved',
      message: 'DDoS attack mitigated, all services restored',
      time: '1 day ago',
      icon: Shield,
      color: 'text-red-600',
      severity: 'high'
    },
    {
      id: '4',
      type: 'info',
      title: 'New Admin User Created',
      message: 'Regional admin added for Europe region',
      time: '2 days ago',
      icon: Users,
      color: 'text-blue-600',
      severity: 'low'
    }
  ];

  const systemServices = [
    { name: 'Web Application', status: 'operational', uptime: '99.9%' },
    { name: 'API Gateway', status: 'operational', uptime: '99.8%' },
    { name: 'Database', status: 'operational', uptime: '99.9%' },
    { name: 'Payment Processing', status: 'degraded', uptime: '98.5%' },
    { name: 'Email Service', status: 'operational', uptime: '99.7%' },
    { name: 'File Storage', status: 'operational', uptime: '99.9%' }
  ];

  const handleBackToDashboard = () => {
    setActiveFeature(null);
    navigate('/superadmin/dashboard');
  };

  const handleQuickAction = (action: () => void) => {
    action();
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-700';
      case 'degraded': return 'bg-yellow-100 text-yellow-700';
      case 'outage': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        groups={navigation} 
        onFeatureSelect={handleFeatureSelect}
        activeFeature={activeFeature || undefined}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header title={activeFeature ? "System Administration" : "System Overview"} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <KycBanner />
          {activeFeature ? (
            <div>
              <button
                onClick={handleBackToDashboard}
                className="mb-4 text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                ← Back to Dashboard
              </button>
              <FeatureRouter featureId={activeFeature} />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-[#0F2A75] rounded-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#0F2A75] mb-1" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                      Super Admin Dashboard
                    </h2>
                    <p className="text-[#098DCF] text-lg" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                      Monitor and manage the entire SureGroups platform
                    </p>
                  </div>
                </div>
              </div>

              {/* Critical Alerts Banner */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-900">1 critical alert requires attention</p>
                      <p className="text-xs text-red-700">Payment service experiencing degraded performance</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveFeature('system-monitoring')}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#0F2A75] mb-6" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.action)}
                      className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-xl hover:border-[#098DCF] transition-all duration-300 group"
                    >
                      <div className={`w-14 h-14 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-sm font-bold text-[#0F2A75] text-center group-hover:text-[#098DCF] transition-colors" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                        {action.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#0F2A75] mb-6" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                  Platform Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {metrics.map((metric, index) => {
                    const icons = [Users, Shield, Clock, DollarSign, Wallet, AlertCircle, Server, FileText];
                    const IconComponent = icons[index] || BarChart3;
                    
                    return (
                      <div key={index} className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
                            <IconComponent className="w-6 h-6 text-[#098DCF]" />
                          </div>
                          <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {metric.change}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#0F2A75] mb-1" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                            {metric.title}
                          </h4>
                          <p className="text-2xl font-bold text-[#098DCF]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                            {metric.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Status & Recent Activity */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                      System Services
                    </h3>
                    <button 
                      onClick={() => setActiveFeature('system-monitoring')}
                      className="text-[#098DCF] hover:text-[#0F2A75] text-sm font-bold flex items-center transition-colors"
                      style={{ fontFamily: 'Molde Semi Expanded Bold' }}
                    >
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {systemServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            service.status === 'operational' ? 'bg-green-500' :
                            service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-900">{service.name}</span>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{service.uptime} uptime</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                      Recent System Activity
                    </h3>
                    <button 
                      onClick={() => setActiveFeature('audit-logs')}
                      className="text-[#098DCF] hover:text-[#0F2A75] text-sm font-bold flex items-center transition-colors"
                      style={{ fontFamily: 'Molde Semi Expanded Bold' }}
                    >
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {systemAlerts.map((alert) => (
                      <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${getAlertSeverityColor(alert.severity)} hover:shadow-sm transition-shadow cursor-pointer`}>
                        <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center ${alert.color} shadow-sm`}>
                          <alert.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                          <p className="text-xs text-gray-500">{alert.message} • {alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Overview */}
              <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">24,891</p>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-xs text-green-600 mt-1">+12% growth</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Server className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">99.9%</p>
                    <p className="text-sm text-gray-600">System Uptime</p>
                    <p className="text-xs text-green-600 mt-1">Above SLA</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Database className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">2.4M</p>
                    <p className="text-sm text-gray-600">API Requests</p>
                    <p className="text-xs text-green-600 mt-1">+15% increase</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">94</p>
                    <p className="text-sm text-gray-600">Security Score</p>
                    <p className="text-xs text-green-600 mt-1">+2 improvement</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};