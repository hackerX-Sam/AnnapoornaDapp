import { useEffect, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Heart, TrendingUp, Users, DollarSign, ArrowRight } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { MODULE_ADDRESS, formatAPT } from '../config/constants';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { account } = useWallet();
  const { getPoolBalance, getTotalDonations, getTotalRedemptions, getDonorStats } = useContract();
  const [stats, setStats] = useState({
    balance: 0,
    totalDonations: 0,
    totalRedemptions: 0,
    donorCount: 0,
    userDonated: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [account]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [balance, donations, redemptions] = await Promise.all([
        getPoolBalance(MODULE_ADDRESS),
        getTotalDonations(MODULE_ADDRESS),
        getTotalRedemptions(MODULE_ADDRESS),
      ]);

      let userDonated = 0;
      if (account) {
        const donorStats = await getDonorStats(account.address);
        userDonated = donorStats.totalDonated;
      }

      setStats({
        balance,
        totalDonations: donations,
        totalRedemptions: redemptions,
        donorCount: 0,
        userDonated,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-100 p-4 rounded-full">
              <Heart className="w-16 h-16 text-emerald-600 fill-emerald-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Annapoorna
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A blockchain-powered donation platform built on Aptos. Help feed the world, one meal at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Current Balance</h3>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : `${formatAPT(stats.balance)} APT`}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Donations</h3>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : `${formatAPT(stats.totalDonations)} APT`}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Redemptions</h3>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : `${formatAPT(stats.totalRedemptions)} APT`}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Your Donations</h3>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : account ? `${formatAPT(stats.userDonated)} APT` : 'Connect Wallet'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Make a Donation</h2>
            <p className="text-gray-600 mb-6">
              Your contribution helps provide meals to those in need. Every donation is recorded transparently on the Aptos blockchain.
            </p>
            <button
              onClick={() => onNavigate('donate')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Donate Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-md p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 mt-1">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Connect Your Wallet</h3>
                  <p className="text-emerald-50 text-sm">Link your Petra wallet to get started</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 mt-1">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Make Your Donation</h3>
                  <p className="text-emerald-50 text-sm">Choose an amount and add a message</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 mt-1">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Track Your Impact</h3>
                  <p className="text-emerald-50 text-sm">View all transactions on the blockchain</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-8 border border-emerald-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Blockchain?</h2>
            <p className="text-gray-700 max-w-3xl mx-auto mb-6">
              Transparency, security, and trust. Every transaction is recorded on the Aptos blockchain, ensuring complete transparency and accountability. Track where your donations go and see the real-time impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-emerald-200">
                <span className="font-semibold text-emerald-700">Transparent</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-emerald-200">
                <span className="font-semibold text-emerald-700">Secure</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-emerald-200">
                <span className="font-semibold text-emerald-700">Immutable</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-emerald-200">
                <span className="font-semibold text-emerald-700">Fast</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
