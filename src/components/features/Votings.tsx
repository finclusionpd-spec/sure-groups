import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Vote, Clock, CheckCircle, X, Eye, BarChart3, Users, Calendar, Edit as EditIcon, Trash2 as TrashIcon } from 'lucide-react';
import { PollData, UserRole } from '../../types';
import { createPoll, updatePoll, deletePoll, listPolls } from '../../services/polls';
import { useAuth } from '../../contexts/AuthContext';

type Voting = PollData & { eligibleVoters?: number };

export const Votings: React.FC = () => {
  const { user } = useAuth();
  const isGroupAdmin = user?.role === 'group-admin';
  const [votings, setVotings] = useState<Voting[]>(() => listPolls());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editPoll, setEditPoll] = useState<Voting | null>(null);
  useEffect(() => {
    const onUpdate = () => setVotings(listPolls());
    window.addEventListener('sure-polls-updated', onUpdate as any);
    return () => window.removeEventListener('sure-polls-updated', onUpdate as any);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Voting['status']>('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [selectedVoting, setSelectedVoting] = useState<Voting | null>(null);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: [''],
    startDate: '',
    endDate: '',
    visibility: 'public' as 'public' | 'restricted',
    allowedRoles: ['member' as UserRole]
  });

  const filteredVotings = votings.filter(voting => {
    const matchesSearch = voting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || voting.status === statusFilter;
    const matchesGroup = groupFilter === 'all' || voting.groupName === groupFilter;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleCreatePoll = () => {
    const options = newPoll.options
      .map(t => t.trim())
      .filter(Boolean)
      .map((t, idx) => ({ id: String(idx + 1), text: t, votes: 0 }));
    const poll: Omit<PollData, 'id' | 'totalVotes'> = {
      title: newPoll.title,
      description: newPoll.description,
      options,
      groupId: '1',
      groupName: 'Community Church',
      createdBy: user?.fullName || 'Group Admin',
      startDate: newPoll.startDate,
      endDate: newPoll.endDate,
      status: 'active',
      totalVotes: 0 as any,
      visibility: newPoll.visibility,
      allowedRoles: newPoll.visibility === 'restricted' ? newPoll.allowedRoles : undefined,
    } as any;
    const created = createPoll(poll);
    setVotings(prev => [created, ...prev]);
    setShowCreateModal(false);
    setNewPoll({ title: '', description: '', options: [''], startDate: '', endDate: '', visibility: 'public', allowedRoles: ['member'] });
  };

  const handleDeletePoll = (id: string) => {
    deletePoll(id);
    setVotings(prev => prev.filter(p => p.id !== id));
  };

  const handleClosePoll = (id: string) => {
    const updated = votings.map(p => p.id === id ? { ...p, status: 'completed' } : p);
    setVotings(updated);
    const changed = updated.find(p => p.id === id)!;
    updatePoll(changed);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'active': return <Vote className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Polls no longer use a separate type field in admin view

  const activeVotings = votings.filter(v => v.status === 'active').length;
  const completedVotings = votings.filter(v => v.status === 'completed').length;
  const totalVotesAll = votings.reduce((sum, v) => sum + (v.totalVotes || 0), 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Voting Management</h1>
        <p className="text-gray-600">Create, manage, and monitor polls for your group</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Votings</p>
              <p className="text-2xl font-bold text-gray-900">{votings.length}</p>
            </div>
            <Vote className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Votings</p>
              <p className="text-2xl font-bold text-green-600">{activeVotings}</p>
            </div>
            <Vote className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{completedVotings}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-purple-600">{totalVotesAll}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
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
                placeholder="Search votings..."
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
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Groups</option>
            <option value="Youth Ministry">Youth Ministry</option>
            <option value="Community Church">Community Church</option>
            <option value="Community Care">Community Care</option>
            <option value="Local Union Chapter">Local Union Chapter</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">Showing {filteredVotings.length} poll(s)</div>
        {isGroupAdmin && (
          <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create New Poll</span>
          </button>
        )}
      </div>

      {/* Polls List */}
      <div className="space-y-6">
        {filteredVotings.map((voting) => (
          <div key={voting.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{voting.title}</h3>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(voting.status)}`}>
                    {getStatusIcon(voting.status)}
                    <span className="ml-1">{voting.status}</span>
                  </span>
                  {/* Removed type badge (not used in admin poll model) */}
                </div>
                
                <p className="text-gray-600 mb-4">{voting.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Ends {new Date(voting.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{voting.totalVotes} total votes</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span>{voting.status === 'active' ? 'Active' : 'Closed'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>{voting.groupName}</span>
                  <span>•</span>
                  <span>Created by {voting.createdBy}</span>
                  {voting.isAnonymous && (
                    <>
                      <span>•</span>
                      <span>Anonymous voting</span>
                    </>
                  )}
                  {voting.requiresQuorum && (
                    <>
                      <span>•</span>
                      <span>Requires {voting.quorumPercentage}% quorum</span>
                    </>
                  )}
                </div>

                {/* Results Preview */}
                <div className="space-y-3">
                  {voting.options.map((option) => {
                    const percentage = Math.round((option.votes / (voting.totalVotes || 1)) * 100);
                    return (
                      <div key={option.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{option.text}</span>
                          <span className="text-sm text-gray-600">{option.votes} votes</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                <button
                  onClick={() => setSelectedVoting(voting)}
                  className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                {isGroupAdmin && (
                  <>
                    <button onClick={() => setEditPoll(voting)} className="text-gray-700 hover:text-gray-900 flex items-center space-x-1">
                      <EditIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => handleDeletePoll(voting.id)} className="text-red-600 hover:text-red-800 flex items-center space-x-1">
                      <TrashIcon className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredVotings.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls created yet</h3>
            <p className="text-gray-500">Click “Create New Poll” to start.</p>
          </div>
        )}
      </div>

      {/* Voting Details Modal / Results */}
      {selectedVoting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedVoting.title}</h3>
              <button
                onClick={() => setSelectedVoting(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedVoting.status)}`}>
                  {getStatusIcon(selectedVoting.status)}
                  <span className="ml-1">{selectedVoting.status}</span>
                </span>
                {/* Removed type badge in details */}
                {selectedVoting.isAnonymous && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Anonymous</span>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{selectedVoting.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Start Date</h4>
                  <p className="text-gray-600">{new Date(selectedVoting.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">End Date</h4>
                  <p className="text-gray-600">{new Date(selectedVoting.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Group</h4>
                  <p className="text-gray-600">{selectedVoting.groupName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Created By</h4>
                  <p className="text-gray-600">{selectedVoting.createdBy}</p>
                </div>
              </div>

              {/* Results Chart-like bars */}
              <div className="space-y-3">
                {selectedVoting.options.map(opt => {
                  const pct = Math.round((opt.votes / (selectedVoting.totalVotes || 1)) * 100);
                  return (
                    <div key={opt.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{opt.text}</span>
                        <span className="text-sm text-gray-600">{opt.votes} votes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {isGroupAdmin && selectedVoting.status === 'active' && (
                <div className="pt-4">
                  <button onClick={() => { handleClosePoll(selectedVoting.id); setSelectedVoting(null); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Close Poll</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Poll Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Poll</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={newPoll.title} onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newPoll.description} onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                <div className="space-y-2">
                  {newPoll.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input type="text" value={opt} onChange={(e) => setNewPoll({ ...newPoll, options: newPoll.options.map((o, i) => i === idx ? e.target.value : o) })} className="flex-1 px-3 py-2 border rounded" placeholder={`Option ${idx + 1}`} />
                      <button onClick={() => setNewPoll({ ...newPoll, options: newPoll.options.filter((_, i) => i !== idx) })} className="text-red-600 hover:text-red-800">Remove</button>
                    </div>
                  ))}
                  <button onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })} className="text-blue-600 hover:text-blue-800 text-sm">+ Add option</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={newPoll.startDate} onChange={(e) => setNewPoll({ ...newPoll, startDate: e.target.value })} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={newPoll.endDate} onChange={(e) => setNewPoll({ ...newPoll, endDate: e.target.value })} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <select value={newPoll.visibility} onChange={(e) => setNewPoll({ ...newPoll, visibility: e.target.value as any })} className="w-full px-3 py-2 border rounded">
                  <option value="public">Public (within group)</option>
                  <option value="restricted">Restricted by role</option>
                </select>
                {newPoll.visibility === 'restricted' && (
                  <div className="mt-2 text-sm text-gray-700">Allowed roles: Member</div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreatePoll} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Poll</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Poll Modal */}
      {editPoll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Poll</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={editPoll.title} onChange={(e) => setEditPoll({ ...editPoll, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editPoll.description} onChange={(e) => setEditPoll({ ...editPoll, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                <div className="space-y-2">
                  {editPoll.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <input type="text" value={opt.text} onChange={(e) => setEditPoll({ ...editPoll, options: editPoll.options.map((o, i) => i === idx ? { ...o, text: e.target.value } : o) })} className="flex-1 px-3 py-2 border rounded" />
                      <button onClick={() => setEditPoll({ ...editPoll, options: editPoll.options.filter((_, i) => i !== idx) })} className="text-red-600 hover:text-red-800">Remove</button>
                    </div>
                  ))}
                  <button onClick={() => setEditPoll({ ...editPoll, options: [...editPoll.options, { id: String(Date.now()), text: '', votes: 0 }] })} className="text-blue-600 hover:text-blue-800 text-sm">+ Add option</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={editPoll.startDate} onChange={(e) => setEditPoll({ ...editPoll, startDate: e.target.value })} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={editPoll.endDate} onChange={(e) => setEditPoll({ ...editPoll, endDate: e.target.value })} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <select value={editPoll.visibility} onChange={(e) => setEditPoll({ ...editPoll, visibility: e.target.value as any, allowedRoles: e.target.value === 'restricted' ? editPoll.allowedRoles || ['member'] : undefined })} className="w-full px-3 py-2 border rounded">
                    <option value="public">Public (within group)</option>
                    <option value="restricted">Restricted by role</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={editPoll.status} onChange={(e) => setEditPoll({ ...editPoll, status: e.target.value as any })} className="w-full px-3 py-2 border rounded">
                    <option value="active">Active</option>
                    <option value="completed">Closed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setEditPoll(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => {
                if (!editPoll) return;
                const sanitizedOptions = editPoll.options.map(o => ({ ...o, text: o.text.trim() })).filter(o => o.text.length > 0);
                const totalVotes = sanitizedOptions.reduce((sum, o) => sum + (o.votes || 0), 0);
                const payload = { ...editPoll, options: sanitizedOptions, totalVotes } as Voting;
                updatePoll(payload);
                setVotings(prev => prev.map(p => p.id === payload.id ? payload : p));
                setEditPoll(null);
              }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Voting Interface Component
interface VotingInterfaceProps {
  voting: Voting;
  onVote: (optionIds: string[]) => void;
}

const VotingInterface: React.FC<VotingInterfaceProps> = ({ voting, onVote }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionSelect = (optionId: string) => {
    if (voting.type === 'single-choice' || voting.type === 'yes-no') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmitVote = () => {
    if (selectedOptions.length === 0) {
      alert('Please select at least one option');
      return;
    }
    onVote(selectedOptions);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {voting.options.map((option) => (
          <label key={option.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type={voting.type === 'multiple-choice' ? 'checkbox' : 'radio'}
              name={`voting-${voting.id}`}
              value={option.id}
              checked={selectedOptions.includes(option.id)}
              onChange={() => handleOptionSelect(option.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-900">{option.text}</span>
          </label>
        ))}
      </div>
      
      <button
        onClick={handleSubmitVote}
        disabled={selectedOptions.length === 0}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <Vote className="w-4 h-4" />
        <span>Submit Vote</span>
      </button>
    </div>
  );
};