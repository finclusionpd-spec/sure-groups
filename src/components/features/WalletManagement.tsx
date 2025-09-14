import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, DollarSign, Send, ArrowDownCircle, ArrowUpCircle, Link as LinkIcon, Shield, Plus, Minus, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getWalletBalance, creditWallet, debitWallet } from '../../services/wallet';

type TxType = 'credit' | 'debit';
type TxStatus = 'completed' | 'pending' | 'failed';

interface WalletTxRow {
  id: string;
  walletId: string;
  type: TxType;
  amount: number;
  description: string;
  status: TxStatus;
  createdAt: string;
}

const txKey = (userId: string) => `sure-wallet-tx-${userId}`;
const payoutKey = (userId: string) => `sure-payout-accounts-${userId}`;

interface WalletManagementProps {
  actorId?: string;
  allowAllRoles?: boolean;
  heading?: string;
}

export const WalletManagement: React.FC<WalletManagementProps> = ({ actorId, allowAllRoles = false, heading }) => {
  const { user } = useAuth();
  const isGroupAdmin = user?.role === 'group-admin';
  const adminId = user?.id || 'group-admin';
  const ownerId = actorId || adminId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [wallet, setWallet] = useState(() => getWalletBalance(ownerId));
  const [escrow, setEscrow] = useState(() => getWalletBalance(`${ownerId}-escrow`));
  const [txs, setTxs] = useState<WalletTxRow[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | TxType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TxStatus>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7d' | '30d'>('all');

  const [showSend, setShowSend] = useState(false);
  const [showFund, setShowFund] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showReceive, setShowReceive] = useState(false);

  const [pin, setPin] = useState('');
  const [sendForm, setSendForm] = useState({ recipient: '', amount: '', purpose: '' });
  const [fundForm, setFundForm] = useState({ method: 'card', amount: '' });
  const [withdrawForm, setWithdrawForm] = useState({ bankId: '', amount: '' });

  const [payoutAccounts, setPayoutAccounts] = useState<{ id: string; bankName: string; accountNumber: string }[]>([]);
  const [newAccount, setNewAccount] = useState({ bankName: '', accountNumber: '' });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(txKey(ownerId));
      let loaded: WalletTxRow[] = raw ? (JSON.parse(raw) as WalletTxRow[]) : [];
      const accRaw = localStorage.getItem(payoutKey(ownerId));
      setPayoutAccounts(accRaw ? (JSON.parse(accRaw) as any[]) : []);

      // Seed dummy transactions if none exist
      if (!loaded || loaded.length === 0) {
        const now = Date.now();
        const seed: WalletTxRow[] = [
          {
            id: `TX-SEED-${now - 1}`,
            walletId: wallet.walletId,
            type: 'credit',
            amount: 500.0,
            description: 'Initial funding via card',
            status: 'completed',
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
          },
          {
            id: `TX-SEED-${now - 2}`,
            walletId: wallet.walletId,
            type: 'debit',
            amount: 120.5,
            description: 'Marketplace purchase payout',
            status: 'completed',
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
          },
          {
            id: `TX-SEED-${now - 3}`,
            walletId: wallet.walletId,
            type: 'credit',
            amount: 75.25,
            description: 'Donation allocation',
            status: 'pending',
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
          },
          {
            id: `TX-SEED-${now - 4}`,
            walletId: wallet.walletId,
            type: 'debit',
            amount: 60,
            description: 'Withdrawal to bank',
            status: 'completed',
            createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
          },
          {
            id: `TX-SEED-${now - 5}`,
            walletId: wallet.walletId,
            type: 'credit',
            amount: 200,
            description: 'Top-up via transfer',
            status: 'failed',
            createdAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
          },
        ];
        loaded = seed;
        localStorage.setItem(txKey(ownerId), JSON.stringify(seed));
      }
      setTxs(loaded);
    } catch {}
    setLoading(false);
  }, [ownerId]);

  const saveTxs = (rows: WalletTxRow[]) => {
    setTxs(rows);
    localStorage.setItem(txKey(ownerId), JSON.stringify(rows));
  };

  const addTx = (row: Omit<WalletTxRow, 'id' | 'createdAt' | 'status'> & { status?: TxStatus }) => {
    const tx: WalletTxRow = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      status: row.status || 'completed',
      ...row,
    };
    const next = [tx, ...txs];
    saveTxs(next);
  };

  const filtered = useMemo(() => {
    const now = Date.now();
    const insideDate = (iso: string) => {
      if (dateFilter === 'all') return true;
      const t = new Date(iso).getTime();
      if (dateFilter === 'today') {
        const d = new Date();
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        return t >= start;
      }
      if (dateFilter === '7d') return t >= now - 7 * 24 * 3600 * 1000;
      if (dateFilter === '30d') return t >= now - 30 * 24 * 3600 * 1000;
      return true;
    };
    return txs.filter(tx =>
      (typeFilter === 'all' || tx.type === typeFilter) &&
      (statusFilter === 'all' || tx.status === statusFilter) &&
      insideDate(tx.createdAt)
    );
  }, [txs, typeFilter, statusFilter, dateFilter]);

  if (!allowAllRoles && !isGroupAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Wallet Management</h1>
        <p className="text-gray-600">Only Group Admins can manage the group wallet.</p>
      </div>
    );
  }

  const requirePin = () => pin === '1234';

  const handleSend = () => {
    setError(null);
    const amount = parseFloat(sendForm.amount);
    if (!sendForm.recipient.trim()) return setError('Recipient required');
    if (isNaN(amount) || amount <= 0) return setError('Enter a valid amount');
    if (!requirePin()) return setError('Invalid PIN (hint: 1234)');
    try {
      const { newBalance } = debitWallet(ownerId, amount, `Send: ${sendForm.purpose || 'Transfer'}`);
      setWallet(prev => ({ ...prev, balance: newBalance }));
      addTx({ walletId: wallet.walletId, type: 'debit', amount, description: `Sent to ${sendForm.recipient}: ${sendForm.purpose || 'Transfer'}` });
      setShowSend(false);
      setSendForm({ recipient: '', amount: '', purpose: '' });
      setPin('');
    } catch (e: any) {
      setError(e?.message || 'Transfer failed');
    }
  };

  const handleFund = () => {
    setError(null);
    const amount = parseFloat(fundForm.amount);
    if (isNaN(amount) || amount <= 0) return setError('Enter a valid amount');
    try {
      const { newBalance } = creditWallet(ownerId, amount, `Top-up via ${fundForm.method}`);
      setWallet(prev => ({ ...prev, balance: newBalance }));
      addTx({ walletId: wallet.walletId, type: 'credit', amount, description: `Funded via ${fundForm.method}` });
      setShowFund(false);
      setFundForm({ method: 'card', amount: '' });
    } catch (e: any) {
      setError(e?.message || 'Top-up failed');
    }
  };

  const handleWithdraw = () => {
    setError(null);
    const amount = parseFloat(withdrawForm.amount);
    if (!withdrawForm.bankId) return setError('Select a payout account');
    if (isNaN(amount) || amount <= 0) return setError('Enter a valid amount');
    if (!requirePin()) return setError('Invalid PIN (hint: 1234)');
    try {
      const { newBalance } = debitWallet(ownerId, amount, `Withdraw to ${withdrawForm.bankId}`);
      setWallet(prev => ({ ...prev, balance: newBalance }));
      addTx({ walletId: wallet.walletId, type: 'debit', amount, description: `Withdrawal to ${withdrawForm.bankId}` });
      setShowWithdraw(false);
      setWithdrawForm({ bankId: '', amount: '' });
      setPin('');
    } catch (e: any) {
      setError(e?.message || 'Withdrawal failed');
    }
  };

  const addPayoutAccount = () => {
    if (!newAccount.bankName.trim() || !newAccount.accountNumber.trim()) return;
    const account = { id: `acct-${Date.now()}`, ...newAccount };
    const next = [account, ...payoutAccounts];
    setPayoutAccounts(next);
    localStorage.setItem(payoutKey(ownerId), JSON.stringify(next));
    setNewAccount({ bankName: '', accountNumber: '' });
  };

  const removePayoutAccount = (id: string) => {
    const next = payoutAccounts.filter(a => a.id !== id);
    setPayoutAccounts(next);
    localStorage.setItem(payoutKey(ownerId), JSON.stringify(next));
  };

  const paymentLink = `${window.location.origin}/pay?to=${encodeURIComponent(wallet.walletId)}&ref=${Date.now()}`;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{heading || 'Wallet Management'}</h1>
        <p className="text-gray-600">Manage your SureBanker wallets and transactions</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">{error}</div>
      )}

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SureBanker Wallet</h3>
              <p className="text-sm text-gray-500">Wallet ID: <span className="font-mono">{wallet.walletId}</span></p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900">{wallet.currency} {wallet.balance.toFixed(2)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <button onClick={() => setShowSend(true)} className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center"><Send className="w-4 h-4 mr-1" /> Send</button>
              <button onClick={() => setShowReceive(true)} className="px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200 inline-flex items-center"><LinkIcon className="w-4 h-4 mr-1" /> Receive</button>
              <button onClick={() => setShowFund(true)} className="px-3 py-2 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 inline-flex items-center"><ArrowDownCircle className="w-4 h-4 mr-1" /> Fund</button>
              <button onClick={() => setShowWithdraw(true)} className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 inline-flex items-center"><ArrowUpCircle className="w-4 h-4 mr-1" /> Withdraw</button>
            </div>
          </div>
        </div>

        {/* Optional Escrow */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SureEscrow Wallet</h3>
              <p className="text-sm text-gray-500">Wallet ID: <span className="font-mono">{escrow.walletId}</span></p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-2xl font-bold text-gray-900">{escrow.currency} {escrow.balance.toFixed(2)}</p>
            </div>
            <div className="text-sm text-gray-600">Admin-controlled release</div>
          </div>
        </div>
      </div>

      {/* Transaction Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex items-center flex-wrap gap-3">
          <div className="inline-flex items-center px-3 py-2 border rounded text-sm text-gray-700"><Filter className="w-4 h-4 mr-2" /> Filters</div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="px-3 py-2 border rounded text-sm">
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-3 py-2 border rounded text-sm">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select value={dateFilter} onChange={e => setDateFilter(e.target.value as any)} className="px-3 py-2 border rounded text-sm">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{t.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{t.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs md:max-w-md truncate">{t.description}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${t.type === 'credit' ? 'text-emerald-700' : 'text-red-700'}`}>{t.type === 'credit' ? '+' : '-'}{wallet.currency} {t.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <span className={`inline-flex px-2 py-1 rounded-full font-medium ${
                      t.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td className="px-6 py-6 text-center text-gray-500" colSpan={6}>No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Accounts */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Payout Accounts</h3>
          <div className="space-y-2 mb-4">
            {payoutAccounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div>
                  <div className="text-sm font-medium text-gray-900">{acc.bankName}</div>
                  <div className="text-xs font-mono text-gray-600">{acc.accountNumber}</div>
                </div>
                <button onClick={() => removePayoutAccount(acc.id)} className="text-red-600 text-sm">Remove</button>
              </div>
            ))}
            {payoutAccounts.length === 0 && (
              <div className="text-sm text-gray-500">No payout accounts linked.</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Bank name" value={newAccount.bankName} onChange={e => setNewAccount({ ...newAccount, bankName: e.target.value })} className="px-3 py-2 border rounded text-sm" />
            <input type="text" placeholder="Account number" value={newAccount.accountNumber} onChange={e => setNewAccount({ ...newAccount, accountNumber: e.target.value })} className="px-3 py-2 border rounded text-sm" />
          </div>
          <div className="mt-2 text-right">
            <button onClick={addPayoutAccount} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Add Account</button>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Security</h3>
          <p className="text-sm text-blue-800 mb-2">Sensitive actions (send, withdraw) require PIN/2FA.</p>
          <div className="text-sm text-blue-800">Demo PIN: 1234</div>
        </div>
      </div>

      {/* Send Modal */}
      {showSend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Money</h3>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 border rounded" placeholder="Recipient wallet/account" value={sendForm.recipient} onChange={e => setSendForm({ ...sendForm, recipient: e.target.value })} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Amount" type="number" step="0.01" value={sendForm.amount} onChange={e => setSendForm({ ...sendForm, amount: e.target.value })} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Purpose (optional)" value={sendForm.purpose} onChange={e => setSendForm({ ...sendForm, purpose: e.target.value })} />
              <input className="w-full px-3 py-2 border rounded" placeholder="PIN" type="password" value={pin} onChange={e => setPin(e.target.value)} />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button onClick={() => setShowSend(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Fund Modal */}
      {showFund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Wallet</h3>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border rounded" value={fundForm.method} onChange={e => setFundForm({ ...fundForm, method: e.target.value })}>
                <option value="card">Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
              <input className="w-full px-3 py-2 border rounded" placeholder="Amount" type="number" step="0.01" value={fundForm.amount} onChange={e => setFundForm({ ...fundForm, amount: e.target.value })} />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button onClick={() => setShowFund(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleFund} className="px-4 py-2 bg-emerald-600 text-white rounded">Fund</button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Funds</h3>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border rounded" value={withdrawForm.bankId} onChange={e => setWithdrawForm({ ...withdrawForm, bankId: e.target.value })}>
                <option value="">Select Payout Account</option>
                {payoutAccounts.map(a => (
                  <option key={a.id} value={`${a.bankName}-${a.accountNumber}`}>{a.bankName} • {a.accountNumber}</option>
                ))}
              </select>
              <input className="w-full px-3 py-2 border rounded" placeholder="Amount" type="number" step="0.01" value={withdrawForm.amount} onChange={e => setWithdrawForm({ ...withdrawForm, amount: e.target.value })} />
              <input className="w-full px-3 py-2 border rounded" placeholder="PIN" type="password" value={pin} onChange={e => setPin(e.target.value)} />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button onClick={() => setShowWithdraw(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleWithdraw} className="px-4 py-2 bg-red-600 text-white rounded">Withdraw</button>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {showReceive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Receive Money</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-gray-50 rounded border">
                <div className="text-gray-600">Payment Link</div>
                <div className="font-mono break-all">{paymentLink}</div>
              </div>
              <button onClick={() => { navigator.clipboard?.writeText(paymentLink); }} className="px-3 py-2 bg-gray-900 text-white rounded">Copy Link</button>
            </div>
            <div className="mt-4 text-right">
              <button onClick={() => setShowReceive(false)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};