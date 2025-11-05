import React, { useState } from "react";
import { useAuthStore } from "../Context/authSContext";
import { useNavigate } from "react-router-dom";
import { 
  Trash2, 
  User, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  X,
  Calendar,
  Receipt
} from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
}

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast 
  const showToast = (type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, type, message };
    setToasts(prev => [...prev, newToast]);
    
   
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  //get transaction count
  const [count, setCount] = useState<number | null>(null);
  
  React.useEffect(() => {
    const fetchTransactionCount = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `https://69060c47ee3d0d14c134982d.mockapi.io/users/${user.id}/transactions`
        );
        const data = await response.json();
        console.log(data);
        if(data=='Not Found'){
          setCount(0);
          return;
        }
        setCount(data.length);
        
        console.log("Transaction count:", data);
      } catch (error) {
        console.error("Failed to fetch transaction count:", error);
      }
    };

    fetchTransactionCount();
  }, [user]);

  const resetAccountData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Reset balance 
      await fetch(`https://69060c47ee3d0d14c134982d.mockapi.io/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: 0 }),
      });

      const transactionsResponse = await fetch(
        `https://69060c47ee3d0d14c134982d.mockapi.io/users/${user.id}/transactions`
      );
      
      if (transactionsResponse.ok) {
        const transactions = await transactionsResponse.json();
      
        // Delete 
        for (const tx of transactions) {
          await fetch(
            `https://69060c47ee3d0d14c134982d.mockapi.io/users/${user.id}/transactions/${tx.id}`,
            { method: "DELETE" }
          );
        }
      }

      showToast('success', 'Account has been reset successfully!');
      setShowResetConfirm(false);
      
     

    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to reset account data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate 
  const totalTransactions = count || 0; 

  if (!user) {
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
          <div className="flex items-center space-x-4">
           
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <User className="w-6 h-6 text-indigo-600" />
                Settings
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 👤 Profile Overview Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col items-center text-center gap-4">
            {/* Profile Image */}
            <div className="relative">
              <img 
                src={user.profile_img} 
                alt="Profile" 
                className="w-24 h-24 rounded-full shadow-lg border-4 border-white object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            
            {/* User Info */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-500">@{user.user_name}</p>
            </div>

            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 gap-6 mt-4 w-full max-w-sm">
              {/* Balance */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl text-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Receipt className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600">Balance</p>
                <p className="font-bold text-gray-800">
                  {user.balance?.toLocaleString('en-IL') || 0} ILS
                </p>
              </div>

              {/* Total Transactions */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Receipt className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="font-bold text-gray-800">{totalTransactions}</p>
              </div>
            </div>

            {/* Birthday */}
            {user.birthday && (
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mt-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Birthday: {new Date(user.birthday).toLocaleDateString('en-IL')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 1. Account Reset Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200">
          <div className="flex items-center space-x-3 mb-6">
            <RotateCcw className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-gray-800">Account Reset</h2>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-bold text-red-800 mb-2">Reset Your Account</h3>
                <p className="text-red-600 text-sm">
                  This will permanently reset your balance to zero and delete all transaction history.
                  This action cannot be undone.
                </p>
              </div>
              
              <button
                onClick={() => setShowResetConfirm(true)}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Reset Account?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reset your balance to <strong>0 ILS</strong> and clear all transactions?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={resetAccountData}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Yes, Reset</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center space-x-3 p-4 rounded-xl shadow-lg border-l-4 min-w-80 transform animate-slide-in ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-400 text-green-800'
                : toast.type === 'error'
                ? 'bg-red-50 border-red-400 text-red-800'
                : 'bg-yellow-50 border-yellow-400 text-yellow-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            
            <p className="flex-1 font-medium">{toast.message}</p>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}