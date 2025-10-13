import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Key, 
  Shield, 
  Activity, 
  Eye, 
  Edit, 
  Search, 
  Plus,
  Globe,
  Clock,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { APIIntegration, apiIntegrationService } from '../../services/apiIntegration';
import { APIIntegrationModal } from './modals/APIIntegrationModal';

export const APIIntegrationManagement: React.FC = () => {
  const [apis, setApis] = useState<APIIntegration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedApi, setSelectedApi] = useState<APIIntegration | null>(null);

  // Load APIs on component mount
  useEffect(() => {
    loadAPIs();
  }, []);

  const loadAPIs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiIntegrationService.getAPIIntegrations();
      setApis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load APIs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAPI = () => {
    setSelectedApi(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleViewAPI = (api: APIIntegration) => {
    setSelectedApi(api);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditAPI = (api: APIIntegration) => {
    setSelectedApi(api);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteAPI = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API integration?')) return;
    
    try {
      await apiIntegrationService.deleteAPIIntegration(id);
      await loadAPIs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API');
    }
  };

  const handleSaveAPI = async (apiData: Omit<APIIntegration, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (modalMode === 'create') {
        await apiIntegrationService.createAPIIntegration(apiData);
      } else if (modalMode === 'edit' && selectedApi) {
        await apiIntegrationService.updateAPIIntegration(selectedApi.id, apiData);
      }
      await loadAPIs();
      setShowModal(false);
    } catch (err) {
      throw err; // Re-throw to be handled by modal
    }
  };

  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.endpoint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || api.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: apis.length,
    active: apis.filter(a => a.status === 'Active').length,
    totalRequests: apis.reduce((sum, a) => sum + a.requests, 0),
    methods: [...new Set(apis.map(a => a.method))].length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
              API Integration Management
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
              Manage API endpoints and integrations
            </p>
          </div>
          <button 
            onClick={handleCreateAPI}
            className="flex items-center gap-2 px-6 py-3 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75] transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span style={{ fontFamily: 'Molde Semi Expanded Bold' }}>New API</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
              <Code className="w-6 h-6 text-[#098DCF]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Total APIs
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
            <div className="p-3 bg-purple-100 rounded-xl">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Total Requests
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.totalRequests.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Globe className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Methods
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.methods}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search APIs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                style={{ fontFamily: 'Molde Semi Expanded Regular' }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
              style={{ fontFamily: 'Molde Semi Expanded Regular' }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* APIs Table */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  API Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requests
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApis.map((api) => (
                <tr key={api.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                        {api.name}
                      </div>
                      <div className="text-sm text-gray-500">{api.endpoint}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {api.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(api.status)}`}>
                      {api.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {api.requests.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {api.lastUsed}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleViewAPI(api)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View API"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditAPI(api)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit API"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAPI(api.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete API"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <APIIntegrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveAPI}
        integration={selectedApi}
        mode={modalMode}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#098DCF]"></div>
            <span className="text-gray-700" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
              Loading APIs...
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 z-50">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-red-700">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};