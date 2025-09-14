import { PollData } from '../types';

const POLLS_KEY = 'sure-polls';

function read(): PollData[] {
  try {
    const raw = localStorage.getItem(POLLS_KEY);
    return raw ? (JSON.parse(raw) as PollData[]) : [];
  } catch {
    return [];
  }
}

function write(list: PollData[]): void {
  localStorage.setItem(POLLS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('sure-polls-updated'));
}

export function listPolls(groupId?: string): PollData[] {
  let all = read();
  if (all.length === 0) {
    all = seedPolls(groupId);
  }
  return groupId ? all.filter(p => p.groupId === groupId) : all;
}

export function createPoll(poll: Omit<PollData, 'id' | 'totalVotes'> & { id?: string; totalVotes?: number }): PollData {
  const p: PollData = {
    id: poll.id || `PL-${Date.now()}`,
    totalVotes: poll.totalVotes ?? 0,
    ...poll,
  } as PollData;
  const all = [p, ...read()];
  write(all);
  return p;
}

export function updatePoll(updated: PollData): PollData {
  const next = read().map(p => (p.id === updated.id ? updated : p));
  write(next);
  return updated;
}

export function deletePoll(pollId: string): void {
  const next = read().filter(p => p.id !== pollId);
  write(next);
}

function seedPolls(groupId?: string): PollData[] {
  const gid = groupId || 'group-1';
  const gname = 'Sure Group';
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const mk = (title: string, desc: string, startOffset: number, endOffset: number, status: PollData['status'], opts: Array<{ text: string; votes: number }>) => {
    const options = opts.map((o, idx) => ({ id: `OPT-${idx + 1}-${now}`, text: o.text, votes: o.votes }));
    const totalVotes = options.reduce((s, o) => s + o.votes, 0);
    return {
      id: `PL-SEED-${Math.random().toString(36).slice(2, 8)}-${now}`,
      title,
      description: desc,
      options,
      groupId: gid,
      groupName: gname,
      createdBy: 'group-admin',
      startDate: new Date(now + startOffset * day).toISOString(),
      endDate: new Date(now + endOffset * day).toISOString(),
      status,
      totalVotes,
      visibility: 'public',
    } as PollData;
  };

  const polls: PollData[] = [
    mk('Preferred Meeting Day', 'Select the best day for weekly meetings.', -7, 7, 'active', [
      { text: 'Monday', votes: 15 },
      { text: 'Wednesday', votes: 22 },
      { text: 'Friday', votes: 10 },
    ]),
    mk('Catering Choice for Gala', 'Choose the cuisine for the gala night.', -20, -10, 'completed', [
      { text: 'Italian', votes: 40 },
      { text: 'Asian', votes: 35 },
      { text: 'Continental', votes: 25 },
    ]),
    mk('Upcoming Workshop Topic', 'Vote for the next workshop topic.', 3, 10, 'upcoming', [
      { text: 'Fundraising Basics', votes: 0 },
      { text: 'Volunteer Management', votes: 0 },
      { text: 'Community Partnerships', votes: 0 },
    ]),
  ];

  write(polls);
  return polls;
}

