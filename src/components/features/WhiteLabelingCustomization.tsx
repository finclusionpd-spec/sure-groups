import React, { useState } from 'react';
import { 
  Palette, 
  Settings, 
  Eye, 
  Edit, 
  Save, 
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const WhiteLabelingCustomization: React.FC = () => {
  const [customizations, setCustomizations] = useState([
    {
      id: '1',
      name: 'Primary Brand Colors',
      type: 'Colors',
      status: 'Active',
      lastModified: '2024-01-15 14:30:00',
      description: 'Main brand color scheme'
    },
    {
      id: '2',
      name: 'Logo Configuration',
      type: 'Assets',
      status: 'Active',
      lastModified: '2024-01-14 12:00:00',
      description: 'Company logo and branding'
    },
    {
      id: '3',
      name: 'Custom Domain',
      type: 'Domain',
      status: 'Pending',
      lastModified: '2024-01-13 09:15:00',
      description: 'Custom domain configuration'
    }
  ]);

  const [activeTab, setActiveTab] = useState('colors');
  const [isSaving, setIsSaving] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: customizations.length,
    active: customizations.filter(c => c.status === 'Active').length,
    pending: customizations.filter(c => c.status === 'Pending').length,
    types: [...new Set(customizations.map(c => c.type))].length
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
              White Labeling & Customization
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
              Customize platform branding and appearance
            </p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75] transition-colors shadow-lg disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span style={{ fontFamily: 'Molde Semi Expanded Bold' }}>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
              <Palette className="w-6 h-6 text-[#098DCF]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Total Customizations
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Active
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.active}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Pending
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.pending}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Types
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.types}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'colors', label: 'Colors', icon: Palette },
              { id: 'assets', label: 'Assets', icon: Upload },
              { id: 'domain', label: 'Domain', icon: Settings },
              { id: 'preview', label: 'Preview', icon: Eye }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#098DCF] text-[#098DCF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: 'Molde Semi Expanded Regular' }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                Brand Colors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input type="color" defaultValue="#098DCF" className="w-12 h-10 rounded border" />
                    <input type="text" defaultValue="#098DCF" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                  <div className="flex items-center space-x-3">
                    <input type="color" defaultValue="#0F2A75" className="w-12 h-10 rounded border" />
                    <input type="text" defaultValue="#0F2A75" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Accent Color</label>
                  <div className="flex items-center space-x-3">
                    <input type="color" defaultValue="#E8EEF7" className="w-12 h-10 rounded border" />
                    <input type="text" defaultValue="#E8EEF7" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                Brand Assets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Favicon Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                Custom Domain
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name</label>
                  <input
                    type="text"
                    placeholder="yourcompany.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
                  <input
                    type="text"
                    placeholder="app"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                Live Preview
              </h3>
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Your Brand Name</h4>
                  <p className="text-gray-600">This is how your platform will look with your custom branding</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customizations Table */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
            Customization History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customizations.map((customization) => (
                <tr key={customization.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                        {customization.name}
                      </div>
                      <div className="text-sm text-gray-500">{customization.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {customization.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(customization.status)}`}>
                      {customization.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customization.lastModified}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};