import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, Clock, History, Receipt, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DonationRecord, DonationType } from '../../types';
import { 
  getWalletBalance, 
  listCampaigns, 
  debitWallet, 
  recordDonation, 
  getDonationHistory,
  buildReceiptText,
  computeNextRun,
  donationDescription,
  Campaign
} from '../../services/wallet';

type Step = 'type' | 'details' | 'confirm' | 'success';

export const Donations: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const userName = user?.fullName || 'Guest User';

  const campaigns = useMemo(() => listCampaigns(), []);
  const [wallet, setWallet] = useState(getWalletBalance(userId));
  const [activeTab, setActiveTab] = useState<'donate' | 'history'>('donate');
  const [step, setStep] = useState<Step>('type');

  const [donationType, setDonationType] = useState<DonationType>('general');
  const [campaignId, setCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [recurring, setRecurring] = useState<false | 'weekly' | 'monthly'>(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDonation, setLastDonation] = useState<DonationRecord | null>(null);

  const [historyRefresh, setHistoryRefresh] = useState(0);
  const history = getDonationHistory(userId);

  useEffect(() => {
    // Prefill donate form with dummy data for Member POV
    if (user?.role === 'member') {
      try {
        if (!amount) setAmount('25');
        if (!note) setNote('Community support');
        if (campaigns.length > 0 && !campaignId) setCampaignId(campaigns[0].id);
        setDonationType('campaign');
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  useEffect(() => {
    // Seed dummy history for Member POV if empty
    if (user?.role === 'member' && history.length === 0) {
      const currency = wallet.currency;
      const pick = (arr: Campaign[]) => (arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : undefined);
      const c1 = pick(campaigns);
      const now = Date.now();
      const samples: DonationRecord[] = [
        {
          id: `DON-SEED-${now - 1}`,
          donorUserId: userId,
          donorUserName: userName,
          amount: 25.0,
          currency,
          donationType: 'general',
          transactionId: `TX-${now - 1}`,
          createdAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString(),
        },
        {
          id: `DON-SEED-${now - 2}`,
          donorUserId: userId,
          donorUserName: userName,
          amount: 50.0,
          currency,
          donationType: 'campaign',
          campaignId: c1?.id,
          campaignName: c1?.name,
          transactionId: `TX-${now - 2}`,
          createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
        },
        {
          id: `DON-SEED-${now - 3}`,
          donorUserId: userId,
          donorUserName: userName,
          amount: 10.5,
          currency,
          donationType: 'custom',
          note: 'Support youth program',
          transactionId: `TX-${now - 3}`,
          createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
      ];
      samples.forEach(s => recordDonation({ ...s, userId } as any));
      setHistoryRefresh(x => x + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, user?.role]);

  const selectedCampaign: Campaign | undefined = campaigns.find(c => c.id === campaignId);

  const parsedAmount = parseFloat(amount || '0');
  const canProceedDetails = parsedAmount > 0 && (!isNaN(parsedAmount));

  const handleProceedFromType = () => {
    setStep('details');
  };

  const handleConfirm = async () => {
    try {
      setError(null);
      setProcessing(true);
      if (!canProceedDetails) throw new Error('Enter a valid amount');

      const desc = donationDescription(
        donationType,
        selectedCampaign?.name,
        note
      );

      if (wallet.balance < parsedAmount) {
        throw new Error('Insufficient wallet balance');
      }

      const { transactionId, newBalance } = debitWallet(userId, parsedAmount, desc);
      setWallet(prev => ({ ...prev, balance: newBalance }));

      const record: DonationRecord = {
        id: `DON-${Date.now()}`,
        donorUserId: userId,
        donorUserName: userName,
        amount: parsedAmount,
        currency: wallet.currency,
        donationType,
        campaignId: donationType === 'campaign' ? selectedCampaign?.id : undefined,
        campaignName: donationType === 'campaign' ? selectedCampaign?.name : undefined,
        note: donationType === 'custom' ? note : undefined,
        transactionId,
        createdAt: new Date().toISOString(),
        recurring: recurring ? { cadence: recurring, nextRunAt: computeNextRun(recurring) } : undefined,
      };
      recordDonation({ ...record, userId });
      setLastDonation(record);
      setStep('success');

      // Simulated notification/email side-effects
      try {
        const { addNotification } = await import('../../services/notifications');
        addNotification({
          title: 'Donation Successful',
          message: `You donated ${wallet.currency} ${parsedAmount.toFixed(2)}${selectedCampaign?.name ? ` to ${selectedCampaign.name}` : ''}. TX: ${transactionId}`,
          type: 'transaction',
          priority: 'medium',
          actionUrl: '/dashboard',
        });
        // eslint-disable-next-line no-alert
        alert(`A receipt has been generated. Transaction ID: ${transactionId}`);
      } catch {}
    } catch (e: any) {
      setError(e?.message || 'Failed to process donation');
    } finally {
      setProcessing(false);
    }
  };

  const downloadReceipt = (record: DonationRecord) => {
    const content = buildReceiptText(record);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-receipt-${record.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-600">Support your community and causes</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-600">Wallet Balance:</span>
          <span className="text-sm font-semibold text-gray-900">{wallet.currency} {wallet.balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('donate')}
            className={`px-1 pb-2 border-b-2 text-sm ${activeTab === 'donate' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
          >
            Donate
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-1 pb-2 border-b-2 text-sm ${activeTab === 'history' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
          >
            Donation History
          </button>
        </nav>
      </div>

      {activeTab === 'donate' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-6">
            <div className={`flex-1 h-1 rounded ${step === 'type' || step === 'details' || step === 'confirm' || step === 'success' ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1 mx-2 rounded ${step === 'details' || step === 'confirm' || step === 'success' ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1 mx-2 rounded ${step === 'confirm' || step === 'success' ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1 rounded ${step === 'success' ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
          )}

          {step === 'type' && (
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setDonationType('general')}
                className={`p-4 border rounded-lg text-left ${donationType === 'general' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">General Group Donation</h3>
                <p className="text-sm text-gray-600">Support group-wide initiatives</p>
              </button>
              <button
                onClick={() => setDonationType('campaign')}
                className={`p-4 border rounded-lg text-left ${donationType === 'campaign' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Campaigns / Causes</h3>
                <p className="text-sm text-gray-600">Choose a specific campaign</p>
              </button>
              <button
                onClick={() => setDonationType('custom')}
                className={`p-4 border rounded-lg text-left ${donationType === 'custom' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Custom Donation</h3>
                <p className="text-sm text-gray-600">Enter amount and description</p>
              </button>
              <div className="md:col-span-3 flex justify-end">
                <button onClick={handleProceedFromType} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Continue</button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-4">
              {donationType === 'campaign' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Campaign</label>
                  <select value={campaignId} onChange={e => setCampaignId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm">
                    {campaigns.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({wallet.currency})</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recurring</label>
                  <div className="flex items-center space-x-3">
                    <label className="inline-flex items-center space-x-1 text-sm">
                      <input type="radio" name="rec" checked={recurring === false} onChange={() => setRecurring(false)} />
                      <span>One-time</span>
                    </label>
                    <label className="inline-flex items-center space-x-1 text-sm">
                      <input type="radio" name="rec" checked={recurring === 'weekly'} onChange={() => setRecurring('weekly')} />
                      <span>Weekly</span>
                    </label>
                    <label className="inline-flex items-center space-x-1 text-sm">
                      <input type="radio" name="rec" checked={recurring === 'monthly'} onChange={() => setRecurring('monthly')} />
                      <span>Monthly</span>
                    </label>
                  </div>
                </div>
              </div>
              {donationType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input value={note} onChange={e => setNote(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm" placeholder="What is this for?" />
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Available balance: {wallet.currency} {wallet.balance.toFixed(2)}</p>
                <button
                  disabled={!canProceedDetails}
                  onClick={() => setStep('confirm')}
                  className={`px-4 py-2 rounded-lg text-sm ${canProceedDetails ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                  Review Donation
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Confirm Donation</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Type: <span className="font-medium capitalize">{donationType}</span></li>
                  {donationType === 'campaign' && (
                    <li>Campaign: <span className="font-medium">{selectedCampaign?.name}</span></li>
                  )}
                  {donationType === 'custom' && note && (
                    <li>Note: <span className="font-medium">{note}</span></li>
                  )}
                  <li>Amount: <span className="font-medium">{wallet.currency} {parsedAmount.toFixed(2)}</span></li>
                  <li>Payment Method: <span className="font-medium">SureBanker Wallet</span></li>
                  <li>Balance After: <span className="font-medium">{wallet.currency} {(wallet.balance - parsedAmount).toFixed(2)}</span></li>
                  {recurring && (
                    <li className="flex items-center space-x-1 text-blue-700"><Clock className="w-4 h-4" />
                      <span>Recurring: {recurring} (next run {new Date(computeNextRun(recurring)).toLocaleDateString()})</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button onClick={() => setStep('details')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Back</button>
                <button onClick={handleConfirm} disabled={processing} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                  {processing ? 'Processing...' : 'Confirm Donation'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && lastDonation && (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Receipt className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Donation Successful</h3>
              <p className="text-sm text-gray-600 mb-4">Transaction ID: <span className="font-mono">{lastDonation.transactionId}</span></p>
              <div className="mb-4 text-sm text-gray-700">
                You donated {wallet.currency} {lastDonation.amount.toFixed(2)} ({lastDonation.donationType}{lastDonation.campaignName ? ` - ${lastDonation.campaignName}` : ''}).
              </div>
              <div className="flex items-center justify-center space-x-3">
                <button onClick={() => downloadReceipt(lastDonation)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm inline-flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Receipt</span>
                </button>
                <button onClick={() => { setStep('type'); setAmount(''); setNote(''); setDonationType('general'); setRecurring(false); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Make Another Donation</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2"><History className="w-5 h-5 text-gray-700" /><span>Donation History</span></h3>
            <p className="text-sm text-gray-600">{history.length} records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Type</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Campaign</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">TX ID</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 capitalize">{r.donationType}{r.recurring ? ` (${r.recurring.cadence})` : ''}</td>
                    <td className="px-4 py-2">{r.campaignName || '-'}</td>
                    <td className="px-4 py-2">{r.currency} {r.amount.toFixed(2)}</td>
                    <td className="px-4 py-2 font-mono text-xs">{r.transactionId}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => downloadReceipt(r)} className="px-3 py-1 text-xs bg-blue-600 text-white rounded inline-flex items-center space-x-1">
                        <Download className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>No donations yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

