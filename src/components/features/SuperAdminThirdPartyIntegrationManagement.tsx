import React, { useState, useMemo } from 'react';
import { 
  Plug, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Search, 
  Plus,
  Activity,
  Globe,
  Shield,
  X,
  Save,
  ArrowRight,
  Calendar,
  Clock,
  RefreshCw,
  Download,
  MoreHorizontal,
  Play,
  Pause,
  Trash2,
  Key,
  Database,
  Zap,
  BarChart3,
  PieChart,
  Target,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Layers,
  Bell,
  DollarSign,
  Mail,
  Cloud,
  CreditCard,
  MessageSquare,
  User,
  Building,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface ThirdPartyIntegration {
  id: string;
  name: string;
  type: 'payment' | 'communication' | 'storage' | 'analytics' | 'authentication' | 'notification' | 'other';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'pending' | 'maintenance';
  description: string;
  apiKey?: string;
  webhookUrl?: string;
  lastSync: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  version: string;
  healthStatus: 'healthy' | 'warning' | 'critical';
  requestCount: number;
  errorCount: number;
  uptime: number;
  features: {
    id: string;
    name: string;
    enabled: boolean;
    description: string;
  }[];
  configuration: {
    environment: 'production' | 'staging' | 'development';
    rateLimit: number;
    timeout: number;
    retryAttempts: number;
  };
}

interface IntegrationStats {
  totalIntegrations: number;
  activeIntegrations: number;
  inactiveIntegrations: number;
  errorIntegrations: number;
  totalRequests: number;
  totalErrors: number;
  averageUptime: number;
  healthyIntegrations: number;
}

export const SuperAdminThirdPartyIntegrationManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'error' | 'pending' | 'maintenance'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'payment' | 'communication' | 'storage' | 'analytics' | 'authentication' | 'notification' | 'other'>('all');
  const [healthFilter, setHealthFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'lastSync' | 'requestCount'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [showCreateIntegration, setShowCreateIntegration] = useState(false);
  const [showEditIntegration, setShowEditIntegration] = useState(false);
  const [showViewIntegration, setShowViewIntegration] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<ThirdPartyIntegration | null>(null);

  // Sample integration data
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([
    {
      id: 'int-1',
      name: 'Stripe Payment Gateway',
      type: 'payment',
      provider: 'Stripe',
      status: 'active',
      description: 'Secure payment processing for all transactions',
      apiKey: 'sk_live_...',
      webhookUrl: 'https://api.suregroups.com/webhooks/stripe',
      lastSync: '2025-01-15T14:30:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-15T14:30:00Z',
      updatedBy: 'Super Admin',
      version: '2.1.0',
      healthStatus: 'healthy',
      requestCount: 125000,
      errorCount: 45,
      uptime: 99.8,
      features: [
        { id: 'f1', name: 'Card Payments', enabled: true, description: 'Process credit/debit card payments' },
        { id: 'f2', name: 'Bank Transfers', enabled: true, description: 'Handle ACH and wire transfers' },
        { id: 'f3', name: 'Refunds', enabled: true, description: 'Process payment refunds' },
        { id: 'f4', name: 'Subscriptions', enabled: false, description: 'Recurring payment management' }
      ],
      configuration: {
        environment: 'production',
        rateLimit: 1000,
        timeout: 30,
        retryAttempts: 3
      }
    },
    {
      id: 'int-2',
      name: 'SendGrid Email Service',
      type: 'communication',
      provider: 'SendGrid',
      status: 'active',
      description: 'Reliable email delivery service for notifications',
      apiKey: 'SG.abc123...',
      webhookUrl: 'https://api.suregroups.com/webhooks/sendgrid',
      lastSync: '2025-01-15T12:00:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-10T09:15:00Z',
      updatedBy: 'Super Admin',
      version: '1.8.2',
      healthStatus: 'healthy',
      requestCount: 85000,
      errorCount: 12,
      uptime: 99.9,
      features: [
        { id: 'f1', name: 'Transactional Emails', enabled: true, description: 'Send automated emails' },
        { id: 'f2', name: 'Marketing Emails', enabled: true, description: 'Bulk email campaigns' },
        { id: 'f3', name: 'Email Templates', enabled: true, description: 'Custom email templates' },
        { id: 'f4', name: 'Analytics', enabled: false, description: 'Email performance tracking' }
      ],
      configuration: {
        environment: 'production',
        rateLimit: 500,
        timeout: 15,
        retryAttempts: 2
      }
    },
    {
      id: 'int-3',
      name: 'AWS S3 Storage',
      type: 'storage',
      provider: 'Amazon Web Services',
      status: 'active',
      description: 'Cloud storage for files and documents',
      apiKey: 'AKIA...',
      webhookUrl: 'https://api.suregroups.com/webhooks/s3',
      lastSync: '2025-01-15T10:45:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-12T16:20:00Z',
      updatedBy: 'Super Admin',
      version: '3.2.1',
      healthStatus: 'healthy',
      requestCount: 45000,
      errorCount: 8,
      uptime: 99.95,
      features: [
        { id: 'f1', name: 'File Upload', enabled: true, description: 'Upload files to cloud storage' },
        { id: 'f2', name: 'File Download', enabled: true, description: 'Download files from storage' },
        { id: 'f3', name: 'CDN', enabled: true, description: 'Content delivery network' },
        { id: 'f4', name: 'Backup', enabled: false, description: 'Automatic file backups' }
      ],
      configuration: {
        environment: 'production',
        rateLimit: 2000,
        timeout: 60,
        retryAttempts: 5
      }
    },
    {
      id: 'int-4',
      name: 'Google Analytics',
      type: 'analytics',
      provider: 'Google',
      status: 'inactive',
      description: 'Website and app analytics tracking',
      apiKey: 'GA-...',
      lastSync: '2025-01-10T09:15:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-08T14:30:00Z',
      updatedBy: 'Super Admin',
      version: '4.0.0',
      healthStatus: 'warning',
      requestCount: 0,
      errorCount: 0,
      uptime: 0,
      features: [
        { id: 'f1', name: 'Page Views', enabled: false, description: 'Track page view events' },
        { id: 'f2', name: 'User Behavior', enabled: false, description: 'Analyze user interactions' },
        { id: 'f3', name: 'Conversion Tracking', enabled: false, description: 'Track conversion events' },
        { id: 'f4', name: 'Custom Events', enabled: false, description: 'Track custom events' }
      ],
      configuration: {
        environment: 'production',
        rateLimit: 100,
        timeout: 10,
        retryAttempts: 1
      }
    },
    {
      id: 'int-5',
      name: 'Auth0 Authentication',
      type: 'authentication',
      provider: 'Auth0',
      status: 'active',
      description: 'Secure user authentication and authorization',
      apiKey: 'auth0_...',
      webhookUrl: 'https://api.suregroups.com/webhooks/auth0',
      lastSync: '2025-01-15T11:20:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-14T08:45:00Z',
      updatedBy: 'Super Admin',
      version: '2.5.3',
      healthStatus: 'healthy',
      requestCount: 200000,
      errorCount: 25,
      uptime: 99.7,
      features: [
        { id: 'f1', name: 'Login', enabled: true, description: 'User login functionality' },
        { id: 'f2', name: 'Registration', enabled: true, description: 'User registration' },
        { id: 'f3', name: 'Password Reset', enabled: true, description: 'Password reset flow' },
        { id: 'f4', name: 'Social Login', enabled: false, description: 'OAuth social login' }
      ],
      configuration: {
        environment: 'production',
        rateLimit: 5000,
        timeout: 20,
        retryAttempts: 3
      }
    },
    {
      id: 'int-6',
      name: 'Twilio SMS Service',
      type: 'notification',
      provider: 'Twilio',
      status: 'error',
      description: 'SMS notifications and verification',
      apiKey: 'AC...',
      webhookUrl: 'https://api.suregroups.com/webhooks/twilio',
      lastSync: '2025-01-14T16:30:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-14T16:30:00Z',
      updatedBy: 'Super Admin',
      version: '1.3.0',
      healthStatus: 'critical',
      requestCount: 15000,
      errorCount: 150,
      uptime: 85.2,
      features: [
        { id: 'f1', name: 'SMS Sending', enabled: true, description: 'Send SMS messages' },
        { id: 'f2', name: 'Verification', enabled: true, description: 'SMS verification codes' },
        { id: 'f3', name: 'Delivery Reports', enabled: false, description: 'SMS delivery status' },
        { id: 'f4', name: 'International', enabled: false, description: 'International SMS support' }
      ],
      configuration: {
        environment: 'production',
        rateLimit: 100,
        timeout: 30,
        retryAttempts: 2
      }
    }
  ]);

  // Calculate stats
  const stats: IntegrationStats = useMemo(() => {
    const total = integrations.length;
    const active = integrations.filter(i => i.status === 'active').length;
    const inactive = integrations.filter(i => i.status === 'inactive').length;
    const error = integrations.filter(i => i.status === 'error').length;
    const totalRequests = integrations.reduce((sum, i) => sum + i.requestCount, 0);
    const totalErrors = integrations.reduce((sum, i) => sum + i.errorCount, 0);
    const averageUptime = integrations.reduce((sum, i) => sum + i.uptime, 0) / integrations.length;
    const healthy = integrations.filter(i => i.healthStatus === 'healthy').length;
    
    return { 
      totalIntegrations: total, 
      activeIntegrations: active, 
      inactiveIntegrations: inactive, 
      errorIntegrations: error,
      totalRequests,
      totalErrors,
      averageUptime,
      healthyIntegrations: healthy
    };
  }, [integrations]);

  // Filter and sort integrations
  const filteredIntegrations = useMemo(() => {
    let filtered = integrations.filter(integration => {
      const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           integration.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           integration.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
      const matchesType = typeFilter === 'all' || integration.type === typeFilter;
      const matchesHealth = healthFilter === 'all' || integration.healthStatus === healthFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesHealth;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastSync':
          aValue = new Date(a.lastSync).getTime();
          bValue = new Date(b.lastSync).getTime();
          break;
        case 'requestCount':
          aValue = a.requestCount;
          bValue = b.requestCount;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortDir === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [integrations, searchTerm, statusFilter, typeFilter, healthFilter, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filteredIntegrations.length / pageSize);
  const paginatedIntegrations = filteredIntegrations.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const handleViewIntegration = (integration: ThirdPartyIntegration) => {
    setSelectedIntegration(integration);
    setShowViewIntegration(true);
  };

  const handleEditIntegration = (integration: ThirdPartyIntegration) => {
    setSelectedIntegration(integration);
    setShowEditIntegration(true);
  };

  const handleDeleteIntegration = (integration: ThirdPartyIntegration) => {
    setSelectedIntegration(integration);
    setShowDeleteModal(true);
  };

  const handleTestIntegration = (integration: ThirdPartyIntegration) => {
    setSelectedIntegration(integration);
    setShowTestModal(true);
  };

  const handleToggleStatus = (integration: ThirdPartyIntegration) => {
    setIntegrations(prev => prev.map(int => 
      int.id === integration.id 
        ? { ...int, status: int.status === 'active' ? 'inactive' : 'active' }
        : int
    ));
  };

  const handleViewActiveIntegrations = () => {
    setStatusFilter('active');
    setPage(1);
  };

  const handleViewErrorIntegrations = () => {
    setStatusFilter('error');
    setPage(1);
  };

  const handleViewHealthyIntegrations = () => {
    setHealthFilter('healthy');
    setPage(1);
  };

  const handleViewAllIntegrations = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setHealthFilter('all');
    setSearchTerm('');
    setPage(1);
  };

  const handleExportIntegrations = () => {
    const csvData = filteredIntegrations.map(integration => ({
      'Name': integration.name,
      'Type': integration.type,
      'Provider': integration.provider,
      'Status': integration.status,
      'Health Status': integration.healthStatus,
      'Version': integration.version,
      'Request Count': integration.requestCount,
      'Error Count': integration.errorCount,
      'Uptime': integration.uptime,
      'Last Sync': integration.lastSync,
      'Created At': integration.createdAt,
      'Updated At': integration.updatedAt,
      'Updated By': integration.updatedBy
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `third-party-integrations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefreshData = () => {
    setIntegrations(prev => [...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard className="w-4 h-4" />;
      case 'communication': return <Mail className="w-4 h-4" />;
      case 'storage': return <Cloud className="w-4 h-4" />;
      case 'analytics': return <BarChart3 className="w-4 h-4" />;
      case 'authentication': return <Shield className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      case 'other': return <Plug className="w-4 h-4" />;
      default: return <Plug className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0F2A75] mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
            Third Party Integration Management
          </h1>
          <p className="text-[#098DCF] text-lg" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
            Comprehensive platform-wide third-party service integration oversight and management
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportIntegrations}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={handleRefreshData}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Integrations</p>
              <p className="text-3xl font-bold text-[#0F2A75]">{stats.totalIntegrations}</p>
            </div>
            <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
              <Plug className="w-8 h-8 text-[#098DCF]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeIntegrations}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Errors</p>
              <p className="text-3xl font-bold text-red-600">{stats.errorIntegrations}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Requests</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalRequests.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Uptime</p>
              <p className="text-3xl font-bold text-purple-600">{stats.averageUptime.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowCreateIntegration(true)}
            className="bg-[#098DCF] hover:bg-[#0F2A75] text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Integration</span>
          </button>
          <button
            onClick={handleViewActiveIntegrations}
            className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>View Active</span>
          </button>
          <button
            onClick={handleViewErrorIntegrations}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <AlertCircle className="w-4 h-4" />
            <span>View Errors</span>
          </button>
          <button
            onClick={handleViewHealthyIntegrations}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Shield className="w-4 h-4" />
            <span>View Healthy</span>
          </button>
          <button
            onClick={handleViewAllIntegrations}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>View All</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="error">Error</option>
            <option value="pending">Pending</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="payment">Payment</option>
            <option value="communication">Communication</option>
            <option value="storage">Storage</option>
            <option value="analytics">Analytics</option>
            <option value="authentication">Authentication</option>
            <option value="notification">Notification</option>
            <option value="other">Other</option>
          </select>

          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Health</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTypeFilter('all');
              setHealthFilter('all');
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Integrations Table */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Integration</span>
                    {sortBy === 'name' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortBy === 'status' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metrics
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastSync')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Sync</span>
                    {sortBy === 'lastSync' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedIntegrations.map((integration) => (
                <tr key={integration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(integration.type)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{integration.name}</div>
                        <div className="text-sm text-gray-500">{integration.provider}</div>
                        <div className="text-xs text-gray-400 max-w-xs truncate">{integration.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{integration.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                      {getStatusIcon(integration.status)}
                      <span className="ml-1 capitalize">{integration.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthColor(integration.healthStatus)}`}>
                      <span className="capitalize">{integration.healthStatus}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Requests: {integration.requestCount.toLocaleString()}</div>
                      <div>Errors: {integration.errorCount}</div>
                      <div>Uptime: {integration.uptime}%</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(integration.lastSync).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewIntegration(integration)}
                        className="text-[#098DCF] hover:text-[#0F2A75] transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditIntegration(integration)}
                        className="text-green-600 hover:text-green-800 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleTestIntegration(integration)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        title="Test Integration"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(integration)}
                        className={`transition-colors duration-200 ${
                          integration.status === 'active' 
                            ? 'text-red-600 hover:text-red-800' 
                            : 'text-green-600 hover:text-green-800'
                        }`}
                        title={integration.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {integration.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteIntegration(integration)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredIntegrations.length)} of {filteredIntegrations.length} integrations
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedIntegration.name}"? This action cannot be undone and may affect dependent services.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIntegrations(prev => prev.filter(int => int.id !== selectedIntegration.id));
                  setShowDeleteModal(false);
                  setSelectedIntegration(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Integration Modal */}
      {showCreateIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#0F2A75]">Add New Integration</h3>
              <button
                onClick={() => setShowCreateIntegration(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Integration Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter integration name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter provider name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select Type</option>
                    <option value="payment">Payment</option>
                    <option value="communication">Communication</option>
                    <option value="storage">Storage</option>
                    <option value="analytics">Analytics</option>
                    <option value="authentication">Authentication</option>
                    <option value="notification">Notification</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1.0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe the integration..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    placeholder="Enter API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.example.com/webhook"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setShowCreateIntegration(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Integration creation functionality would be implemented here');
                  setShowCreateIntegration(false);
                }}
                className="px-6 py-2 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75]"
              >
                Create Integration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};










