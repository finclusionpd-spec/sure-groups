import React, { useState } from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

export const SystemHealthCheck: React.FC = () => {
  const [services, setServices] = useState([
    {
      id: '1',
      name: 'Web Application',
      status: 'Operational',
      uptime: '99.9%',
      responseTime: '120ms',
      lastCheck: '2024-01-15 14:30:00'
    },
    {
      id: '2',
      name: 'Database',
      status: 'Operational',
      uptime: '99.8%',
      responseTime: '45ms',
      lastCheck: '2024-01-15 14:30:00'
    },
    {
      id: '3',
      name: 'API Gateway',
      status: 'Degraded',
      uptime: '98.5%',
      responseTime: '250ms',
      lastCheck: '2024-01-15 14:30:00'
    },
    {
      id: '4',
      name: 'Email Service',
      status: 'Operational',
      uptime: '99.7%',
      responseTime: '180ms',
      lastCheck: '2024-01-15 14:30:00'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'bg-green-100 text-green-800';
      case 'Degraded': return 'bg-yellow-100 text-yellow-800';
      case 'Down': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Operational': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Degraded': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'Down': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const stats = {
    totalServices: services.length,
    operational: services.filter(s => s.status === 'Operational').length,
    degraded: services.filter(s => s.status === 'Degraded').length,
    averageUptime: services.reduce((sum, s) => sum + parseFloat(s.uptime), 0) / services.length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
              System Health Check
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
              Monitor system performance and service status
            </p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-6 py-3 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75] transition-colors shadow-lg disabled:opacity-50"
          >
            {isRefreshing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            <span style={{ fontFamily: 'Molde Semi Expanded Bold' }}>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
              <Server className="w-6 h-6 text-[#098DCF]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Total Services
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.totalServices}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Operational
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.operational}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Degraded
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.degraded}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Avg Uptime
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.averageUptime.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
            Service Status
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {services.map((service) => (
            <div key={service.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(service.status)}
                  <div>
                    <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                      {service.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Last check: {service.lastCheck}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {service.uptime}
                    </div>
                    <div className="text-sm text-gray-500">Uptime</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {service.responseTime}
                    </div>
                    <div className="text-sm text-gray-500">Response</div>
                  </div>
                  <div>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};