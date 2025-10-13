import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Search, 
  Filter,
  Plus,
  TrendingUp,
  Users,
  FileText,
  X,
  Save,
  ArrowRight,
  Calendar,
  User,
  Building,
  Lock,
  Unlock,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface EscrowTransaction {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'active' | 'released' | 'disputed' | 'expired' | 'cancelled' | 'pending';
  buyer: {
    id: string;
    name: string;
    email: string;
    role: 'member' | 'vendor' | 'group-admin' | 'product-admin';
  };
  seller: {
    id: string;
    name: string;
    email: string;
    role: 'member' | 'vendor' | 'group-admin' | 'product-admin';
  };
  createdAt: string;
  expiresAt: string;
  releasedAt?: string;
  description: string;
  category: 'service' | 'product' | 'consultation' | 'development' | 'other';
  platformSegment: 'marketplace' | 'groups' | 'direct' | 'other';
  disputeReason?: string;
  adminNotes?: string;
  fees: {
    platformFee: number;
    processingFee: number;
    totalFees: number;
  };
  milestones?: {
    id: string;
    description: string;
    amount: number;
    status: 'pending' | 'completed' | 'rejected';
    completedAt?: string;
  }[];
}

interface EscrowStats {
  totalEscrows: number;
  activeEscrows: number;
  releasedEscrows: number;
  disputedEscrows: number;
  totalAmount: number;
  totalFees: number;
  averageResolutionTime: number; // in hours
}

export const SuperAdminEscrowManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'disputes' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'released' | 'disputed' | 'expired' | 'cancelled' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'service' | 'product' | 'consultation' | 'development' | 'other'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'marketplace' | 'groups' | 'direct' | 'other'>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '7d' | '30d' | '90d'>('all');
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowTransaction | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'amount' | 'status' | 'expiresAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Sample data
  const [escrows, setEscrows] = useState<EscrowTransaction[]>([
    {
      id: 'escrow-1',
      transactionId: 'TXN-001',
      amount: 2500.00,
      currency: 'USD',
      status: 'active',
      buyer: {
        id: 'user-1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        role: 'member'
      },
      seller: {
        id: 'user-2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        role: 'vendor'
      },
      createdAt: '2025-01-15T10:30:00Z',
      expiresAt: '2025-01-22T10:30:00Z',
      description: 'Website development project - Complete e-commerce platform',
      category: 'development',
      platformSegment: 'marketplace',
      fees: {
        platformFee: 75.00,
        processingFee: 25.00,
        totalFees: 100.00
      },
      milestones: [
        {
          id: 'milestone-1',
          description: 'Design mockups and wireframes',
          amount: 500.00,
          status: 'completed',
          completedAt: '2025-01-16T14:20:00Z'
        },
        {
          id: 'milestone-2',
          description: 'Frontend development',
          amount: 1000.00,
          status: 'completed',
          completedAt: '2025-01-18T09:15:00Z'
        },
        {
          id: 'milestone-3',
          description: 'Backend integration',
          amount: 1000.00,
          status: 'pending'
        }
      ]
    },
    {
      id: 'escrow-2',
      transactionId: 'TXN-002',
      amount: 1200.00,
      currency: 'USD',
      status: 'released',
      buyer: {
        id: 'user-3',
        name: 'Mike Wilson',
        email: 'mike.wilson@email.com',
        role: 'member'
      },
      seller: {
        id: 'user-4',
        name: 'Lisa Brown',
        email: 'lisa.brown@email.com',
        role: 'vendor'
      },
      createdAt: '2025-01-14T14:20:00Z',
      expiresAt: '2025-01-21T14:20:00Z',
      releasedAt: '2025-01-20T16:45:00Z',
      description: 'Logo design service - Brand identity package',
      category: 'service',
      platformSegment: 'marketplace',
      fees: {
        platformFee: 36.00,
        processingFee: 12.00,
        totalFees: 48.00
      }
    },
    {
      id: 'escrow-3',
      transactionId: 'TXN-003',
      amount: 5000.00,
      currency: 'USD',
      status: 'disputed',
      buyer: {
        id: 'user-5',
        name: 'David Lee',
        email: 'david.lee@email.com',
        role: 'member'
      },
      seller: {
        id: 'user-6',
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        role: 'vendor'
      },
      createdAt: '2025-01-13T09:15:00Z',
      expiresAt: '2025-01-20T09:15:00Z',
      description: 'Mobile app development - iOS and Android app',
      category: 'development',
      platformSegment: 'marketplace',
      disputeReason: 'Quality issues - App crashes frequently',
      adminNotes: 'Under review - Technical assessment required',
      fees: {
        platformFee: 150.00,
        processingFee: 50.00,
        totalFees: 200.00
      }
    },
    {
      id: 'escrow-4',
      transactionId: 'TXN-004',
      amount: 800.00,
      currency: 'USD',
      status: 'pending',
      buyer: {
        id: 'user-7',
        name: 'Anna Martinez',
        email: 'anna.martinez@email.com',
        role: 'member'
      },
      seller: {
        id: 'user-8',
        name: 'Robert Kim',
        email: 'robert.kim@email.com',
        role: 'vendor'
      },
      createdAt: '2025-01-12T11:30:00Z',
      expiresAt: '2025-01-19T11:30:00Z',
      description: 'Consultation service - Business strategy planning',
      category: 'consultation',
      platformSegment: 'groups',
      fees: {
        platformFee: 24.00,
        processingFee: 8.00,
        totalFees: 32.00
      }
    },
    {
      id: 'escrow-5',
      transactionId: 'TXN-005',
      amount: 300.00,
      currency: 'USD',
      status: 'expired',
      buyer: {
        id: 'user-9',
        name: 'Chris Taylor',
        email: 'chris.taylor@email.com',
        role: 'member'
      },
      seller: {
        id: 'user-10',
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        role: 'vendor'
      },
      createdAt: '2025-01-10T08:45:00Z',
      expiresAt: '2025-01-17T08:45:00Z',
      description: 'Content writing service - Blog articles',
      category: 'service',
      platformSegment: 'marketplace',
      fees: {
        platformFee: 9.00,
        processingFee: 3.00,
        totalFees: 12.00
      }
    }
  ]);

  // Calculate stats
  const stats: EscrowStats = useMemo(() => {
    const total = escrows.length;
    const active = escrows.filter(e => e.status === 'active').length;
    const released = escrows.filter(e => e.status === 'released').length;
    const disputed = escrows.filter(e => e.status === 'disputed').length;
    const totalAmount = escrows.reduce((sum, e) => sum + e.amount, 0);
    const totalFees = escrows.reduce((sum, e) => sum + e.fees.totalFees, 0);
    
    const releasedEscrows = escrows.filter(e => e.releasedAt);
    const avgResolutionTime = releasedEscrows.length > 0 
      ? releasedEscrows.reduce((sum, e) => {
          const created = new Date(e.createdAt).getTime();
          const released = new Date(e.releasedAt!).getTime();
          return sum + ((released - created) / (1000 * 60 * 60)); // Convert to hours
        }, 0) / releasedEscrows.length
      : 0;
    
    return { 
      totalEscrows: total, 
      activeEscrows: active, 
      releasedEscrows: released, 
      disputedEscrows: disputed, 
      totalAmount, 
      totalFees,
      averageResolutionTime: Math.round(avgResolutionTime)
    };
  }, [escrows]);

  // Filter and sort escrows
  const filteredEscrows = useMemo(() => {
    let filtered = escrows.filter(escrow => {
      const matchesSearch = escrow.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           escrow.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           escrow.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           escrow.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || escrow.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || escrow.category === categoryFilter;
      const matchesPlatform = platformFilter === 'all' || escrow.platformSegment === platformFilter;
      
      // Date range filter
      const escrowDate = new Date(escrow.createdAt);
      const now = new Date();
      let matchesDate = true;
      if (dateRangeFilter !== 'all') {
        const days = parseInt(dateRangeFilter.replace('d', ''));
        const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
        matchesDate = escrowDate >= cutoffDate;
      }
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPlatform && matchesDate;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'expiresAt':
          aValue = new Date(a.expiresAt).getTime();
          bValue = new Date(b.expiresAt).getTime();
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }
      
      if (sortDir === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [escrows, searchTerm, statusFilter, categoryFilter, platformFilter, dateRangeFilter, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filteredEscrows.length / pageSize);
  const paginatedEscrows = filteredEscrows.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  };

  const handleViewEscrow = (escrow: EscrowTransaction) => {
    setSelectedEscrow(escrow);
    setShowViewModal(true);
  };

  const handleReleaseEscrow = (escrow: EscrowTransaction) => {
    setSelectedEscrow(escrow);
    setShowReleaseModal(true);
  };

  const handleDisputeEscrow = (escrow: EscrowTransaction) => {
    setSelectedEscrow(escrow);
    setShowDisputeModal(true);
  };

  const handleCancelEscrow = (escrow: EscrowTransaction) => {
    setSelectedEscrow(escrow);
    setShowCancelModal(true);
  };

  const handleViewActiveEscrows = () => {
    setStatusFilter('active');
    setPage(1);
  };

  const handleViewDisputedEscrows = () => {
    setStatusFilter('disputed');
    setPage(1);
  };

  const handleExportEscrows = () => {
    const csvData = filteredEscrows.map(escrow => ({
      'Transaction ID': escrow.transactionId,
      'Amount': escrow.amount,
      'Currency': escrow.currency,
      'Status': escrow.status,
      'Buyer': escrow.buyer.name,
      'Buyer Email': escrow.buyer.email,
      'Seller': escrow.seller.name,
      'Seller Email': escrow.seller.email,
      'Description': escrow.description,
      'Category': escrow.category,
      'Platform Segment': escrow.platformSegment,
      'Created At': escrow.createdAt,
      'Expires At': escrow.expiresAt,
      'Released At': escrow.releasedAt || 'N/A',
      'Platform Fee': escrow.fees.platformFee,
      'Processing Fee': escrow.fees.processingFee,
      'Total Fees': escrow.fees.totalFees
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
    link.setAttribute('download', `escrow-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefreshData = () => {
    setEscrows(prev => [...prev]);
  };

  const handleCreateEscrow = () => {
    setShowCreateModal(true);
  };

  const handleViewAllEscrows = () => {
    setStatusFilter('all');
    setSearchTerm('');
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'released': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'released': return <CheckCircle2 className="w-4 h-4" />;
      case 'disputed': return <AlertTriangle className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      case 'pending': return <Pause className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'member': return <User className="w-4 h-4" />;
      case 'vendor': return <Building className="w-4 h-4" />;
      case 'group-admin': return <Users className="w-4 h-4" />;
      case 'product-admin': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0F2A75] mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
            Escrow Management System
          </h1>
          <p className="text-[#098DCF] text-lg" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
            Comprehensive platform-wide escrow transaction oversight and management
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Escrows</p>
              <p className="text-3xl font-bold text-[#0F2A75]">{stats.totalEscrows}</p>
            </div>
            <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
              <Shield className="w-8 h-8 text-[#098DCF]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
              <p className="text-3xl font-bold text-blue-600">{stats.activeEscrows}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Released</p>
              <p className="text-3xl font-bold text-green-600">{stats.releasedEscrows}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Disputed</p>
              <p className="text-3xl font-bold text-red-600">{stats.disputedEscrows}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-purple-600">${stats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleViewActiveEscrows}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Clock className="w-4 h-4" />
            <span>View Active Escrows</span>
          </button>
          <button
            onClick={handleViewDisputedEscrows}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>View Disputed Escrows</span>
          </button>
          <button
            onClick={handleExportEscrows}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export Escrows</span>
          </button>
          <button
            onClick={handleCreateEscrow}
            className="bg-[#098DCF] hover:bg-[#0F2A75] text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Escrow</span>
          </button>
          <button
            onClick={handleViewAllEscrows}
            className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>View All Escrows</span>
          </button>
          <button
            onClick={handleRefreshData}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
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
              placeholder="Search escrows..."
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
            <option value="released">Released</option>
            <option value="disputed">Disputed</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="service">Service</option>
            <option value="product">Product</option>
            <option value="consultation">Consultation</option>
            <option value="development">Development</option>
            <option value="other">Other</option>
          </select>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Platforms</option>
            <option value="marketplace">Marketplace</option>
            <option value="groups">Groups</option>
            <option value="direct">Direct</option>
            <option value="other">Other</option>
          </select>

          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('all');
              setPlatformFilter('all');
              setDateRangeFilter('all');
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Escrows Table */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Transaction ID</span>
                    {sortBy === 'createdAt' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    {sortBy === 'amount' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parties
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
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
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('expiresAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Expires</span>
                    {sortBy === 'expiresAt' && (
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
              {paginatedEscrows.map((escrow) => (
                <tr key={escrow.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{escrow.transactionId}</div>
                    <div className="text-sm text-gray-500">{escrow.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${escrow.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{escrow.currency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(escrow.buyer.role)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{escrow.buyer.name}</div>
                          <div className="text-xs text-gray-500">Buyer</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(escrow.seller.role)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{escrow.seller.name}</div>
                          <div className="text-xs text-gray-500">Seller</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{escrow.description}</div>
                    <div className="text-xs text-gray-500 capitalize">{escrow.platformSegment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{escrow.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(escrow.status)}`}>
                      {getStatusIcon(escrow.status)}
                      <span className="ml-1 capitalize">{escrow.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(escrow.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewEscrow(escrow)}
                        className="text-[#098DCF] hover:text-[#0F2A75] transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {escrow.status === 'active' && (
                        <button
                          onClick={() => handleReleaseEscrow(escrow)}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200"
                          title="Release Funds"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      )}
                      {escrow.status === 'active' && (
                        <button
                          onClick={() => handleDisputeEscrow(escrow)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          title="Create Dispute"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                      {escrow.status === 'active' && (
                        <button
                          onClick={() => handleCancelEscrow(escrow)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                          title="Cancel Escrow"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
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
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredEscrows.length)} of {filteredEscrows.length} escrows
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

      {/* View Escrow Modal */}
      {showViewModal && selectedEscrow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#0F2A75]">{selectedEscrow.transactionId}</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <p className="text-2xl font-bold text-gray-900">${selectedEscrow.amount.toLocaleString()} {selectedEscrow.currency}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEscrow.status)}`}>
                    {getStatusIcon(selectedEscrow.status)}
                    <span className="ml-1 capitalize">{selectedEscrow.status}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900 capitalize">{selectedEscrow.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform Segment</label>
                  <p className="text-gray-900 capitalize">{selectedEscrow.platformSegment}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                  <p className="text-gray-900">{new Date(selectedEscrow.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                  <p className="text-gray-900">{new Date(selectedEscrow.expiresAt).toLocaleString()}</p>
                </div>
                {selectedEscrow.releasedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Released At</label>
                    <p className="text-gray-900">{new Date(selectedEscrow.releasedAt).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">Platform: ${selectedEscrow.fees.platformFee}</p>
                    <p className="text-sm text-gray-900">Processing: ${selectedEscrow.fees.processingFee}</p>
                    <p className="text-sm font-medium text-gray-900">Total: ${selectedEscrow.fees.totalFees}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{selectedEscrow.description}</p>
            </div>

            {selectedEscrow.milestones && selectedEscrow.milestones.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Milestones</label>
                <div className="space-y-3">
                  {selectedEscrow.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{milestone.description}</div>
                        <div className="text-sm text-gray-600">${milestone.amount}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Close
              </button>
              {selectedEscrow.status === 'active' && (
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleReleaseEscrow(selectedEscrow);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                >
                  Release Funds
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Escrow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#0F2A75]">Create New Escrow</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter transaction ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount <span className="text-red-500">*</span>
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
                    Buyer Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="buyer@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seller Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="seller@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe the escrow transaction..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select Category</option>
                    <option value="service">Service</option>
                    <option value="product">Product</option>
                    <option value="consultation">Consultation</option>
                    <option value="development">Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform Segment <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select Platform</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="groups">Groups</option>
                    <option value="direct">Direct</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add escrow creation logic here
                  alert('Escrow creation functionality would be implemented here');
                  setShowCreateModal(false);
                }}
                className="px-6 py-2 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75]"
              >
                Create Escrow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
