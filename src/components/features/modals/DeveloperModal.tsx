import React, { useState, useEffect } from 'react';
import { X, Save, Key, Eye, EyeOff, Copy, Check, AlertCircle } from 'lucide-react';
import { Developer } from '../../../services/developerToolsSandbox';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (developer: Omit<Developer, 'id' | 'createdDate' | 'lastUsed' | 'requestCount'>) => Promise<void>;
  developer?: Developer | null;
  mode: 'create' | 'edit' | 'view';
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({
  isOpen,
  onClose,
  onSave,
  developer,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accessScope: [] as string[],
    status: 'Active' as 'Active' | 'Revoked' | 'Expired',
    expiryDate: '',
    permissions: [] as { id: string; name: string; description: string; enabled: boolean }[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const availablePermissions = [
    { id: 'users:read', name: 'Read Users', description: 'Access user data' },
    { id: 'users:write', name: 'Write Users', description: 'Modify user data' },
    { id: 'groups:read', name: 'Read Groups', description: 'Access group data' },
    { id: 'groups:write', name: 'Write Groups', description: 'Modify group data' },
    { id: 'transactions:read', name: 'Read Transactions', description: 'Access transaction data' },
    { id: 'transactions:write', name: 'Write Transactions', description: 'Modify transaction data' },
    { id: 'api:admin', name: 'API Admin', description: 'Full API access' }
  ];

  useEffect(() => {
    if (developer && mode !== 'create') {
      setFormData({
        name: developer.name,
        email: developer.email,
        accessScope: developer.accessScope,
        status: developer.status,
        expiryDate: developer.expiryDate.split('T')[0],
        permissions: developer.permissions
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        email: '',
        accessScope: [],
        status: 'Active',
        expiryDate: '',
        permissions: []
      });
    }
  }, [developer, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    setIsLoading(true);
    setError(null);

    try {
      const developerData = {
        name: formData.name,
        email: formData.email,
        apiKey: developer?.apiKey || `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        accessScope: formData.accessScope,
        status: formData.status,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        permissions: formData.permissions
      };
      
      await onSave(developerData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    if (!permission) return;

    const isSelected = formData.permissions.some(p => p.id === permissionId);
    
    if (isSelected) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p.id !== permissionId),
        accessScope: formData.accessScope.filter(scope => scope !== permissionId)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, { ...permission, enabled: true }],
        accessScope: [...formData.accessScope, permissionId]
      });
    }
  };

  const copyApiKey = async () => {
    if (developer?.apiKey) {
      await navigator.clipboard.writeText(developer.apiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
            {mode === 'create' && 'Create New Developer'}
            {mode === 'edit' && 'Edit Developer'}
            {mode === 'view' && 'View Developer Details'}
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

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Developer Name *
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
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
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
                <option value="Revoked">Revoked</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Expiry Date *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                disabled={mode === 'view'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent disabled:bg-gray-50"
                required
              />
            </div>
          </div>

          {/* API Key Display (for view/edit modes) */}
          {developer && (mode === 'view' || mode === 'edit') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={developer.apiKey}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={copyApiKey}
                  className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availablePermissions.map((permission) => {
                const isSelected = formData.permissions.some(p => p.id === permission.id);
                return (
                  <label
                    key={permission.id}
                    className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-[#098DCF] bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handlePermissionToggle(permission.id)}
                      disabled={mode === 'view'}
                      className="mt-1 rounded border-gray-300 text-[#098DCF] focus:ring-[#098DCF]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{permission.name}</div>
                      <div className="text-sm text-gray-500">{permission.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
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
                {isLoading ? 'Saving...' : mode === 'create' ? 'Create Developer' : 'Save Changes'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};



