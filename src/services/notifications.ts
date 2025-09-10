export type NotificationType = 'system' | 'transaction' | 'group' | 'event' | 'security';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  groupName?: string;
}

const NOTIFS_KEY = 'sure-notifications';

function read(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFS_KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function write(list: AppNotification[]): void {
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(list));
  // Notify same-tab listeners
  window.dispatchEvent(new CustomEvent('sure-notifications-updated'));
}

export function listNotifications(): AppNotification[] {
  return read();
}

export function addNotification(n: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'> & { timestamp?: string; isRead?: boolean }): AppNotification {
  const notif: AppNotification = {
    id: `NT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    isRead: false,
    timestamp: n.timestamp || new Date().toISOString(),
    ...n,
  };
  const all = [notif, ...read()];
  write(all);
  return notif;
}

export function markAllRead(): void {
  const next = read().map(n => ({ ...n, isRead: true }));
  write(next);
}

