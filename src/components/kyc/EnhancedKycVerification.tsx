import React, { useState, useRef } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  Building, 
  User, 
  Shield, 
  ArrowLeft, 
  ArrowRight,
  Check,
  X,
  Upload,
  FileText
} from 'lucide-react';
import { UserRole } from '../../types';
import { kycService } from '../../services/kyc';
import { useAuth } from '../../contexts/AuthContext';

interface KycVerificationProps {
  role: UserRole;
  onComplete: (tier: 'tier1' | 'tier2' | 'tier3', status: 'verified' | 'pending') => void;
  onSkip: () => void;
}

interface BvnData {
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  bankName: string;
}

interface NinData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  stateOfOrigin: string;
}

interface BusinessData {
  businessName: string;
  cacNumber?: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  documents: File[];
}

export const EnhancedKycVerification: React.FC<KycVerificationProps> = ({ 
  role, 
  onComplete, 
  onSkip 
}) => {
  const { updateKycData } = useAuth();
  const [currentTier, setCurrentTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier1');
  const [loading, setLoading] = useState<null | 'tier1' | 'tier2' | 'tier3'>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Tier 1 states
  const [bvn, setBvn] = useState('');
  const [bvnData, setBvnData] = useState<BvnData | null>(null);
  const [livenessCompleted, setLivenessCompleted] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  
  // Tier 2 states
  const [nin, setNin] = useState('');
  const [ninData, setNinData] = useState<NinData | null>(null);
  
  // Tier 3 states
  const [businessData, setBusinessData] = useState<BusinessData>({
    businessName: '',
    cacNumber: '',
    businessPhone: '',
    businessEmail: '',
    businessAddress: '',
    documents: []
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const isBusinessAccount = role === 'vendor' || role === 'group-admin';
  const totalTiers = isBusinessAccount ? 3 : 2;

  const getTierProgress = () => {
    const tierIndex = currentTier === 'tier1' ? 1 : currentTier === 'tier2' ? 2 : 3;
    return `${tierIndex} of ${totalTiers}`;
  };

  const getTierTitle = () => {
    switch (currentTier) {
      case 'tier1': return 'Identity Verification (Tier 1)';
      case 'tier2': return 'NIN Verification (Tier 2)';
      case 'tier3': return 'Business (KYB) Verification (Tier 3)';
      default: return '';
    }
  };

  const getTierDescription = () => {
    switch (currentTier) {
      case 'tier1': 
        return 'Your BVN will be verified with the Central Bank of Nigeria (CBN) to confirm your identity details.';
      case 'tier2': 
        return 'Your National Identification Number (NIN) will be verified with the National Identity Management Commission (NIMC).';
      case 'tier3': 
        return 'Provide your business details to complete verification. If your business is not yet registered, you may skip the CAC number field.';
      default: return '';
    }
  };

  // BVN Verification
  const verifyBVN = async () => {
    if (!/^\d{11}$/.test(bvn)) {
      setError('Please enter a valid 11-digit BVN');
      return;
    }

    setLoading('tier1');
    setError('');
    
    try {
      const result = await kycService.verifyBVN(bvn);
      
      const bvnData: BvnData = {
        fullName: result.fullName,
        dateOfBirth: result.dateOfBirth,
        phoneNumber: result.phoneNumber,
        bankName: result.bankName
      };
      
      setBvnData(bvnData);
      setSuccess('BVN verified successfully!');
    } catch (err: any) {
      setError(err.message || 'BVN verification failed. Please check your number and try again.');
    } finally {
      setLoading(null);
    }
  };

  // Liveness Check
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera access to continue.');
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(photoDataUrl);
        
        // Stop camera
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        
        // Perform liveness check with KYC service
        try {
          await kycService.performLivenessCheck(photoDataUrl);
          setLivenessCompleted(true);
          setSuccess('Identity confirmed successfully!');
          
          // Save liveness photo to user's KYC data
          updateKycData({
            livenessPhoto: photoDataUrl
          });
        } catch (err: any) {
          setError(err.message || 'Liveness check failed. Please try again.');
        }
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setLivenessCompleted(false);
    startCamera();
  };

  // NIN Verification
  const verifyNIN = async () => {
    if (!/^\d{11}$/.test(nin)) {
      setError('Please enter a valid 11-digit NIN');
      return;
    }

    setLoading('tier2');
    setError('');
    
    try {
      const result = await kycService.verifyNIN(nin);
      
      const ninData: NinData = {
        fullName: result.fullName,
        dateOfBirth: result.dateOfBirth,
        gender: result.gender,
        stateOfOrigin: result.stateOfOrigin
      };
      
      setNinData(ninData);
      setSuccess('NIN verified successfully!');
    } catch (err: any) {
      setError(err.message || 'NIN verification failed. Please check your number and try again.');
    } finally {
      setLoading(null);
    }
  };

  // Business Verification
  const verifyBusiness = async () => {
    if (!businessData.businessName.trim()) {
      setError('Business name is required');
      return;
    }

    setLoading('tier3');
    setError('');
    
    try {
      const result = await kycService.submitBusinessVerification(businessData);
      setSuccess(result.message);
      onComplete('tier3', 'verified');
    } catch (err: any) {
      setError(err.message || 'Business verification failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setBusinessData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeDocument = (index: number) => {
    setBusinessData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const proceedToNextTier = () => {
    if (currentTier === 'tier1') {
      setCurrentTier('tier2');
    } else if (currentTier === 'tier2') {
      if (isBusinessAccount) {
        setCurrentTier('tier3');
      } else {
        onComplete('tier2', 'verified');
      }
    }
    setError('');
    setSuccess('');
  };

  const canProceedTier1 = bvnData && livenessCompleted;
  const canProceedTier2 = ninData;
  const canProceedTier3 = businessData.businessName.trim() && businessData.businessPhone.trim() && businessData.businessEmail.trim();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC/KYB Verification</h1>
          <p className="text-gray-600 text-lg">Complete your identity verification to unlock full access</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {getTierProgress().split(' of ')[0]}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {getTierProgress()}
                </span>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(parseInt(getTierProgress().split(' of ')[0]) / totalTiers) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{getTierTitle()}</h2>
            <p className="text-gray-600">{getTierDescription()}</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-green-700 font-medium">{success}</span>
            </div>
          )}

          {/* Tier 1 - Identity Verification */}
          {currentTier === 'tier1' && (
            <div className="space-y-8">
              {/* BVN Section */}
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-blue-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Bank Verification Number (BVN)</h3>
                </div>
                
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Important:</strong> Your BVN will be verified with the Central Bank of Nigeria (CBN) to confirm your identity details.
                  </p>
                  <p className="text-sm text-blue-800">
                    If you don't know your BVN, dial <strong>*565*0#</strong> on your registered mobile number to retrieve it.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter your Bank Verification Number (BVN)
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="Enter 11-digit BVN"
                      value={bvn}
                      onChange={(e) => setBvn(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      disabled={bvnData !== null}
                    />
                  </div>

                  {bvnData && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">BVN Verification Successful</h4>
                      <div className="space-y-1 text-sm text-green-700">
                        <p><strong>Name:</strong> {bvnData.fullName}</p>
                        <p><strong>Date of Birth:</strong> {bvnData.dateOfBirth}</p>
                        <p><strong>Phone:</strong> {bvnData.phoneNumber}</p>
                        <p><strong>Bank:</strong> {bvnData.bankName}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={verifyBVN}
                    disabled={loading === 'tier1' || bvn.length !== 11 || bvnData !== null}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading === 'tier1' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying BVN...
                      </>
                    ) : bvnData ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        BVN Verified
                      </>
                    ) : (
                      'Verify BVN'
                    )}
                  </button>
                </div>
              </div>

              {/* Liveness Check Section */}
              {bvnData && (
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Camera className="w-6 h-6 text-blue-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Liveness Check</h3>
                  </div>
                  
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Please take a live photo to confirm your identity. Ensure you're in a well-lit area and your face is clearly visible.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {!capturedPhoto && !livenessCompleted && (
                      <div className="text-center">
                        {!stream ? (
                          <button
                            onClick={startCamera}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center mx-auto"
                          >
                            <Camera className="w-5 h-5 mr-2" />
                            Start Camera
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative mx-auto max-w-md">
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full rounded-lg border-2 border-gray-200"
                              />
                              <canvas ref={canvasRef} className="hidden" />
                            </div>
                            <button
                              onClick={capturePhoto}
                              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center mx-auto"
                            >
                              <Camera className="w-5 h-5 mr-2" />
                              Capture Photo
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {capturedPhoto && !livenessCompleted && (
                      <div className="text-center">
                        <div className="mb-4">
                          <img
                            src={capturedPhoto}
                            alt="Captured photo"
                            className="mx-auto rounded-lg border-2 border-gray-200 max-w-md"
                          />
                        </div>
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={retakePhoto}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center"
                          >
                            <X className="w-5 h-5 mr-2" />
                            Retake Photo
                          </button>
                          <button
                            onClick={() => setLivenessCompleted(true)}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center"
                          >
                            <Check className="w-5 h-5 mr-2" />
                            Confirm Photo
                          </button>
                        </div>
                      </div>
                    )}

                    {livenessCompleted && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-green-700 font-semibold">Identity confirmed successfully!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tier 2 - NIN Verification */}
          {currentTier === 'tier2' && (
            <div className="space-y-8">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-blue-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">National Identification Number (NIN)</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter your National Identification Number (NIN)
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="Enter 11-digit NIN"
                      value={nin}
                      onChange={(e) => setNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      disabled={ninData !== null}
                    />
                  </div>

                  {ninData && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">NIN Verification Successful</h4>
                      <div className="space-y-1 text-sm text-green-700">
                        <p><strong>Name:</strong> {ninData.fullName}</p>
                        <p><strong>Date of Birth:</strong> {ninData.dateOfBirth}</p>
                        <p><strong>Gender:</strong> {ninData.gender}</p>
                        <p><strong>State of Origin:</strong> {ninData.stateOfOrigin}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={verifyNIN}
                    disabled={loading === 'tier2' || nin.length !== 11 || ninData !== null}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading === 'tier2' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying NIN...
                      </>
                    ) : ninData ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        NIN Verified
                      </>
                    ) : (
                      'Verify NIN'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tier 3 - Business Verification */}
          {currentTier === 'tier3' && (
            <div className="space-y-8">
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Building className="w-6 h-6 text-blue-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        placeholder="Enter business name"
                        value={businessData.businessName}
                        onChange={(e) => setBusinessData(prev => ({ ...prev, businessName: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CAC Registration Number (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        placeholder="Enter CAC number (optional)"
                        value={businessData.cacNumber}
                        onChange={(e) => setBusinessData(prev => ({ ...prev, cacNumber: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Phone Number *
                      </label>
                      <input
                        type="tel"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        placeholder="Enter business phone"
                        value={businessData.businessPhone}
                        onChange={(e) => setBusinessData(prev => ({ ...prev, businessPhone: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Email Address *
                      </label>
                      <input
                        type="email"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        placeholder="Enter business email"
                        value={businessData.businessEmail}
                        onChange={(e) => setBusinessData(prev => ({ ...prev, businessEmail: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Address *
                    </label>
                    <textarea
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="Enter business address"
                      rows={3}
                      value={businessData.businessAddress}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, businessAddress: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Supporting Documents (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center mx-auto"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Documents
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        Upload business license, CAC certificate, or other supporting documents
                      </p>
                    </div>

                    {businessData.documents.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-semibold text-gray-700">Uploaded Documents:</h4>
                        {businessData.documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                            </div>
                            <button
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={verifyBusiness}
                    disabled={loading === 'tier3' || !canProceedTier3}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading === 'tier3' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit KYB Verification'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={onSkip}
              className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors duration-200"
            >
              Skip and Verify Later
            </button>

            <div className="flex space-x-4">
              {currentTier !== 'tier1' && (
                <button
                  onClick={() => {
                    if (currentTier === 'tier2') setCurrentTier('tier1');
                    else if (currentTier === 'tier3') setCurrentTier('tier2');
                    setError('');
                    setSuccess('');
                  }}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              )}

              {((currentTier === 'tier1' && canProceedTier1) || 
                (currentTier === 'tier2' && canProceedTier2) || 
                (currentTier === 'tier3' && canProceedTier3)) && (
                <button
                  onClick={proceedToNextTier}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                >
                  {currentTier === 'tier3' ? 'Complete Verification' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
