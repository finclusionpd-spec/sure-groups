import React, { useEffect, useState } from 'react';
import { Search, Plus, Calendar, MapPin, Users, Clock, Edit, Trash2, Eye, CalendarDays, ChevronLeft, ChevronRight, Bell, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { EventData } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { createEvent as svcCreateEvent, updateEvent as svcUpdateEvent, deleteEvent as svcDeleteEvent, listEvents as svcListEvents } from '../../services/events';
import { addNotification } from '../../services/notifications';

export const EventManagement: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventData[]>(() => svcListEvents());
  const [editEvent, setEditEvent] = useState<EventData | null>(null);
  const [attendeeEditEvent, setAttendeeEditEvent] = useState<EventData | null>(null);
  useEffect(() => {
    const onUpdate = () => setEvents(svcListEvents());
    window.addEventListener('sure-events-updated', onUpdate as any);
    return () => window.removeEventListener('sure-events-updated', onUpdate as any);
  }, []);

  const seedIfEmpty = () => {
    if (svcListEvents().length === 0) {
      const seed: EventData[] = [
        {
          id: '1',
          title: 'Sunday Service',
          description: 'Weekly worship service with communion',
          date: '2025-01-19',
          time: '10:00',
          location: 'Main Sanctuary',
          groupId: '1',
          groupName: 'Community Church',
          maxAttendees: 300,
          currentAttendees: 245,
          status: 'upcoming',
          createdBy: 'Pastor John',
          createdAt: '2025-01-01T00:00:00Z',
          attendees: []
        }
      ];
      seed.forEach(e => svcCreateEvent(e));
      setEvents(svcListEvents());
    }
  };
  useEffect(() => { seedIfEmpty(); }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    groupId: '1',
    maxAttendees: '',
    bannerUrl: '',
    rsvpMode: 'open' as 'open' | 'invite-only' | 'limited'
  });
  const handleBannerFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewEvent(prev => ({ ...prev, bannerUrl: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesGroup = groupFilter === 'all' || event.groupId === groupFilter;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleCreateEvent = () => {
    const event: Omit<EventData, 'id' | 'createdAt' | 'currentAttendees'> = {
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      groupId: newEvent.groupId,
      groupName: newEvent.groupId === '2' ? 'Youth Ministry' : newEvent.groupId === '3' ? 'Local Union Chapter' : 'Community Church',
      maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : undefined,
      status: 'upcoming',
      createdBy: user?.fullName || 'Current User',
      bannerUrl: newEvent.bannerUrl || undefined,
      rsvpMode: newEvent.rsvpMode,
      attendees: [],
    } as any;
    const created = svcCreateEvent(event);
    setEvents(prev => [created, ...prev]);
    addNotification({
      title: 'New Event Created',
      message: `${created.title} scheduled on ${created.date} at ${created.time}`,
      type: 'event',
      priority: 'medium',
      actionUrl: '/dashboard',
      groupName: created.groupName,
    });
    setNewEvent({ title: '', description: '', date: '', time: '', location: '', groupId: '1', maxAttendees: '', bannerUrl: '', rsvpMode: 'open' });
    setShowCreateModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    svcDeleteEvent(eventId);
    setEvents(events.filter(event => event.id !== eventId));
    addNotification({
      title: 'Event Cancelled',
      message: 'An event was removed by the admin',
      type: 'event',
      priority: 'high',
      actionUrl: '/dashboard'
    });
  };

  const handleSaveEditEvent = () => {
    if (!editEvent) return;
    setEvents(events.map(ev => ev.id === editEvent.id ? editEvent : ev));
    setEditEvent(null);
  };

  const handleSaveAttendees = (updated: EventData) => {
    setEvents(events.map(ev => ev.id === updated.id ? updated : ev));
    setAttendeeEditEvent(null);
  };

  const updateEventStatus = (eventId: string, status: EventData['status']) => {
    const updated = events.map(event => event.id === eventId ? { ...event, status } : event);
    const changed = updated.find(e => e.id === eventId)!;
    setEvents(updated);
    svcUpdateEvent(changed);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'ongoing': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const totalAttendees = events.reduce((sum, event) => sum + event.currentAttendees, 0);
  
  // Check if user can create events (only admins can create)
  const canCreateEvents = user?.role && ['super-admin', 'product-admin', 'group-admin'].includes(user.role);

  const exportToGoogleCalendar = (e: EventData) => {
    const start = new Date(`${e.date}T${e.time}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const details = encodeURIComponent(e.description || '');
    const location = encodeURIComponent(e.location || '');
    const text = encodeURIComponent(e.title);
    const dates = `${start.toISOString().replace(/[-:]|\.\d{3}/g, '')}/${end.toISOString().replace(/[-:]|\.\d{3}/g, '')}`;
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
    window.open(url, '_blank');
  };

  const notifyUpcoming = (e: EventData) => {
    try {
      // Simple in-app notification using alert for demo
      alert(`Reminder set for ${e.title} on ${new Date(e.date).toLocaleDateString()} at ${e.time}`);
    } catch {}
  };

  const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  const monthEvents = events.filter(e => {
    const dt = new Date(e.date);
    return dt.getFullYear() === calendarDate.getFullYear() && dt.getMonth() === calendarDate.getMonth();
  });
  const eventsByDay = monthEvents.reduce<Record<number, EventData[]>>((acc, e) => {
    const dt = new Date(e.date);
    const day = dt.getDate();
    acc[day] = acc[day] || [];
    acc[day].push(e);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Events</h1>
          <p className="text-gray-600">Browse and manage your group events</p>
        </div>
        <button
          onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm inline-flex items-center hover:bg-gray-50"
          aria-label="Toggle Calendar View"
        >
          <CalendarDays className="w-4 h-4 mr-2" /> {view === 'list' ? 'Calendar View' : 'List View'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{upcomingEvents}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-emerald-600">{completedEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold text-purple-600">{totalAttendees}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters / Calendar Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {view === 'list' ? (
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className="p-2 border rounded-lg hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
              <div className="text-sm font-medium text-gray-700 w-40 text-center">
                {calendarDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
              </div>
              <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className="p-2 border rounded-lg hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Groups</option>
            <option value="1">Community Church</option>
            <option value="2">Youth Ministry</option>
            <option value="3">Local Union Chapter</option>
          </select>
          {canCreateEvents && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>
                  {event.currentAttendees} attendees
                  {event.maxAttendees && ` / ${event.maxAttendees} max`}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-400 mb-4">
              {event.groupName} • Created by {event.createdBy}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => notifyUpcoming(event)} className="text-emerald-700 hover:text-emerald-900"><Bell className="w-4 h-4" /></button>
                <button onClick={() => exportToGoogleCalendar(event)} className="text-gray-700 hover:text-gray-900"><ExternalLink className="w-4 h-4" /></button>
                
                {canCreateEvents && (
                  <>
                    <button onClick={() => setEditEvent(event)} className="text-gray-600 hover:text-gray-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              {event.status === 'upcoming' && (
                <div className="flex space-x-1">
                  {canCreateEvents && (
                    <>
                      <button
                        onClick={() => updateEventStatus(event.id, 'ongoing')}
                        className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => updateEventStatus(event.id, 'cancelled')}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
              {event.status === 'ongoing' && (
                canCreateEvents && (
                  <button
                    onClick={() => updateEventStatus(event.id, 'completed')}
                    className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                  >
                    Complete
                  </button>
                )
              )}
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-600 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (<div key={d} className="font-medium">{d}</div>))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth(calendarDate) }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-24" />
            ))}
            {Array.from({ length: daysInMonth(calendarDate) }).map((_, idx) => {
              const day = idx + 1;
              const evts = eventsByDay[day] || [];
              return (
                <div key={day} className={`h-24 border rounded-lg p-1 ${evts.length ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="text-xs font-medium text-gray-700">{day}</div>
                  <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                    {evts.map(e => (
                      <button key={e.id} onClick={() => setSelectedEvent(e)} className="w-full text-left text-[11px] px-1 py-0.5 rounded bg-white border border-blue-200 hover:bg-blue-100">
                        {e.title}
                      </button>
                    ))}
                    {evts.length === 0 && (
                      <div className="text-[10px] text-gray-400">No events</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && canCreateEvents && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Event</h3>
            <div className="space-y-4">
              {newEvent.bannerUrl ? (
                <div className="w-full h-32 rounded-lg overflow-hidden border">
                  <img src={newEvent.bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-20 rounded-lg border border-dashed flex items-center justify-center text-gray-500 text-sm">
                  <ImageIcon className="w-4 h-4 mr-2" /> Add a banner image (optional)
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the event"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Event location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Banner/Image URL</label>
                <input
                  type="url"
                  value={newEvent.bannerUrl}
                  onChange={(e) => setNewEvent({ ...newEvent, bannerUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
                <div className="mt-2">
                  <label className="inline-flex items-center px-3 py-1 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-50">
                    <input type="file" accept="image/*" onChange={(e) => handleBannerFile(e.target.files?.[0])} className="hidden" />
                    <ImageIcon className="w-4 h-4 mr-2" /> Upload Image
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RSVP Settings</label>
                <select
                  value={newEvent.rsvpMode}
                  onChange={(e) => setNewEvent({ ...newEvent, rsvpMode: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="open">Open</option>
                  <option value="invite-only">Invite Only</option>
                  <option value="limited">Limited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                <select
                  value={newEvent.groupId}
                  onChange={(e) => setNewEvent({...newEvent, groupId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">Community Church</option>
                  <option value="2">Youth Ministry</option>
                  <option value="3">Local Union Chapter</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees (Optional)</label>
                <input
                  type="number"
                  value={newEvent.maxAttendees}
                  onChange={(e) => setNewEvent({...newEvent, maxAttendees: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave empty for unlimited"
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
                onClick={handleCreateEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEvent.status)}`}>
                {selectedEvent.status}
              </span>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Date & Time</h4>
                  <p className="text-gray-600">{new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Location</h4>
                  <p className="text-gray-600">{selectedEvent.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Group</h4>
                  <p className="text-gray-600">{selectedEvent.groupName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Attendees</h4>
                  <p className="text-gray-600">
                    {selectedEvent.currentAttendees}
                    {selectedEvent.maxAttendees && ` / ${selectedEvent.maxAttendees}`}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Created By</h4>
                  <p className="text-gray-600">{selectedEvent.createdBy}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Created Date</h4>
                  <p className="text-gray-600">{new Date(selectedEvent.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <button onClick={() => setAttendeeEditEvent(selectedEvent)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Manage Attendees
                </button>
                {canCreateEvents && (
                  <>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                      Send Notifications
                    </button>
                    <button onClick={() => setEditEvent(selectedEvent)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Edit Event
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Event</h3>
              <button onClick={() => setEditEvent(null)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={editEvent.title} onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value } as EventData)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editEvent.description} onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value } as EventData)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={editEvent.date} onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value } as EventData)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" value={editEvent.time} onChange={(e) => setEditEvent({ ...editEvent, time: e.target.value } as EventData)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={editEvent.location} onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value } as EventData)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                  <input type="number" value={editEvent.maxAttendees || ''} onChange={(e) => setEditEvent({ ...editEvent, maxAttendees: e.target.value ? parseInt(e.target.value) : undefined } as EventData)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={editEvent.status} onChange={(e) => setEditEvent({ ...editEvent, status: e.target.value as EventData['status'] } as EventData)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setEditEvent(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveEditEvent} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Attendees Modal */}
      {attendeeEditEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Attendees</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Attendees</label>
                <input type="number" value={attendeeEditEvent.currentAttendees} onChange={(e) => setAttendeeEditEvent({ ...attendeeEditEvent, currentAttendees: parseInt(e.target.value || '0') } as EventData)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                <input type="number" value={attendeeEditEvent.maxAttendees || ''} onChange={(e) => setAttendeeEditEvent({ ...attendeeEditEvent, maxAttendees: e.target.value ? parseInt(e.target.value) : undefined } as EventData)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setAttendeeEditEvent(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleSaveAttendees(attendeeEditEvent as EventData)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};