import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { History as HistoryIcon, TrendingUp, TrendingDown, Clock, Filter } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { formatAPT, MODULE_ADDRESS } from '../config/constants';

interface Transaction {
  type: 'donation' | 'redemption';
  address: string;
  amount: number;
  message: string;
  timestamp: number;
  hash: string;
}

export function History() {
  const { account } = useWallet();
  const { aptos } = useContract();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'donation' | 'redemption'>('all');

  useEffect(() => {
    loadTransactions();
  }, [account]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const mockTransactions: Transaction[] = [
        {
          type: 'donation',
          address: '0x1234...5678',
          amount: 500000000,
          message: 'Help feed families in need',
          timestamp: Date.now() - 3600000,
          hash: '0xabc123...',
        },
        {
          type: 'donation',
          address: '0x8765...4321',
          amount: 1000000000,
          message: 'Supporting the cause',
          timestamp: Date.now() - 7200000,
          hash: '0xdef456...',
        },
        {
          type: 'redemption',
          address: '0x9999...1111',
          amount: 300000000,
          message: 'Food distribution at Community Center A',
          timestamp: Date.now() - 10800000,
          hash: '0xghi789...',
        },
        {
          type: 'donation',
          address: '0x2222...3333',
          amount: 250000000,
          message: 'Every bit helps!',
          timestamp: Date.now() - 14400000,
          hash: '0xjkl012...',
        },
        {
          type: 'redemption',
          address: '0x4444...5555',
          amount: 500000000,
          message: 'Monthly meal program',
          timestamp: Date.now() - 18000000,
          hash: '0xmno345...',
        },
      ];

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <HistoryIcon className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p className="text-lg text-gray-600">
            View all donations and redemptions recorded on the blockchain
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter Transactions
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('donation')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'donation'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Donations
              </button>
              <button
                onClick={() => setFilter('redemption')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'redemption'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Redemptions
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`p-3 rounded-full ${
                          tx.type === 'donation'
                            ? 'bg-emerald-100'
                            : 'bg-orange-100'
                        }`}
                      >
                        {tx.type === 'donation' ? (
                          <TrendingUp className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              tx.type === 'donation'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {tx.type === 'donation' ? 'Donation' : 'Redemption'}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimestamp(tx.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium mb-1">{tx.message}</p>
                        <p className="text-sm text-gray-600">
                          {tx.type === 'donation' ? 'From' : 'To'}: {tx.address}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          Tx: {tx.hash}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xl font-bold ${
                          tx.type === 'donation'
                            ? 'text-emerald-600'
                            : 'text-orange-600'
                        }`}
                      >
                        {tx.type === 'donation' ? '+' : '-'}
                        {formatAPT(tx.amount)} APT
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Blockchain Transparency</h3>
          <p className="text-sm text-gray-700 mb-4">
            All transactions are permanently recorded on the Aptos blockchain, ensuring complete
            transparency and immutability. You can verify any transaction using its hash on the
            Aptos Explorer.
          </p>
          <a
            href="https://explorer.aptoslabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            View on Aptos Explorer →
          </a>
        </div>
      </div>
    </div>
  );
}
