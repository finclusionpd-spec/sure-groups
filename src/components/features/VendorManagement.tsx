import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Shield, 
  Star, 
  Calendar,
  Building2,
  Mail,
  Phone,
  MapPin,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  MoreVertical,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  kycTier: 1 | 2 | 3;
  kycStatus: 'pending' | 'verified' | 'rejected';
  activeServices: number;
  rating: number;
  reviewCount: number;
  registrationDate: string;
  status: 'active' | 'suspended';
  category: string;
  totalRevenue: number;
  lastLogin: string;
  documents: VendorDocument[];
  services: VendorService[];
  transactions: VendorTransaction[];
}

interface VendorDocument {
  id: string;
  type: 'kyc' | 'kyb' | 'license' | 'certificate';
  name: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface VendorService {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'active' | 'inactive';
  orders: number;
}

interface VendorTransaction {
  id: string;
  amount: number;
  type: 'payment' | 'refund' | 'commission';
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface VendorStats {
  totalVendors: number;
  activeVendors: number;
  pendingKYC: number;
  suspendedVendors: number;
  totalRevenue: number;
  averageRating: number;
}

export const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [stats, setStats] = useState<VendorStats>({
    totalVendors: 0,
    activeVendors: 0,
    pendingKYC: 0,
    suspendedVendors: 0,
    totalRevenue: 0,
    averageRating: 0
  });

  // Mock data
  useEffect(() => {
    const mockVendors: Vendor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        businessName: 'HealthCare Plus',
        email: 'sarah@healthcareplus.com',
        phone: '+234-801-234-5678',
        address: '123 Medical District, Lagos',
        kycTier: 3,
        kycStatus: 'verified',
        activeServices: 5,
        rating: 4.8,
        reviewCount: 127,
        registrationDate: '2024-01-15',
        status: 'active',
        category: 'Healthcare',
        totalRevenue: 45000,
        lastLogin: '2024-01-20 14:30',
        documents: [
          { id: '1', type: 'kyc', name: 'National ID', url: '#', uploadedAt: '2024-01-15', status: 'approved' },
          { id: '2', type: 'kyb', name: 'Business License', url: '#', uploadedAt: '2024-01-15', status: 'approved' }
        ],
        services: [
          { id: '1', name: 'Health Screening', category: 'Medical', price: 150, status: 'active', orders: 45 },
          { id: '2', name: 'Consultation', category: 'Medical', price: 75, status: 'active', orders: 23 }
        ],
        transactions: [
          { id: '1', amount: 1500, type: 'payment', date: '2024-01-20', status: 'completed' },
          { id: '2', amount: 750, type: 'payment', date: '2024-01-19', status: 'completed' }
        ]
      },
      {
        id: '2',
        name: 'Michael Chen',
        businessName: 'Tech Solutions Ltd',
        email: 'michael@techsolutions.com',
        phone: '+234-802-345-6789',
        address: '456 Tech Hub, Abuja',
        kycTier: 2,
        kycStatus: 'pending',
        activeServices: 3,
        rating: 4.5,
        reviewCount: 89,
        registrationDate: '2024-01-10',
        status: 'active',
        category: 'Technology',
        totalRevenue: 28000,
        lastLogin: '2024-01-19 09:15',
        documents: [
          { id: '3', type: 'kyc', name: 'Driver License', url: '#', uploadedAt: '2024-01-10', status: 'pending' }
        ],
        services: [
          { id: '3', name: 'Web Development', category: 'IT', price: 500, status: 'active', orders: 12 }
        ],
        transactions: [
          { id: '3', amount: 2500, type: 'payment', date: '2024-01-18', status: 'completed' }
        ]
      },
      {
        id: '3',
        name: 'Aisha Mohammed',
        businessName: 'Creative Designs',
        email: 'aisha@creativedesigns.com',
        phone: '+234-803-456-7890',
        address: '789 Art District, Port Harcourt',
        kycTier: 1,
        kycStatus: 'rejected',
        activeServices: 0,
        rating: 3.2,
        reviewCount: 15,
        registrationDate: '2024-01-05',
        status: 'suspended',
        category: 'Creative',
        totalRevenue: 0,
        lastLogin: '2024-01-15 16:45',
        documents: [
          { id: '4', type: 'kyc', name: 'Voter ID', url: '#', uploadedAt: '2024-01-05', status: 'rejected' }
        ],
        services: [],
        transactions: []
      }
    ];

    setVendors(mockVendors);
    setFilteredVendors(mockVendors);

    // Calculate stats
    const totalVendors = mockVendors.length;
    const activeVendors = mockVendors.filter(v => v.status === 'active').length;
    const pendingKYC = mockVendors.filter(v => v.kycStatus === 'pending').length;
    const suspendedVendors = mockVendors.filter(v => v.status === 'suspended').length;
    const totalRevenue = mockVendors.reduce((sum, v) => sum + v.totalRevenue, 0);
    const averageRating = mockVendors.reduce((sum, v) => sum + v.rating, 0) / totalVendors;

    setStats({
      totalVendors,
      activeVendors,
      pendingKYC,
      suspendedVendors,
      totalRevenue,
      averageRating
    });
  }, []);

  // Filter vendors based on search and filters
  useEffect(() => {
    let filtered = vendors;

    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(vendor => vendor.status === statusFilter);
    }

    if (kycFilter !== 'all') {
      filtered = filtered.filter(vendor => vendor.kycStatus === kycFilter);
    }

    if (ratingFilter !== 'all') {
      const rating = parseFloat(ratingFilter);
      filtered = filtered.filter(vendor => vendor.rating >= rating);
    }

    setFilteredVendors(filtered);
  }, [vendors, searchTerm, statusFilter, kycFilter, ratingFilter]);

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

  // Vendor management actions
  const handleViewVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
  };

  const handleApproveVendor = async (vendorId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVendors(prev => prev.map(vendor => 
        vendor.id === vendorId 
          ? { ...vendor, kycStatus: 'verified' as const, status: 'active' as const }
          : vendor
      ));
      addToast('success', 'Vendor approved successfully!');
    } catch (error) {
      addToast('error', 'Failed to approve vendor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendVendor = async (vendorId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVendors(prev => prev.map(vendor => 
        vendor.id === vendorId 
          ? { ...vendor, status: vendor.status === 'active' ? 'suspended' as const : 'active' as const }
          : vendor
      ));
      addToast('success', 'Vendor status updated successfully!');
    } catch (error) {
      addToast('error', 'Failed to update vendor status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVendors(prev => prev.filter(vendor => vendor.id !== vendorId));
        addToast('success', 'Vendor deleted successfully!');
      } catch (error) {
        addToast('error', 'Failed to delete vendor. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetPassword = async (vendorId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('success', 'Password reset link sent to vendor email!');
    } catch (error) {
      addToast('error', 'Failed to send password reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'verified': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getKycTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-blue-100 text-blue-700';
      case 2: return 'bg-yellow-100 text-yellow-700';
      case 3: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
        <p className="text-gray-600">Manage vendor registrations, approvals, and account status.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalVendors}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeVendors}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending KYC</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingKYC}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.suspendedVendors}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
              <UserX className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₦{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.averageRating.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <Star className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Vendor Registrations by Month</p>
                <p className="text-sm text-gray-400">Chart showing vendor registration trends</p>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue by Vendor Category</p>
                <p className="text-sm text-gray-400">Pie chart showing revenue distribution</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search vendors..."
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
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">KYC Status</label>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All KYC</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setKycFilter('all');
                setRatingFilter('all');
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">KYC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Services</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                      <div className="text-sm text-gray-500">{vendor.businessName}</div>
                      <div className="text-xs text-gray-400">{vendor.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycTierColor(vendor.kycTier)}`}>
                        Tier {vendor.kycTier}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.kycStatus)}`}>
                        {vendor.kycStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vendor.activeServices}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">{vendor.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({vendor.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">₦{vendor.totalRevenue.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.status)}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleViewVendor(vendor)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {vendor.kycStatus === 'pending' && (
                        <button
                          onClick={() => handleApproveVendor(vendor.id)}
                          disabled={isLoading}
                          className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded disabled:opacity-50"
                          title="Approve Vendor"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleSuspendVendor(vendor.id)}
                        disabled={isLoading}
                        className="p-1 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded disabled:opacity-50"
                        title={vendor.status === 'active' ? 'Suspend Vendor' : 'Activate Vendor'}
                      >
                        {vendor.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteVendor(vendor.id)}
                        disabled={isLoading}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded disabled:opacity-50"
                        title="Delete Vendor"
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
      </div>

      {/* Vendor Details Modal */}
      {showVendorDetails && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Vendor Details</h2>
                <button
                  onClick={() => setShowVendorDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vendor Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedVendor.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedVendor.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedVendor.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Address:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedVendor.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Business Name:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedVendor.businessName}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Category:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedVendor.category}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Registration Date:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedVendor.registrationDate}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Last Login:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedVendor.lastLogin}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Documents</h3>
                    <div className="space-y-2">
                      {selectedVendor.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{doc.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                            <button className="text-blue-600 hover:text-blue-800">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Services and Transactions */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Services</h3>
                    <div className="space-y-2">
                      {selectedVendor.services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{service.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({service.category})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">₦{service.price}</span>
                            <span className="text-xs text-gray-500">({service.orders} orders)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                    <div className="space-y-2">
                      {selectedVendor.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{transaction.type}</span>
                            <span className="text-xs text-gray-500 ml-2">{transaction.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">₦{transaction.amount.toLocaleString()}</span>
                            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleResetPassword(selectedVendor.id)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {isLoading ? 'Sending...' : 'Send Password Reset'}
                      </button>
                      <button
                        onClick={() => handleSuspendVendor(selectedVendor.id)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                      >
                        {selectedVendor.status === 'active' ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                        {selectedVendor.status === 'active' ? 'Suspend Vendor' : 'Activate Vendor'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
            {toast.type === 'info' && <AlertCircle className="w-5 h-5 mr-2" />}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
