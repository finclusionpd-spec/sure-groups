import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Building, 
  FileImage,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

type RegistrationStatus = 'draft' | 'pending' | 'approved' | 'rejected';

interface RegistrationData {
  id: string;
  status: RegistrationStatus;
  submittedAt?: Date;
  reviewedAt?: Date;
  rejectionReason?: string;
  associationDetails: AssociationDetails;
  contactDetails: ContactDetails;
  files: UploadedFile[];
}

const ASSOCIATION_TYPES = [
  'NGO',
  'Cooperative',
  'Professional Body',
  'Community Group',
  'Religious Organization',
  'Trade Union',
  'Charity Organization',
  'Social Club',
  'Other'
];

const REGISTRATION_OPTIONS = [
  'CAC Registration',
  'Regular Association Registration',
  'Cooperative Society Registration',
  'Religious Body Registration',
  'Professional Body Registration',
  'Others'
];

export const AssociationRegistration: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock existing registration data - in real app, this would come from API
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  const [formData, setFormData] = useState<{
    associationDetails: AssociationDetails;
    contactDetails: ContactDetails;
    files: UploadedFile[];
  }>({
    associationDetails: {
      associationName: '',
      associationType: '',
      registrationOption: '',
      description: ''
    },
    contactDetails: {
      contactPersonName: user?.name || '',
      contactEmail: user?.email || '',
      contactPhone: '',
      address: ''
    },
    files: []
  });

  const handleInputChange = (section: keyof typeof formData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  };

  const removeFile = (fileId: string) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(file => file.id !== fileId)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (status: 'draft' | 'submit') => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRegistration: RegistrationData = {
        id: Math.random().toString(36).substr(2, 9),
        status: status === 'submit' ? 'pending' : 'draft',
        submittedAt: status === 'submit' ? new Date() : undefined,
        associationDetails: formData.associationDetails,
        contactDetails: formData.contactDetails,
        files: formData.files
      };

      setRegistrationData(newRegistration);
      
      if (status === 'submit') {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: RegistrationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showSuccess) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">Registration Submitted Successfully!</h2>
            <p className="text-green-700 mb-6">
              Your association registration request has been received. We will contact you once it has been processed.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (registrationData && registrationData.status !== 'draft') {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Association Registration Status</h1>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(registrationData.status)}`}>
                {getStatusIcon(registrationData.status)}
                <span className="font-medium capitalize">{registrationData.status}</span>
              </div>
            </div>

            {registrationData.status === 'rejected' && registrationData.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900">Rejection Reason</h3>
                    <p className="text-red-700 mt-1">{registrationData.rejectionReason}</p>
                  </div>
                </div>
                <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Resubmit Application
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Association Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Association Name</label>
                    <p className="text-gray-900">{registrationData.associationDetails.associationName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Association Type</label>
                    <p className="text-gray-900">{registrationData.associationDetails.associationType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Option</label>
                    <p className="text-gray-900">{registrationData.associationDetails.registrationOption}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900">{registrationData.associationDetails.description}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person</label>
                    <p className="text-gray-900">{registrationData.contactDetails.contactPersonName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{registrationData.contactDetails.contactEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{registrationData.contactDetails.contactPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{registrationData.contactDetails.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {registrationData.files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {registrationData.files.map((file) => (
                    <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <FileImage className="w-8 h-8 text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <p>Submitted: {registrationData.submittedAt?.toLocaleDateString()}</p>
                {registrationData.reviewedAt && (
                  <p>Reviewed: {registrationData.reviewedAt.toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Association Registration</h1>
          <p className="text-gray-600">
            Register your association with relevant authorities through SureGroups. Complete the form below to get started.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Association Details</span>
            <span>Contact Information</span>
            <span>Supporting Documents</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Step 1: Association Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Association Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Association Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.associationDetails.associationName}
                  onChange={(e) => handleInputChange('associationDetails', 'associationName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your association name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Association Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.associationDetails.associationType}
                  onChange={(e) => handleInputChange('associationDetails', 'associationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select association type</option>
                  {ASSOCIATION_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Option <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.associationDetails.registrationOption}
                  onChange={(e) => handleInputChange('associationDetails', 'registrationOption', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select registration option</option>
                  {REGISTRATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description / Purpose of Association <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.associationDetails.description}
                  onChange={(e) => handleInputChange('associationDetails', 'description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the purpose and activities of your association"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactDetails.contactPersonName}
                  onChange={(e) => handleInputChange('contactDetails', 'contactPersonName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactDetails.contactEmail}
                  onChange={(e) => handleInputChange('contactDetails', 'contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter contact email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.contactDetails.contactPhone}
                  onChange={(e) => handleInputChange('contactDetails', 'contactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactDetails.address}
                  onChange={(e) => handleInputChange('contactDetails', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete address"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Include street address, city, state, and postal code
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Supporting Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Supporting Documents</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Documents
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload files or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF, JPEG, PNG up to 10MB each</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {formData.files.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
                  <div className="space-y-3">
                    {formData.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileImage className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.preview && (
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Required Documents</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Association Constitution or Bylaws</li>
                  <li>• Proof of Members (minimum 10 members)</li>
                  <li>• Bank Account Details</li>
                  <li>• Valid Identification of Key Officials</li>
                  <li>• Any existing registration documents</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit('submit')}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
