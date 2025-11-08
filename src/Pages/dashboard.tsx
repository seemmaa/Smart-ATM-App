import { useEffect, useState } from 'react';
import { useAuthStore } from '../Context/authSContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Component/Header';
import {
  BanknoteArrowUp,
  BanknoteArrowDown,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import Confetti from 'react-confetti';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  date: string;
  userId: string;
}

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [birthdayModal, setBirthdayModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate
  const summary = {
    deposits: transactions
      .filter((tx) => tx.type.toLowerCase() === 'deposit')
      .reduce((sum, tx) => sum + tx.amount, 0),
    withdrawals: transactions
      .filter((tx) => tx.type.toLowerCase() === 'withdraw')
      .reduce((sum, tx) => sum + tx.amount, 0),
    balance: balance,
  };

  const fetchUserData = async () => {
    console.log(user);
    if (!user) return;
    try {
      setLoading(true);

      const [userRes, txRes] = await Promise.all([
        fetch(`https://69060c47ee3d0d14c134982d.mockapi.io/users/${user.id}`),
        fetch(`https://69060c47ee3d0d14c134982d.mockapi.io/users/${user.id}/transactions`),
      ]);

      if (txRes.status === 404) {
        setTransactions([]);
      }

      if (!userRes.ok) throw new Error('Failed to fetch data');

      const userData = await userRes.json();
      const today = new Date();
      
      
      const todayKey = `birthdayShown_${user.id}_${today.toDateString()}`;
      const birthDate = userData.birthday ? new Date(userData.birthday) : null;
      
      console.log('Birth date:', birthDate);
      console.log('Today:', today);
      console.log('Birthday shown key:', localStorage.getItem(todayKey));

      
      if (
        birthDate instanceof Date &&
        !isNaN(birthDate.getTime()) &&
        birthDate.getDate() === today.getDate() &&
        birthDate.getMonth() === today.getMonth() &&
        !localStorage.getItem(todayKey)
      ) {
        console.log('Show birthday modal for user:', user.id);
        setTimeout(() => {
          setBirthdayModal(true);
          setShowConfetti(true);
        }, 1000);
       
        localStorage.setItem(todayKey, 'true');
      }
      
      const transactionsData = await txRes.json();

      setBalance(userData.balance);
      console.log(transactionsData);
      setTransactions(
        transactionsData
          .sort(
            (a: Transaction, b: Transaction) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5)
      );

    } catch (err) {
      console.error(err);
      // setError("⚠️ Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const resetBalance = async () => {
    if (!user) return;

    try {
      setLoading(true);

      await fetch(`https://69060c47ee3d0d14c134982d.mockapi.io/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: 0 }),
      });

      await fetchUserData();
    } catch (err) {
      console.error(err);
      alert('⚠️ Failed to reset balance or transactions');
    } finally {
      setShowConfirm(false);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br ">
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={500}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      <Header
        username={user.user_name}
        profileImage={user.profile_img}
        transactions={transactions}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Deposits Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Total Deposits</p>
                <p className="text-2xl font-bold text-gray-800">
                  {summary.deposits.toLocaleString('en-IL')} ILS
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-50">
              <p className="text-xs text-green-500">All-time deposit transactions</p>
            </div>
          </div>

          {/* Total Withdrawals Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Total Withdrawals</p>
                <p className="text-2xl font-bold text-gray-800">
                  {summary.withdrawals.toLocaleString('en-IL')} ILS
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-red-50">
              <p className="text-xs text-red-500">All-time withdrawal transactions</p>
            </div>
          </div>

          {/* Current Balance Card */}
          <div className="bg-gradient-to-r  rounded-2xl shadow-lg p-6 border border-blue-100 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-500 mb-1">Current Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    summary.balance > 0 ? 'text-green-500' : 'text-red-200'
                  }`}
                >
                  {summary.balance.toLocaleString('en-IL')} ILS
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-50">
              <p className="text-xs text-blue-500">Available for transactions</p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Banking Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Deposit Button */}
            <button
              onClick={() => navigate('/deposit')}
              disabled={loading}
              className="group bg-gradient-to-r border border-green-100 text-green-500 p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-green-100 rounded-full  transition-colors">
                  <BanknoteArrowUp className="w-8 h-8" />
                </div>
                <span className="text-xl font-semibold">Deposit</span>
                <p className="text-green-500 text-sm">Add funds to your account</p>
              </div>
            </button>

            {/* Withdraw Button */}
            <button
              onClick={() => navigate('/withdraw')}
              disabled={loading}
              className="group bg-gradient-to-r border border-red-100 text-red-500  p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-red-100 rounded-full  transition-colors">
                  <BanknoteArrowDown className="w-8 h-8" />
                </div>
                <span className="text-xl  font-semibold">Withdraw</span>
                <p className="text-red-500 text-sm">Withdraw funds from account</p>
              </div>
            </button>

            {/* Reset Button */}
            <button
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              className="group bg-gradient-to-r border border-amber-100 text-amber-500 p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-amber-100 rounded-full transition-colors">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <span className="text-xl font-semibold">Reset Account</span>
                <p className="text-amber-500 text-sm">Clear balance</p>
              </div>
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform animate-scale-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Reset Account?</h3>
                <p className="text-gray-600 mb-6">
                  This will clear your balance This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={resetBalance}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Resetting...' : 'Yes, Reset'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Birthday Modal */}
        {birthdayModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-yellow-400 to-pink-500 rounded-2xl shadow-2xl p-8 max-w-md w-full transform animate-bounce-in">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Happy Birthday, {user.first_name}!</h3>
                <p className="text-yellow-100 mb-6">
                  Wishing you a fantastic year ahead filled with prosperity and success!
                </p>
                <button
                  onClick={() => setBirthdayModal(false)}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30"
                >
                  Thank You! 🎂
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}