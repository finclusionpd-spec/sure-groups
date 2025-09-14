import { addNotification } from './notifications';
import { UserRole } from '../types';

export type ApprovalType = 'membership' | 'content' | 'event' | 'marketplace' | 'donation';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  requesterId: string;
  requesterName: string;
  groupId: string;
  groupName: string;
  description: string;
  createdAt: string;
  status: ApprovalStatus;
  resolvedAt?: string;
  resolvedById?: string;
  resolvedByName?: string;
}

const KEY = (groupId: string) => `sure-approvals-${groupId}`;

function read(groupId: string): ApprovalRequest[] {
  try {
    const raw = localStorage.getItem(KEY(groupId));
    return raw ? (JSON.parse(raw) as ApprovalRequest[]) : [];
  } catch {
    return [];
  }
}

function write(groupId: string, list: ApprovalRequest[]): void {
  localStorage.setItem(KEY(groupId), JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('sure-approvals-updated'));
}

export function listApprovals(groupId: string): ApprovalRequest[] {
  let list = read(groupId);
  if (list.length === 0) {
    list = seedApprovals(groupId);
  }
  return list;
}

export function listByStatus(groupId: string, status: ApprovalStatus): ApprovalRequest[] {
  return listApprovals(groupId).filter(a => a.status === status);
}

export function createApproval(groupId: string, req: Omit<ApprovalRequest, 'id' | 'status' | 'createdAt' | 'groupId' | 'resolvedAt' | 'resolvedById' | 'resolvedByName'>): ApprovalRequest {
  const item: ApprovalRequest = {
    id: `AP-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    groupId,
    ...req,
  };
  const list = [item, ...read(groupId)];
  write(groupId, list);
  addNotification({
    title: 'New Approval Request',
    message: `${item.requesterName} submitted a ${item.type} request`,
    type: 'group',
    priority: 'high',
    actionUrl: '/dashboard?feature=approval-workflow',
    groupName: item.groupName,
  });
  return item;
}

export function resolveApproval(groupId: string, approvalId: string, action: 'approve' | 'reject', admin: { id: string; name: string }): ApprovalRequest | null {
  const list = read(groupId);
  const idx = list.findIndex(a => a.id === approvalId);
  if (idx === -1) return null;
  const status: ApprovalStatus = action === 'approve' ? 'approved' : 'rejected';
  const updated: ApprovalRequest = {
    ...list[idx],
    status,
    resolvedAt: new Date().toISOString(),
    resolvedById: admin.id,
    resolvedByName: admin.name,
  };
  list[idx] = updated;
  write(groupId, list);
  addNotification({
    title: `Request ${status}`,
    message: `Your ${updated.type} request was ${status} by ${admin.name}`,
    type: 'group',
    priority: 'medium',
    groupName: updated.groupName,
  });
  return updated;
}

function seedApprovals(groupId: string): ApprovalRequest[] {
  const now = Date.now();
  const gname = 'Sure Group';
  const mk = (type: ApprovalType, requesterName: string, desc: string, daysAgo: number, status: ApprovalStatus = 'pending') => ({
    id: `AP-SEED-${Math.random().toString(36).slice(2,8)}-${now}`,
    type,
    requesterId: `u-${requesterName.split(' ')[0].toLowerCase()}`,
    requesterName,
    groupId,
    groupName: gname,
    description: desc,
    createdAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    status,
    resolvedAt: status === 'pending' ? undefined : new Date(now - (daysAgo - 1) * 24 * 60 * 60 * 1000).toISOString(),
    resolvedById: status === 'pending' ? undefined : 'admin-1',
    resolvedByName: status === 'pending' ? undefined : 'Group Admin',
  } as ApprovalRequest);

  const data: ApprovalRequest[] = [
    mk('membership', 'Alice Johnson', 'Request to join group as Member', 1, 'pending'),
    mk('content', 'Bob Smith', 'Post: “Upcoming volunteer drive details”', 2, 'pending'),
    mk('event', 'Carol Danvers', 'Event proposal: “Tech for Good Summit”', 5, 'approved'),
    mk('marketplace', 'David Lee', 'New service listing: “Photography Package”', 3, 'rejected'),
    mk('donation', 'Emily Clark', 'Donation withdrawal request: $250 for supplies', 7, 'pending'),
  ];

  write(groupId, data);
  return data;
}

