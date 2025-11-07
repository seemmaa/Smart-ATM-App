import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../Context/authSContext';
import {
  ArrowLeft,
  Filter,
  Download,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  date: string;
  userId: string;
}

export default function History() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5); // Show 5 transactions per page

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://69060c47ee3d0d14c134982d.mockapi.io/users/${user.id}/transactions`
      );

      if (response.ok) {
        const data = await response.json();
        //  most recent first
        const sortedTransactions = data.sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(sortedTransactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = filter === 'all' || transaction.type.toLowerCase() === filter;
    const matchesSearch =
      transaction.amount.toString().includes(searchTerm) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && (searchTerm === '' || matchesSearch);
  });

  // Calculate
  const stats = {
    totalDeposits: transactions
      .filter((t) => t.type === 'Deposit')
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions
      .filter((t) => t.type === 'Withdraw')
      .reduce((sum, t) => sum + t.amount, 0),
    transactionCount: transactions.length,
  };

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              ></button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 rounded-md">
                    <ArrowLeftRight className="w-6 h-6 text-indigo-600" />
                  </div>
                  Transaction History
                </h1>
                <p className="text-gray-600">Complete overview of all your transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-800">{stats.transactionCount}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deposits</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalDeposits.toLocaleString('en-IL')} ILS
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalWithdrawals.toLocaleString('en-IL')} ILS
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Flow</p>
                <p
                  className={`text-2xl font-bold ${
                    stats.totalDeposits - stats.totalWithdrawals >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {(stats.totalDeposits - stats.totalWithdrawals).toLocaleString('en-IL')} ILS
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  stats.totalDeposits - stats.totalWithdrawals >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {stats.totalDeposits - stats.totalWithdrawals >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Transactions
              </button>
              <button
                onClick={() => setFilter('deposit')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  filter === 'deposit'
                    ? 'bg-green-500! text-white!'
                    : 'bg-gray-100! text-gray-600! hover:bg-gray-200'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setFilter('withdraw')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  filter === 'withdraw'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Withdrawals
              </button>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {currentTransactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {currentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'Deposit'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.type === 'Deposit' ? (
                          <TrendingUp className="w-6 h-6" />
                        ) : (
                          <TrendingDown className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 capitalize text-lg">
                          {transaction.type}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {new Date(transaction.date).toLocaleDateString('en-IL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-xl font-bold ${
                          transaction.type === 'Deposit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'Deposit' ? '+' : '-'}
                        {transaction.amount.toLocaleString('en-IL')} {transaction.currency}
                      </p>
                      <p
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          transaction.type === 'Deposit'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {transaction.type}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No transactions found</h3>
              <p className="text-gray-500">
                {transactions.length === 0
                  ? "You haven't made any transactions yet."
                  : 'No transactions match your current filters.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredTransactions.length > transactionsPerPage && (
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstTransaction + 1} to{' '}
              {Math.min(indexOfLastTransaction, filteredTransactions.length)} of{' '}
              {filteredTransactions.length} transactions
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === number
                        ? 'bg-indigo-500 text-white'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
