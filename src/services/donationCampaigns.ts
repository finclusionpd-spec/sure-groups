import { DonationRecord, UserRole } from '../types';

export interface DonationCampaign {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  description: string;
  targetAmount?: number;
  startDate: string;
  endDate: string;
  visibility: 'public' | 'restricted';
  allowedRoles?: UserRole[];
  status: 'active' | 'closed';
  raisedAmount: number;
  donations: Array<{
    id: string;
    memberId: string;
    memberName: string;
    amount: number;
    currency: string;
    createdAt: string;
  }>;
}

const KEY = (groupId: string) => `sure-donation-campaigns-${groupId}`;

function read(groupId: string): DonationCampaign[] {
  try {
    const raw = localStorage.getItem(KEY(groupId));
    return raw ? (JSON.parse(raw) as DonationCampaign[]) : [];
  } catch {
    return [];
  }
}

function write(groupId: string, list: DonationCampaign[]): void {
  localStorage.setItem(KEY(groupId), JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('sure-donations-updated'));
}

export function listDonationCampaigns(groupId: string): DonationCampaign[] {
  const list = read(groupId);
  if (list.length === 0) {
    const seeded = seedDonationCampaigns(groupId);
    return seeded;
  }
  return list;
}

export function createDonationCampaign(groupId: string, campaign: Omit<DonationCampaign, 'id' | 'raisedAmount' | 'donations' | 'status' | 'groupId'> & { id?: string }): DonationCampaign {
  const c: DonationCampaign = {
    id: campaign.id || `DC-${Date.now()}`,
    groupId,
    raisedAmount: 0,
    donations: [],
    status: 'active',
    ...campaign,
  } as DonationCampaign;
  const all = [c, ...read(groupId)];
  write(groupId, all);
  return c;
}

export function updateDonationCampaign(groupId: string, updated: DonationCampaign): DonationCampaign {
  const next = read(groupId).map(c => (c.id === updated.id ? updated : c));
  write(groupId, next);
  return updated;
}

export function deleteDonationCampaign(groupId: string, campaignId: string): void {
  const next = read(groupId).filter(c => c.id !== campaignId);
  write(groupId, next);
}

export function closeDonationCampaign(groupId: string, campaignId: string): DonationCampaign | null {
  const list = read(groupId);
  const idx = list.findIndex(c => c.id === campaignId);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], status: 'closed' };
  write(groupId, list);
  return list[idx];
}

export function addDonationToCampaign(groupId: string, campaignId: string, donation: DonationRecord & { currency: string }): DonationCampaign | null {
  const list = read(groupId);
  const idx = list.findIndex(c => c.id === campaignId);
  if (idx === -1) return null;
  const c = list[idx];
  const entry = {
    id: donation.id,
    memberId: donation.donorUserId,
    memberName: donation.donorUserName,
    amount: donation.amount,
    currency: donation.currency,
    createdAt: donation.createdAt,
  };
  const raisedAmount = parseFloat((c.raisedAmount + donation.amount).toFixed(2));
  list[idx] = { ...c, raisedAmount, donations: [entry, ...c.donations] };
  write(groupId, list);
  return list[idx];
}

function seedDonationCampaigns(groupId: string): DonationCampaign[] {
  const now = Date.now();
  const gid = groupId;
  const gname = 'Sure Group';
  const mkDonation = (id: string, name: string, amount: number, daysAgo: number) => ({
    id,
    memberId: `m-${id}`,
    memberName: name,
    amount,
    currency: 'USD',
    createdAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
  });

  const c1Donations = [
    mkDonation('d1', 'Alice Johnson', 150, 15),
    mkDonation('d2', 'Bob Smith', 75, 12),
    mkDonation('d3', 'Carol Danvers', 200, 7),
  ];
  const c2Donations = [
    mkDonation('d4', 'David Lee', 50, 3),
  ];

  const campaigns: DonationCampaign[] = [
    {
      id: `DC-SEED-${now - 1}`,
      groupId: gid,
      groupName: gname,
      title: 'Back-to-School Supplies',
      description: 'Raising funds to provide school supplies to underprivileged students.',
      targetAmount: 2000,
      startDate: new Date(now - 20 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString(),
      visibility: 'public',
      status: 'active',
      raisedAmount: c1Donations.reduce((s, d) => s + d.amount, 0),
      donations: c1Donations,
    },
    {
      id: `DC-SEED-${now - 2}`,
      groupId: gid,
      groupName: gname,
      title: 'Community Health Outreach',
      description: 'Support free health screenings and medical supplies for the community.',
      targetAmount: 5000,
      startDate: new Date(now - 40 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      visibility: 'public',
      status: 'closed',
      raisedAmount: c2Donations.reduce((s, d) => s + d.amount, 0),
      donations: c2Donations,
    },
  ];

  write(groupId, campaigns);
  return campaigns;
}

