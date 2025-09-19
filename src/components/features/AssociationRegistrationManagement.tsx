import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Printer,
  FileSpreadsheet,
  FileImage,
  Trash2
} from 'lucide-react';

interface AssociationDetails {
  associationName: string;
  associationType: string;
  registrationOption: string;
  description: string;
}

interface ContactDetails {
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface GroupInfo {
  id: string;
  name: string;
  adminName: string;
  adminEmail: string;
}

type RegistrationStatus = 'pending' | 'approved' | 'rejected';

interface RegistrationRequest {
  id: string;
  groupInfo: GroupInfo;
  associationDetails: AssociationDetails;
  contactDetails: ContactDetails;
  files: UploadedFile[];
  status: RegistrationStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

const MOCK_REGISTRATIONS: RegistrationRequest[] = [
  {
    id: 'REG001',
    groupInfo: {
      id: 'GRP001',
      name: 'Youth Ministry Group',
      adminName: 'John Doe',
      adminEmail: 'john.doe@example.com'
    },
    associationDetails: {
      associationName: 'Youth Development Association',
      associationType: 'NGO',
      registrationOption: 'CAC Registration',
      description: 'A non-profit organization focused on youth development and community service.'
    },
    contactDetails: {
      contactPersonName: 'John Doe',
      contactEmail: 'john.doe@example.com',
      contactPhone: '+234 801 234 5678',
      address: '123 Main Street, Lagos, Nigeria'
    },
    files: [
      { id: '1', name: 'constitution.pdf', size: 1024000, type: 'application/pdf', url: '#' },
      { id: '2', name: 'members_list.pdf', size: 512000, type: 'application/pdf', url: '#' }
    ],
    status: 'pending',
    submittedAt: new Date('2024-01-15'),
    notes: 'Complete documentation provided'
  },
  {
    id: 'REG002',
    groupInfo: {
      id: 'GRP002',
      name: 'Women Cooperative Society',
      adminName: 'Jane Smith',
      adminEmail: 'jane.smith@example.com'
    },
    associationDetails: {
      associationName: 'Women Empowerment Cooperative',
      associationType: 'Cooperative',
      registrationOption: 'Cooperative Society Registration',
      description: 'A cooperative society focused on women economic empowerment and skill development.'
    },
    contactDetails: {
      contactPersonName: 'Jane Smith',
      contactEmail: 'jane.smith@example.com',
      contactPhone: '+234 802 345 6789',
      address: '456 Oak Avenue, Abuja, Nigeria'
    },
    files: [
      { id: '3', name: 'bylaws.pdf', size: 2048000, type: 'application/pdf', url: '#' },
      { id: '4', name: 'bank_details.pdf', size: 256000, type: 'application/pdf', url: '#' }
    ],
    status: 'approved',
    submittedAt: new Date('2024-01-10'),
    reviewedAt: new Date('2024-01-12'),
    reviewedBy: 'Admin User',
    notes: 'All requirements met'
  },
  {
    id: 'REG003',
    groupInfo: {
      id: 'GRP003',
      name: 'Tech Professionals Union',
      adminName: 'Mike Johnson',
      adminEmail: 'mike.johnson@example.com'
    },
    associationDetails: {
      associationName: 'Nigerian Tech Professionals Association',
      associationType: 'Professional Body',
      registrationOption: 'Professional Body Registration',
      description: 'Professional association for technology workers and software developers.'
    },
    contactDetails: {
      contactPersonName: 'Mike Johnson',
      contactEmail: 'mike.johnson@example.com',
      contactPhone: '+234 803 456 7890',
      address: '789 Tech Hub, Port Harcourt, Nigeria'
    },
    files: [
      { id: '5', name: 'registration_docs.pdf', size: 1536000, type: 'application/pdf', url: '#' }
    ],
    status: 'rejected',
    submittedAt: new Date('2024-01-08'),
    reviewedAt: new Date('2024-01-11'),
    reviewedBy: 'Admin User',
    rejectionReason: 'Incomplete documentation. Please provide valid bank account details and updated constitution.',
    notes: 'Missing required documents'
  }
];

export const AssociationRegistrationManagement: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationRequest[]>(MOCK_REGISTRATIONS);
  const [filteredRegistrations, setFilteredRegistrations] = useState<RegistrationRequest[]>(MOCK_REGISTRATIONS);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = registrations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reg => 
        reg.associationDetails.associationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.groupInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.contactDetails.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(reg => reg.submittedAt >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(reg => reg.submittedAt >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(reg => reg.submittedAt >= filterDate);
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = a.submittedAt.getTime() - b.submittedAt.getTime();
          break;
        case 'name':
          comparison = a.associationDetails.associationName.localeCompare(b.associationDetails.associationName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredRegistrations(filtered);
  }, [registrations, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  const getStatusBadge = (status: RegistrationStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const icons = {
      pending: <Clock className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const handleApprove = (id: string) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === id 
        ? { 
            ...reg, 
            status: 'approved' as RegistrationStatus, 
            reviewedAt: new Date(),
            reviewedBy: 'Current Admin'
          }
        : reg
    ));
  };

  const handleReject = (id: string) => {
    if (rejectionReason.trim()) {
      setRegistrations(prev => prev.map(reg => 
        reg.id === id 
          ? { 
              ...reg, 
              status: 'rejected' as RegistrationStatus, 
              reviewedAt: new Date(),
              reviewedBy: 'Current Admin',
              rejectionReason: rejectionReason
            }
          : reg
      ));
      setRejectionReason('');
      setShowRejectModal(false);
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // Mock export functionality
    console.log(`Exporting as ${format.toUpperCase()}`);
    // In real implementation, this would generate and download the file
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Association Registration Management</h1>
          <p className="text-gray-600">
            Manage and process association registration requests from Group Admins
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by association name, group name, or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as RegistrationStatus | 'all')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="date">Date Submitted</option>
                    <option value="name">Association Name</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Association Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Group Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Registration Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Contact Person
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Date Submitted
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 break-words">
                          {registration.associationDetails.associationName}
                        </div>
                        <div className="text-sm text-gray-500 break-words">
                          {registration.associationDetails.associationType}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 break-words">
                          {registration.groupInfo.name}
                        </div>
                        <div className="text-sm text-gray-500 break-words">
                          Admin: {registration.groupInfo.adminName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 break-words">
                        {registration.associationDetails.registrationOption}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 break-words">
                          {registration.contactDetails.contactPersonName}
                        </div>
                        <div className="text-sm text-gray-500 break-words">
                          {registration.contactDetails.contactEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(registration.status)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {registration.submittedAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setSelectedRegistration(registration);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRegistration(registration);
                            setShowDetailsModal(true);
                          }}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {registration.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(registration.id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRegistration(registration);
                                setShowRejectModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Registration Details - {selectedRegistration.associationDetails.associationName}
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Association Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Association Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Association Name</label>
                      <p className="text-gray-900">{selectedRegistration.associationDetails.associationName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Association Type</label>
                      <p className="text-gray-900">{selectedRegistration.associationDetails.associationType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Registration Option</label>
                      <p className="text-gray-900">{selectedRegistration.associationDetails.registrationOption}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-gray-900">{selectedRegistration.associationDetails.description}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Person</label>
                      <p className="text-gray-900">{selectedRegistration.contactDetails.contactPersonName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {selectedRegistration.contactDetails.contactEmail}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedRegistration.contactDetails.contactPhone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedRegistration.contactDetails.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Uploaded Files */}
                {selectedRegistration.files.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Uploaded Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRegistration.files.map((file) => (
                        <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileImage className="w-8 h-8 text-blue-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status and Review Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Status & Review Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Status</label>
                      <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted Date</label>
                      <p className="text-gray-900">{selectedRegistration.submittedAt.toLocaleDateString()}</p>
                    </div>
                    {selectedRegistration.reviewedAt && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Reviewed Date</label>
                          <p className="text-gray-900">{selectedRegistration.reviewedAt.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Reviewed By</label>
                          <p className="text-gray-900">{selectedRegistration.reviewedBy}</p>
                        </div>
                      </>
                    )}
                    {selectedRegistration.rejectionReason && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                        <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800">{selectedRegistration.rejectionReason}</p>
                        </div>
                      </div>
                    )}
                    {selectedRegistration.notes && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Notes</label>
                        <p className="text-gray-900">{selectedRegistration.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Reject Registration</h2>
                <p className="text-gray-600 mt-1">
                  Please provide a reason for rejecting this registration request.
                </p>
              </div>
              <div className="p-6">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter rejection reason..."
                />
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRegistration.id)}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Registration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
