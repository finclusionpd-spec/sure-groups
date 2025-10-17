import { PollData } from '../types';

const POLLS_KEY = 'sure-polls';
const USER_VOTES_KEY = (userId: string) => `sure-poll-votes-${userId}`;

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

export function getPollById(pollId: string): PollData | undefined {
  return read().find(p => p.id === pollId);
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

function readUserVotes(userId: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(USER_VOTES_KEY(userId));
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeUserVotes(userId: string, map: Record<string, string>) {
  localStorage.setItem(USER_VOTES_KEY(userId), JSON.stringify(map));
}

export function hasVoted(userId: string, pollId: string): boolean {
  const m = readUserVotes(userId);
  return !!m[pollId];
}

export function submitVote(userId: string, pollId: string, optionId: string): PollData | undefined {
  const polls = read();
  const idx = polls.findIndex(p => p.id === pollId);
  if (idx === -1) return undefined;
  const poll = polls[idx];
  const now = Date.now();
  if (poll.status !== 'active') return poll;
  if (new Date(poll.endDate).getTime() < now) return poll;
  const votesMap = readUserVotes(userId);
  if (votesMap[pollId]) return poll;

  const options = poll.options.map(o => o.id === optionId ? { ...o, votes: (o.votes || 0) + 1 } : o);
  const totalVotes = (poll.totalVotes || 0) + 1;
  const updated: PollData = { ...poll, options, totalVotes };
  polls[idx] = updated;
  write(polls);
  votesMap[pollId] = optionId;
  writeUserVotes(userId, votesMap);
  return updated;
}

export function listActivePolls(): PollData[] {
  const now = Date.now();
  return read().filter(p => p.status === 'active' && new Date(p.endDate).getTime() >= now);
}

export function listPastPolls(): PollData[] {
  const now = Date.now();
  return read().filter(p => p.status === 'completed' || new Date(p.endDate).getTime() < now);
}

// Optional: helper to create notifications for members when new polls available or closing soon
export function notifyPollsIfNeeded(userId: string) {
  try {
    const seenKey = `sure-polls-seen-${userId}`;
    const seen = new Set<string>(JSON.parse(localStorage.getItem(seenKey) || '[]'));
    const now = Date.now();
    const soon = now + 24 * 3600 * 1000;
    const all = read();
    const toMark: string[] = [];
    all.forEach(p => {
      if (p.status === 'active' && !seen.has(`active:${p.id}`)) {
        // New poll available
        toMark.push(`active:${p.id}`);
      }
      const end = new Date(p.endDate).getTime();
      if (p.status === 'active' && end < soon && !seen.has(`closing:${p.id}`)) {
        // Poll closing soon
        toMark.push(`closing:${p.id}`);
      }
    });
    if (toMark.length > 0) {
      const next = Array.from(new Set([...Array.from(seen), ...toMark]));
      localStorage.setItem(seenKey, JSON.stringify(next));
    }
  } catch {}
}

