import React, { useEffect, useMemo, useState } from 'react';
import { Clock, CheckCircle2, XCircle, Filter, Search, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listApprovals, listByStatus, resolveApproval, ApprovalRequest, ApprovalStatus } from '../../services/approvals';

export const ApprovalWorkflow: React.FC = () => {
  const { user } = useAuth();
  const groupId = 'group-1';
  const isGroupAdmin = user?.role === 'group-admin';

  const [activeTab, setActiveTab] = useState<ApprovalStatus>('pending');
  const [items, setItems] = useState<ApprovalRequest[]>([]);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ApprovalRequest['type']>('all');
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d'>('all');
  const [requesterFilter, setRequesterFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ApprovalRequest | null>(null);

  const refresh = () => {
    setLoading(true);
    try {
      const list = listApprovals(groupId);
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('sure-approvals-updated', handler as any);
    return () => window.removeEventListener('sure-approvals-updated', handler as any);
  }, []);

  const stats = useMemo(() => {
    const all = items;
    return {
      pending: all.filter(a => a.status === 'pending').length,
      approved: all.filter(a => a.status === 'approved').length,
      rejected: all.filter(a => a.status === 'rejected').length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const dateOk = (iso: string) => {
      if (dateFilter === 'all') return true;
      const t = new Date(iso).getTime();
      if (dateFilter === '7d') return t >= now - 7 * 24 * 3600 * 1000;
      return t >= now - 30 * 24 * 3600 * 1000;
    };
    return items
      .filter(a => a.status === activeTab)
      .filter(a => (typeFilter === 'all' ? true : a.type === typeFilter))
      .filter(a => dateOk(a.createdAt))
      .filter(a => (requesterFilter ? a.requesterName.toLowerCase().includes(requesterFilter.toLowerCase()) : true))
      .filter(a => (query ? (a.description + a.type + a.requesterName).toLowerCase().includes(query.toLowerCase()) : true));
  }, [items, activeTab, typeFilter, dateFilter, requesterFilter, query]);

  const handleAction = (row: ApprovalRequest, action: 'approve' | 'reject') => {
    if (!isGroupAdmin) return;
    const admin = { id: user?.id || 'admin-1', name: user?.fullName || 'Group Admin' };
    resolveApproval(groupId, row.id, action, admin);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Approval Workflow</h1>
        <p className="text-gray-600">Review and act on items requiring Group Admin approval</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Pending</div>
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Approved</div>
              <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Rejected</div>
              <div className="text-2xl font-bold text-gray-900">{stats.rejected}</div>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-3 md:px-4 pt-4">
          <div className="flex flex-wrap gap-2">
            {(['pending', 'approved', 'rejected'] as ApprovalStatus[]).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-2 text-sm rounded md:rounded-t ${activeTab === t ? 'bg-gray-100 text-gray-900 border md:border-b-0' : 'text-gray-600'}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input className="pl-7 pr-3 py-2 border rounded text-sm" placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <select className="px-2 py-2 border rounded text-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
              <option value="all">All Types</option>
              <option value="membership">Membership</option>
              <option value="content">Content</option>
              <option value="event">Event</option>
              <option value="marketplace">Marketplace</option>
              <option value="donation">Donation</option>
            </select>
            <select className="px-2 py-2 border rounded text-sm" value={dateFilter} onChange={e => setDateFilter(e.target.value as any)}>
              <option value="all">All Time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <input className="px-2 py-2 border rounded text-sm" placeholder="Requester" value={requesterFilter} onChange={e => setRequesterFilter(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Type</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40 md:w-56">Requester</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[180px] md:w-auto">Details</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell w-40">Created</th>
                {activeTab !== 'pending' && (
                  <>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell w-40">Resolved</th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell w-40">By</th>
                  </>
                )}
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40 md:w-auto">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap capitalize text-sm">{row.type}</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium text-gray-900">{row.requesterName}</div>
                    <div className="text-xs text-gray-500 hidden sm:block">{row.requesterId}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 text-sm text-gray-700 break-words truncate" title={row.description}>{row.description}</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">{new Date(row.createdAt).toLocaleString()}</td>
                  {activeTab !== 'pending' && (
                    <>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">{row.resolvedAt ? new Date(row.resolvedAt).toLocaleString() : '-'}</td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">{row.resolvedByName || '-'}</td>
                    </>
                  )}
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm align-top">
                    <div className="flex flex-wrap items-center gap-1 md:gap-2">
                      <button onClick={() => setDetail(row)} className="px-2 py-1 text-xs border rounded text-gray-700 inline-flex items-center"><Eye className="w-4 h-4 mr-1" /> View</button>
                      {row.status === 'pending' && (
                        <>
                          <button onClick={() => handleAction(row, 'approve')} className="px-2 py-1 text-xs bg-emerald-600 text-white rounded">Approve</button>
                          <button onClick={() => handleAction(row, 'reject')} className="px-2 py-1 text-xs bg-red-600 text-white rounded">Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-gray-500" colSpan={activeTab !== 'pending' ? 7 : 5}>No {activeTab} items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Request Details</h3>
              <button onClick={() => setDetail(null)} className="text-gray-500">×</button>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-600">Type:</span> <span className="capitalize">{detail.type}</span></div>
              <div><span className="text-gray-600">Requester:</span> {detail.requesterName} ({detail.requesterId})</div>
              <div><span className="text-gray-600">Group:</span> {detail.groupName}</div>
              <div><span className="text-gray-600">Submitted:</span> {new Date(detail.createdAt).toLocaleString()}</div>
              <div><span className="text-gray-600">Status:</span> {detail.status}</div>
              {detail.resolvedAt && <div><span className="text-gray-600">Resolved:</span> {new Date(detail.resolvedAt).toLocaleString()} by {detail.resolvedByName}</div>}
              <div className="pt-2"><span className="text-gray-600">Description:</span>
                <div className="mt-1 p-3 bg-gray-50 rounded border text-gray-800">{detail.description}</div>
              </div>
            </div>
            {detail.status === 'pending' && isGroupAdmin && (
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => { handleAction(detail, 'reject'); setDetail(null); }} className="px-3 py-2 bg-red-600 text-white rounded">Reject</button>
                <button onClick={() => { handleAction(detail, 'approve'); setDetail(null); }} className="px-3 py-2 bg-emerald-600 text-white rounded">Approve</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

