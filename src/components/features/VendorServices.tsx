import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Star, Package, DollarSign, Upload, X } from 'lucide-react';
import { VendorService } from '../../types';

export const VendorServices: React.FC = () => {
  const LOCAL_STORAGE_KEY = 'sure-groups-vendor-services';
  const [services, setServices] = useState<VendorService[]>([
    {
      id: '1',
      name: 'Comprehensive Health Screening',
      description: 'Complete health checkup including blood tests, vitals, and consultation with certified medical professionals.',
      category: 'Health Services',
      price: 125.00,
      currency: 'NGN',
      status: 'active',
      connectedGroups: ['Community Church', 'Youth Ministry'],
      imageUrl: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.9,
      reviewCount: 23,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-14T10:30:00Z'
    },
    {
      id: '2',
      name: 'Professional Business Consultation',
      description: 'One-on-one consultation with certified business advisors for strategic planning and growth.',
      category: 'Professional Services',
      price: 75.00,
      currency: 'NGN',
      status: 'active',
      connectedGroups: ['Local Union Chapter'],
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.8,
      reviewCount: 18,
      createdAt: '2025-01-05T00:00:00Z',
      updatedAt: '2025-01-13T15:20:00Z'
    },
    {
      id: '3',
      name: 'Digital Marketing Masterclass',
      description: 'Comprehensive course covering SEO, social media marketing, PPC, and analytics for modern businesses.',
      category: 'Training & Education',
      price: 149.00,
      currency: 'NGN',
      status: 'pending',
      connectedGroups: ['Tech Professionals'],
      imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.7,
      reviewCount: 15,
      createdAt: '2025-01-10T00:00:00Z',
      updatedAt: '2025-01-14T09:15:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VendorService['status']>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedService, setSelectedService] = useState<VendorService | null>(null);

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    availability: true,
    connectedGroups: [] as string[]
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{ name?: string; description?: string; price?: string; category?: string }>({});

  const categories = [
    'Product',
    'Professional Service',
    'Discount',
    'Offer',
    'Training',
    'Health Services',
    'Financial Services',
    'Technology Services',
    'Consulting',
    'Other'
  ];

  const availableGroups = [
    'Community Church',
    'Youth Ministry', 
    'Local Union Chapter',
    'Tech Professionals',
    'Community Care',
    'Business Network'
  ];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as VendorService[];
        if (Array.isArray(parsed)) {
          setServices(prev => (parsed.length > 0 ? parsed : prev));
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
    } catch {}
  }, [services]);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const readFilesAsDataUrls = (files: File[]): Promise<string[]> => {
    return Promise.all(files.map(file => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    })));
  };

  const validateForm = (): boolean => {
    const errors: { name?: string; description?: string; price?: string; category?: string } = {};
    if (!newService.name.trim()) errors.name = 'Service name is required';
    if (!newService.description.trim()) errors.description = 'Description is required';
    if (!newService.category.trim()) errors.category = 'Category is required';
    if (newService.price === '' || isNaN(Number(newService.price))) errors.price = 'Price must be a number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateService = async () => {
    if (!validateForm()) return;

    const [images, videos] = await Promise.all([
      readFilesAsDataUrls(imageFiles),
      readFilesAsDataUrls(videoFiles)
    ]);

    const service: VendorService = {
      id: Date.now().toString(),
      name: newService.name.trim(),
      description: newService.description.trim(),
      category: newService.category,
      price: parseFloat(newService.price) || 0,
      currency: 'NGN',
      status: newService.availability ? 'active' : 'inactive',
      connectedGroups: newService.connectedGroups,
      imageUrl: images[0] || 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=600',
      images,
      videos,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setServices([service, ...services]);
    setNewService({ name: '', description: '', category: '', price: '', availability: true, connectedGroups: [] });
    setImageFiles([]);
    setImagePreviews([]);
    setVideoFiles([]);
    setVideoPreviews([]);
    setFormErrors({});
    setShowCreateModal(false);
  };

  const toggleServiceStatus = (serviceId: string) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { 
            ...service, 
            status: service.status === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toISOString()
          }
        : service
    ));
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const activeServices = services.filter(s => s.status === 'active').length;
  const pendingServices = services.filter(s => s.status === 'pending').length;
  const totalRevenue = services.reduce((sum, service) => sum + (service.price * service.reviewCount), 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Services</h1>
        <p className="text-gray-600">Manage your service offerings and group connections</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <Package className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <p className="text-2xl font-bold text-green-600">{activeServices}</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingServices}</p>
            </div>
            <Package className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Est. Revenue</p>
              <p className="text-2xl font-bold text-purple-600">${totalRevenue.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={(service.images && service.images[0]) || service.imageUrl} 
                alt={service.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  ${service.price}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{service.name}</h3>
                <div className="flex items-center space-x-1 ml-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">{service.rating}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500">
                  <p className="font-medium">{service.category}</p>
                  <p>{service.reviewCount} reviews</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${service.price}</p>
                  <p className="text-xs text-gray-500">{service.currency}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Connected Groups:</p>
                <div className="flex flex-wrap gap-1">
                  {service.connectedGroups.map((group, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {group}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full ${
                    service.status === 'active' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {service.status === 'active' ? <ToggleLeft className="w-3 h-3" /> : <ToggleRight className="w-3 h-3" />}
                  <span>{service.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Service</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter service name"
                />
                {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your service"
                />
                {formErrors.description && <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({...newService, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {formErrors.category && <p className="mt-1 text-xs text-red-600">{formErrors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (NGN)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {formErrors.price && <p className="mt-1 text-xs text-red-600">{formErrors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center space-x-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Select Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setImageFiles(prev => [...prev, ...files]);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = () => setImagePreviews(prev => [...prev, reader.result as string]);
                          reader.readAsDataURL(file);
                        });
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-500">You can upload multiple images</span>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 md:grid-cols-4 gap-2">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative">
                        <img src={src} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded-lg border" />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow hover:bg-gray-50"
                          onClick={() => {
                            setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                            setImageFiles(prev => prev.filter((_, i) => i !== idx));
                          }}
                        >
                          <X className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Videos (optional)</label>
                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center space-x-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Select Videos</span>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setVideoFiles(prev => [...prev, ...files]);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = () => setVideoPreviews(prev => [...prev, reader.result as string]);
                          reader.readAsDataURL(file);
                        });
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-500">Short promo/demo videos recommended</span>
                </div>
                {videoPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {videoPreviews.map((src, idx) => (
                      <div key={idx} className="relative">
                        <video src={src} className="w-full h-24 object-cover rounded-lg border" controls />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow hover:bg-gray-50"
                          onClick={() => {
                            setVideoPreviews(prev => prev.filter((_, i) => i !== idx));
                            setVideoFiles(prev => prev.filter((_, i) => i !== idx));
                          }}
                        >
                          <X className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Connect to Groups</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableGroups.map(group => (
                    <label key={group} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newService.connectedGroups.includes(group)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewService({...newService, connectedGroups: [...newService.connectedGroups, group]});
                          } else {
                            setNewService({...newService, connectedGroups: newService.connectedGroups.filter(g => g !== group)});
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{group}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <button
                  type="button"
                  onClick={() => setNewService({...newService, availability: !newService.availability})}
                  className={`inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-full ${
                    newService.availability ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {newService.availability ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{newService.availability ? 'Active' : 'Inactive'}</span>
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateService}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={(selectedService.images && selectedService.images[0]) || selectedService.imageUrl} 
                alt={selectedService.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedService.name}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedService.status)}`}>
                      {selectedService.status}
                    </span>
                    <span className="text-sm text-gray-500">{selectedService.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">${selectedService.price}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{selectedService.rating} ({selectedService.reviewCount})</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{selectedService.description}</p>

              {selectedService.images && selectedService.images.length > 1 && (
                <div className="mb-6 grid grid-cols-3 gap-2">
                  {selectedService.images.slice(1).map((img, idx) => (
                    <img key={idx} src={img} alt={`image-${idx}`} className="w-full h-24 object-cover rounded" />
                  ))}
                </div>
              )}

              {selectedService.videos && selectedService.videos.length > 0 && (
                <div className="mb-6 grid grid-cols-2 gap-2">
                  {selectedService.videos.map((vid, idx) => (
                    <video key={idx} src={vid} className="w-full h-32 object-cover rounded" controls />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Service Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="text-gray-900">${selectedService.price} {selectedService.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="text-gray-900">{selectedService.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{new Date(selectedService.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900">{new Date(selectedService.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Connected Groups</h4>
                  <div className="space-y-1">
                    {selectedService.connectedGroups.map((group, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{group}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => toggleServiceStatus(selectedService.id)}
                  className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                    selectedService.status === 'active' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedService.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};