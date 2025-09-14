import React, { useEffect, useMemo, useState } from 'react';
import { Plus, CreditCard, DollarSign, Calendar, Users, Edit, Trash2, Eye, BarChart3, PieChart, Download, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DonationRecord, UserRole } from '../../types';
import { getWalletBalance, creditWallet, debitWallet } from '../../services/wallet';
import {
  DonationCampaign,
  listDonationCampaigns,
  createDonationCampaign,
  updateDonationCampaign,
  deleteDonationCampaign,
  closeDonationCampaign,
} from '../../services/donationCampaigns';

export const DonationManagement: React.FC = () => {
  const { user } = useAuth();
  const groupId = '1';
  const groupName = 'Community Church';

  const [wallet, setWallet] = useState(getWalletBalance(groupId));
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>(() => listDonationCampaigns(groupId));
  useEffect(() => {
    const onUpdate = () => setCampaigns(listDonationCampaigns(groupId));
    window.addEventListener('sure-donations-updated', onUpdate as any);
    return () => window.removeEventListener('sure-donations-updated', onUpdate as any);
  }, []);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCampaign, setEditCampaign] = useState<DonationCampaign | null>(null);
  const [detailsCampaign, setDetailsCampaign] = useState<DonationCampaign | null>(null);

  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    visibility: 'public' as 'public' | 'restricted',
    allowedRoles: ['member' as UserRole],
  });

  const totalRaised = useMemo(() => campaigns.reduce((sum, c) => sum + c.raisedAmount, 0), [campaigns]);
  const activeCount = campaigns.filter(c => c.status === 'active').length;

  const handleCreate = () => {
    const target = newCampaign.targetAmount ? parseFloat(newCampaign.targetAmount) : undefined;
    if (newCampaign.targetAmount && (isNaN(target as number) || (target as number) < 0)) return alert('Target must be a valid number');
    const created = createDonationCampaign(groupId, {
      groupName,
      title: newCampaign.title,
      description: newCampaign.description,
      targetAmount: target,
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate,
      visibility: newCampaign.visibility,
      allowedRoles: newCampaign.visibility === 'restricted' ? newCampaign.allowedRoles : undefined,
    });
    setCampaigns(prev => [created, ...prev]);
    setShowCreateModal(false);
    setNewCampaign({ title: '', description: '', targetAmount: '', startDate: '', endDate: '', visibility: 'public', allowedRoles: ['member'] });
  };

  const handleUpdate = () => {
    if (!editCampaign) return;
    const target = editCampaign.targetAmount;
    if (target !== undefined && (isNaN(target) || target < 0)) return alert('Target must be a valid number');
    const saved = updateDonationCampaign(groupId, editCampaign);
    setCampaigns(prev => prev.map(c => (c.id === saved.id ? saved : c)));
    setEditCampaign(null);
  };

  const handleDelete = (id: string) => {
    deleteDonationCampaign(groupId, id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleClose = (id: string) => {
    const closed = closeDonationCampaign(groupId, id);
    if (closed) setCampaigns(prev => prev.map(c => (c.id === closed.id ? closed : c)));
  };

  const handleTransfer = () => {
    const amountStr = prompt('Enter amount to allocate/transfer from donations wallet:');
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return alert('Enter a valid amount');
    try {
      const { newBalance } = debitWallet(groupId, amount, 'Allocate donations to program/fund');
      setWallet(prev => ({ ...prev, balance: newBalance }));
      alert('Funds allocated successfully');
    } catch (e: any) {
      alert(e?.message || 'Allocation failed');
    }
  };

  const handleTopUp = () => {
    const amountStr = prompt('Enter amount to credit donations wallet:');
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return alert('Enter a valid amount');
    const { newBalance } = creditWallet(groupId, amount, 'Top-up donations wallet');
    setWallet(prev => ({ ...prev, balance: newBalance }));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Donation Management</h1>
          <p className="text-gray-600">Create campaigns, track donations, and manage funds</p>
        </div>
        <div className="bg-white rounded-lg border px-4 py-2 flex items-center space-x-3">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-gray-600">Donations Wallet:</span>
          <span className="text-sm font-semibold text-gray-900">{wallet.currency} {wallet.balance.toFixed(2)}</span>
          <button onClick={handleTopUp} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">Top up</button>
          <button onClick={handleTransfer} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">Allocate</button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">Active: {activeCount} • Total Raised: {wallet.currency} {totalRaised.toFixed(2)}</div>
        <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create New Donation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(c => {
          const target = c.targetAmount || 0;
          const pct = target > 0 ? Math.min(Math.round((c.raisedAmount / target) * 100), 100) : 0;
          return (
            <div key={c.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                  <p className="text-sm text-gray-600">{c.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{c.status === 'active' ? 'Active' : 'Closed'}</span>
              </div>
              <div className="text-sm text-gray-600 flex items-center space-x-4 mb-3">
                <span className="inline-flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</span>
                <span className="inline-flex items-center"><Users className="w-4 h-4 mr-1" />{c.donations.length} donors</span>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Raised</span>
                  <span>{wallet.currency} {c.raisedAmount.toFixed(2)}{c.targetAmount ? ` / ${wallet.currency} ${c.targetAmount.toFixed(2)}` : ''}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-x-3 text-sm">
                  <button onClick={() => setDetailsCampaign(c)} className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1"><Eye className="w-4 h-4" /><span>Details</span></button>
                  <button onClick={() => setEditCampaign(c)} className="text-gray-700 hover:text-gray-900 inline-flex items-center space-x-1"><Edit className="w-4 h-4" /><span>Edit</span></button>
                </div>
                <div className="space-x-3 text-sm">
                  {c.status === 'active' && (<button onClick={() => handleClose(c.id)} className="text-orange-600 hover:text-orange-800">Close</button>)}
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800 inline-flex items-center space-x-1"><Trash2 className="w-4 h-4" /><span>Delete</span></button>
                </div>
              </div>
            </div>
          );
        })}

        {campaigns.length === 0 && (
          <div className="col-span-full bg-white rounded-lg border p-8 text-center text-gray-600">No donations yet. Create a new donation campaign to get started.</div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900">Create New Donation</h3><button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={newCampaign.title} onChange={e => setNewCampaign({ ...newCampaign, title: e.target.value })} className="w-full border rounded p-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newCampaign.description} onChange={e => setNewCampaign({ ...newCampaign, description: e.target.value })} className="w-full border rounded p-2 text-sm" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (optional)</label>
                  <input type="number" min="0" value={newCampaign.targetAmount} onChange={e => setNewCampaign({ ...newCampaign, targetAmount: e.target.value })} className="w-full border rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <select value={newCampaign.visibility} onChange={e => setNewCampaign({ ...newCampaign, visibility: e.target.value as any })} className="w-full border rounded p-2 text-sm">
                    <option value="public">Public (all members)</option>
                    <option value="restricted">Restricted by role</option>
                  </select>
                  {newCampaign.visibility === 'restricted' && (
                    <div className="mt-1 text-xs text-gray-600">Allowed roles: Member</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={newCampaign.startDate} onChange={e => setNewCampaign({ ...newCampaign, startDate: e.target.value })} className="w-full border rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={newCampaign.endDate} onChange={e => setNewCampaign({ ...newCampaign, endDate: e.target.value })} className="w-full border rounded p-2 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded text-sm">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Create Campaign</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900">Edit Campaign</h3><button onClick={() => setEditCampaign(null)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={editCampaign.title} onChange={e => setEditCampaign({ ...editCampaign, title: e.target.value })} className="w-full border rounded p-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editCampaign.description} onChange={e => setEditCampaign({ ...editCampaign, description: e.target.value })} className="w-full border rounded p-2 text-sm" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                  <input type="number" min="0" value={editCampaign.targetAmount ?? ''} onChange={e => setEditCampaign({ ...editCampaign, targetAmount: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-full border rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={editCampaign.status} onChange={e => setEditCampaign({ ...editCampaign, status: e.target.value as any })} className="w-full border rounded p-2 text-sm">
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setEditCampaign(null)} className="px-4 py-2 border rounded text-sm">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900">Campaign Details</h3><button onClick={() => setDetailsCampaign(null)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button></div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <h4 className="text-md font-semibold text-gray-900 mb-1">{detailsCampaign.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{detailsCampaign.description}</p>
                <div className="text-xs text-gray-500 mb-3">{new Date(detailsCampaign.startDate).toLocaleDateString()} - {new Date(detailsCampaign.endDate).toLocaleDateString()}</div>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Raised</span>
                    <span>{wallet.currency} {detailsCampaign.raisedAmount.toFixed(2)}{detailsCampaign.targetAmount ? ` / ${wallet.currency} ${detailsCampaign.targetAmount.toFixed(2)}` : ''}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${detailsCampaign.targetAmount ? Math.min(Math.round((detailsCampaign.raisedAmount / detailsCampaign.targetAmount) * 100), 100) : 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Donations</h5>
                  <div className="overflow-x-auto border rounded">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-gray-600 font-medium">Member</th>
                          <th className="px-3 py-2 text-left text-gray-600 font-medium">Amount</th>
                          <th className="px-3 py-2 text-left text-gray-600 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {detailsCampaign.donations.map(d => (
                          <tr key={d.id}>
                            <td className="px-3 py-2">{d.memberName}</td>
                            <td className="px-3 py-2">{d.currency} {d.amount.toFixed(2)}</td>
                            <td className="px-3 py-2">{new Date(d.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                        {detailsCampaign.donations.length === 0 && (
                          <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={3}>No donations recorded for this campaign yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-gray-50 rounded border p-3 mb-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Analytics</h5>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center justify-between"><span>Total Donors</span><span>{detailsCampaign.donations.length}</span></div>
                    <div className="flex items-center justify-between"><span>Total Raised</span><span>{wallet.currency} {detailsCampaign.raisedAmount.toFixed(2)}</span></div>
                    <div className="flex items-center justify-between"><span>Status</span><span>{detailsCampaign.status}</span></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded border p-3">
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Top Donors</h5>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {detailsCampaign.donations.slice(0,5).sort((a,b) => b.amount - a.amount).map(d => (
                      <li key={d.id} className="flex items-center justify-between"><span>{d.memberName}</span><span>{wallet.currency} {d.amount.toFixed(2)}</span></li>
                    ))}
                    {detailsCampaign.donations.length === 0 && <li className="text-gray-500">No donors yet</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

