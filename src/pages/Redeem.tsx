import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Gift, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { toOctas } from '../config/constants';

export function Redeem() {
  const { account } = useWallet();
  const { redeem } = useContract();
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleRedeem = async (e: React.FormEvent) => {
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

    if (!beneficiary.startsWith('0x') || beneficiary.length < 10) {
      setStatus({ type: 'error', message: 'Please enter a valid Aptos address' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const octas = toOctas(amountNum);
      await redeem(beneficiary, octas, purpose);
      setStatus({ type: 'success', message: `Successfully redeemed ${amount} APT!` });
      setBeneficiary('');
      setAmount('');
      setPurpose('');
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Failed to process redemption' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-100 p-4 rounded-full">
              <Gift className="w-12 h-12 text-teal-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Redeem Funds</h1>
          <p className="text-lg text-gray-600">
            Distribute funds to beneficiaries for meals and food programs.
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

          <form onSubmit={handleRedeem}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Beneficiary Address
              </label>
              <input
                type="text"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the Aptos wallet address of the beneficiary
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount (APT)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <span className="absolute right-4 top-3.5 text-gray-500 font-medium">APT</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purpose
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Describe the purpose of this redemption..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                required
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{purpose.length}/200 characters</p>
            </div>

            {!account && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Please connect your wallet to redeem funds
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !account}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  <span>Redeem {amount ? `${amount} APT` : ''}</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Redemption Guidelines</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Only authorized administrators can redeem funds</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>All redemptions are recorded transparently on the blockchain</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Verify the beneficiary address before submitting</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Provide a clear purpose for audit and transparency</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
