import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ArrowLeft,
  ArrowRight,
  X,
  Eye,
  Download,
  Trash2,
  Plus
} from 'lucide-react';
import { 
  AssociationRegistration, 
  AssociationRegistrationFormData, 
  AssociationDocument,
  AssociationType,
  RegistrationOption,
  RegistrationStatus
} from '../../types';
import { associationRegistrationService } from '../../services/associationRegistration';
import { useAuth } from '../../contexts/AuthContext';

interface AssociationRegistrationFormProps {
  groupId: string;
  groupName: string;
  existingRegistration?: AssociationRegistration | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssociationRegistrationForm: React.FC<AssociationRegistrationFormProps> = ({ 
  groupId,
  groupName,
  existingRegistration,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AssociationRegistrationFormData>({
    associationName: '',
    associationType: 'NGO',
    registrationOption: 'CAC Registration',
    description: '',
    contactPersonName: user?.fullName || '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    documents: []
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);

  const associationTypes: AssociationType[] = [
    'NGO', 'Cooperative', 'Professional Body', 'Community Group', 
    'Religious Organization', 'Trade Union', 'Other'
  ];

  const registrationOptions: RegistrationOption[] = [
    'CAC Registration', 'Regular Association Registration', 
    'Professional Body Registration', 'Religious Organization Registration', 'Other'
  ];

  const documentTypes: { value: AssociationDocument['documentType']; label: string }[] = [
    { value: 'constitution', label: 'Constitution' },
    { value: 'existing_registration', label: 'Existing Registration Documents' },
    { value: 'proof_of_members', label: 'Proof of Members' },
    { value: 'financial_statement', label: 'Financial Statement' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (existingRegistration) {
      setFormData({
        associationName: existingRegistration.associationName,
        associationType: existingRegistration.associationType,
        registrationOption: existingRegistration.registrationOption,
        description: existingRegistration.description,
        contactPersonName: existingRegistration.contactPersonName,
        contactEmail: existingRegistration.contactEmail,
        contactPhone: existingRegistration.contactPhone,
        address: existingRegistration.address,
        city: existingRegistration.city,
        state: existingRegistration.state,
        country: existingRegistration.country,
        documents: []
      });
    }
  }, [existingRegistration]);

  const handleInputChange = (field: keyof AssociationRegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.associationName.trim()) {
      errors.associationName = 'Association name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.contactPersonName.trim()) {
      errors.contactPersonName = 'Contact person name is required';
    }
    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
    if (!formData.contactPhone.trim()) {
      errors.contactPhone = 'Contact phone is required';
    }
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      return validTypes.includes(file.type);
    });

    if (newFiles.length !== files.length) {
      setError('Some files were skipped. Only PDF, JPEG, and PNG files are allowed.');
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) {
      setError('Please fix validation errors before saving');
      return;
    }

    try {
      setIsSubmitting(true);
      if (existingRegistration) {
        await associationRegistrationService.updateAssociationRegistration(existingRegistration.id, formData);
      } else {
        await associationRegistrationService.createAssociationRegistration(
          groupId,
          groupName,
          user?.id || 'admin-1',
          user?.fullName || 'Admin User',
          formData,
          uploadedFiles
        );
      }
      setError(null);
      setSuccessMessage('Draft saved successfully');
    } catch (err) {
      setError('Failed to save draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fix validation errors before submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      if (existingRegistration) {
        await associationRegistrationService.submitAssociationRegistration(existingRegistration.id);
      } else {
        await associationRegistrationService.createAndSubmitRegistration(
          groupId,
          groupName,
          user?.id || 'admin-1',
          user?.fullName || 'Admin User',
          formData,
          uploadedFiles
        );
      }
      setShowSuccess(true);
      setError(null);
    } catch (err) {
      setError('Failed to submit registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Your association registration request has been received. You can track its status from your registrations list.
        </p>
        <button
          onClick={onSuccess}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Registrations
        </button>
      </div>
    );
  }

  return (
    <div>
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
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Association Details</span>
          <span>Contact Details</span>
          <span>Documents</span>
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

      {/* Form Steps */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Association Details</h3>
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Association Name *
              </label>
              <input
                type="text"
                value={formData.associationName}
                onChange={(e) => handleInputChange('associationName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.associationName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter association name"
              />
              {validationErrors.associationName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.associationName}</p>
              )}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Association Type *
              </label>
              <select
                value={formData.associationType}
                onChange={(e) => handleInputChange('associationType', e.target.value as AssociationType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {associationTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Option *
              </label>
              <select
                value={formData.registrationOption}
                onChange={(e) => handleInputChange('registrationOption', e.target.value as RegistrationOption)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {registrationOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description / Purpose of Association *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the purpose and activities of your association"
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person Name *
            </label>
            <input
              type="text"
              value={formData.contactPersonName}
              onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter contact person name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter state"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>
      )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>
            
            {/* File Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-gray-600 mb-4">
                {isDragOver ? 'Drop files here' : 'Drag & drop files here or click to select'}
              </p>
              <p className="text-sm text-gray-500 mb-4">Supports PDF, JPEG, and PNG files</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Files
              </button>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Uploaded Files</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB • {file.type}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
