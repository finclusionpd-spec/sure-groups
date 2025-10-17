import React, { useState } from 'react';
import { 
  Search, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Download, 
  Filter,
  Plus,
  Shield,
  FileText,
  Calendar
} from 'lucide-react';

export const BackgroundCheckManagement: React.FC = () => {
  const [checks, setChecks] = useState([
    {
      id: '1',
      userId: 'user-123',
      userName: 'John Smith',
      userEmail: 'john@company.com',
      type: 'Employment Verification',
      status: 'Completed',
      submittedAt: '2024-01-15 10:30:00',
      completedAt: '2024-01-16 14:20:00',
      result: 'Passed',
      notes: 'All verifications successful'
    },
    {
      id: '2',
      userId: 'user-124',
      userName: 'Sarah Johnson',
      userEmail: 'sarah@company.com',
      type: 'Criminal Background',
      status: 'In Progress',
      submittedAt: '2024-01-14 09:15:00',
      completedAt: null,
      result: null,
      notes: 'Awaiting court records'
    },
    {
      id: '3',
      userId: 'user-125',
      userName: 'Mike Wilson',
      userEmail: 'mike@company.com',
      type: 'Education Verification',
      status: 'Failed',
      submittedAt: '2024-01-13 16:45:00',
      completedAt: '2024-01-14 11:30:00',
      result: 'Failed',
      notes: 'Degree verification unsuccessful'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredChecks = checks.filter(check => {
    const matchesSearch = check.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || check.status === statusFilter;
    const matchesType = typeFilter === 'All' || check.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result: string | null) => {
    switch (result) {
      case 'Passed': return 'text-green-600';
      case 'Failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const stats = {
    total: checks.length,
    completed: checks.filter(c => c.status === 'Completed').length,
    inProgress: checks.filter(c => c.status === 'In Progress').length,
    failed: checks.filter(c => c.status === 'Failed').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
              Background Check Management System
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
              Manage and monitor background verification processes
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#098DCF] text-white rounded-xl hover:bg-[#0F2A75] transition-colors shadow-lg">
            <Plus className="w-5 h-5" />
            <span style={{ fontFamily: 'Molde Semi Expanded Bold' }}>New Check</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-[#098DCF] bg-opacity-10 rounded-xl">
              <Shield className="w-6 h-6 text-[#098DCF]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Total Checks
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
                Completed
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                In Progress
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.inProgress}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EEF7] p-6 hover:shadow-lg hover:border-[#098DCF] transition-all">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Molde Semi Expanded Regular' }}>
                Failed
              </p>
              <p className="text-2xl font-bold text-[#0F2A75]" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                {stats.failed}
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
                placeholder="Search checks..."
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
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#098DCF] focus:border-transparent"
              style={{ fontFamily: 'Molde Semi Expanded Regular' }}
            >
              <option value="All">All Types</option>
              <option value="Employment Verification">Employment Verification</option>
              <option value="Criminal Background">Criminal Background</option>
              <option value="Education Verification">Education Verification</option>
            </select>
          </div>
        </div>
      </div>

      {/* Checks Table */}
      <div className="bg-white rounded-2xl border border-[#E8EEF7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChecks.map((check) => (
                <tr key={check.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Molde Semi Expanded Bold' }}>
                        {check.userName}
                      </div>
                      <div className="text-sm text-gray-500">{check.userEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {check.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(check.status)}`}>
                      {check.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${getResultColor(check.result)}`}>
                      {check.result || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {check.submittedAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
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