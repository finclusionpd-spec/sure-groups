import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Play,
  Download, 
  RefreshCw,
  Loader2,
  AlertCircle,
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  User,
  Building2,
  ShoppingCart,
  Star,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface MarketplaceListing {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  vendorName: string;
  vendorId: string;
  groupName: string;
  groupId: string;
  imageUrl: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  isGroupExclusive: boolean;
  commission: number;
  tags: string[];
}

interface MarketplaceStats {
  totalListings: number;
  activeListings: number;
  suspendedListings: number;
  pendingApprovals: number;
  totalRevenue: number;
  averageRating: number;
  totalVendors: number;
  groupExclusiveListings: number;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const MarketplaceManagementAdmin: React.FC = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<MarketplaceListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [showListingDetails, setShowListingDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [stats, setStats] = useState<MarketplaceStats>({
    totalListings: 0,
    activeListings: 0,
    suspendedListings: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalVendors: 0,
    groupExclusiveListings: 0
  });

  // Mock data
  useEffect(() => {
    const mockListings: MarketplaceListing[] = [
      {
        id: '1',
        name: 'Organic Honey - 500ml',
        description: 'Pure organic honey sourced from local beekeepers with natural sweetness and health benefits.',
        price: 25.99,
        currency: 'NGN',
        category: 'Food & Beverages',
        vendorName: 'Local Farmers Co-op',
        vendorId: 'vendor-1',
        groupName: 'Tech Innovators',
        groupId: 'group-1',
        imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
        status: 'active',
        stock: 45,
        sold: 23,
        rating: 4.8,
        reviewCount: 12,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-20',
        isGroupExclusive: true,
        commission: 10,
        tags: ['organic', 'local', 'healthy']
      },
      {
        id: '2',
        name: 'Handmade Crafts Set',
        description: 'Beautiful handmade crafts created by community artisans with traditional techniques.',
        price: 45.00,
        currency: 'NGN',
        category: 'Arts & Crafts',
        vendorName: 'Community Artisans',
        vendorId: 'vendor-2',
        groupName: 'Community Builders',
        groupId: 'group-2',
        imageUrl: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600',
        status: 'pending',
        stock: 12,
        sold: 8,
        rating: 4.9,
        reviewCount: 6,
        createdAt: '2024-01-08',
        updatedAt: '2024-01-19',
        isGroupExclusive: false,
        commission: 15,
        tags: ['handmade', 'traditional', 'artisan']
      },
      {
        id: '3',
        name: 'Professional Consulting Services',
        description: 'Expert business consulting services for startups and small businesses.',
        price: 150.00,
        currency: 'NGN',
        category: 'Professional Services',
        vendorName: 'Business Consultants Ltd',
        vendorId: 'vendor-3',
        groupName: 'Business Network',
        groupId: 'group-3',
        imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
        status: 'suspended',
        stock: 0,
        sold: 5,
        rating: 4.5,
        reviewCount: 3,
        createdAt: '2024-01-05',
        updatedAt: '2024-01-18',
        isGroupExclusive: false,
        commission: 20,
        tags: ['consulting', 'business', 'professional']
      },
      {
        id: '4',
        name: 'Tech Gadgets Bundle',
        description: 'Latest technology gadgets and accessories for tech enthusiasts.',
        price: 299.99,
        currency: 'NGN',
        category: 'Electronics',
        vendorName: 'Tech Solutions Inc',
        vendorId: 'vendor-4',
        groupName: 'Tech Innovators',
        groupId: 'group-1',
        imageUrl: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=600',
        status: 'active',
        stock: 8,
        sold: 15,
        rating: 4.7,
        reviewCount: 8,
        createdAt: '2024-01-12',
        updatedAt: '2024-01-20',
        isGroupExclusive: true,
        commission: 12,
        tags: ['technology', 'gadgets', 'electronics']
      }
    ];

    setListings(mockListings);
    setFilteredListings(mockListings);

    // Calculate stats
    const totalListings = mockListings.length;
    const activeListings = mockListings.filter(l => l.status === 'active').length;
    const suspendedListings = mockListings.filter(l => l.status === 'suspended').length;
    const pendingApprovals = mockListings.filter(l => l.status === 'pending').length;
    const totalRevenue = mockListings.reduce((sum, l) => sum + (l.price * l.sold), 0);
    const averageRating = mockListings.reduce((sum, l) => sum + l.rating, 0) / totalListings;
    const totalVendors = new Set(mockListings.map(l => l.vendorId)).size;
    const groupExclusiveListings = mockListings.filter(l => l.isGroupExclusive).length;

    setStats({
      totalListings,
      activeListings,
      suspendedListings,
      pendingApprovals,
      totalRevenue,
      averageRating,
      totalVendors,
      groupExclusiveListings
    });
  }, []);

  // Filter listings based on search and filters
  useEffect(() => {
    let filtered = listings;

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.groupName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (groupFilter !== 'all') {
      filtered = filtered.filter(listing => listing.groupId === groupFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(listing => listing.category === categoryFilter);
    }

    if (vendorFilter !== 'all') {
      filtered = filtered.filter(listing => listing.vendorId === vendorFilter);
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, groupFilter, statusFilter, categoryFilter, vendorFilter]);

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

  // Listing management actions
  const handleViewListing = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setShowListingDetails(true);
  };

  const handleApproveListing = async (listingId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: 'active' as const }
          : listing
      ));
      addToast('success', 'Listing approved successfully!');
    } catch (error) {
      addToast('error', 'Failed to approve listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectListing = async (listingId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: 'rejected' as const }
          : listing
      ));
      addToast('success', 'Listing rejected successfully!');
    } catch (error) {
      addToast('error', 'Failed to reject listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleListingStatus = async (listingId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: listing.status === 'active' ? 'suspended' as const : 'active' as const }
          : listing
      ));
      addToast('success', 'Listing status updated successfully!');
    } catch (error) {
      addToast('error', 'Failed to update listing status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast('success', `Marketplace data exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      addToast('error', 'Export failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'rejected': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUniqueGroups = () => {
    const groups = Array.from(new Set(listings.map(l => l.groupName)));
    return groups;
  };

  const getUniqueVendors = () => {
    const vendors = Array.from(new Set(listings.map(l => l.vendorName)));
    return vendors;
  };

  const getUniqueCategories = () => {
    const categories = Array.from(new Set(listings.map(l => l.category)));
    return categories;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace Management</h1>
        <p className="text-gray-600">Monitor and manage marketplace listings across all groups.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalListings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeListings}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.suspendedListings}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingApprovals}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
              <Clock className="w-6 h-6" />
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
        <div className="flex space-x-2">
          <button
            onClick={() => handleExportData('csv')}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {isLoading ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={() => handleExportData('xlsx')}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isLoading ? 'Exporting...' : 'Export XLSX'}
          </button>
          <button
            onClick={() => handleExportData('pdf')}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isLoading ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketplace Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Listing Performance</p>
                <p className="text-sm text-gray-400">Chart showing listing sales and performance trends</p>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue Trends</p>
                <p className="text-sm text-gray-400">Chart showing revenue growth over time</p>
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
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Groups</option>
              {getUniqueGroups().map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
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
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setGroupFilter('all');
                setStatusFilter('all');
                setCategoryFilter('all');
                setVendorFilter('all');
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredListings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img className="h-12 w-12 rounded-lg object-cover" src={listing.imageUrl} alt={listing.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{listing.name}</div>
                        <div className="text-sm text-gray-500">{listing.category}</div>
                        <div className="text-xs text-gray-400">{listing.createdAt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{listing.vendorName}</div>
                      <div className="text-sm text-gray-500">ID: {listing.vendorId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{listing.groupName}</div>
                      {listing.isGroupExclusive && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                          Exclusive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">₦{listing.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{listing.commission}% commission</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{listing.sold} sold</div>
                      <div className="text-xs text-gray-500">{listing.stock} in stock</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.status)}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewListing(listing)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {listing.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveListing(listing.id)}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Approve Listing"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectListing(listing.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Reject Listing"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {listing.status === 'active' && (
                        <button
                          onClick={() => handleToggleListingStatus(listing.id)}
                          disabled={isLoading}
                          className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                          title="Suspend Listing"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {listing.status === 'suspended' && (
                        <button
                          onClick={() => handleToggleListingStatus(listing.id)}
                          disabled={isLoading}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Activate Listing"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Listing Details Modal */}
      {showListingDetails && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Listing Details - {selectedListing.name}</h2>
                <button
                  onClick={() => setShowListingDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Listing Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Name:</span>
                        <p className="text-sm text-gray-900">{selectedListing.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Description:</span>
                        <p className="text-sm text-gray-900">{selectedListing.description}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Category:</span>
                        <p className="text-sm text-gray-900">{selectedListing.category}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Price:</span>
                        <p className="text-sm text-gray-900">₦{selectedListing.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Commission:</span>
                        <p className="text-sm text-gray-900">{selectedListing.commission}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Stock:</span>
                        <p className="text-sm text-gray-900">{selectedListing.stock} units</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Sold:</span>
                        <p className="text-sm text-gray-900">{selectedListing.sold} units</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Rating:</span>
                        <p className="text-sm text-gray-900">{selectedListing.rating}/5 ({selectedListing.reviewCount} reviews)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendor and Group Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Vendor Name:</span>
                        <p className="text-sm text-gray-900">{selectedListing.vendorName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Vendor ID:</span>
                        <p className="text-sm text-gray-900">{selectedListing.vendorId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Group Name:</span>
                        <p className="text-sm text-gray-900">{selectedListing.groupName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Group ID:</span>
                        <p className="text-sm text-gray-900">{selectedListing.groupId}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Exclusive:</span>
                        <p className="text-sm text-gray-900">{selectedListing.isGroupExclusive ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      {selectedListing.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveListing(selectedListing.id)}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Listing
                          </button>
                          <button
                            onClick={() => handleRejectListing(selectedListing.id)}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject Listing
                          </button>
                        </>
                      )}
                      {selectedListing.status === 'active' && (
                        <button
                          onClick={() => handleToggleListingStatus(selectedListing.id)}
                          disabled={isLoading}
                          className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Suspend Listing
                        </button>
                      )}
                      {selectedListing.status === 'suspended' && (
                        <button
                          onClick={() => handleToggleListingStatus(selectedListing.id)}
                          disabled={isLoading}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Activate Listing
                        </button>
                      )}
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
