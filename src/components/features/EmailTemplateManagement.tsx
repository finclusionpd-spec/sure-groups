import React, { useState } from 'react';
import { 
  Mail, 
  FileText, 
  Edit, 
  Eye, 
  Copy, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings
} from 'lucide-react';

export const EmailTemplateManagement: React.FC = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to SureGroups!',
      category: 'Onboarding',
      status: 'Active',
      lastModified: '2024-01-15 14:30',
      createdBy: 'Super Admin',
      usage: 1250,
      language: 'English'
    },
    {
      id: 2,
      name: 'Password Reset',
      subject: 'Reset Your Password',
      category: 'Security',
      status: 'Active',
      lastModified: '2024-01-14 10:15',
      createdBy: 'Super Admin',
      usage: 890,
      language: 'English'
    },
    {
      id: 3,
      name: 'Payment Confirmation',
      subject: 'Payment Successful',
      category: 'Transaction',
      status: 'Draft',
      lastModified: '2024-01-13 16:45',
      createdBy: 'Super Admin',
      usage: 0,
      language: 'English'
    },
    {
      id: 4,
      name: 'Group Invitation',
      subject: 'You\'re invited to join a group',
      category: 'Invitation',
      status: 'Active',
      lastModified: '2024-01-12 09:20',
      createdBy: 'Super Admin',
      usage: 2100,
      language: 'English'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || template.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || template.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4" />;
      case 'Draft': return <Clock className="w-4 h-4" />;
      case 'Inactive': return <AlertTriangle className="w-4 h-4" />;
      case 'Archived': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email & Template Management</h1>
        <p className="text-gray-600">Create and manage email templates for automated communications</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Security">Security</option>
              <option value="Transaction">Transaction</option>
              <option value="Invitation">Invitation</option>
              <option value="Notification">Notification</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Inactive">Inactive</option>
              <option value="Archived">Archived</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              New Template
            </button>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                      <div className="text-xs text-gray-500">By {template.createdBy}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{template.subject}</div>
                    <div className="text-xs text-gray-500">{template.language}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {template.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(template.status)}`}>
                      {getStatusIcon(template.status)}
                      {template.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {template.usage.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.lastModified}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 p-1">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="bg-white rounded border p-4 max-w-2xl">
            <div className="border-b border-gray-200 pb-2 mb-4">
              <h4 className="text-sm font-medium text-gray-900">Welcome Email</h4>
              <p className="text-xs text-gray-500">Subject: Welcome to SureGroups!</p>
            </div>
            <div className="text-sm text-gray-700">
              <p className="mb-2">Hi {{user_name}},</p>
              <p className="mb-2">Welcome to SureGroups! We're excited to have you join our community.</p>
              <p className="mb-2">Your account has been successfully created and you can now:</p>
              <ul className="list-disc list-inside mb-4 ml-4">
                <li>Join groups and communities</li>
                <li>Connect with like-minded people</li>
                <li>Access exclusive features and content</li>
              </ul>
              <p className="mb-4">Get started by exploring our platform and joining your first group!</p>
              <div className="text-center">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
                  Get Started
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Best regards,<br />
                The SureGroups Team
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
              </div>
            </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.reduce((sum, t) => sum + t.usage, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.status === 'Draft').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
