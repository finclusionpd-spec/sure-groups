import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  UserCheck, 
  Building2, 
  DollarSign, 
  Download, 
  Search, 
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  FileText,
  FileSpreadsheet,
  FileDown,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Printer
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  userType: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

interface GroupData {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  memberCount: number;
  dateCreated: string;
  revenue: number;
}

interface TransactionData {
  id: string;
  amount: number;
  userType: string;
  paymentStatus: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

interface ActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'group' | 'transaction' | 'user' | 'vendor';
}

interface ChartData {
  name: string;
  value: number;
  users?: number;
  groups?: number;
  revenue?: number;
  transactions?: number;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ReportDetails {
  id: string;
  title: string;
  data: any[];
  metadata: {
    generatedAt: string;
    totalRecords: number;
    filters: string;
  };
}

export const AnalyticsReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'groups' | 'financial'>('overview');
  const [dateRange, setDateRange] = useState('30');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [groupTypeFilter, setGroupTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportDetails | null>(null);
  const [chartData, setChartData] = useState<{
    userGrowth: ChartData[];
    groupCreation: ChartData[];
    transactionVolume: ChartData[];
    groupStatus: ChartData[];
    revenueSplit: ChartData[];
  }>({
    userGrowth: [],
    groupCreation: [],
    transactionVolume: [],
    groupStatus: [],
    revenueSplit: []
  });

  // Mock data
  const [users, setUsers] = useState<UserData[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Generate chart data
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    setChartData({
      userGrowth: months.map(month => ({
        name: month,
        users: Math.floor(Math.random() * 200) + 100,
        value: Math.floor(Math.random() * 200) + 100
      })),
      groupCreation: months.map(month => ({
        name: month,
        groups: Math.floor(Math.random() * 20) + 5,
        value: Math.floor(Math.random() * 20) + 5
      })),
      transactionVolume: months.map(month => ({
        name: month,
        transactions: Math.floor(Math.random() * 500) + 200,
        revenue: Math.floor(Math.random() * 10000) + 5000,
        value: Math.floor(Math.random() * 500) + 200
      })),
      groupStatus: [
        { name: 'Active', value: 120, color: '#10B981' },
        { name: 'Inactive', value: 36, color: '#EF4444' }
      ],
      revenueSplit: [
        { name: 'Members', value: 45, color: '#3B82F6' },
        { name: 'Group Admins', value: 30, color: '#8B5CF6' },
        { name: 'Vendors', value: 20, color: '#F59E0B' },
        { name: 'Developers', value: 5, color: '#10B981' }
      ]
    });
  };

  useEffect(() => {
    // Load mock data
    setUsers([
      { id: '1', name: 'John Doe', email: 'john@example.com', userType: 'Member', registrationDate: '2024-01-15', status: 'active', lastLogin: '2024-01-20' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', userType: 'Group Admin', registrationDate: '2024-01-10', status: 'active', lastLogin: '2024-01-19' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', userType: 'Vendor', registrationDate: '2024-01-05', status: 'pending', lastLogin: '2024-01-18' },
      { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', userType: 'Developer', registrationDate: '2024-01-12', status: 'active', lastLogin: '2024-01-20' },
      { id: '5', name: 'David Brown', email: 'david@example.com', userType: 'Member', registrationDate: '2024-01-08', status: 'inactive', lastLogin: '2024-01-15' }
    ]);

    setGroups([
      { id: '1', name: 'Tech Innovators', type: 'Professional', status: 'active', memberCount: 45, dateCreated: '2024-01-01', revenue: 1250 },
      { id: '2', name: 'Community Builders', type: 'Community', status: 'active', memberCount: 78, dateCreated: '2024-01-05', revenue: 890 },
      { id: '3', name: 'Business Network', type: 'Professional', status: 'inactive', memberCount: 23, dateCreated: '2024-01-10', revenue: 450 },
      { id: '4', name: 'Local Church', type: 'Religious', status: 'active', memberCount: 156, dateCreated: '2024-01-12', revenue: 2100 }
    ]);

    setTransactions([
      { id: '1', amount: 150.00, userType: 'Member', paymentStatus: 'completed', date: '2024-01-20', description: 'Group membership fee' },
      { id: '2', amount: 75.50, userType: 'Vendor', paymentStatus: 'completed', date: '2024-01-19', description: 'Service fee' },
      { id: '3', amount: 200.00, userType: 'Group Admin', paymentStatus: 'pending', date: '2024-01-18', description: 'Premium features' },
      { id: '4', amount: 89.99, userType: 'Developer', paymentStatus: 'failed', date: '2024-01-17', description: 'API access' },
      { id: '5', amount: 300.00, userType: 'Member', paymentStatus: 'completed', date: '2024-01-16', description: 'Annual subscription' }
    ]);

    setActivities([
      { id: '1', action: 'New group created', user: 'Jane Smith', timestamp: '2024-01-20 14:30', type: 'group' },
      { id: '2', action: 'Large transaction processed', user: 'System', timestamp: '2024-01-20 12:15', type: 'transaction' },
      { id: '3', action: 'Vendor registered', user: 'Mike Johnson', timestamp: '2024-01-20 10:45', type: 'vendor' },
      { id: '4', action: 'User profile updated', user: 'John Doe', timestamp: '2024-01-20 09:20', type: 'user' },
      { id: '5', action: 'Group membership approved', user: 'Sarah Wilson', timestamp: '2024-01-19 16:30', type: 'group' }
    ]);

    // Generate chart data
    generateChartData();
  }, []);

  const metrics: MetricCard[] = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users (30 Days)',
      value: '1,923',
      change: '+8%',
      trend: 'up',
      icon: <UserCheck className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Total Groups',
      value: '156',
      change: '+5%',
      trend: 'up',
      icon: <Building2 className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Transactions',
      value: '4,521',
      change: '+15%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      title: 'Total Revenue',
      value: '$45,230',
      change: '+22%',
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-emerald-500'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredGroups = groups.filter(group => {
    const matchesType = groupTypeFilter === 'all' || group.type === groupTypeFilter;
    const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesStatus = statusFilter === 'all' || transaction.paymentStatus === statusFilter;
    return matchesStatus;
  });

  // Toast notification functions
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Generate report function
  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      generateChartData();
      addToast('success', 'Report generated successfully!');
    } catch (error) {
      addToast('error', 'Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export functions
  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf', dataType: string) => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate filename
      const date = new Date().toISOString().split('T')[0];
      const filename = `report_${dataType}_${date}.${format}`;
      
      // In a real app, this would generate and download the file
      console.log(`Exporting ${dataType} as ${format.toUpperCase()} - ${filename}`);
      
      addToast('success', `Report exported as ${filename}`);
    } catch (error) {
      addToast('error', 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Reset filters function
  const resetFilters = () => {
    setDateRange('30');
    setUserTypeFilter('all');
    setGroupTypeFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
    addToast('info', 'Filters reset to default');
  };

  // View details function
  const handleViewDetails = (item: any, type: string) => {
    const reportDetails: ReportDetails = {
      id: item.id,
      title: `${type} Details - ${item.name || item.id}`,
      data: [item],
      metadata: {
        generatedAt: new Date().toISOString(),
        totalRecords: 1,
        filters: `Type: ${type}, Date Range: ${dateRange} days`
      }
    };
    setSelectedReport(reportDetails);
    setShowReportDetails(true);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'group': return <Building2 className="w-4 h-4 text-blue-500" />;
      case 'transaction': return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'user': return <Users className="w-4 h-4 text-purple-500" />;
      case 'vendor': return <TrendingUp className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
        <p className="text-gray-600">Track key metrics, view insights, and export reports.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Analytics', icon: Users },
            { id: 'groups', label: 'Group Analytics', icon: Building2 },
            { id: 'financial', label: 'Financial Reports', icon: DollarSign }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                {isLoading ? 'Generating...' : 'Generate Report'}
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Reset Filters
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv', 'overview')}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Growth Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Group Creation Trend */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Creation Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.groupCreation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="groups" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Transaction Volume Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume by Month</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.transactionVolume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="transactions" stackId="1" stroke="#10B981" fill="#10B981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user} • {activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                {isLoading ? 'Generating...' : 'Generate Report'}
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Reset Filters
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv', 'users')}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
              <button
                onClick={() => handleExport('xlsx', 'users')}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export XLSX'}
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="Member">Member</option>
                  <option value="Group Admin">Group Admin</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.userType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.registrationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastLogin}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewDetails(user, 'User')}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                {isLoading ? 'Generating...' : 'Generate Report'}
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Reset Filters
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv', 'groups')}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
              <button
                onClick={() => handleExport('xlsx', 'groups')}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export XLSX'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Type</label>
                <select
                  value={groupTypeFilter}
                  onChange={(e) => setGroupTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="Professional">Professional</option>
                  <option value="Community">Community</option>
                  <option value="Religious">Religious</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Groups Created by Month</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.groupCreation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="groups" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active vs Inactive Groups</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData.groupStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.groupStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Groups Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGroups.map((group) => (
                    <tr key={group.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(group.status)}`}>
                          {group.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.memberCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${group.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.dateCreated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                {isLoading ? 'Generating...' : 'Generate Report'}
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Reset Filters
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('csv', 'transactions')}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
              <button
                onClick={() => handleExport('xlsx', 'transactions')}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export XLSX'}
              </button>
              <button
                onClick={() => handleExport('pdf', 'transactions')}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="Member">Member</option>
                  <option value="Group Admin">Group Admin</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume by Month</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.transactionVolume}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="transactions" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Split by User Type</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData.revenueSplit}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.revenueSplit.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.userType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.paymentStatus)}`}>
                          {transaction.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewDetails(transaction, 'Transaction')}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg shadow-lg max-w-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
            {toast.type === 'info' && <Activity className="w-5 h-5 mr-2" />}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Report Details Modal */}
      {showReportDetails && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExport('pdf', selectedReport.id)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </button>
                  <button
                    onClick={() => setShowReportDetails(false)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Report Metadata */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Generated At:</span>
                      <p className="text-gray-900">{new Date(selectedReport.metadata.generatedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Records:</span>
                      <p className="text-gray-900">{selectedReport.metadata.totalRecords}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Filters Applied:</span>
                      <p className="text-gray-900">{selectedReport.metadata.filters}</p>
                    </div>
                  </div>
                </div>

                {/* Report Data */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(selectedReport.data[0] || {}).map((key) => (
                            <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedReport.data.map((item, index) => (
                          <tr key={index}>
                            {Object.values(item).map((value, valueIndex) => (
                              <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
