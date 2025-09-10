import { Transaction, DonationRecord, DonationType } from '../types';

type WalletState = {
  walletId: string;
  balance: number;
  currency: string;
};

type Campaign = {
  id: string;
  name: string;
  description: string;
};

const WALLET_KEY = (userId: string) => `sure-wallet-${userId}`;
const TX_KEY = (userId: string) => `sure-wallet-tx-${userId}`;
const DONATIONS_KEY = (userId: string) => `sure-donations-${userId}`;
const CAMPAIGNS_KEY = 'sure-campaigns';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedCampaigns(): Campaign[] {
  const existing = readJSON<Campaign[] | null>(CAMPAIGNS_KEY, null);
  if (existing && existing.length > 0) return existing;
  const seeded: Campaign[] = [
    { id: 'cmp-edu', name: 'Education Support', description: 'Scholarships and supplies for students' },
    { id: 'cmp-health', name: 'Community Health', description: 'Medical outreach and health screenings' },
    { id: 'cmp-relief', name: 'Relief Fund', description: 'Emergency relief for members in need' },
  ];
  writeJSON(CAMPAIGNS_KEY, seeded);
  return seeded;
}

function getOrCreateWallet(userId: string): WalletState {
  const key = WALLET_KEY(userId);
  const existing = readJSON<WalletState | null>(key, null);
  if (existing) return existing;
  const created: WalletState = {
    walletId: `wal-${userId}`,
    balance: 500.0,
    currency: 'USD',
  };
  writeJSON(key, created);
  return created;
}

function saveWallet(userId: string, wallet: WalletState): void {
  writeJSON(WALLET_KEY(userId), wallet);
}

function getTransactions(userId: string): Transaction[] {
  return readJSON<Transaction[]>(TX_KEY(userId), []);
}

function saveTransactions(userId: string, txs: Transaction[]): void {
  writeJSON(TX_KEY(userId), txs);
}

export function getWalletBalance(userId: string): { balance: number; currency: string; walletId: string } {
  const w = getOrCreateWallet(userId);
  return { balance: w.balance, currency: w.currency, walletId: w.walletId };
}

export function listCampaigns(): Campaign[] {
  return seedCampaigns();
}

export function debitWallet(userId: string, amount: number, description: string): { transactionId: string; newBalance: number } {
  if (amount <= 0) throw new Error('Amount must be greater than 0');
  const wallet = getOrCreateWallet(userId);
  if (wallet.balance < amount) throw new Error('Insufficient wallet balance');

  wallet.balance = parseFloat((wallet.balance - amount).toFixed(2));
  saveWallet(userId, wallet);

  const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const tx: Transaction = {
    id: transactionId,
    walletId: wallet.walletId,
    type: 'debit',
    amount,
    description,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };
  const all = [tx, ...getTransactions(userId)];
  saveTransactions(userId, all);

  return { transactionId, newBalance: wallet.balance };
}

export function creditWallet(userId: string, amount: number, description: string): { transactionId: string; newBalance: number } {
  if (amount <= 0) throw new Error('Amount must be greater than 0');
  const wallet = getOrCreateWallet(userId);
  wallet.balance = parseFloat((wallet.balance + amount).toFixed(2));
  saveWallet(userId, wallet);

  const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const tx: Transaction = {
    id: transactionId,
    walletId: wallet.walletId,
    type: 'credit',
    amount,
    description,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };
  const all = [tx, ...getTransactions(userId)];
  saveTransactions(userId, all);
  return { transactionId, newBalance: wallet.balance };
}

export function recordDonation(donation: DonationRecord & { userId: string }): void {
  const list = readJSON<DonationRecord[]>(DONATIONS_KEY(donation.userId), []);
  writeJSON(DONATIONS_KEY(donation.userId), [donation, ...list]);
}

export function getDonationHistory(userId: string): DonationRecord[] {
  return readJSON<DonationRecord[]>(DONATIONS_KEY(userId), []);
}

export function buildReceiptText(dr: DonationRecord): string {
  const lines: string[] = [];
  lines.push('SureGroups Donation Receipt');
  lines.push('--------------------------------');
  lines.push(`Donor: ${dr.donorUserName} (${dr.donorUserId})`);
  lines.push(`Date: ${new Date(dr.createdAt).toLocaleString()}`);
  lines.push(`Donation Type: ${dr.donationType}${dr.campaignName ? ` (${dr.campaignName})` : ''}`);
  if (dr.note) lines.push(`Note: ${dr.note}`);
  lines.push(`Amount: ${dr.currency} ${dr.amount.toFixed(2)}`);
  lines.push(`Transaction ID: ${dr.transactionId}`);
  if (dr.recurring) lines.push(`Recurring: ${dr.recurring.cadence}, next run at ${new Date(dr.recurring.nextRunAt).toLocaleString()}`);
  lines.push('--------------------------------');
  lines.push('Thank you for your generosity.');
  return lines.join('\n');
}

export function computeNextRun(cadence: 'weekly' | 'monthly'): string {
  const d = new Date();
  if (cadence === 'weekly') d.setDate(d.getDate() + 7);
  if (cadence === 'monthly') d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

export function donationDescription(type: DonationType, campaignName?: string, note?: string): string {
  if (type === 'general') return 'Donation - General Group Donation';
  if (type === 'campaign') return `Donation - Campaign: ${campaignName || 'Unknown Campaign'}`;
  return `Donation - ${note || 'Custom Donation'}`;
}

export type { Campaign };

