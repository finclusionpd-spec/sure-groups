import React, { useState, useEffect } from 'react';
import { X, Save, TestTube, AlertCircle, RefreshCw } from 'lucide-react';
import { ThirdPartyIntegration } from '../../../services/apiIntegration';

interface ThirdPartyIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (integration: Omit<ThirdPartyIntegration, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  integration?: ThirdPartyIntegration | null;
  mode: 'create' | 'edit' | 'view';
}

export const ThirdPartyIntegrationModal: React.FC<ThirdPartyIntegrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  integration,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Payment' as 'Payment' | 'Communication' | 'Storage' | 'Analytics' | 'Authentication' | 'Notification' | 'Other',
    status: 'Active' as 'Active' | 'Inactive' | 'Error',
    description: '',
    provider: '',
    apiKey: '',
    webhookUrl: '',
    environment: 'production' as 'production' | 'staging' | 'development',
    rateLimit: 100,
    timeout: 30,
    retryAttempts: 3
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; responseTime?: number } | null>(null);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; lastSync: string } | null>(null);

  useEffect(() => {
    if (integration && mode !== 'create') {
      setFormData({
        name: integration.name,
        type: integration.type,
        status: integration.status,
        description: integration.description,
        provider: integration.provider,
        apiKey: integration.apiKey || '',
        webhookUrl: integration.webhookUrl || '',
        environment: integration.configuration.environment,
        rateLimit: integration.configuration.rateLimit,
        timeout: integration.configuration.timeout,
        retryAttempts: integration.configuration.retryAttempts
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        type: 'Payment',
        status: 'Active',
        description: '',
        provider: '',
        apiKey: '',
        webhookUrl: '',
        environment: 'production',
        rateLimit: 100,
        timeout: 30,
        retryAttempts: 3
      });
    }
  }, [integration, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    setIsLoading(true);
    setError(null);

    try {
      const integrationData = {
        ...formData,
        healthStatus: 'healthy' as const,
        requestCount: 0,
        errorCount: 0,
        uptime: 100,
        features: [],
        configuration: {
          environment: formData.environment,
          rateLimit: formData.rateLimit,
          timeout: formData.timeout,
          retryAttempts: formData.retryAttempts
        }
      };
      
      await onSave(integrationData);
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
      // Simulate integration test
      await new Promise(resolve => setTimeout(resolve, 1500));
      const success = Math.random() > 0.15;
      setTestResult({
        success,
        message: success ? 'Integration test successful' : 'Integration test failed',
        responseTime: Math.floor(Math.random() * 800) + 200
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

  const handleSync = async () => {
    if (!integration) return;
    
    setIsLoading(true);
    setSyncResult(null);
    
    try {
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      const success = Math.random() > 0.1;
      setSyncResult({
        success,
        message: success ? 'Integration synced successfully' : 'Sync failed',
        lastSync: success ? new Date().toISOString() : integration.lastSync
      });
    } catch (err) {
      setSyncResult({
        success: false,
        message: 'Sync failed with error',
        lastSync: integration.lastSync
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
            {mode === 'create' && 'Create New Integration'}
            {mode === 'edit' && 'Edit Integration'}
            {mode === 'view' && 'View Integration'}
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
                Integration Name *
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
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                required
              >
                <option value="Payment">Payment</option>
                <option value="Communication">Communication</option>
                <option value="Storage">Storage</option>
                <option value="Analytics">Analytics</option>
                <option value="Authentication">Authentication</option>
                <option value="Notification">Notification</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Provider *
              </label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                placeholder="e.g., Stripe, SendGrid, AWS"
                required
              />
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
                API Key
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Webhook URL
              </label>
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                placeholder="https://example.com/webhook"
              />
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
              placeholder="Describe the integration..."
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

          {/* Sync Result */}
          {syncResult && (
            <div className={`p-4 rounded-lg ${syncResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${syncResult.success ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`font-medium ${syncResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {syncResult.message}
                </span>
                {syncResult.lastSync && (
                  <span className="text-sm text-gray-500">
                    Last sync: {new Date(syncResult.lastSync).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            {mode !== 'view' && integration && (
              <>
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <TestTube className="w-4 h-4" />
                  Test Integration
                </button>
                
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync Integration
                </button>
              </>
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
                {isLoading ? 'Saving...' : mode === 'create' ? 'Create Integration' : 'Save Changes'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};



