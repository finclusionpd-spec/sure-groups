import React, { useState, useEffect } from 'react';
import { X, Save, TestTube, AlertCircle } from 'lucide-react';
import { APIIntegration } from '../../../services/apiIntegration';

interface APIIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (integration: Omit<APIIntegration, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  integration?: APIIntegration | null;
  mode: 'create' | 'edit' | 'view';
}

export const APIIntegrationModal: React.FC<APIIntegrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  integration,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    endpoint: '',
    method: 'REST' as 'REST' | 'GraphQL' | 'WebSocket',
    status: 'Active' as 'Active' | 'Inactive' | 'Error',
    description: '',
    rateLimit: 1000,
    timeout: 30,
    retryAttempts: 3,
    environment: 'production' as 'production' | 'staging' | 'development'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; responseTime?: number } | null>(null);

  useEffect(() => {
    if (integration && mode !== 'create') {
      setFormData({
        name: integration.name,
        endpoint: integration.endpoint,
        method: integration.method,
        status: integration.status,
        description: integration.description || '',
        rateLimit: integration.rateLimit || 1000,
        timeout: integration.timeout || 30,
        retryAttempts: integration.retryAttempts || 3,
        environment: integration.environment
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        endpoint: '',
        method: 'REST',
        status: 'Active',
        description: '',
        rateLimit: 1000,
        timeout: 30,
        retryAttempts: 3,
        environment: 'production'
      });
    }
  }, [integration, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    setIsLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!integration) return;
    
    setIsLoading(true);
    setTestResult(null);
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = Math.random() > 0.2;
      setTestResult({
        success,
        message: success ? 'API test successful' : 'API test failed',
        responseTime: Math.floor(Math.random() * 500) + 100
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Test failed with error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
            {mode === 'create' && 'Create New API Integration'}
            {mode === 'edit' && 'Edit API Integration'}
            {mode === 'view' && 'View API Integration'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                API Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Endpoint *
              </label>
              <input
                type="text"
                value={formData.endpoint}
                onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                placeholder="/api/endpoint"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Method *
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                required
              >
                <option value="REST">REST</option>
                <option value="GraphQL">GraphQL</option>
                <option value="WebSocket">WebSocket</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Error">Error</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Environment *
              </label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value as any })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                required
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Rate Limit (requests/hour)
              </label>
              <input
                type="number"
                value={formData.rateLimit}
                onChange={(e) => setFormData({ ...formData, rateLimit: parseInt(e.target.value) || 0 })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Timeout (seconds)
              </label>
              <input
                type="number"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) || 0 })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Retry Attempts
              </label>
              <input
                type="number"
                value={formData.retryAttempts}
                onChange={(e) => setFormData({ ...formData, retryAttempts: parseInt(e.target.value) || 0 })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                min="0"
                max="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={mode === 'view'}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
              rows={3}
              placeholder="Describe the API integration..."
            />
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${testResult.success ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`font-medium ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {testResult.message}
                </span>
                {testResult.responseTime && (
                  <span className="text-sm text-gray-500">
                    ({testResult.responseTime}ms)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            {mode !== 'view' && integration && (
              <button
                type="button"
                onClick={handleTest}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <TestTube className="w-4 h-4" />
                Test API
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-[#098DCF] text-white rounded-lg hover:bg-[#0F2A75] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : mode === 'create' ? 'Create API' : 'Save Changes'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};



