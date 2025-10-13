import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Settings,
  Users,
  FileText,
  DollarSign,
  Shield,
  Building,
  UserCheck,
  MoreHorizontal,
  X,
  Save,
  ArrowRight,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Pause,
  Play
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  role: string;
  order: number;
  isRequired: boolean;
  escalationDays?: number;
}

interface ApprovalWorkflow {
  id: string;
  name: string;
  category: string;
  module: string;
  makerRole: string;
  checkerRole: string;
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  dateCreated: string;
  lastModified: string;
  steps: WorkflowStep[];
  description: string;
  isDefault: boolean;
  escalationEnabled: boolean;
  maxEscalationDays: number;
}

interface WorkflowStats {
  totalWorkflows: number;
  activeWorkflows: number;
  pendingRequests: number;
  suspendedWorkflows: number;
}

export const SuperAdminApprovalWorkflowManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'requests' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive' | 'suspended'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'transactions' | 'onboarding' | 'kyc' | 'financial' | 'system'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'maker' | 'checker'>('all');
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'status' | 'dateCreated'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Sample data
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([
    {
      id: 'wf-1',
      name: 'High-Value Transaction Approval',
      category: 'Financial',
      module: 'Transaction Management',
      makerRole: 'Product Admin',
      checkerRole: 'Super Admin',
      status: 'active',
      dateCreated: '2024-01-15',
      lastModified: '2024-01-20',
      description: 'Approval workflow for transactions over $10,000',
      isDefault: true,
      escalationEnabled: true,
      maxEscalationDays: 3,
      steps: [
        { id: 'step-1', name: 'Initial Review', role: 'Product Admin', order: 1, isRequired: true, escalationDays: 1 },
        { id: 'step-2', name: 'Financial Review', role: 'Super Admin', order: 2, isRequired: true, escalationDays: 2 },
        { id: 'step-3', name: 'Final Approval', role: 'Super Admin', order: 3, isRequired: true, escalationDays: 3 }
      ]
    },
    {
      id: 'wf-2',
      name: 'Vendor Onboarding Process',
      category: 'Onboarding',
      module: 'Vendor Management',
      makerRole: 'Group Admin',
      checkerRole: 'Product Admin',
      status: 'active',
      dateCreated: '2024-01-10',
      lastModified: '2024-01-18',
      description: 'Complete vendor verification and onboarding workflow',
      isDefault: false,
      escalationEnabled: true,
      maxEscalationDays: 5,
      steps: [
        { id: 'step-1', name: 'Document Review', role: 'Group Admin', order: 1, isRequired: true, escalationDays: 2 },
        { id: 'step-2', name: 'Background Check', role: 'Product Admin', order: 2, isRequired: true, escalationDays: 3 },
        { id: 'step-3', name: 'Final Approval', role: 'Product Admin', order: 3, isRequired: true, escalationDays: 5 }
      ]
    },
    {
      id: 'wf-3',
      name: 'KYC Verification Update',
      category: 'Compliance',
      module: 'KYC Management',
      makerRole: 'Member',
      checkerRole: 'Group Admin',
      status: 'pending',
      dateCreated: '2024-01-20',
      lastModified: '2024-01-22',
      description: 'Workflow for updating KYC verification status',
      isDefault: false,
      escalationEnabled: false,
      maxEscalationDays: 0,
      steps: [
        { id: 'step-1', name: 'Document Submission', role: 'Member', order: 1, isRequired: true },
        { id: 'step-2', name: 'Verification Review', role: 'Group Admin', order: 2, isRequired: true, escalationDays: 2 }
      ]
    },
    {
      id: 'wf-4',
      name: 'System Configuration Changes',
      category: 'System',
      module: 'System Settings',
      makerRole: 'Product Admin',
      checkerRole: 'Super Admin',
      status: 'inactive',
      dateCreated: '2024-01-05',
      lastModified: '2024-01-12',
      description: 'Approval for critical system configuration changes',
      isDefault: false,
      escalationEnabled: true,
      maxEscalationDays: 1,
      steps: [
        { id: 'step-1', name: 'Change Request', role: 'Product Admin', order: 1, isRequired: true },
        { id: 'step-2', name: 'Security Review', role: 'Super Admin', order: 2, isRequired: true, escalationDays: 1 }
      ]
    }
  ]);

  // Calculate stats
  const stats: WorkflowStats = useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter(w => w.status === 'active').length;
    const pending = workflows.filter(w => w.status === 'pending').length;
    const suspended = workflows.filter(w => w.status === 'suspended').length;
    
    return { totalWorkflows: total, activeWorkflows: active, pendingRequests: pending, suspendedWorkflows: suspended };
  }, [workflows]);

  // Filter and sort workflows
  const filteredWorkflows = useMemo(() => {
    let filtered = workflows.filter(workflow => {
      const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workflow.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workflow.module.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || workflow.category.toLowerCase() === categoryFilter;
      const matchesRole = roleFilter === 'all' || 
                         (roleFilter === 'maker' && workflow.makerRole) ||
                         (roleFilter === 'checker' && workflow.checkerRole);
      
      return matchesSearch && matchesStatus && matchesCategory && matchesRole;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'dateCreated':
          aValue = new Date(a.dateCreated).getTime();
          bValue = new Date(b.dateCreated).getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortDir === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [workflows, searchTerm, statusFilter, categoryFilter, roleFilter, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filteredWorkflows.length / pageSize);
  const paginatedWorkflows = filteredWorkflows.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const handleViewWorkflow = (workflow: ApprovalWorkflow) => {
    setSelectedWorkflow(workflow);
    setShowViewModal(true);
  };

  const handleEditWorkflow = (workflow: ApprovalWorkflow) => {
    setSelectedWorkflow(workflow);
    setShowEditModal(true);
  };

  const handleDeleteWorkflow = (workflow: ApprovalWorkflow) => {
    setSelectedWorkflow(workflow);
    setShowDeleteModal(true);
  };

  const handleToggleStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: w.status === 'active' ? 'suspended' : 'active' }
        : w
    ));
  };

  const handleCreateWorkflow = () => {
    setShowCreateModal(true);
  };

  const handleViewPendingRequests = () => {
    setStatusFilter('pending');
    setPage(1);
  };

  const handleExportWorkflowData = () => {
    // Create CSV data
    const csvData = filteredWorkflows.map(workflow => ({
      'Workflow Name': workflow.name,
      'Category': workflow.category,
      'Module': workflow.module,
      'Initiator Role': workflow.makerRole,
      'Approver Role': workflow.checkerRole,
      'Status': workflow.status,
      'Date Created': workflow.dateCreated,
      'Last Modified': workflow.lastModified,
      'Description': workflow.description,
      'Steps Count': workflow.steps.length,
      'Escalation Enabled': workflow.escalationEnabled ? 'Yes' : 'No',
      'Max Escalation Days': workflow.maxEscalationDays
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `approval-workflows-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefreshData = () => {
    // Simulate data refresh
    setWorkflows(prev => [...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'inactive': return <Pause className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#0F2A75] mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
            Approval Workflow Management
          </h1>
          <p className="text-[#098DCF] text-lg" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
            Centralized control over all approval processes across the platform
          </p>
        </div>
        <button
          onClick={handleCreateWorkflow}
          className="bg-[#098DCF] hover:bg-[#0F2A75] text-white px-6 py-3 rounded-2xl font-medium flex items-center space-x-2 transition-all duration-200 hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Workflow</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Workflows</p>
              <p className="text-3xl font-bold text-[#0F2A75]">{stats.totalWorkflows}</p>
            </div>
            <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
              <Settings className="w-8 h-8 text-[#098DCF]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Workflows</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeWorkflows}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Suspended</p>
              <p className="text-3xl font-bold text-red-600">{stats.suspendedWorkflows}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleCreateWorkflow}
            className="bg-[#098DCF] hover:bg-[#0F2A75] text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Workflow</span>
          </button>
          <button
            onClick={handleViewPendingRequests}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Clock className="w-4 h-4" />
            <span>View Pending Requests</span>
          </button>
          <button
            onClick={handleExportWorkflowData}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export Workflow Data</span>
          </button>
          <button
            onClick={handleRefreshData}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="transactions">Transactions</option>
            <option value="onboarding">Onboarding</option>
            <option value="kyc">KYC</option>
            <option value="financial">Financial</option>
            <option value="system">System</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="maker">Maker</option>
            <option value="checker">Checker</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('all');
              setRoleFilter('all');
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Workflows Table */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Workflow Name</span>
                    {sortBy === 'name' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category / Module</span>
                    {sortBy === 'category' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Initiator Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approver Role
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortBy === 'status' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('dateCreated')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date Created</span>
                    {sortBy === 'dateCreated' && (
                      <ArrowRight className={`w-4 h-4 ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedWorkflows.map((workflow) => (
                <tr key={workflow.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                        <div className="text-sm text-gray-500">{workflow.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{workflow.category}</div>
                    <div className="text-sm text-gray-500">{workflow.module}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{workflow.makerRole}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{workflow.checkerRole}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {getStatusIcon(workflow.status)}
                      <span className="ml-1 capitalize">{workflow.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(workflow.dateCreated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewWorkflow(workflow)}
                        className="text-[#098DCF] hover:text-[#0F2A75] transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditWorkflow(workflow)}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        title="Edit Workflow"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(workflow.id)}
                        className={`transition-colors duration-200 ${
                          workflow.status === 'active' 
                            ? 'text-red-600 hover:text-red-800' 
                            : 'text-green-600 hover:text-green-800'
                        }`}
                        title={workflow.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteWorkflow(workflow)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="Delete Workflow"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredWorkflows.length)} of {filteredWorkflows.length} workflows
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Workflow Modal */}
      {showViewModal && selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#0F2A75]">{selectedWorkflow.name}</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900">{selectedWorkflow.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900">{selectedWorkflow.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                  <p className="text-gray-900">{selectedWorkflow.module}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedWorkflow.status)}`}>
                    {getStatusIcon(selectedWorkflow.status)}
                    <span className="ml-1 capitalize">{selectedWorkflow.status}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initiator Role</label>
                  <p className="text-gray-900">{selectedWorkflow.makerRole}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Approver Role</label>
                  <p className="text-gray-900">{selectedWorkflow.checkerRole}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Created</label>
                  <p className="text-gray-900">{new Date(selectedWorkflow.dateCreated).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Modified</label>
                  <p className="text-gray-900">{new Date(selectedWorkflow.lastModified).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Workflow Steps</label>
              <div className="space-y-3">
                {selectedWorkflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#098DCF] text-white rounded-full flex items-center justify-center font-medium">
                      {step.order}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{step.name}</div>
                      <div className="text-sm text-gray-600">Role: {step.role}</div>
                      {step.escalationDays && (
                        <div className="text-sm text-gray-500">Escalation: {step.escalationDays} days</div>
                      )}
                    </div>
                    {step.isRequired && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Required
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditWorkflow(selectedWorkflow);
                }}
                className="px-6 py-2 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75]"
              >
                Edit Workflow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Workflow</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the workflow "{selectedWorkflow.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setWorkflows(prev => prev.filter(w => w.id !== selectedWorkflow.id));
                  setShowDeleteModal(false);
                  setSelectedWorkflow(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#0F2A75]">Create New Workflow</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workflow Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter workflow name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select Category</option>
                    <option value="Financial">Financial</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Compliance">Compliance</option>
                    <option value="System">System</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe the workflow purpose and requirements"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initiator Role <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select Role</option>
                    <option value="Member">Member</option>
                    <option value="Group Admin">Group Admin</option>
                    <option value="Product Admin">Product Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approver Role <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent">
                    <option value="">Select Role</option>
                    <option value="Group Admin">Group Admin</option>
                    <option value="Product Admin">Product Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-[#098DCF] focus:ring-[#098DCF]" />
                  <span className="text-sm text-gray-700">Enable Escalation</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-[#098DCF] focus:ring-[#098DCF]" />
                  <span className="text-sm text-gray-700">Set as Default</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add workflow creation logic here
                  setShowCreateModal(false);
                }}
                className="px-6 py-2 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75]"
              >
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
