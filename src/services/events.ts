import { EventData } from '../types';

const EVENTS_KEY = 'sure-events';

function read(): EventData[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? (JSON.parse(raw) as EventData[]) : [];
  } catch {
    return [];
  }
}

function write(list: EventData[]): void {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('sure-events-updated'));
}

export function listEvents(groupId?: string): EventData[] {
  let all = read();
  if (all.length === 0) {
    all = seedEvents(groupId);
  }
  return groupId ? all.filter(e => e.groupId === groupId) : all;
}

export function createEvent(event: Omit<EventData, 'id' | 'createdAt' | 'currentAttendees'> & { id?: string; createdAt?: string; currentAttendees?: number }): EventData {
  const newEvent: EventData = {
    id: event.id || `EV-${Date.now()}`,
    createdAt: event.createdAt || new Date().toISOString(),
    currentAttendees: event.currentAttendees ?? 0,
    ...event,
  } as EventData;
  const all = [newEvent, ...read()];
  write(all);
  return newEvent;
}

export function updateEvent(updated: EventData): EventData {
  const next = read().map(e => (e.id === updated.id ? updated : e));
  write(next);
  return updated;
}

export function deleteEvent(eventId: string): void {
  const next = read().filter(e => e.id !== eventId);
  write(next);
}

export function rsvpToEvent(eventId: string, attendee: { userId: string; userName: string; status: 'going' | 'interested' | 'declined' }): EventData | null {
  const all = read();
  const idx = all.findIndex(e => e.id === eventId);
  if (idx === -1) return null;
  const existing = all[idx];
  const attendees = existing.attendees || [];
  const existingIdx = attendees.findIndex(a => a.userId === attendee.userId);
  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    attendees[existingIdx] = { ...attendee, timestamp: now } as any;
  } else {
    attendees.unshift({ ...attendee, timestamp: now } as any);
  }
  const currentAttendees = attendees.filter(a => a.status === 'going').length;
  const updated: EventData = { ...existing, attendees, currentAttendees };
  all[idx] = updated;
  write(all);
  return updated;
}

function seedEvents(groupId?: string): EventData[] {
  const gid = groupId || 'group-1';
  const gname = 'Sure Group';
  const now = Date.now();
  const makeDate = (offsetDays: number) => {
    const d = new Date(now + offsetDays * 24 * 60 * 60 * 1000);
    return {
      date: d.toISOString().slice(0, 10),
      time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
      createdAt: new Date(now - Math.max(0, -offsetDays) * 24 * 60 * 60 * 1000).toISOString(),
    };
  };

  const e1Date = makeDate(5);
  const e2Date = makeDate(0);
  const e3Date = makeDate(-10);

  const events: EventData[] = [
    {
      id: `EV-SEED-${now - 1}`,
      title: 'Community Outreach Seminar',
      description: 'Join us for a seminar on community outreach and impact.',
      date: e1Date.date,
      time: e1Date.time,
      location: 'Main Hall, City Center',
      groupId: gid,
      groupName: gname,
      maxAttendees: 200,
      currentAttendees: 45,
      status: 'upcoming',
      createdBy: 'group-admin',
      createdAt: e1Date.createdAt,
      bannerUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop',
      rsvpMode: 'open',
      attendees: [
        { userId: 'm1', userName: 'Alice Johnson', status: 'going', timestamp: new Date(now - 1000 * 60 * 30).toISOString() },
        { userId: 'm2', userName: 'Bob Smith', status: 'interested', timestamp: new Date(now - 1000 * 60 * 60).toISOString() },
      ],
    },
    {
      id: `EV-SEED-${now - 2}`,
      title: 'Monthly Group Meeting',
      description: 'Regular meeting to review plans and progress.',
      date: e2Date.date,
      time: e2Date.time,
      location: 'Conference Room 2',
      groupId: gid,
      groupName: gname,
      maxAttendees: 50,
      currentAttendees: 20,
      status: 'ongoing',
      createdBy: 'group-admin',
      createdAt: e2Date.createdAt,
      bannerUrl: 'https://images.unsplash.com/photo-1496302662116-85c0c76b5b46?q=80&w=1000&auto=format&fit=crop',
      rsvpMode: 'limited',
      attendees: [
        { userId: 'm3', userName: 'Carol Danvers', status: 'going', timestamp: new Date(now - 1000 * 60 * 90).toISOString() },
      ],
    },
    {
      id: `EV-SEED-${now - 3}`,
      title: 'Fundraising Gala Night',
      description: 'A special evening to raise funds for community projects.',
      date: e3Date.date,
      time: e3Date.time,
      location: 'Grand Ballroom',
      groupId: gid,
      groupName: gname,
      maxAttendees: 300,
      currentAttendees: 180,
      status: 'completed',
      createdBy: 'group-admin',
      createdAt: e3Date.createdAt,
      bannerUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop',
      rsvpMode: 'invite-only',
      attendees: [
        { userId: 'm4', userName: 'David Lee', status: 'going', timestamp: new Date(now - 1000 * 60 * 60 * 24 * 9).toISOString() },
        { userId: 'm5', userName: 'Emily Clark', status: 'going', timestamp: new Date(now - 1000 * 60 * 60 * 24 * 8).toISOString() },
      ],
    },
  ];

  write(events);
  return events;
}

