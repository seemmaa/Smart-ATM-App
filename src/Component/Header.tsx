import React, { useState } from "react";
import { ChevronDown, ChevronUp, Clock, User } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  date: string;
  userId: string;
}

interface HeaderProps {
  username: string;
  profileImage: string;
  transactions: Transaction[];
}

export default function Header({
  username,
  profileImage,
  transactions,
}: HeaderProps) {
  const [showHistory, setShowHistory] = useState(false);
  
  // Get only the 3 most recent transactions
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        {/* Main Header */}
        <div className="flex items-center justify-between">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            
            <div>
             
              <h2 className="text-xl font-bold text-gray-800">{username}</h2>
            </div>
          </div>

          {/* Transaction History Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r border border-gray-300 text-gray-700 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Clock className="w-4 h-4" />
            <span>{showHistory ? "Hide History" : "Show History"}</span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Transaction History Dropdown */}
        {showHistory && (
          <div className="mt-6 animate-slide-down">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  <span>Recent Transactions</span>
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Last 3 transactions
                </span>
              </div>

              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50/80 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "Deposit" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-red-100 text-red-600"
                        }`}>
                          {transaction.type === "Deposit" ? (
                            <span className="font-bold">+</span>
                          ) : (
                            <span className="font-bold">-</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 capitalize">
                            {transaction.type.toLowerCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('en-IL', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          transaction.type === "Deposit" 
                            ? "text-green-600" 
                            : "text-red-600"
                        }`}>
                          {transaction.type === "Deposit" ? "+" : "-"} 
                          {transaction.amount.toLocaleString('en-IL')} {transaction.currency}
                        </p>
                        <p className={`text-xs font-medium px-2 py-1 rounded-full ${
                          transaction.type === "Deposit" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {transaction.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No recent transactions</p>
                  <p className="text-sm text-gray-400 mt-1">Your transactions will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}