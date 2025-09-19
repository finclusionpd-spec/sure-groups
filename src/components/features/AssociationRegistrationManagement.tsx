import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  FileDown,
  Printer
} from 'lucide-react';
import { 
  AssociationRegistration, 
  RegistrationStatus,
  AssociationType,
  RegistrationOption
} from '../../types';
import { associationRegistrationService } from '../../services/associationRegistration';
import { useAuth } from '../../contexts/AuthContext';

export const AssociationRegistrationManagement: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<AssociationRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<AssociationRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<AssociationRegistration | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AssociationType | 'all'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadRegistrations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [registrations, searchQuery, statusFilter, typeFilter, dateRange]);

  // Handle clicking outside the export dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showExportDropdown && !target.closest('.export-dropdown')) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportDropdown]);

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      const data = await associationRegistrationService.getAllAssociationRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError('Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...registrations];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(reg => 
        reg.associationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.contactPersonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(reg => reg.associationType === typeFilter);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter(reg => {
        const regDate = new Date(reg.createdAt);
        return regDate >= startDate && regDate <= endDate;
      });
    }

    setFilteredRegistrations(filtered);
  };

  const handleView = (registration: AssociationRegistration) => {
    setSelectedRegistration(registration);
  };

  const handleApprove = async (registration: AssociationRegistration) => {
    try {
      await associationRegistrationService.updateRegistrationStatus(
        registration.id,
        'approved',
        user?.id || 'super-admin',
        undefined,
        'Registration approved by Super Admin'
      );

      // Send notification
      await associationRegistrationService.sendNotificationToGroupAdmin(
        registration.adminId,
        registration.id,
        'approved',
        `Your association registration for "${registration.associationName}" has been approved.`
      );

      setSuccessMessage('Registration approved successfully');
      setShowApprovalModal(false);
      loadRegistrations();
    } catch (err) {
      setError('Failed to approve registration');
    }
  };

  const handleReject = async () => {
    if (!selectedRegistration || !rejectionReason.trim()) return;

    try {
      await associationRegistrationService.updateRegistrationStatus(
        selectedRegistration.id,
        'rejected',
        user?.id || 'super-admin',
        rejectionReason,
        'Registration rejected by Super Admin'
      );

      // Send notification
      await associationRegistrationService.sendNotificationToGroupAdmin(
        selectedRegistration.adminId,
        selectedRegistration.id,
        'rejected',
        `Your association registration for "${selectedRegistration.associationName}" has been rejected. Reason: ${rejectionReason}`
      );

      setSuccessMessage('Registration rejected successfully');
      setShowRejectionModal(false);
      setRejectionReason('');
      loadRegistrations();
    } catch (err) {
      setError('Failed to reject registration');
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      setShowExportDropdown(false); // Close dropdown after selection
      
      if (format === 'csv') {
        const csvContent = await associationRegistrationService.exportRegistrationsToCSV(filteredRegistrations);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `association-registrations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // For Excel and PDF, you would implement similar logic
        setSuccessMessage(`${format.toUpperCase()} export functionality coming soon`);
      }
    } catch (err) {
      setError('Failed to export data');
    }
  };

  const getStatusIcon = (status: RegistrationStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
      case 'under_review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateRange({ start: '', end: '' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Association Registration Management</h1>
              <p className="text-gray-600">Manage and process all association registration requests</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <div className="relative export-dropdown">
              <button 
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport('csv')}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                    >
                      <FileDown className="w-4 h-4 mr-3 flex-shrink-0" />
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('excel')}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                    >
                      <FileDown className="w-4 h-4 mr-3 flex-shrink-0" />
                      Export as Excel
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                    >
                      <Printer className="w-4 h-4 mr-3 flex-shrink-0" />
                      Export as PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by association name, group name, or contact person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as RegistrationStatus | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Association Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as AssociationType | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="NGO">NGO</option>
                  <option value="Cooperative">Cooperative</option>
                  <option value="Professional Body">Professional Body</option>
                  <option value="Community Group">Community Group</option>
                  <option value="Religious Organization">Religious Organization</option>
                  <option value="Trade Union">Trade Union</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredRegistrations.length} of {registrations.length} registrations
        </p>
        <button
          onClick={loadRegistrations}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </button>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Association Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Option
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Submitted
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.associationName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.associationType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {registration.groupName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {registration.registrationOption}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.contactPersonName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.contactEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(registration.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(registration.status)}`}>
                        {registration.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registration.submittedAt ? formatDate(registration.submittedAt) : 'Not submitted'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(registration)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {registration.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setShowApprovalModal(true);
                            }}
                            className="text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setShowRejectionModal(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
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

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No registrations found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || dateRange.start || dateRange.end
                ? 'Try adjusting your filters to see more results.'
                : 'No association registrations have been submitted yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Registration Details</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <Printer className="w-4 h-4 mr-1" />
                    Print
                  </button>
                  <button
                    onClick={() => setSelectedRegistration(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {getStatusIcon(selectedRegistration.status)}
                    <span className="ml-2 font-medium">Status:</span>
                    <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedRegistration.status)}`}>
                      {selectedRegistration.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Submitted: {selectedRegistration.submittedAt ? formatDate(selectedRegistration.submittedAt) : 'Not submitted'}
                  </div>
                </div>

                {/* Association Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Association Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Association Name</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.associationName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Association Type</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.associationType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registration Option</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.registrationOption}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.description}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.contactPersonName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.contactEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.contactPhone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.state}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Country</label>
                      <p className="text-sm text-gray-900">{selectedRegistration.country}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                {selectedRegistration.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h3>
                    <div className="space-y-2">
                      {selectedRegistration.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                              <p className="text-xs text-gray-500">
                                {doc.documentType.replace('_', ' ')} • {(doc.fileSize / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedRegistration.status === 'rejected' && selectedRegistration.rejectionReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Rejection Reason</h4>
                    <p className="text-sm text-red-700">{selectedRegistration.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Approve Registration</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve the registration for "{selectedRegistration.associationName}"?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(selectedRegistration)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Reject Registration</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting the registration for "{selectedRegistration.associationName}":
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-6"
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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
