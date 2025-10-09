import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Calendar,
  Shield,
  FileText,
  Camera,
  CreditCard,
  Users,
  TrendingUp,
  RefreshCw,
  Settings,
  Zap
} from 'lucide-react';

interface KYCUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Tier 1' | 'Tier 2';
  verificationType: 'BVN' | 'Liveliness' | 'NIN';
  status: 'Pending' | 'Verified' | 'Rejected';
  submittedAt: string;
  bvn?: string;
  nin?: string;
  livelinessPhoto?: string;
  documents: {
    bvnDocument?: string;
    ninDocument?: string;
    livelinessPhoto?: string;
  };
}

interface KYBBusiness {
  id: string;
  businessName: string;
  cacNumber: string;
  email: string;
  phone: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  submittedAt: string;
  documents: {
    cacDocument?: string;
    businessProof?: string;
    directorId?: string;
  };
  directors: Array<{
    name: string;
    position: string;
    idNumber: string;
  }>;
}

export const KycKybManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kyc' | 'kyb'>('kyc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [selectedKYC, setSelectedKYC] = useState<KYCUser | null>(null);
  const [selectedKYB, setSelectedKYB] = useState<KYBBusiness | null>(null);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showKYBModal, setShowKYBModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingItem, setRejectingItem] = useState<{type: 'kyc' | 'kyb', id: string} | null>(null);

  // Sample KYC Data
  const [kycUsers, setKycUsers] = useState<KYCUser[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+234 801 234 5678',
      tier: 'Tier 1',
      verificationType: 'BVN',
      status: 'Pending',
      submittedAt: '2024-01-15 10:30:00',
      bvn: '12345678901',
      documents: {
        bvnDocument: 'bvn_doc_001.pdf'
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+234 802 345 6789',
      tier: 'Tier 2',
      verificationType: 'NIN',
      status: 'Verified',
      submittedAt: '2024-01-14 14:20:00',
      nin: '12345678901',
      documents: {
        ninDocument: 'nin_doc_002.pdf'
      }
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+234 803 456 7890',
      tier: 'Tier 1',
      verificationType: 'Liveliness',
      status: 'Rejected',
      submittedAt: '2024-01-13 09:15:00',
      documents: {
        livelinessPhoto: 'liveliness_003.jpg'
      }
    }
  ]);

  // Sample KYB Data
  const [kybBusinesses, setKybBusinesses] = useState<KYBBusiness[]>([
    {
      id: '1',
      businessName: 'Tech Solutions Ltd',
      cacNumber: 'RC123456789',
      email: 'info@techsolutions.com',
      phone: '+234 801 234 5678',
      status: 'Pending',
      submittedAt: '2024-01-15 11:30:00',
      documents: {
        cacDocument: 'cac_001.pdf',
        businessProof: 'business_proof_001.pdf'
      },
      directors: [
        { name: 'John Smith', position: 'CEO', idNumber: '12345678901' },
        { name: 'Sarah Johnson', position: 'CTO', idNumber: '12345678902' }
      ]
    },
    {
      id: '2',
      businessName: 'Innovation Hub',
      cacNumber: 'RC987654321',
      email: 'contact@innovationhub.com',
      phone: '+234 802 345 6789',
      status: 'Verified',
      submittedAt: '2024-01-14 16:45:00',
      documents: {
        cacDocument: 'cac_002.pdf',
        businessProof: 'business_proof_002.pdf'
      },
      directors: [
        { name: 'Mike Wilson', position: 'Managing Director', idNumber: '12345678903' }
      ]
    }
  ]);

  // Filtered data
  const filteredKYC = useMemo(() => {
    return kycUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      const matchesTier = tierFilter === 'All' || user.tier === tierFilter;
      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [kycUsers, searchTerm, statusFilter, tierFilter]);

  const filteredKYB = useMemo(() => {
    return kybBusinesses.filter(business => {
      const matchesSearch = business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           business.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || business.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [kybBusinesses, searchTerm, statusFilter]);

  // Stats
  const kycStats = {
    total: kycUsers.length,
    pending: kycUsers.filter(u => u.status === 'Pending').length,
    verified: kycUsers.filter(u => u.status === 'Verified').length,
    rejected: kycUsers.filter(u => u.status === 'Rejected').length,
    tier1: kycUsers.filter(u => u.tier === 'Tier 1').length,
    tier2: kycUsers.filter(u => u.tier === 'Tier 2').length
  };

  const kybStats = {
    total: kybBusinesses.length,
    pending: kybBusinesses.filter(b => b.status === 'Pending').length,
    verified: kybBusinesses.filter(b => b.status === 'Verified').length,
    rejected: kybBusinesses.filter(b => b.status === 'Rejected').length
  };

  const handleApprove = (type: 'kyc' | 'kyb', id: string) => {
    if (type === 'kyc') {
      setKycUsers(prev => prev.map(user => 
        user.id === id ? { ...user, status: 'Verified' as const } : user
      ));
    } else {
      setKybBusinesses(prev => prev.map(business => 
        business.id === id ? { ...business, status: 'Verified' as const } : business
      ));
    }
  };

  const handleReject = (type: 'kyc' | 'kyb', id: string) => {
    setRejectingItem({ type, id });
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (rejectingItem) {
      if (rejectingItem.type === 'kyc') {
        setKycUsers(prev => prev.map(user => 
          user.id === rejectingItem.id ? { ...user, status: 'Rejected' as const } : user
        ));
      } else {
        setKybBusinesses(prev => prev.map(business => 
          business.id === rejectingItem.id ? { ...business, status: 'Rejected' as const } : business
        ));
      }
    }
    setShowRejectModal(false);
    setRejectReason('');
    setRejectingItem(null);
  };

  const handleViewDetails = (type: 'kyc' | 'kyb', item: KYCUser | KYBBusiness) => {
    if (type === 'kyc') {
      setSelectedKYC(item as KYCUser);
      setShowKYCModal(true);
    } else {
      setSelectedKYB(item as KYBBusiness);
      setShowKYBModal(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
              KYC / KYB Management
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
              Manage user and business verification processes
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span style={{ fontFamily: 'Molde Semi Expanded Regular' }}>Refresh</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span style={{ fontFamily: 'Molde Semi Expanded Regular' }}>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('kyc')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'kyc'
                  ? 'border-[#098DCF] text-[#098DCF]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ fontFamily: 'Molde Semi Expanded Regular' }}
            >
              <UserCheck className="w-4 h-4" />
              KYC Management (Tier 1 & 2)
            </button>
            <button
              onClick={() => setActiveTab('kyb')}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'kyb'
                  ? 'border-[#098DCF] text-[#098DCF]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ fontFamily: 'Molde Semi Expanded Regular' }}
            >
              <Building2 className="w-4 h-4" />
              KYB Management (Tier 3)
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          {activeTab === 'kyc' ? (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-[#E8EEF7] p-4 hover:shadow-lg hover:border-[#098DCF] transition-all">
                <div className="flex items-center">
                  <div className="p-2 bg-[#098DCF] bg-opacity-10 rounded-lg">
                    <UserCheck className="w-5 h-5 text-[#098DCF]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Total KYC</p>
                    <p className="text-lg font-bold text-[#0F2A75]">{kycStats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8EEF7] p-4 hover:shadow-lg hover:border-[#098DCF] transition-all">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Pending</p>
                    <p className="text-lg font-bold text-[#0F2A75]">{kycStats.pending}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8EEF7] p-4 hover:shadow-lg hover:border-[#098DCF] transition-all">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Verified</p>
                    <p className="text-lg font-bold text-[#0F2A75]">{kycStats.verified}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8EEF7] p-4 hover:shadow-lg hover:border-[#098DCF] transition-all">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Rejected</p>
                    <p className="text-lg font-bold text-[#0F2A75]">{kycStats.rejected}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8EEF7] p-4 hover:shadow-lg hover:border-[#098DCF] transition-all">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Tier 1</p>
                    <p className="text-lg font-bold text-[#0F2A75]">{kycStats.tier1}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8EEF7] p-4 hover:shadow-lg hover:border-[#098DCF] transition-all">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Tier 2</p>
                    <p className="text-lg font-bold text-[#0F2A75]">{kycStats.tier2}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-[#E8EEF7] p-4 hover:shadow-lg hover:border-[#098DCF] transition-all">
                <div className="flex items-center">
                  <div className="p-2 bg-[#098DCF] bg-opacity-10 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#098DCF]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Total KYB</p>
                    <p className="text-lg font-bold text-[#0F2A75]">{kybStats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8EEF7] p-4 hover:shadow-lg hover:border-[#098DCF] transition-all">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Pending</p>
                    <p className="text-lg font-bold text-[#0F2A75]">{kybStats.pending}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8EEF7] p-4 hover:shadow-lg hover:border-[#098DCF] transition-all">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Verified</p>
                    <p className="text-lg font-bold text-[#0F2A75]">{kybStats.verified}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8EEF7] p-4 hover:shadow-lg hover:border-[#098DCF] transition-all">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Rejected</p>
                    <p className="text-lg font-bold text-[#0F2A75]">{kybStats.rejected}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'kyc' ? 'users' : 'businesses'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  style={{ fontFamily: 'Molde Semi Expanded Regular' }}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                style={{ fontFamily: 'Molde Semi Expanded Regular' }}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
              {activeTab === 'kyc' && (
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  style={{ fontFamily: 'Molde Semi Expanded Regular' }}
                >
                  <option value="All">All Tiers</option>
                  <option value="Tier 1">Tier 1</option>
                  <option value="Tier 2">Tier 2</option>
                </select>
              )}
            </div>
          </div>

          {/* Tables */}
          {activeTab === 'kyc' ? (
            <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tier & Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredKYC.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user.tier}
                            </span>
                            <div className="text-sm text-gray-500 mt-1">{user.verificationType}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.submittedAt}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails('kyc', user)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApprove('kyc', user.id)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject('kyc', user.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CAC Number
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredKYB.map((business) => (
                      <tr key={business.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                              {business.businessName}
                            </div>
                            <div className="text-sm text-gray-500">{business.email}</div>
                            <div className="text-sm text-gray-500">{business.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {business.cacNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(business.status)}`}>
                            {business.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {business.submittedAt}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails('kyb', business)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApprove('kyb', business.id)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject('kyb', business.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KYC Details Modal */}
      {showKYCModal && selectedKYC && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                KYC Verification Details
              </h3>
              <button
                onClick={() => setShowKYCModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-sm text-gray-900">{selectedKYC.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedKYC.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedKYC.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tier</label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {selectedKYC.tier}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                  Verification Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Verification Type</label>
                    <p className="text-sm text-gray-900">{selectedKYC.verificationType}</p>
                  </div>
                  {selectedKYC.bvn && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">BVN</label>
                      <p className="text-sm text-gray-900">{selectedKYC.bvn}</p>
                    </div>
                  )}
                  {selectedKYC.nin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NIN</label>
                      <p className="text-sm text-gray-900">{selectedKYC.nin}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedKYC.status)}`}>
                      {selectedKYC.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                Documents & Verification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedKYC.documents.bvnDocument && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">BVN Document</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">View Document</button>
                  </div>
                )}
                {selectedKYC.documents.ninDocument && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">NIN Document</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">View Document</button>
                  </div>
                )}
                {selectedKYC.documents.livelinessPhoto && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Liveliness Photo</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">View Photo</button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowKYCModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleReject('kyc', selectedKYC.id)}
                className="px-4 py-2 text-red-700 border border-red-300 rounded-lg hover:bg-red-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove('kyc', selectedKYC.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYB Details Modal */}
      {showKYBModal && selectedKYB && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                KYB Verification Details
              </h3>
              <button
                onClick={() => setShowKYBModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                  Business Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <p className="text-sm text-gray-900">{selectedKYB.businessName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CAC Number</label>
                    <p className="text-sm text-gray-900">{selectedKYB.cacNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedKYB.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedKYB.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                  Directors
                </h4>
                <div className="space-y-3">
                  {selectedKYB.directors.map((director, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900">{director.name}</div>
                      <div className="text-sm text-gray-500">{director.position}</div>
                      <div className="text-sm text-gray-500">ID: {director.idNumber}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                Documents
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedKYB.documents.cacDocument && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">CAC Document</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">View Document</button>
                  </div>
                )}
                {selectedKYB.documents.businessProof && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Business Proof</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">View Document</button>
                  </div>
                )}
                {selectedKYB.documents.directorId && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Director ID</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">View Document</button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowKYBModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleReject('kyb', selectedKYB.id)}
                className="px-4 py-2 text-red-700 border border-red-300 rounded-lg hover:bg-red-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove('kyb', selectedKYB.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
              Reject Verification
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                rows={4}
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
