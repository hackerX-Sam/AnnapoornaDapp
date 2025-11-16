import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Shield, DollarSign, TrendingUp, TrendingDown, Users, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { MODULE_ADDRESS, formatAPT } from '../config/constants';

export function Admin() {
  const { account } = useWallet();
  const { getPoolBalance, getTotalDonations, getTotalRedemptions, isAdmin, initialize } = useContract();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [stats, setStats] = useState({
    balance: 0,
    totalDonations: 0,
    totalRedemptions: 0,
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [account]);

  const checkAdminStatus = async () => {
    if (!account) {
      setIsAuthorized(false);
      setChecking(false);
      return;
    }

    setChecking(true);
    try {
      const admin = await isAdmin(MODULE_ADDRESS, account.address);
      setIsAuthorized(admin);
      if (admin) {
        await loadStats();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAuthorized(false);
    } finally {
      setChecking(false);
    }
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const [balance, donations, redemptions] = await Promise.all([
        getPoolBalance(MODULE_ADDRESS),
        getTotalDonations(MODULE_ADDRESS),
        getTotalRedemptions(MODULE_ADDRESS),
      ]);

      setStats({
        balance,
        totalDonations: donations,
        totalRedemptions: redemptions,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    if (!account) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    setInitializing(true);
    setStatus(null);

    try {
      await initialize();
      setStatus({ type: 'success', message: 'Donation pool initialized successfully!' });
      await checkAdminStatus();
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Failed to initialize pool' });
    } finally {
      setInitializing(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md border border-gray-200 text-center">
          <div className="bg-yellow-100 p-4 rounded-full inline-block mb-4">
            <Shield className="w-12 h-12 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to access the admin dashboard</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Initialize Donation Pool</h2>
              <p className="text-gray-600 mb-6">
                You need to initialize the donation pool to become an admin. This is a one-time setup.
              </p>
              <button
                onClick={handleInitialize}
                disabled={initializing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center space-x-2 mx-auto"
              >
                {initializing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Initializing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Initialize Pool</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">
            Monitor and manage the Annapoorna donation pool
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                CURRENT
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Available Balance</h3>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : `${formatAPT(stats.balance)} APT`}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                TOTAL IN
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Donations</h3>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : `${formatAPT(stats.totalDonations)} APT`}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                TOTAL OUT
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Redemptions</h3>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : `${formatAPT(stats.totalRedemptions)} APT`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Admin Address</span>
                <span className="text-gray-900 font-mono text-sm">
                  {account.address.slice(0, 8)}...{account.address.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Pool Address</span>
                <span className="text-gray-900 font-mono text-sm">
                  {MODULE_ADDRESS.slice(0, 8)}...{MODULE_ADDRESS.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Network</span>
                <span className="text-gray-900 font-semibold">Aptos Testnet</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-md p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Admin Actions</h2>
            <p className="text-blue-50 mb-6">
              As an admin, you can process redemptions for beneficiaries. All actions are recorded transparently on the blockchain.
            </p>
            <div className="space-y-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm font-semibold mb-1">Monitor Donations</p>
                <p className="text-xs text-blue-50">Track incoming donations in real-time</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm font-semibold mb-1">Process Redemptions</p>
                <p className="text-xs text-blue-50">Distribute funds to beneficiaries</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm font-semibold mb-1">Maintain Transparency</p>
                <p className="text-xs text-blue-50">All transactions are publicly verifiable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
