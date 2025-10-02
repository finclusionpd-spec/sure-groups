import React, { useState } from 'react';
import { 
  Percent, 
  DollarSign, 
  CreditCard, 
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const SubscriptionFeeManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: 'Basic Plan',
      description: 'Essential features for small groups',
      price: 9.99,
      billingCycle: 'Monthly',
      features: ['Up to 10 members', 'Basic analytics', 'Email support'],
      status: 'Active',
      subscribers: 1250,
      revenue: 12487.50
    },
    {
      id: 2,
      name: 'Professional Plan',
      description: 'Advanced features for growing organizations',
      price: 29.99,
      billingCycle: 'Monthly',
      features: ['Up to 100 members', 'Advanced analytics', 'Priority support', 'Custom branding'],
      status: 'Active',
      subscribers: 450,
      revenue: 13495.50
    },
    {
      id: 3,
      name: 'Enterprise Plan',
      description: 'Full-featured solution for large organizations',
      price: 99.99,
      billingCycle: 'Monthly',
      features: ['Unlimited members', 'Full analytics', '24/7 support', 'White-label', 'API access'],
      status: 'Active',
      subscribers: 85,
      revenue: 8499.15
    },
    {
      id: 4,
      name: 'Starter Plan',
      description: 'Free tier with limited features',
      price: 0.00,
      billingCycle: 'Monthly',
      features: ['Up to 5 members', 'Basic features'],
      status: 'Active',
      subscribers: 3200,
      revenue: 0
    }
  ]);

  const [fees, setFees] = useState([
    {
      id: 1,
      name: 'Transaction Fee',
      type: 'Percentage',
      value: 2.9,
      description: 'Standard payment processing fee',
      status: 'Active',
      appliedTo: 'All Transactions'
    },
    {
      id: 2,
      name: 'Fixed Processing Fee',
      type: 'Fixed',
      value: 0.30,
      description: 'Fixed fee per transaction',
      status: 'Active',
      appliedTo: 'All Transactions'
    },
    {
      id: 3,
      name: 'International Fee',
      type: 'Percentage',
      value: 1.5,
      description: 'Additional fee for international transactions',
      status: 'Active',
      appliedTo: 'International Only'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('subscriptions');

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.revenue, 0);
  const totalSubscribers = subscriptions.reduce((sum, sub) => sum + sub.subscribers, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription & Fee Management</h1>
        <p className="text-gray-600">Manage subscription plans and platform fees</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscriptions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Subscription Plans
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Platform Fees
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add {activeTab === 'subscriptions' ? 'Plan' : 'Fee'}
            </button>
          </div>

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              {filteredSubscriptions.map((subscription) => (
                <div key={subscription.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{subscription.name}</h3>
                      <p className="text-gray-600">{subscription.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${subscription.price.toFixed(2)}
                        <span className="text-sm font-normal text-gray-500">/{subscription.billingCycle}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {subscription.subscribers.toLocaleString()} subscribers
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {subscription.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Revenue</h4>
                      <p className="text-lg font-semibold text-gray-900">
                        ${subscription.revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">This month</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscription.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subscription.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-900 p-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-2">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === 'fees' && (
            <div className="space-y-4">
              {fees.map((fee) => (
                <div key={fee.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{fee.name}</h3>
                      <p className="text-gray-600">{fee.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {fee.type === 'Percentage' ? `${fee.value}%` : `$${fee.value.toFixed(2)}`}
                      </div>
                      <div className="text-sm text-gray-500">{fee.type}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Applied To</h4>
                      <p className="text-sm text-gray-600">{fee.appliedTo}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        fee.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {fee.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-900 p-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-2">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{totalSubscribers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscriptions.filter(s => s.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">+12.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
