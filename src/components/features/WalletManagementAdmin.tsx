import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  CreditCard,
  DollarSign,
  Users,
  UserCheck,
  UserX,
  Calendar,
  FileText,
  Building2,
  User
} from 'lucide-react';

interface Wallet {
  id: string;
  ownerName: string;
  ownerEmail: string;
  ownerType: 'member' | 'group-admin' | 'vendor' | 'developer';
  groupName?: string;
  balance: number;
  currency: string;
  status: 'active' | 'suspended' | 'pending';
  transactionCount: number;
  totalVolume: number;
  lastTransaction: string;
  createdAt: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
}

interface WalletStats {
  totalWallets: number;
  activeWallets: number;
  suspendedWallets: number;
  totalVolume: number;
  averageBalance: number;
  totalTransactions: number;
  pendingWallets: number;
}

interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  counterparty: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const WalletManagementAdmin: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [filteredWallets, setFilteredWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [selectedWalletTransactions, setSelectedWalletTransactions] = useState<Transaction[]>([]);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [stats, setStats] = useState<WalletStats>({
    totalWallets: 0,
    activeWallets: 0,
    suspendedWallets: 0,
    totalVolume: 0,
    averageBalance: 0,
    totalTransactions: 0,
    pendingWallets: 0
  });

  // Mock data
  useEffect(() => {
    const mockWallets: Wallet[] = [
      {
        id: '1',
        ownerName: 'John Doe',
        ownerEmail: 'john@example.com',
        ownerType: 'member',
        groupName: 'Tech Innovators',
        balance: 2500.00,
        currency: 'NGN',
        status: 'active',
        transactionCount: 45,
        totalVolume: 15000.00,
        lastTransaction: '2024-01-20 14:30',
        createdAt: '2024-01-15',
        kycStatus: 'verified'
      },
      {
        id: '2',
        ownerName: 'Jane Smith',
        ownerEmail: 'jane@example.com',
        ownerType: 'group-admin',
        groupName: 'Community Builders',
        balance: 5000.00,
        currency: 'NGN',
        status: 'active',
        transactionCount: 78,
        totalVolume: 25000.00,
        lastTransaction: '2024-01-20 12:15',
        createdAt: '2024-01-10',
        kycStatus: 'verified'
      },
      {
        id: '3',
        ownerName: 'Mike Johnson',
        ownerEmail: 'mike@example.com',
        ownerType: 'vendor',
        balance: 1200.00,
        currency: 'NGN',
        status: 'suspended',
        transactionCount: 12,
        totalVolume: 5000.00,
        lastTransaction: '2024-01-18 16:45',
        createdAt: '2024-01-05',
        kycStatus: 'pending'
      },
      {
        id: '4',
        ownerName: 'Sarah Wilson',
        ownerEmail: 'sarah@example.com',
        ownerType: 'developer',
        balance: 0.00,
        currency: 'NGN',
        status: 'pending',
        transactionCount: 0,
        totalVolume: 0.00,
        lastTransaction: 'Never',
        createdAt: '2024-01-20',
        kycStatus: 'rejected'
      }
    ];

    setWallets(mockWallets);
    setFilteredWallets(mockWallets);

    // Calculate stats
    const totalWallets = mockWallets.length;
    const activeWallets = mockWallets.filter(w => w.status === 'active').length;
    const suspendedWallets = mockWallets.filter(w => w.status === 'suspended').length;
    const pendingWallets = mockWallets.filter(w => w.status === 'pending').length;
    const totalVolume = mockWallets.reduce((sum, w) => sum + w.totalVolume, 0);
    const averageBalance = mockWallets.reduce((sum, w) => sum + w.balance, 0) / totalWallets;
    const totalTransactions = mockWallets.reduce((sum, w) => sum + w.transactionCount, 0);

    setStats({
      totalWallets,
      activeWallets,
      suspendedWallets,
      totalVolume,
      averageBalance,
      totalTransactions,
      pendingWallets
    });
  }, []);

  // Filter wallets based on search and filters
  useEffect(() => {
    let filtered = wallets;

    if (searchTerm) {
      filtered = filtered.filter(wallet =>
        wallet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wallet.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (wallet.groupName && wallet.groupName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(wallet => wallet.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(wallet => wallet.ownerType === typeFilter);
    }

    setFilteredWallets(filtered);
  }, [wallets, searchTerm, statusFilter, typeFilter]);

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

  // Wallet management actions
  const handleViewWallet = async (wallet: Wallet) => {
    setSelectedWallet(wallet);
    
    // Mock transaction data
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        walletId: wallet.id,
        amount: 500.00,
        type: 'credit',
        description: 'Group contribution',
        status: 'completed',
        date: '2024-01-20 14:30',
        counterparty: 'Tech Innovators'
      },
      {
        id: '2',
        walletId: wallet.id,
        amount: 200.00,
        type: 'debit',
        description: 'Service payment',
        status: 'completed',
        date: '2024-01-19 10:15',
        counterparty: 'Service Provider'
      }
    ];
    
    setSelectedWalletTransactions(mockTransactions);
    setShowWalletDetails(true);
  };

  const handleToggleWalletStatus = async (walletId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWallets(prev => prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, status: wallet.status === 'active' ? 'suspended' as const : 'active' as const }
          : wallet
      ));
      addToast('success', 'Wallet status updated successfully!');
    } catch (error) {
      addToast('error', 'Failed to update wallet status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast('success', `Wallet data exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      addToast('error', 'Export failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getKycColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet Management</h1>
        <p className="text-gray-600">Monitor and manage user wallets across the platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Wallets</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalWallets}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Wallets</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeWallets}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₦{stats.totalVolume.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.suspendedWallets}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
              <UserX className="w-6 h-6" />
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Transaction Volume Over Time</p>
                <p className="text-sm text-gray-400">Chart showing wallet transaction trends</p>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Wallet Creation Trends</p>
                <p className="text-sm text-gray-400">Chart showing wallet registration patterns</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search wallets..."
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
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="member">Member</option>
              <option value="group-admin">Group Admin</option>
              <option value="vendor">Vendor</option>
              <option value="developer">Developer</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWallets.map((wallet) => (
                <tr key={wallet.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{wallet.ownerName}</div>
                      <div className="text-sm text-gray-500">{wallet.ownerEmail}</div>
                      {wallet.groupName && (
                        <div className="text-xs text-gray-400">{wallet.groupName}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      {wallet.ownerType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">₦{wallet.balance.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Total: ₦{wallet.totalVolume.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{wallet.transactionCount}</div>
                      <div className="text-xs text-gray-500">Last: {wallet.lastTransaction}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(wallet.status)}`}>
                      {wallet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycColor(wallet.kycStatus)}`}>
                      {wallet.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewWallet(wallet)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleWalletStatus(wallet.id)}
                        disabled={isLoading}
                        className={`${wallet.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} disabled:opacity-50`}
                        title={wallet.status === 'active' ? 'Suspend Wallet' : 'Activate Wallet'}
                      >
                        {wallet.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet Details Modal */}
      {showWalletDetails && selectedWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Wallet Details - {selectedWallet.ownerName}</h2>
                <button
                  onClick={() => setShowWalletDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Wallet Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Owner:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedWallet.ownerName}</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedWallet.ownerEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedWallet.ownerType}</span>
                      </div>
                      {selectedWallet.groupName && (
                        <div className="flex items-center">
                          <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-600">Group:</span>
                          <span className="text-sm font-medium text-gray-900 ml-2">{selectedWallet.groupName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Current Balance:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">₦{selectedWallet.balance.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Total Volume:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">₦{selectedWallet.totalVolume.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Transaction Count:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedWallet.transactionCount}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Last Transaction:</span>
                        <span className="text-sm font-medium text-gray-900 ml-2">{selectedWallet.lastTransaction}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                    <div className="space-y-2">
                      {selectedWalletTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{transaction.description}</span>
                            <span className="text-xs text-gray-500 ml-2">({transaction.counterparty})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                            </span>
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
                        onClick={() => handleToggleWalletStatus(selectedWallet.id)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                      >
                        {selectedWallet.status === 'active' ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                        {selectedWallet.status === 'active' ? 'Suspend Wallet' : 'Activate Wallet'}
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
