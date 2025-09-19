import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Eye, 
  Edit, 
  RotateCcw,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  Trash2,
  X
} from 'lucide-react';
import { 
  AssociationRegistration, 
  AssociationRegistrationFormData,
  RegistrationStatus
} from '../../types';
import { associationRegistrationService } from '../../services/associationRegistration';
import { useAuth } from '../../contexts/AuthContext';
import { AssociationRegistrationForm } from './AssociationRegistrationForm';

interface AssociationRegistrationListProps {
  groupId?: string;
  groupName?: string;
}

export const AssociationRegistrationList: React.FC<AssociationRegistrationListProps> = ({ 
  groupId = 'group-1', 
  groupName = 'Sample Group' 
}) => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<AssociationRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<AssociationRegistration | null>(null);
  const [viewingRegistration, setViewingRegistration] = useState<AssociationRegistration | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRegistrations();
  }, [groupId]);

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      const data = await associationRegistrationService.getAssociationRegistrations(user?.id || 'admin-1');
      setRegistrations(data);
    } catch (err) {
      setError('Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingRegistration(null);
    setShowForm(true);
  };

  const handleEdit = (registration: AssociationRegistration) => {
    setEditingRegistration(registration);
    setShowForm(true);
  };

  const handleView = (registration: AssociationRegistration) => {
    setViewingRegistration(registration);
  };

  const handleResubmit = (registration: AssociationRegistration) => {
    setEditingRegistration(registration);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRegistration(null);
    loadRegistrations(); // Refresh the list
  };

  const handleViewClose = () => {
    setViewingRegistration(null);
  };

  const getStatusIcon = (status: RegistrationStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
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
      day: 'numeric'
    });
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
              <h1 className="text-2xl font-bold text-gray-900">Association Registration</h1>
              <p className="text-gray-600">Manage your association registration requests</p>
            </div>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Apply for New Registration
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Registrations List */}
      {registrations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No registrations yet</h3>
          <p className="text-gray-600 mb-6">
            Click 'Apply for New Registration' to get started with your first association registration.
          </p>
          <button
            onClick={handleCreateNew}
            className="flex items-center mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Apply for New Registration
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Association Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Option
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
                {registrations.map((registration) => (
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
                        {registration.registrationOption}
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
                        {(registration.status === 'draft' || registration.status === 'rejected') && (
                          <button
                            onClick={() => handleEdit(registration)}
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {registration.status === 'rejected' && (
                          <button
                            onClick={() => handleResubmit(registration)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Resubmit"
                          >
                            <RotateCcw className="w-4 h-4" />
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
      )}

      {/* Registration Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingRegistration ? 'Edit Registration' : 'New Association Registration'}
                </h2>
                <button
                  onClick={handleFormClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <AssociationRegistrationForm
                groupId={groupId}
                groupName={groupName}
                existingRegistration={editingRegistration}
                onClose={handleFormClose}
                onSuccess={handleFormClose}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Registration Details</h2>
                <button
                  onClick={handleViewClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {getStatusIcon(viewingRegistration.status)}
                    <span className="ml-2 font-medium">Status:</span>
                    <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(viewingRegistration.status)}`}>
                      {viewingRegistration.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {viewingRegistration.submittedAt && (
                    <div className="text-sm text-gray-500">
                      Submitted: {formatDate(viewingRegistration.submittedAt)}
                    </div>
                  )}
                </div>

                {/* Association Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Association Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Association Name</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.associationName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Association Type</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.associationType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registration Option</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.registrationOption}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.description}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.contactPersonName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.contactEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.contactPhone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.state}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Country</label>
                      <p className="text-sm text-gray-900">{viewingRegistration.country}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                {viewingRegistration.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h3>
                    <div className="space-y-2">
                      {viewingRegistration.documents.map((doc) => (
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
                {viewingRegistration.status === 'rejected' && viewingRegistration.rejectionReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Rejection Reason</h4>
                    <p className="text-sm text-red-700">{viewingRegistration.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
