import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar,
  Clock,
  MapPin,
  Users,
  Download, 
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  FileText,
  User,
  Building2,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerName: string;
  organizerId: string;
  groupName: string;
  groupId: string;
  eventType: 'meeting' | 'workshop' | 'social' | 'business' | 'other';
  status: 'upcoming' | 'past' | 'cancelled';
  attendees: number;
  maxAttendees: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  cancelledEvents: number;
  totalAttendees: number;
  averageAttendance: number;
  mostActiveGroup: string;
  eventTypes: { [key: string]: number };
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const CalendarManagementAdmin: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [stats, setStats] = useState<EventStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    cancelledEvents: 0,
    totalAttendees: 0,
    averageAttendance: 0,
    mostActiveGroup: '',
    eventTypes: {}
  });

  // Mock data
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Tech Innovation Workshop',
        description: 'A comprehensive workshop on emerging technologies and innovation strategies for tech professionals.',
        date: '2024-01-25',
        time: '10:00 AM',
        location: 'Tech Hub, Lagos',
        organizerName: 'John Doe',
        organizerId: 'org-1',
        groupName: 'Tech Innovators',
        groupId: 'group-1',
        eventType: 'workshop',
        status: 'upcoming',
        attendees: 25,
        maxAttendees: 50,
        isPublic: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        tags: ['technology', 'innovation', 'workshop']
      },
      {
        id: '2',
        title: 'Community Building Meetup',
        description: 'Monthly meetup for community builders to share experiences and best practices.',
        date: '2024-01-22',
        time: '2:00 PM',
        location: 'Community Center, Abuja',
        organizerName: 'Jane Smith',
        organizerId: 'org-2',
        groupName: 'Community Builders',
        groupId: 'group-2',
        eventType: 'meeting',
        status: 'upcoming',
        attendees: 15,
        maxAttendees: 30,
        isPublic: false,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        tags: ['community', 'networking', 'meetup']
      },
      {
        id: '3',
        title: 'Business Networking Event',
        description: 'Professional networking event for business owners and entrepreneurs.',
        date: '2024-01-18',
        time: '6:00 PM',
        location: 'Business District, Lagos',
        organizerName: 'Mike Johnson',
        organizerId: 'org-3',
        groupName: 'Business Network',
        groupId: 'group-3',
        eventType: 'business',
        status: 'past',
        attendees: 40,
        maxAttendees: 60,
        isPublic: true,
        createdAt: '2024-01-05',
        updatedAt: '2024-01-18',
        tags: ['business', 'networking', 'entrepreneurs']
      },
      {
        id: '4',
        title: 'Social Gathering',
        description: 'Casual social gathering for group members to connect and socialize.',
        date: '2024-01-20',
        time: '4:00 PM',
        location: 'Recreation Center, Port Harcourt',
        organizerName: 'Sarah Wilson',
        organizerId: 'org-4',
        groupName: 'Community Builders',
        groupId: 'group-2',
        eventType: 'social',
        status: 'cancelled',
        attendees: 0,
        maxAttendees: 25,
        isPublic: false,
        createdAt: '2024-01-12',
        updatedAt: '2024-01-19',
        tags: ['social', 'casual', 'gathering']
      }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);

    // Calculate stats
    const totalEvents = mockEvents.length;
    const upcomingEvents = mockEvents.filter(e => e.status === 'upcoming').length;
    const pastEvents = mockEvents.filter(e => e.status === 'past').length;
    const cancelledEvents = mockEvents.filter(e => e.status === 'cancelled').length;
    const totalAttendees = mockEvents.reduce((sum, e) => sum + e.attendees, 0);
    const averageAttendance = totalAttendees / totalEvents;
    const mostActiveGroup = mockEvents.reduce((max, e) => 
      e.attendees > max.attendees ? e : max
    ).groupName;
    
    const eventTypes = mockEvents.reduce((acc, e) => {
      acc[e.eventType] = (acc[e.eventType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    setStats({
      totalEvents,
      upcomingEvents,
      pastEvents,
      cancelledEvents,
      totalAttendees,
      averageAttendance,
      mostActiveGroup,
      eventTypes
    });
  }, []);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.groupName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (groupFilter !== 'all') {
      filtered = filtered.filter(event => event.groupId === groupFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.eventType === typeFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, groupFilter, statusFilter, typeFilter]);

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

  // Event management actions
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleCancelEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'cancelled' as const }
          : event
      ));
      addToast('success', 'Event cancelled successfully!');
    } catch (error) {
      addToast('error', 'Failed to cancel event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivateEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'upcoming' as const }
          : event
      ));
      addToast('success', 'Event reactivated successfully!');
    } catch (error) {
      addToast('error', 'Failed to reactivate event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast('success', `Event data exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      addToast('error', 'Export failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-700';
      case 'past': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-700';
      case 'workshop': return 'bg-purple-100 text-purple-700';
      case 'social': return 'bg-pink-100 text-pink-700';
      case 'business': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUniqueGroups = () => {
    const groups = Array.from(new Set(events.map(e => e.groupName)));
    return groups;
  };

  const getUniqueTypes = () => {
    const types = Array.from(new Set(events.map(e => e.eventType)));
    return types;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar Management</h1>
        <p className="text-gray-600">Monitor and manage events across all groups.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Past Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pastEvents}</p>
            </div>
            <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.cancelledEvents}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
              <XCircle className="w-6 h-6" />
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
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {viewMode === 'list' ? 'Calendar View' : 'List View'}
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
            onClick={() => handleExportData('xlsx')}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isLoading ? 'Exporting...' : 'Export XLSX'}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Event Types Distribution</p>
                <p className="text-sm text-gray-400">Chart showing distribution of event types</p>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Attendance Trends</p>
                <p className="text-sm text-gray-400">Chart showing attendance patterns over time</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
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
              {getUniqueGroups().map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
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
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setGroupFilter('all');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Events Table/Calendar */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.description}</div>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(event.eventType)}`}>
                            {event.eventType}
                          </span>
                          {event.isPublic && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 ml-2">
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.organizerName}</div>
                        <div className="text-sm text-gray-500">ID: {event.organizerId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.groupName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.date}</div>
                        <div className="text-sm text-gray-500">{event.time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{event.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.attendees}/{event.maxAttendees}</div>
                        <div className="text-xs text-gray-500">attendees</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {event.status === 'upcoming' && (
                          <button
                            onClick={() => handleCancelEvent(event.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Cancel Event"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {event.status === 'cancelled' && (
                          <button
                            onClick={() => handleReactivateEvent(event.id)}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Reactivate Event"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Calendar View</p>
              <p className="text-sm text-gray-400">Interactive calendar would be displayed here</p>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Event Details - {selectedEvent.title}</h2>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Event Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Title:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.title}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Description:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.description}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Type:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.eventType}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Visibility:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.isPublic ? 'Public' : 'Private'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-700">Date:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedEvent.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-700">Time:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-700">Location:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedEvent.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organizer and Group Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Organizer Name:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.organizerName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Organizer ID:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.organizerId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Group Name:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.groupName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Group ID:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.groupId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Current Attendees:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.attendees}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Maximum Attendees:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.maxAttendees}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Availability:</span>
                        <p className="text-sm text-gray-900">{selectedEvent.maxAttendees - selectedEvent.attendees} spots remaining</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      {selectedEvent.status === 'upcoming' && (
                        <button
                          onClick={() => handleCancelEvent(selectedEvent.id)}
                          disabled={isLoading}
                          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel Event
                        </button>
                      )}
                      {selectedEvent.status === 'cancelled' && (
                        <button
                          onClick={() => handleReactivateEvent(selectedEvent.id)}
                          disabled={isLoading}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Reactivate Event
                        </button>
                      )}
                    </div>
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
