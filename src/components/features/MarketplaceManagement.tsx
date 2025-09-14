import React, { useMemo, useState } from 'react';
import { Search, Plus, ShoppingCart, Edit, Trash2, Eye, Star, DollarSign, Package, TrendingUp, Check, Image as ImageIcon, Wallet } from 'lucide-react';
import { getWalletBalance } from '../../services/wallet';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendor: string;
  vendorId: string;
  imageUrl: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  isGroupExclusive: boolean;
  commission: number;
}

interface MarketplaceOrder {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  vendorName: string;
}

export const MarketplaceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'discounts' | 'services' | 'general' | 'orders' | 'vendors' | 'analytics'>('overview');
  const donationsWallet = getWalletBalance('1');
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Organic Honey - 500ml',
      description: 'Pure organic honey sourced from local beekeepers',
      price: 25.99,
      category: 'Food & Beverages',
      vendor: 'Local Farmers Co-op',
      vendorId: '1',
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      status: 'active',
      stock: 45,
      sold: 23,
      rating: 4.8,
      reviewCount: 12,
      createdAt: '2025-01-10T00:00:00Z',
      updatedAt: '2025-01-14T10:30:00Z',
      isGroupExclusive: true,
      commission: 10
    },
    {
      id: '2',
      name: 'Handmade Crafts Set',
      description: 'Beautiful handmade crafts created by community artisans',
      price: 45.00,
      category: 'Arts & Crafts',
      vendor: 'Community Artisans',
      vendorId: '2',
      imageUrl: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600',
      status: 'active',
      stock: 12,
      sold: 8,
      rating: 4.9,
      reviewCount: 6,
      createdAt: '2025-01-08T00:00:00Z',
      updatedAt: '2025-01-13T15:20:00Z',
      isGroupExclusive: false,
      commission: 15
    },
    {
      id: '3',
      name: 'Professional Consultation',
      description: 'One-on-one consultation with certified professionals',
      price: 75.00,
      category: 'Services',
      vendor: 'Professional Services Inc',
      vendorId: '3',
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
      status: 'pending',
      stock: 0,
      sold: 15,
      rating: 4.7,
      reviewCount: 9,
      createdAt: '2025-01-12T00:00:00Z',
      updatedAt: '2025-01-14T09:15:00Z',
      isGroupExclusive: true,
      commission: 20
    }
  ]);

  const [orders] = useState<MarketplaceOrder[]>([
    {
      id: 'ORD-001',
      productId: '1',
      productName: 'Organic Honey - 500ml',
      buyerName: 'Sarah Johnson',
      buyerEmail: 'sarah.j@example.com',
      quantity: 2,
      totalAmount: 51.98,
      status: 'confirmed',
      orderDate: '2025-01-14T10:30:00Z',
      vendorName: 'Local Farmers Co-op'
    },
    {
      id: 'ORD-002',
      productId: '2',
      productName: 'Handmade Crafts Set',
      buyerName: 'Mike Wilson',
      buyerEmail: 'mike.w@example.com',
      quantity: 1,
      totalAmount: 45.00,
      status: 'shipped',
      orderDate: '2025-01-13T16:45:00Z',
      vendorName: 'Community Artisans'
    },
    {
      id: 'ORD-003',
      productId: '3',
      productName: 'Professional Consultation',
      buyerName: 'Emily Davis',
      buyerEmail: 'emily.d@example.com',
      quantity: 1,
      totalAmount: 75.00,
      status: 'pending',
      orderDate: '2025-01-12T14:20:00Z',
      vendorName: 'Professional Services Inc'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Product['status']>('all');
  const [vendorFilter, setVendorFilter] = useState<'all' | string>('all');
  // Date range is display-only (non-editable)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    vendor: '',
    stock: '',
    commission: '',
    imageUrl: ''
  });
  const handleMediaFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewProduct(prev => ({ ...prev, imageUrl: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const categories = ['Marketplace', 'Discounts & Offers', 'Professional Services'];
  const allVendors = useMemo(() => Array.from(new Set(products.map(p => p.vendor))), [products]);

  const preDateFiltered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' ||
      (categoryFilter === 'Marketplace' && product.category !== 'Professional Services' && product.category !== 'Discounts & Offers') ||
      (categoryFilter === 'Professional Services' && product.category === 'Services') ||
      (categoryFilter === 'Discounts & Offers' && product.category === 'Discounts & Offers') ||
      product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesVendor = vendorFilter === 'all' || product.vendor === vendorFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesVendor;
  });

  const filteredProducts = preDateFiltered;

  const dateRangeLabel = useMemo(() => {
    if (preDateFiltered.length === 0) return 'All time';
    const timestamps = preDateFiltered.map(p => new Date(p.createdAt).getTime()).filter(n => !isNaN(n));
    if (timestamps.length === 0) return 'All time';
    const min = new Date(Math.min(...timestamps));
    const max = new Date(Math.max(...timestamps));
    const fmt = (d: Date) => d.toLocaleDateString();
    return `${fmt(min)} – ${fmt(max)}`;
  }, [preDateFiltered]);

  const handleCreateProduct = () => {
    if (!newProduct.name.trim()) return alert('Title is required');
    if (!newProduct.description.trim()) return alert('Description is required');
    if (!newProduct.category) return alert('Category is required');
    const priceNum = parseFloat(newProduct.price);
    if (isNaN(priceNum) || priceNum < 0) return alert('Price must be numeric');
    if (!newProduct.imageUrl) return alert('Please upload or paste an image URL');
    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
      price: priceNum || 0,
      stock: parseInt(newProduct.stock) || 0,
      commission: parseFloat(newProduct.commission) || 0,
      vendorId: Date.now().toString(),
      imageUrl: newProduct.imageUrl,
      status: 'pending',
      sold: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isGroupExclusive: false
    };
    setProducts([product, ...products]);
    setNewProduct({
      name: '', description: '', price: '', category: '', vendor: '', stock: '', commission: '', imageUrl: ''
    });
    setShowCreateModal(false);
  };

  const handleUpdateProductStatus = (productId: string, status: Product['status']) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, status, updatedAt: new Date().toISOString() } : product
    ));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const activeProducts = products.filter(p => p.status === 'active').length;
  const pendingProducts = products.filter(p => p.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const mostPopular = [...products].sort((a,b) => b.sold - a.sold).slice(0, 5);
  const recentActivity = [
    ...products.map(p => ({ type: 'listing', at: p.createdAt, title: `New listing: ${p.name}` })),
    ...orders.map(o => ({ type: 'order', at: o.orderDate, title: `Order ${o.id} - ${o.productName}` }))
  ].sort((a,b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0,6);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketplace Management</h1>
        <p className="text-gray-600">Manage group marketplace products, vendors, and orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-green-600">{activeProducts}</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingProducts}</p>
            </div>
            <Eye className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-purple-600">₦{totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'listings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Listings ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('discounts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discounts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discounts & Offers
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Professional Services
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General Items
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Wallet & KPIs</h3>
              <div className="inline-flex items-center space-x-2 text-sm text-gray-700 bg-gray-50 border rounded px-2 py-1">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>{donationsWallet.currency} {donationsWallet.balance.toFixed(2)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded border">
                <div className="text-gray-600">Active Listings</div>
                <div className="text-2xl font-bold text-blue-700 mt-1">{activeProducts}</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded border">
                <div className="text-gray-600">Pending Approval</div>
                <div className="text-2xl font-bold text-yellow-700 mt-1">{pendingProducts}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded border">
                <div className="text-gray-600">Sales Volume</div>
                <div className="text-2xl font-bold text-purple-700 mt-1">₦{totalRevenue.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-green-50 rounded border">
                <div className="text-gray-600">Orders</div>
                <div className="text-2xl font-bold text-green-700 mt-1">{totalOrders}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-2 text-sm">
              {recentActivity.map((a, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 border">
                  <span className="text-gray-700">{a.title}</span>
                  <span className="text-gray-500">{new Date(a.at).toLocaleString()}</span>
                </div>
              ))}
              {recentActivity.length === 0 && (<div className="text-gray-500">No activity yet</div>)}
            </div>
          </div>
          <div className="md:col-span-2 bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular</h3>
            <div className="grid md:grid-cols-5 gap-4">
              {mostPopular.map(p => (
                <div key={p.id} className="border rounded-lg p-3">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-24 object-cover rounded" />
                  <div className="mt-2 text-sm font-medium text-gray-900 line-clamp-1">{p.name}</div>
                  <div className="text-xs text-gray-500">Sold: {p.sold}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:flex-wrap items-center gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>
              </div>
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={vendorFilter}
                onChange={e => setVendorFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Vendors</option>
                {allVendors.map(v => (<option key={v} value={v}>{v}</option>))}
              </select>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 select-none cursor-default">
                Date: {dateRangeLabel}
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                  {product.isGroupExclusive && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        EXCLUSIVE
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-500">
                      <p className="font-medium">{product.vendor}</p>
                      <p>{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${product.price}</p>
                      <p className="text-xs text-gray-500">{product.commission}% commission</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <span>Stock: {product.stock}</span>
                    <span>Sold: {product.sold}</span>
                    <span>{product.reviewCount} reviews</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {product.status === 'pending' && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleUpdateProductStatus(product.id, 'active')}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateProductStatus(product.id, 'rejected')}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Discounts & Offers */}
      {activeTab === 'discounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(p => p.category === 'Discounts & Offers').map((product) => (
            <div key={product.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>{product.status}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{product.description}</div>
              <div className="text-sm text-gray-500 mb-3">Vendor: {product.vendor}</div>
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedProduct(product)} className="text-blue-600 hover:text-blue-800">Details</button>
                <div className="space-x-2 text-sm">
                  <button onClick={() => handleUpdateProductStatus(product.id, 'active')} className="text-green-600">Approve</button>
                  <button onClick={() => handleUpdateProductStatus(product.id, 'rejected')} className="text-red-600">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Professional Services */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(p => p.category === 'Services').map((product) => (
            <div key={product.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>{product.status}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{product.description}</div>
              <div className="text-sm text-gray-500 mb-3">Vendor: {product.vendor}</div>
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedProduct(product)} className="text-blue-600 hover:text-blue-800">Details</button>
                <div className="space-x-2 text-sm">
                  <button onClick={() => handleUpdateProductStatus(product.id, 'active')} className="text-green-600">Approve</button>
                  <button onClick={() => handleUpdateProductStatus(product.id, 'rejected')} className="text-red-600">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* General Items */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(p => p.category !== 'Services' && p.category !== 'Discounts & Offers').map((product) => (
            <div key={product.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>{product.status}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">{product.description}</div>
              <div className="text-sm text-gray-500 mb-3">Vendor: {product.vendor}</div>
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedProduct(product)} className="text-blue-600 hover:text-blue-800">Details</button>
                <div className="space-x-2 text-sm">
                  <button onClick={() => handleUpdateProductStatus(product.id, 'active')} className="text-green-600">Approve</button>
                  <button onClick={() => handleUpdateProductStatus(product.id, 'rejected')} className="text-red-600">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">Qty: {order.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                      <div className="text-sm text-gray-500">{order.vendorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.buyerName}</div>
                      <div className="text-sm text-gray-500">{order.buyerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₦{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Local Farmers Co-op</h3>
                <p className="text-sm text-gray-500">Food & Beverages</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Products:</span>
                <span className="text-gray-900">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sales:</span>
                <span className="text-gray-900">$1,245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-gray-900">4.8</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
              View Details
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Community Artisans</h3>
                <p className="text-sm text-gray-500">Arts & Crafts</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Products:</span>
                <span className="text-gray-900">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sales:</span>
                <span className="text-gray-900">$890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-gray-900">4.9</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
              View Details
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Professional Services Inc</h3>
                <p className="text-sm text-gray-500">Services</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Products:</span>
                <span className="text-gray-900">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sales:</span>
                <span className="text-gray-900">$2,150</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-gray-900">4.7</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Total Revenue</p>
                  <p className="text-xs text-green-600">This month</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">₦{totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-green-500">+15% from last month</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Orders Processed</p>
                  <p className="text-xs text-blue-600">This month</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{totalOrders}</p>
                  <p className="text-xs text-blue-500">+8 from last month</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-900">Average Order Value</p>
                  <p className="text-xs text-purple-600">Per transaction</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">
                    ₦{totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
                  </p>
                  <p className="text-xs text-purple-500">Stable</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Food & Beverages</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm text-gray-900">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Services</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-sm text-gray-900">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Arts & Crafts</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm text-gray-900">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Service / Product</h3>
            <div className="space-y-4">
              {newProduct.imageUrl ? (
                <div className="w-full h-40 rounded-lg overflow-hidden border">
                  {/* Basic preview for images/videos */}
                  {newProduct.imageUrl.startsWith('data:video') ? (
                    <video src={newProduct.imageUrl} className="w-full h-full object-cover" controls />
                  ) : (
                    <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
              ) : (
                <div className="w-full h-20 rounded-lg border border-dashed flex items-center justify-center text-gray-500 text-sm">
                  <ImageIcon className="w-4 h-4 mr-2" /> Add media (image/video)
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media Upload</label>
                <div className="flex items-center space-x-3">
                  <label className="inline-flex items-center px-3 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-50">
                    <input type="file" accept="image/*,video/*" onChange={(e) => handleMediaFile(e.target.files?.[0])} className="hidden" />
                    <ImageIcon className="w-4 h-4 mr-2" /> Upload
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <input
                  type="text"
                  value={newProduct.vendor}
                  onChange={(e) => setNewProduct({...newProduct, vendor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newProduct.commission}
                  onChange={(e) => setNewProduct({...newProduct, commission: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                onClick={handleCreateProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};