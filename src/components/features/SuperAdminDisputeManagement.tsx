import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  User, 
  Users, 
  Building, 
  DollarSign,
  Search, 
  Filter, 
  Eye, 
  UserCheck, 
  Send, 
  Download, 
  Plus,
  X,
  Save,
  ArrowRight,
  Calendar,
  MessageSquare,
  FileText,
  Shield,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

interface Dispute {
  id: string;
  title: string;
  description: string;
  category: 'payment' | 'service' | 'fraud' | 'behavior' | 'content' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'under-review' | 'resolved' | 'escalated' | 'closed';
  reportedBy: {
    id: string;
    name: string;
    role: 'member' | 'vendor' | 'group-admin' | 'product-admin' | 'super-admin';
    email: string;
  };
  against: {
    type: 'user' | 'vendor' | 'group' | 'system';
    id: string;
    name: string;
    role?: string;
  };
  dateSubmitted: string;
  lastUpdated: string;
  assignedHandler?: {
    id: string;
    name: string;
    role: string;
  };
  resolution?: string;
  evidence: string[];
  messages: DisputeMessage[];
  platformSegment: 'groups' | 'marketplace' | 'wallet' | 'system' | 'other';
  escalatedTo?: string;
  resolutionTime?: number; // in hours
}

interface DisputeMessage {
  id: string;
  disputeId: string;
  sender: 'user' | 'admin' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface DisputeStats {
  totalDisputes: number;
  pendingDisputes: number;
  resolvedDisputes: number;
  escalatedCases: number;
  averageResolutionTime: number; // in hours
}

export const SuperAdminDisputeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'disputes' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'under-review' | 'resolved' | 'escalated' | 'closed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'payment' | 'service' | 'fraud' | 'behavior' | 'content' | 'technical' | 'other'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'member' | 'vendor' | 'group-admin' | 'product-admin'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'groups' | 'marketplace' | 'wallet' | 'system' | 'other'>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '7d' | '30d' | '90d'>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [sortBy, setSortBy] = useState<'dateSubmitted' | 'priority' | 'status' | 'category'>('dateSubmitted');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Sample data
  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: 'DIS-001',
      title: 'Unauthorized Payment Deduction',
      description: 'User was charged ₦15,000 for a service they did not request. Payment was deducted from wallet without consent.',
      category: 'payment',
      priority: 'high',
      status: 'under-review',
      reportedBy: {
        id: 'user-1',
        name: 'Sarah Johnson',
        role: 'member',
        email: 'sarah.johnson@email.com'
      },
      against: {
        type: 'group',
        id: 'group-1',
        name: 'Community Church',
        role: 'Group Admin'
      },
      dateSubmitted: '2025-01-15T10:30:00Z',
      lastUpdated: '2025-01-15T14:20:00Z',
      assignedHandler: {
        id: 'admin-1',
        name: 'John Smith',
        role: 'Dispute Resolution Officer'
      },
      evidence: ['Transaction receipt', 'Bank statement', 'Screenshot of unauthorized charge'],
      messages: [
        {
          id: 'msg-1',
          disputeId: 'DIS-001',
          sender: 'user',
          senderName: 'Sarah Johnson',
          message: 'I have attached the transaction receipt and bank statement as evidence.',
          timestamp: '2025-01-15T10:35:00Z',
          attachments: ['receipt.pdf', 'statement.pdf']
        },
        {
          id: 'msg-2',
          disputeId: 'DIS-001',
          sender: 'admin',
          senderName: 'John Smith',
          message: 'Thank you for providing the evidence. We are reviewing your case and will respond within 24 hours.',
          timestamp: '2025-01-15T14:20:00Z'
        }
      ],
      platformSegment: 'wallet'
    },
    {
      id: 'DIS-002',
      title: 'Fraudulent Vendor Activity',
      description: 'Vendor is selling counterfeit products and using fake reviews to boost ratings.',
      category: 'fraud',
      priority: 'urgent',
      status: 'escalated',
      reportedBy: {
        id: 'user-2',
        name: 'Mike Wilson',
        role: 'member',
        email: 'mike.wilson@email.com'
      },
      against: {
        type: 'vendor',
        id: 'vendor-1',
        name: 'Tech Solutions Inc',
        role: 'Vendor'
      },
      dateSubmitted: '2025-01-14T16:45:00Z',
      lastUpdated: '2025-01-15T09:15:00Z',
      assignedHandler: {
        id: 'admin-2',
        name: 'Lisa Brown',
        role: 'Senior Dispute Resolution Officer'
      },
      escalatedTo: 'Legal Department',
      evidence: ['Product photos', 'Review screenshots', 'Communication logs'],
      messages: [
        {
          id: 'msg-3',
          disputeId: 'DIS-002',
          sender: 'user',
          senderName: 'Mike Wilson',
          message: 'I have evidence of counterfeit products being sold by this vendor.',
          timestamp: '2025-01-14T16:50:00Z',
          attachments: ['product_photos.pdf']
        }
      ],
      platformSegment: 'marketplace'
    },
    {
      id: 'DIS-003',
      title: 'Inappropriate Group Content',
      description: 'Member posted offensive content in group chat that violates community guidelines.',
      category: 'behavior',
      priority: 'medium',
      status: 'resolved',
      reportedBy: {
        id: 'user-3',
        name: 'David Lee',
        role: 'member',
        email: 'david.lee@email.com'
      },
      against: {
        type: 'user',
        id: 'user-4',
        name: 'John Doe',
        role: 'Member'
      },
      dateSubmitted: '2025-01-13T11:20:00Z',
      lastUpdated: '2025-01-14T09:15:00Z',
      assignedHandler: {
        id: 'admin-3',
        name: 'Emma Davis',
        role: 'Content Moderator'
      },
      resolution: 'Content has been removed and user has been warned. Group moderators have been notified.',
      evidence: ['Chat screenshots', 'Content report'],
      messages: [],
      platformSegment: 'groups',
      resolutionTime: 22
    },
    {
      id: 'DIS-004',
      title: 'Service Not Delivered',
      description: 'Paid for professional consultation service but provider did not show up for scheduled appointment.',
      category: 'service',
      priority: 'medium',
      status: 'pending',
      reportedBy: {
        id: 'user-5',
        name: 'Anna Martinez',
        role: 'member',
        email: 'anna.martinez@email.com'
      },
      against: {
        type: 'vendor',
        id: 'vendor-2',
        name: 'Consulting Pro',
        role: 'Vendor'
      },
      dateSubmitted: '2025-01-12T14:30:00Z',
      lastUpdated: '2025-01-12T14:30:00Z',
      evidence: ['Payment confirmation', 'Appointment booking', 'No-show evidence'],
      messages: [],
      platformSegment: 'marketplace'
    },
    {
      id: 'DIS-005',
      title: 'System Error Causing Data Loss',
      description: 'Technical issue caused loss of important group data and member information.',
      category: 'technical',
      priority: 'high',
      status: 'under-review',
      reportedBy: {
        id: 'admin-4',
        name: 'Robert Kim',
        role: 'group-admin',
        email: 'robert.kim@email.com'
      },
      against: {
        type: 'system',
        id: 'system-1',
        name: 'Platform System',
        role: 'System'
      },
      dateSubmitted: '2025-01-11T08:15:00Z',
      lastUpdated: '2025-01-15T10:30:00Z',
      assignedHandler: {
        id: 'admin-5',
        name: 'Tech Support Team',
        role: 'Technical Support'
      },
      evidence: ['Error logs', 'Data backup files', 'System reports'],
      messages: [],
      platformSegment: 'system'
    }
  ]);

  // Calculate stats
  const stats: DisputeStats = useMemo(() => {
    const total = disputes.length;
    const pending = disputes.filter(d => d.status === 'pending').length;
    const resolved = disputes.filter(d => d.status === 'resolved').length;
    const escalated = disputes.filter(d => d.status === 'escalated').length;
    const resolvedDisputes = disputes.filter(d => d.resolutionTime);
    const avgResolutionTime = resolvedDisputes.length > 0 
      ? resolvedDisputes.reduce((sum, d) => sum + (d.resolutionTime || 0), 0) / resolvedDisputes.length 
      : 0;
    
    return { 
      totalDisputes: total, 
      pendingDisputes: pending, 
      resolvedDisputes: resolved, 
      escalatedCases: escalated, 
      averageResolutionTime: Math.round(avgResolutionTime) 
    };
  }, [disputes]);

  // Filter and sort disputes
  const filteredDisputes = useMemo(() => {
    let filtered = disputes.filter(dispute => {
      const matchesSearch = dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dispute.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || dispute.category === categoryFilter;
      const matchesRole = roleFilter === 'all' || dispute.reportedBy.role === roleFilter;
      const matchesPlatform = platformFilter === 'all' || dispute.platformSegment === platformFilter;
      
      // Date range filter
      const disputeDate = new Date(dispute.dateSubmitted);
      const now = new Date();
      let matchesDate = true;
      if (dateRangeFilter !== 'all') {
        const days = parseInt(dateRangeFilter.replace('d', ''));
        const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
        matchesDate = disputeDate >= cutoffDate;
      }
      
      return matchesSearch && matchesStatus && matchesCategory && matchesRole && matchesPlatform && matchesDate;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'dateSubmitted':
          aValue = new Date(a.dateSubmitted).getTime();
          bValue = new Date(b.dateSubmitted).getTime();
          break;
        case 'priority':
          const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = new Date(a.dateSubmitted).getTime();
          bValue = new Date(b.dateSubmitted).getTime();
      }
      
      if (sortDir === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [disputes, searchTerm, statusFilter, categoryFilter, roleFilter, platformFilter, dateRangeFilter, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filteredDisputes.length / pageSize);
  const paginatedDisputes = filteredDisputes.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  };

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowViewModal(true);
  };

  const handleAssignDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowAssignModal(true);
  };

  const handleResolveDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowResolveModal(true);
  };

  const handleEscalateDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowEscalateModal(true);
  };

  const handleViewPendingDisputes = () => {
    setStatusFilter('pending');
    setPage(1);
  };

  const handleExportDisputes = () => {
    const csvData = filteredDisputes.map(dispute => ({
      'Dispute ID': dispute.id,
      'Title': dispute.title,
      'Category': dispute.category,
      'Priority': dispute.priority,
      'Status': dispute.status,
      'Reported By': dispute.reportedBy.name,
      'Reporter Role': dispute.reportedBy.role,
      'Against': dispute.against.name,
      'Against Type': dispute.against.type,
      'Date Submitted': dispute.dateSubmitted,
      'Last Updated': dispute.lastUpdated,
      'Assigned Handler': dispute.assignedHandler?.name || 'Unassigned',
      'Platform Segment': dispute.platformSegment,
      'Resolution Time (Hours)': dispute.resolutionTime || 'N/A'
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
    link.setAttribute('download', `disputes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAssignCases = () => {
    // Show unassigned disputes and allow bulk assignment
    const unassignedDisputes = disputes.filter(d => !d.assignedHandler);
    if (unassignedDisputes.length === 0) {
      alert('All disputes are already assigned to handlers.');
      return;
    }
    
    // Filter to show only unassigned disputes
    setStatusFilter('all');
    setSearchTerm('unassigned');
    setPage(1);
    
    // You could also open a modal for bulk assignment here
    alert(`Found ${unassignedDisputes.length} unassigned disputes. Use the table below to assign them individually.`);
  };

  const handleRefreshData = () => {
    // Simulate data refresh
    setDisputes(prev => [...prev]);
  };

  const handleViewAllDisputes = () => {
    setStatusFilter('all');
    setSearchTerm('');
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'under-review': return <Eye className="w-4 h-4" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4" />;
      case 'escalated': return <AlertTriangle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'member': return <User className="w-4 h-4" />;
      case 'vendor': return <Building className="w-4 h-4" />;
      case 'group-admin': return <Users className="w-4 h-4" />;
      case 'product-admin': return <Shield className="w-4 h-4" />;
      case 'super-admin': return <Target className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0F2A75] mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
            Dispute Management
          </h1>
          <p className="text-[#098DCF] text-lg" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
            Comprehensive platform-wide dispute oversight and resolution
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Disputes</p>
              <p className="text-3xl font-bold text-[#0F2A75]">{stats.totalDisputes}</p>
            </div>
            <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-[#098DCF]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingDisputes}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolvedDisputes}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Escalated</p>
              <p className="text-3xl font-bold text-red-600">{stats.escalatedCases}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Resolution</p>
              <p className="text-3xl font-bold text-blue-600">{stats.averageResolutionTime}h</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleViewPendingDisputes}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Clock className="w-4 h-4" />
            <span>View Pending Disputes</span>
          </button>
          <button
            onClick={handleAssignCases}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <UserCheck className="w-4 h-4" />
            <span>Assign Cases</span>
          </button>
          <button
            onClick={handleExportDisputes}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export Disputes</span>
          </button>
          <button
            onClick={handleViewAllDisputes}
            className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>View All Disputes</span>
          </button>
          <button
            onClick={handleRefreshData}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search disputes..."
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
            <option value="pending">Pending</option>
            <option value="under-review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="payment">Payment</option>
            <option value="service">Service</option>
            <option value="fraud">Fraud</option>
            <option value="behavior">Behavior</option>
            <option value="content">Content</option>
            <option value="technical">Technical</option>
            <option value="other">Other</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="member">Member</option>
            <option value="vendor">Vendor</option>
            <option value="group-admin">Group Admin</option>
            <option value="product-admin">Product Admin</option>
          </select>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Platforms</option>
            <option value="groups">Groups</option>
            <option value="marketplace">Marketplace</option>
            <option value="wallet">Wallet</option>
            <option value="system">System</option>
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
              setRoleFilter('all');
              setPlatformFilter('all');
              setDateRangeFilter('all');
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('dateSubmitted')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Dispute ID</span>
                    {sortBy === 'dateSubmitted' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported By
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Against
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    {sortBy === 'category' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Submitted
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
                  Assigned Handler
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDisputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{dispute.id}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(dispute.priority)}`}>
                        {dispute.priority.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getRoleIcon(dispute.reportedBy.role)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{dispute.reportedBy.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{dispute.reportedBy.role.replace('-', ' ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {dispute.against.type === 'user' && <User className="w-4 h-4 text-gray-400" />}
                      {dispute.against.type === 'vendor' && <Building className="w-4 h-4 text-gray-400" />}
                      {dispute.against.type === 'group' && <Users className="w-4 h-4 text-gray-400" />}
                      {dispute.against.type === 'system' && <Shield className="w-4 h-4 text-gray-400" />}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{dispute.against.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{dispute.against.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{dispute.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{dispute.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(dispute.dateSubmitted).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                      {getStatusIcon(dispute.status)}
                      <span className="ml-1 capitalize">{dispute.status.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dispute.assignedHandler ? dispute.assignedHandler.name : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDispute(dispute)}
                        className="text-[#098DCF] hover:text-[#0F2A75] transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAssignDispute(dispute)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        title="Assign"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResolveDispute(dispute)}
                        className="text-green-600 hover:text-green-800 transition-colors duration-200"
                        title="Resolve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEscalateDispute(dispute)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="Escalate"
                      >
                        <AlertTriangle className="w-4 h-4" />
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
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredDisputes.length)} of {filteredDisputes.length} disputes
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

      {/* View Dispute Modal */}
      {showViewModal && selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#0F2A75]">{selectedDispute.title}</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dispute ID</label>
                  <p className="text-gray-900 font-mono">{selectedDispute.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900 capitalize">{selectedDispute.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedDispute.priority)}`}>
                    {selectedDispute.priority.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDispute.status)}`}>
                    {getStatusIcon(selectedDispute.status)}
                    <span className="ml-1 capitalize">{selectedDispute.status.replace('-', ' ')}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform Segment</label>
                  <p className="text-gray-900 capitalize">{selectedDispute.platformSegment}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(selectedDispute.reportedBy.role)}
                    <div>
                      <p className="text-gray-900 font-medium">{selectedDispute.reportedBy.name}</p>
                      <p className="text-sm text-gray-500">{selectedDispute.reportedBy.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Against</label>
                  <div className="flex items-center space-x-2">
                    {selectedDispute.against.type === 'user' && <User className="w-4 h-4 text-gray-400" />}
                    {selectedDispute.against.type === 'vendor' && <Building className="w-4 h-4 text-gray-400" />}
                    {selectedDispute.against.type === 'group' && <Users className="w-4 h-4 text-gray-400" />}
                    {selectedDispute.against.type === 'system' && <Shield className="w-4 h-4 text-gray-400" />}
                    <div>
                      <p className="text-gray-900 font-medium">{selectedDispute.against.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{selectedDispute.against.type}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Handler</label>
                  <p className="text-gray-900">{selectedDispute.assignedHandler?.name || 'Unassigned'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Submitted</label>
                  <p className="text-gray-900">{new Date(selectedDispute.dateSubmitted).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{selectedDispute.description}</p>
            </div>

            {selectedDispute.evidence.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Evidence</label>
                <div className="space-y-2">
                  {selectedDispute.evidence.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDispute.messages.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Messages</label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedDispute.messages.map((message) => (
                    <div key={message.id} className="flex space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0">
                        {message.sender === 'user' ? <User className="w-4 h-4 text-blue-600" /> : <Shield className="w-4 h-4 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{message.senderName}</span>
                          <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-700">{message.message}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2">
                            {message.attachments.map((attachment, index) => (
                              <span key={index} className="inline-block text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mr-2">
                                {attachment}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
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
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleAssignDispute(selectedDispute);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Assign Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
