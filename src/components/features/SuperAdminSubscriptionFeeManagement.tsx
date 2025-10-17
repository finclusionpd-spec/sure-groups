import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Download,
  X,
  Save,
  ArrowRight,
  Calendar,
  User,
  Building,
  Shield,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  MoreHorizontal,
  Play,
  Pause,
  Lock,
  Unlock,
  FileText,
  Database,
  Calculator,
  Percent,
  Tag,
  Layers,
  Globe,
  Key,
  Bell
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'quarterly' | 'yearly' | 'lifetime';
  description: string;
  accessLevel: 'member' | 'vendor' | 'group-admin' | 'product-admin' | 'all';
  benefits: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  subscriberCount: number;
  maxSubscribers?: number;
  features: {
    id: string;
    name: string;
    included: boolean;
    limit?: number;
  }[];
}

interface FeeStructure {
  id: string;
  name: string;
  type: 'transaction' | 'escrow' | 'vendor-commission' | 'withdrawal' | 'subscription' | 'platform' | 'other';
  applicableUserType: 'member' | 'vendor' | 'group-admin' | 'product-admin' | 'all';
  rate: number;
  rateType: 'percentage' | 'fixed';
  currency: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  description: string;
  minAmount?: number;
  maxAmount?: number;
  transactionTypes?: string[];
}

interface SubscriptionStats {
  totalSubscriptions: number;
  activePlans: number;
  inactivePlans: number;
  totalSubscribers: number;
  totalRevenue: number;
  averageSubscriptionValue: number;
}

interface FeeStats {
  totalFeeCategories: number;
  activeFees: number;
  inactiveFees: number;
  pendingUpdates: number;
  averageFeeRate: number;
  totalFeesCollected: number;
}

export const SuperAdminSubscriptionFeeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'subscription' | 'fee'>('subscription');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft' | 'pending'>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'member' | 'vendor' | 'group-admin' | 'product-admin'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt' | 'subscriberCount'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [showCreateSubscription, setShowCreateSubscription] = useState(false);
  const [showEditSubscription, setShowEditSubscription] = useState(false);
  const [showViewSubscription, setShowViewSubscription] = useState(false);
  const [showCreateFee, setShowCreateFee] = useState(false);
  const [showEditFee, setShowEditFee] = useState(false);
  const [showViewFee, setShowViewFee] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SubscriptionPlan | FeeStructure | null>(null);

  // Sample subscription data
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([
    {
      id: 'sub-1',
      name: 'Basic Member',
      price: 9.99,
      currency: 'USD',
      duration: 'monthly',
      description: 'Essential features for individual members',
      accessLevel: 'member',
      benefits: ['Basic group access', 'Standard support', 'Limited transactions'],
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
      subscriberCount: 1250,
      features: [
        { id: 'f1', name: 'Group Access', included: true, limit: 5 },
        { id: 'f2', name: 'Transaction Limit', included: true, limit: 100 },
        { id: 'f3', name: 'Priority Support', included: false }
      ]
    },
    {
      id: 'sub-2',
      name: 'Vendor Pro',
      price: 29.99,
      currency: 'USD',
      duration: 'monthly',
      description: 'Advanced features for vendors and sellers',
      accessLevel: 'vendor',
      benefits: ['Unlimited listings', 'Advanced analytics', 'Priority support', 'Custom branding'],
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-10T14:20:00Z',
      subscriberCount: 450,
      features: [
        { id: 'f1', name: 'Unlimited Listings', included: true },
        { id: 'f2', name: 'Advanced Analytics', included: true },
        { id: 'f3', name: 'Priority Support', included: true },
        { id: 'f4', name: 'Custom Branding', included: true }
      ]
    },
    {
      id: 'sub-3',
      name: 'Group Admin Premium',
      price: 99.99,
      currency: 'USD',
      duration: 'quarterly',
      description: 'Comprehensive management tools for group administrators',
      accessLevel: 'group-admin',
      benefits: ['Full group management', 'Advanced reporting', 'Custom integrations', 'Dedicated support'],
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-12T09:15:00Z',
      subscriberCount: 85,
      features: [
        { id: 'f1', name: 'Full Group Management', included: true },
        { id: 'f2', name: 'Advanced Reporting', included: true },
        { id: 'f3', name: 'Custom Integrations', included: true },
        { id: 'f4', name: 'Dedicated Support', included: true }
      ]
    },
    {
      id: 'sub-4',
      name: 'Enterprise',
      price: 299.99,
      currency: 'USD',
      duration: 'yearly',
      description: 'Enterprise-level features for large organizations',
      accessLevel: 'all',
      benefits: ['All features', 'Custom development', '24/7 support', 'SLA guarantee'],
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-08T16:45:00Z',
      subscriberCount: 25,
      maxSubscribers: 50,
      features: [
        { id: 'f1', name: 'All Features', included: true },
        { id: 'f2', name: 'Custom Development', included: true },
        { id: 'f3', name: '24/7 Support', included: true },
        { id: 'f4', name: 'SLA Guarantee', included: true }
      ]
    },
    {
      id: 'sub-5',
      name: 'Trial Plan',
      price: 0,
      currency: 'USD',
      duration: 'monthly',
      description: 'Free trial for new users',
      accessLevel: 'member',
      benefits: ['Basic features', '7-day trial'],
      status: 'inactive',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-05T11:30:00Z',
      subscriberCount: 0,
      features: [
        { id: 'f1', name: 'Basic Features', included: true, limit: 1 },
        { id: 'f2', name: 'Trial Period', included: true, limit: 7 }
      ]
    }
  ]);

  // Sample fee data
  const [fees, setFees] = useState<FeeStructure[]>([
    {
      id: 'fee-1',
      name: 'Transaction Fee',
      type: 'transaction',
      applicableUserType: 'all',
      rate: 2.5,
      rateType: 'percentage',
      currency: 'USD',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
      updatedBy: 'Super Admin',
      description: 'Standard fee for all transactions',
      minAmount: 0.01,
      transactionTypes: ['payment', 'transfer', 'purchase']
    },
    {
      id: 'fee-2',
      name: 'Escrow Fee',
      type: 'escrow',
      applicableUserType: 'all',
      rate: 3.0,
      rateType: 'percentage',
      currency: 'USD',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-10T14:20:00Z',
      updatedBy: 'Super Admin',
      description: 'Fee for escrow transactions',
      minAmount: 1.00,
      transactionTypes: ['escrow', 'milestone']
    },
    {
      id: 'fee-3',
      name: 'Vendor Commission',
      type: 'vendor-commission',
      applicableUserType: 'vendor',
      rate: 5.0,
      rateType: 'percentage',
      currency: 'USD',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-12T09:15:00Z',
      updatedBy: 'Super Admin',
      description: 'Commission for vendor sales',
      minAmount: 0.50,
      transactionTypes: ['sale', 'marketplace']
    },
    {
      id: 'fee-4',
      name: 'Withdrawal Fee',
      type: 'withdrawal',
      applicableUserType: 'all',
      rate: 1.50,
      rateType: 'fixed',
      currency: 'USD',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-08T16:45:00Z',
      updatedBy: 'Super Admin',
      description: 'Fixed fee for withdrawals',
      minAmount: 0.01
    },
    {
      id: 'fee-5',
      name: 'Platform Fee',
      type: 'platform',
      applicableUserType: 'all',
      rate: 1.0,
      rateType: 'percentage',
      currency: 'USD',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-05T11:30:00Z',
      updatedBy: 'Super Admin',
      description: 'General platform usage fee',
      minAmount: 0.10
    },
    {
      id: 'fee-6',
      name: 'Premium Support Fee',
      type: 'other',
      applicableUserType: 'group-admin',
      rate: 25.00,
      rateType: 'fixed',
      currency: 'USD',
      status: 'inactive',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-03T08:20:00Z',
      updatedBy: 'Super Admin',
      description: 'Fee for premium support services',
      minAmount: 25.00
    }
  ]);

  // Calculate subscription stats
  const subscriptionStats: SubscriptionStats = useMemo(() => {
    const total = subscriptions.length;
    const active = subscriptions.filter(s => s.status === 'active').length;
    const inactive = subscriptions.filter(s => s.status === 'inactive').length;
    const totalSubscribers = subscriptions.reduce((sum, s) => sum + s.subscriberCount, 0);
    const totalRevenue = subscriptions.reduce((sum, s) => sum + (s.price * s.subscriberCount), 0);
    const averageSubscriptionValue = totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0;
    
    return { 
      totalSubscriptions: total, 
      activePlans: active, 
      inactivePlans: inactive, 
      totalSubscribers, 
      totalRevenue,
      averageSubscriptionValue
    };
  }, [subscriptions]);

  // Calculate fee stats
  const feeStats: FeeStats = useMemo(() => {
    const total = fees.length;
    const active = fees.filter(f => f.status === 'active').length;
    const inactive = fees.filter(f => f.status === 'inactive').length;
    const pending = fees.filter(f => f.status === 'pending').length;
    const averageFeeRate = fees.reduce((sum, f) => sum + f.rate, 0) / fees.length;
    const totalFeesCollected = fees.reduce((sum, f) => sum + (f.rate * 100), 0); // Mock calculation
    
    return { 
      totalFeeCategories: total, 
      activeFees: active, 
      inactiveFees: inactive, 
      pendingUpdates: pending,
      averageFeeRate,
      totalFeesCollected
    };
  }, [fees]);

  // Filter and sort subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions.filter(subscription => {
      const matchesSearch = subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subscription.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
      const matchesUserType = userTypeFilter === 'all' || subscription.accessLevel === userTypeFilter;
      
      return matchesSearch && matchesStatus && matchesUserType;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'subscriberCount':
          aValue = a.subscriberCount;
          bValue = b.subscriberCount;
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
  }, [subscriptions, searchTerm, statusFilter, userTypeFilter, sortBy, sortDir]);

  // Filter and sort fees
  const filteredFees = useMemo(() => {
    let filtered = fees.filter(fee => {
      const matchesSearch = fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fee.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
      const matchesUserType = userTypeFilter === 'all' || fee.applicableUserType === userTypeFilter;
      
      return matchesSearch && matchesStatus && matchesUserType;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.rate;
          bValue = b.rate;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
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
  }, [fees, searchTerm, statusFilter, userTypeFilter, sortBy, sortDir]);

  // Pagination
  const currentData = activeTab === 'subscription' ? filteredSubscriptions : filteredFees;
  const totalPages = Math.ceil(currentData.length / pageSize);
  const paginatedData = currentData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const handleViewItem = (item: SubscriptionPlan | FeeStructure) => {
    setSelectedItem(item);
    if (activeTab === 'subscription') {
      setShowViewSubscription(true);
    } else {
      setShowViewFee(true);
    }
  };

  const handleEditItem = (item: SubscriptionPlan | FeeStructure) => {
    setSelectedItem(item);
    if (activeTab === 'subscription') {
      setShowEditSubscription(true);
    } else {
      setShowEditFee(true);
    }
  };

  const handleDeleteItem = (item: SubscriptionPlan | FeeStructure) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleToggleStatus = (item: SubscriptionPlan | FeeStructure) => {
    if (activeTab === 'subscription') {
      setSubscriptions(prev => prev.map(sub => 
        sub.id === item.id 
          ? { ...sub, status: sub.status === 'active' ? 'inactive' : 'active' }
          : sub
      ));
    } else {
      setFees(prev => prev.map(fee => 
        fee.id === item.id 
          ? { ...fee, status: fee.status === 'active' ? 'inactive' : 'active' }
          : fee
      ));
    }
  };

  const handleExportData = () => {
    const csvData = currentData.map(item => {
      if (activeTab === 'subscription') {
        const sub = item as SubscriptionPlan;
        return {
          'Name': sub.name,
          'Price': sub.price,
          'Currency': sub.currency,
          'Duration': sub.duration,
          'Access Level': sub.accessLevel,
          'Status': sub.status,
          'Subscribers': sub.subscriberCount,
          'Created At': sub.createdAt,
          'Updated At': sub.updatedAt
        };
      } else {
        const fee = item as FeeStructure;
        return {
          'Name': fee.name,
          'Type': fee.type,
          'Rate': fee.rate,
          'Rate Type': fee.rateType,
          'Currency': fee.currency,
          'Applicable User Type': fee.applicableUserType,
          'Status': fee.status,
          'Updated By': fee.updatedBy,
          'Created At': fee.createdAt,
          'Updated At': fee.updatedAt
        };
      }
    });

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}-management-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefreshData = () => {
    // Refresh data logic
    setSubscriptions(prev => [...prev]);
    setFees(prev => [...prev]);
  };

  const handleViewActivePlans = () => {
    setStatusFilter('active');
    setPage(1);
  };

  const handleViewInactivePlans = () => {
    setStatusFilter('inactive');
    setPage(1);
  };

  const handleViewActiveFees = () => {
    setStatusFilter('active');
    setPage(1);
  };

  const handleViewPendingFees = () => {
    setStatusFilter('pending');
    setPage(1);
  };

  const handleViewAllItems = () => {
    setStatusFilter('all');
    setSearchTerm('');
    setUserTypeFilter('all');
    setPage(1);
  };

  const handleCreateSubscription = () => {
    setShowCreateSubscription(true);
  };

  const handleCreateFee = () => {
    setShowCreateFee(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'member': return <User className="w-4 h-4" />;
      case 'vendor': return <Building className="w-4 h-4" />;
      case 'group-admin': return <Users className="w-4 h-4" />;
      case 'product-admin': return <Shield className="w-4 h-4" />;
      case 'all': return <Globe className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getFeeTypeIcon = (type: string) => {
    switch (type) {
      case 'transaction': return <CreditCard className="w-4 h-4" />;
      case 'escrow': return <Shield className="w-4 h-4" />;
      case 'vendor-commission': return <Percent className="w-4 h-4" />;
      case 'withdrawal': return <DollarSign className="w-4 h-4" />;
      case 'subscription': return <Calendar className="w-4 h-4" />;
      case 'platform': return <Layers className="w-4 h-4" />;
      case 'other': return <Tag className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0F2A75] mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
            Subscription & Fee Management
          </h1>
          <p className="text-[#098DCF] text-lg" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
            Comprehensive platform-wide subscription plans and fee structure management
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportData}
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

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === 'subscription'
                ? 'bg-[#098DCF] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscription Management</span>
          </button>
          <button
            onClick={() => setActiveTab('fee')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === 'fee'
                ? 'bg-[#098DCF] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Fee Management</span>
          </button>
        </div>

        {/* Summary Cards */}
        {activeTab === 'subscription' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Plans</p>
                  <p className="text-3xl font-bold text-[#0F2A75]">{subscriptionStats.totalSubscriptions}</p>
                </div>
                <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
                  <CreditCard className="w-8 h-8 text-[#098DCF]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Plans</p>
                  <p className="text-3xl font-bold text-green-600">{subscriptionStats.activePlans}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Inactive Plans</p>
                  <p className="text-3xl font-bold text-red-600">{subscriptionStats.inactivePlans}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Subscribers</p>
                  <p className="text-3xl font-bold text-blue-600">{subscriptionStats.totalSubscribers.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">${subscriptionStats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Categories</p>
                  <p className="text-3xl font-bold text-[#0F2A75]">{feeStats.totalFeeCategories}</p>
                </div>
                <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
                  <Tag className="w-8 h-8 text-[#098DCF]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Fees</p>
                  <p className="text-3xl font-bold text-green-600">{feeStats.activeFees}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Inactive Fees</p>
                  <p className="text-3xl font-bold text-red-600">{feeStats.inactiveFees}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending Updates</p>
                  <p className="text-3xl font-bold text-orange-600">{feeStats.pendingUpdates}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Fee Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{feeStats.averageFeeRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Percent className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          {activeTab === 'subscription' ? (
            <>
              <button
                onClick={handleCreateSubscription}
                className="bg-[#098DCF] hover:bg-[#0F2A75] text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Subscription Plan</span>
              </button>
              <button
                onClick={handleViewActivePlans}
                className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View Active Plans</span>
              </button>
              <button
                onClick={handleViewInactivePlans}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
              >
                <XCircle className="w-4 h-4" />
                <span>View Inactive Plans</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCreateFee}
                className="bg-[#098DCF] hover:bg-[#0F2A75] text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Fee Structure</span>
              </button>
              <button
                onClick={handleViewActiveFees}
                className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View Active Fees</span>
              </button>
              <button
                onClick={handleViewPendingFees}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
              >
                <Clock className="w-4 h-4" />
                <span>View Pending Updates</span>
              </button>
            </>
          )}
          <button
            onClick={handleViewAllItems}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>View All</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'subscription' ? 'subscriptions' : 'fees'}...`}
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
            {activeTab === 'subscription' && <option value="draft">Draft</option>}
            {activeTab === 'fee' && <option value="pending">Pending</option>}
          </select>

          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All User Types</option>
            <option value="member">Member</option>
            <option value="vendor">Vendor</option>
            <option value="group-admin">Group Admin</option>
            <option value="product-admin">Product Admin</option>
            <option value="all">All</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setUserTypeFilter('all');
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>

        {/* Data Table */}
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
                      <span>{activeTab === 'subscription' ? 'Plan Name' : 'Fee Name'}</span>
                      {sortBy === 'name' && (
                        <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{activeTab === 'subscription' ? 'Price' : 'Rate'}</span>
                      {sortBy === 'price' && (
                        <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'subscription' ? 'Duration' : 'Type'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Access Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === 'subscription' && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribers
                    </th>
                  )}
                  {activeTab === 'fee' && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated By
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {activeTab === 'subscription' 
                          ? (item as SubscriptionPlan).description
                          : (item as FeeStructure).description
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {activeTab === 'subscription' 
                          ? `$${(item as SubscriptionPlan).price} ${(item as SubscriptionPlan).currency}`
                          : `${(item as FeeStructure).rate}${(item as FeeStructure).rateType === 'percentage' ? '%' : ''} ${(item as FeeStructure).currency}`
                        }
                      </div>
                      {activeTab === 'fee' && (
                        <div className="text-xs text-gray-500 capitalize">
                          {(item as FeeStructure).rateType}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {activeTab === 'subscription' ? (
                          <>
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900 capitalize">
                              {(item as SubscriptionPlan).duration}
                            </span>
                          </>
                        ) : (
                          <>
                            {getFeeTypeIcon((item as FeeStructure).type)}
                            <span className="text-sm text-gray-900 capitalize">
                              {(item as FeeStructure).type.replace('-', ' ')}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getUserTypeIcon(item.accessLevel || (item as FeeStructure).applicableUserType)}
                        <span className="text-sm text-gray-900 capitalize">
                          {item.accessLevel || (item as FeeStructure).applicableUserType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </span>
                    </td>
                    {activeTab === 'subscription' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(item as SubscriptionPlan).subscriberCount.toLocaleString()}
                      </td>
                    )}
                    {activeTab === 'fee' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(item as FeeStructure).updatedBy}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewItem(item)}
                          className="text-[#098DCF] hover:text-[#0F2A75] transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`transition-colors duration-200 ${
                            item.status === 'active' 
                              ? 'text-red-600 hover:text-red-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                          title={item.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {item.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item)}
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
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, currentData.length)} of {currentData.length} {activeTab === 'subscription' ? 'subscriptions' : 'fees'}
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
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedItem.name}"? This action cannot be undone.
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
                  if (activeTab === 'subscription') {
                    setSubscriptions(prev => prev.filter(sub => sub.id !== selectedItem.id));
                  } else {
                    setFees(prev => prev.filter(fee => fee.id !== selectedItem.id));
                  }
                  setShowDeleteModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Subscription Modal */}
      {showCreateSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#0F2A75]">Create New Subscription Plan</h3>
              <button
                onClick={() => setShowCreateSubscription(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter plan name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select Duration</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Level <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select Access Level</option>
                    <option value="member">Member</option>
                    <option value="vendor">Vendor</option>
                    <option value="group-admin">Group Admin</option>
                    <option value="product-admin">Product Admin</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe the subscription plan..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Benefits
                </label>
                <textarea
                  placeholder="List the benefits of this plan..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setShowCreateSubscription(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Subscription plan creation functionality would be implemented here');
                  setShowCreateSubscription(false);
                }}
                className="px-6 py-2 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75]"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Fee Modal */}
      {showCreateFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#0F2A75]">Create New Fee Structure</h3>
              <button
                onClick={() => setShowCreateFee(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fee Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter fee name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fee Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select Fee Type</option>
                    <option value="transaction">Transaction Fee</option>
                    <option value="escrow">Escrow Fee</option>
                    <option value="vendor-commission">Vendor Commission</option>
                    <option value="withdrawal">Withdrawal Fee</option>
                    <option value="subscription">Subscription Fee</option>
                    <option value="platform">Platform Fee</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select Rate Type</option>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Applicable User Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select User Type</option>
                    <option value="member">Member</option>
                    <option value="vendor">Vendor</option>
                    <option value="group-admin">Group Admin</option>
                    <option value="product-admin">Product Admin</option>
                    <option value="all">All</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe the fee structure..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setShowCreateFee(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Fee structure creation functionality would be implemented here');
                  setShowCreateFee(false);
                }}
                className="px-6 py-2 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75]"
              >
                Create Fee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
