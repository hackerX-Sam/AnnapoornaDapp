import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Heart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { toOctas } from '../config/constants';

export function Donate() {
  const { account } = useWallet();
  const { donate } = useContract();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const presetAmounts = [1, 5, 10, 25, 50, 100];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setStatus({ type: 'error', message: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const octas = toOctas(amountNum);
      await donate(octas, message);
      setStatus({ type: 'success', message: `Successfully donated ${amount} APT!` });
      setAmount('');
      setMessage('');
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Failed to process donation' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-4 rounded-full">
              <Heart className="w-12 h-12 text-emerald-600 fill-emerald-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Make a Donation</h1>
          <p className="text-lg text-gray-600">
            Help us feed those in need. Your contribution makes a real difference.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          {status && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
                status.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  status.type === 'success' ? 'text-emerald-800' : 'text-red-800'
                }`}
              >
                {status.message}
              </p>
            </div>
          )}

          <form onSubmit={handleDonate}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Amount (APT)
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      amount === preset.toString()
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset} APT
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Or enter custom amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
                <span className="absolute right-4 top-3.5 text-gray-500 font-medium">APT</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message with your donation..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{message.length}/200 characters</p>
            </div>

            {!account && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Please connect your wallet to make a donation
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !account}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  <span>Donate {amount ? `${amount} APT` : ''}</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 border border-emerald-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Your Impact</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-emerald-600 mr-2">•</span>
              <span>1 APT can provide 5 meals to families in need</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-2">•</span>
              <span>All donations are recorded transparently on the blockchain</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-2">•</span>
              <span>100% of your donation goes directly to feeding programs</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
