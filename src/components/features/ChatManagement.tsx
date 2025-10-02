import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Users, 
  AlertTriangle,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  User,
  Building2
} from 'lucide-react';

interface Chat {
  id: string;
  groupName: string;
  groupId: string;
  participants: ChatParticipant[];
  messageCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isActive: boolean;
  isMuted: boolean;
  reportedMessages: number;
  spamReports: number;
  createdAt: string;
}

interface ChatParticipant {
  id: string;
  name: string;
  role: 'admin' | 'member' | 'vendor';
  isOnline: boolean;
  lastSeen: string;
}

interface ChatStats {
  totalChats: number;
  activeChats: number;
  mutedChats: number;
  reportedMessages: number;
  totalMessages: number;
  mostActiveGroup: string;
  spamReports: number;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const ChatManagement: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showChatViewer, setShowChatViewer] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [stats, setStats] = useState<ChatStats>({
    totalChats: 0,
    activeChats: 0,
    mutedChats: 0,
    reportedMessages: 0,
    totalMessages: 0,
    mostActiveGroup: '',
    spamReports: 0
  });

  // Mock data
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: '1',
        groupName: 'Tech Innovators',
        groupId: 'group-1',
        participants: [
          { id: '1', name: 'John Doe', role: 'admin', isOnline: true, lastSeen: '2024-01-20 14:30' },
          { id: '2', name: 'Jane Smith', role: 'member', isOnline: false, lastSeen: '2024-01-20 13:45' },
          { id: '3', name: 'Mike Johnson', role: 'member', isOnline: true, lastSeen: '2024-01-20 14:25' }
        ],
        messageCount: 1247,
        lastMessage: 'Great meeting everyone! Looking forward to the next session.',
        lastMessageTime: '2024-01-20 14:30',
        isActive: true,
        isMuted: false,
        reportedMessages: 2,
        spamReports: 0,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        groupName: 'Community Builders',
        groupId: 'group-2',
        participants: [
          { id: '4', name: 'Sarah Wilson', role: 'admin', isOnline: true, lastSeen: '2024-01-20 14:20' },
          { id: '5', name: 'David Brown', role: 'member', isOnline: false, lastSeen: '2024-01-20 12:15' }
        ],
        messageCount: 856,
        lastMessage: 'Don\'t forget about the community event this weekend!',
        lastMessageTime: '2024-01-20 14:20',
        isActive: true,
        isMuted: false,
        reportedMessages: 0,
        spamReports: 1,
        createdAt: '2024-01-10'
      },
      {
        id: '3',
        groupName: 'Business Network',
        groupId: 'group-3',
        participants: [
          { id: '6', name: 'Lisa Chen', role: 'admin', isOnline: false, lastSeen: '2024-01-19 16:30' },
          { id: '7', name: 'Robert Davis', role: 'vendor', isOnline: true, lastSeen: '2024-01-20 14:15' }
        ],
        messageCount: 234,
        lastMessage: 'New business opportunity available for members.',
        lastMessageTime: '2024-01-19 16:30',
        isActive: false,
        isMuted: true,
        reportedMessages: 5,
        spamReports: 2,
        createdAt: '2024-01-05'
      }
    ];

    setChats(mockChats);
    setFilteredChats(mockChats);

    // Calculate stats
    const totalChats = mockChats.length;
    const activeChats = mockChats.filter(chat => chat.isActive).length;
    const mutedChats = mockChats.filter(chat => chat.isMuted).length;
    const reportedMessages = mockChats.reduce((sum, chat) => sum + chat.reportedMessages, 0);
    const totalMessages = mockChats.reduce((sum, chat) => sum + chat.messageCount, 0);
    const mostActiveGroup = mockChats.reduce((max, chat) => 
      chat.messageCount > max.messageCount ? chat : max
    ).groupName;
    const spamReports = mockChats.reduce((sum, chat) => sum + chat.spamReports, 0);

    setStats({
      totalChats,
      activeChats,
      mutedChats,
      reportedMessages,
      totalMessages,
      mostActiveGroup,
      spamReports
    });
  }, []);

  // Filter chats based on search and filters
  useEffect(() => {
    let filtered = chats;

    if (searchTerm) {
      filtered = filtered.filter(chat =>
        chat.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (groupFilter !== 'all') {
      filtered = filtered.filter(chat => chat.groupId === groupFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(chat => chat.isActive && !chat.isMuted);
      } else if (statusFilter === 'muted') {
        filtered = filtered.filter(chat => chat.isMuted);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(chat => !chat.isActive);
      }
    }

    setFilteredChats(filtered);
  }, [chats, searchTerm, groupFilter, statusFilter]);

  // Toast notification functions
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Chat management actions
  const handleViewChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowChatViewer(true);
  };

  const handleToggleMute = async (chatId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, isMuted: !chat.isMuted }
          : chat
      ));
      addToast('success', 'Chat mute status updated successfully!');
    } catch (error) {
      addToast('error', 'Failed to update chat status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addToast('success', 'Chat usage report generated successfully!');
    } catch (error) {
      addToast('error', 'Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast('success', `Chat data exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      addToast('error', 'Export failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (chat: Chat) => {
    if (chat.isMuted) return 'bg-red-100 text-red-700';
    if (chat.isActive) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (chat: Chat) => {
    if (chat.isMuted) return 'Muted';
    if (chat.isActive) return 'Active';
    return 'Inactive';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat Management</h1>
        <p className="text-gray-600">Monitor and manage group chats across the platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Chats</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalChats}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Chats</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeChats}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Muted Chats</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.mutedChats}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
              <VolumeX className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reported Messages</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.reportedMessages}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExportData('csv')}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {isLoading ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={() => handleExportData('pdf')}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isLoading ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Message Volume Over Time</p>
                <p className="text-sm text-gray-400">Chart showing chat activity trends</p>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Most Active Groups</p>
                <p className="text-sm text-gray-400">Bar chart showing group activity levels</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Groups</option>
              <option value="group-1">Tech Innovators</option>
              <option value="group-2">Community Builders</option>
              <option value="group-3">Business Network</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="muted">Muted</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setGroupFilter('all');
                setStatusFilter('all');
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Chats Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChats.map((chat) => (
                <tr key={chat.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{chat.groupName}</div>
                      <div className="text-sm text-gray-500">Created: {chat.createdAt}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{chat.participants.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{chat.messageCount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 truncate max-w-xs">{chat.lastMessage}</div>
                      <div className="text-xs text-gray-500">{chat.lastMessageTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(chat)}`}>
                      {getStatusText(chat)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {chat.reportedMessages > 0 && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                          {chat.reportedMessages} Reports
                        </span>
                      )}
                      {chat.spamReports > 0 && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                          {chat.spamReports} Spam
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewChat(chat)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Chat"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleMute(chat.id)}
                        disabled={isLoading}
                        className={`${chat.isMuted ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'} disabled:opacity-50`}
                        title={chat.isMuted ? 'Unmute Chat' : 'Mute Chat'}
                      >
                        {chat.isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chat Viewer Modal */}
      {showChatViewer && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Chat Viewer - {selectedChat.groupName}</h2>
                <button
                  onClick={() => setShowChatViewer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Chat Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Total Messages:</span>
                      <p className="text-gray-900">{selectedChat.messageCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Participants:</span>
                      <p className="text-gray-900">{selectedChat.participants.length}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-900">{getStatusText(selectedChat)}</p>
                    </div>
                  </div>
                </div>

                {/* Participants */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Participants</h3>
                  <div className="space-y-2">
                    {selectedChat.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{participant.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({participant.role})</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${participant.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-xs text-gray-500">{participant.lastSeen}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Messages Preview */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 italic">Chat messages would be displayed here in read-only mode for compliance monitoring.</p>
                    <p className="text-xs text-gray-500 mt-2">Last message: {selectedChat.lastMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg shadow-lg max-w-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5 mr-2" />}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
