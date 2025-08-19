"use client";
import React, { useState, useMemo } from "react";
import Layout from "../components/core/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { 
  Wallet,
  CurrencyDollar,
  ArrowUp,
  ArrowDown,
  Copy,
  Eye,
  EyeSlash,
  Plus,
  Minus,
  Clock,
  CheckCircle,
  X,
  Bank,
  QrCode,
  CaretDown,
  TrendUp,
  ArrowsLeftRight,
  Warning
} from "@phosphor-icons/react";

// Transaction interface
interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'conversion' | 'trade_payment' | 'trade_received';
  amount: string;
  currency: 'NGN' | 'USDC';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  date: string;
  fee?: string;
  reference?: string;
  hash?: string;
}

// Wallet Balance Card Component
const WalletBalanceCard = ({ 
  currency, 
  balance, 
  usdValue, 
  change, 
  isHidden, 
  onToggleVisibility,
  onDeposit,
  onWithdraw 
}: {
  currency: string;
  balance: string;
  usdValue?: string;
  change?: string;
  isHidden: boolean;
  onToggleVisibility: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="bg-gradient-to-r from-[#8b61c2] to-[#7952a8] text-white border-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-xl">
            {currency === 'USDC' ? <CurrencyDollar size={24} /> : <Bank size={24} />}
          </div>
          <div>
            <p className="text-sm opacity-75">{currency} Balance</p>
            <div className="flex items-center space-x-2">
              {isHidden ? (
                <p className="text-2xl font-bold">****</p>
              ) : (
                <p className="text-2xl font-bold">{balance}</p>
              )}
              <button onClick={onToggleVisibility} className="opacity-75 hover:opacity-100">
                {isHidden ? <Eye size={16} /> : <EyeSlash size={16} />}
              </button>
            </div>
            {usdValue && !isHidden && (
              <p className="text-sm opacity-75">≈ {usdValue}</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          {change && (
            <div className="flex items-center space-x-1 mb-2">
              <TrendUp size={16} className="text-green-300" />
              <span className="text-sm text-green-300">{change}</span>
            </div>
          )}
          <div className="flex space-x-2">
            <Button
              onClick={onDeposit}
              size="small"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0"
            >
              <Plus size={16} className="mr-1" />
              Deposit
            </Button>
            <Button
              onClick={onWithdraw}
              size="small"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0"
            >
              <Minus size={16} className="mr-1" />
              Withdraw
            </Button>
          </div>
        </div>
      </div>
      
      {currency === 'USDC' && (
        <div className="bg-white bg-opacity-10 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-75">Wallet Address</p>
              <p className="font-mono text-sm">0x1234...5678</p>
            </div>
            <button 
              onClick={() => copyToClipboard('0x1234567890abcdef1234567890abcdef12345678')}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

// Transaction Item Component
const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return <ArrowDown size={20} className="text-green-600" />;
      case 'withdrawal':
        return <ArrowUp size={20} className="text-red-600" />;
      case 'conversion':
        return <ArrowsLeftRight size={20} className="text-[#8b61c2]" />;
      case 'trade_payment':
        return <ArrowUp size={20} className="text-blue-600" />;
      case 'trade_received':
        return <ArrowDown size={20} className="text-green-600" />;
      default:
        return <CurrencyDollar size={20} className="text-gray-600" />;
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'failed':
        return <X size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getAmountColor = () => {
    if (transaction.type === 'deposit' || transaction.type === 'trade_received') {
      return 'text-green-600';
    } else if (transaction.type === 'withdrawal' || transaction.type === 'trade_payment') {
      return 'text-red-600';
    }
    return 'text-gray-900';
  };

  const getAmountPrefix = () => {
    if (transaction.type === 'deposit' || transaction.type === 'trade_received') {
      return '+';
    } else if (transaction.type === 'withdrawal' || transaction.type === 'trade_payment') {
      return '-';
    }
    return '';
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-gray-100 rounded-xl">
          {getTransactionIcon()}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900">{transaction.description}</p>
            {getStatusIcon()}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{transaction.date}</span>
            {transaction.reference && (
              <span className="font-mono">Ref: {transaction.reference}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-bold ${getAmountColor()}`}>
          {getAmountPrefix()}{transaction.amount} {transaction.currency}
        </p>
        {transaction.fee && (
          <p className="text-xs text-gray-500">Fee: {transaction.fee}</p>
        )}
      </div>
    </div>
  );
};

// Deposit Modal Component
const DepositModal = ({ isOpen, onClose, currency }: {
  isOpen: boolean;
  onClose: () => void;
  currency: 'NGN' | 'USDC';
}) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank_transfer');

  if (!isOpen) return null;

  const depositMethods = currency === 'NGN' ? [
    { id: 'bank_transfer', name: 'Bank Transfer', fee: 'Free' },
    { id: 'card', name: 'Debit Card', fee: '1.5%' }
  ] : [
    { id: 'crypto', name: 'USDC Transfer', fee: 'Network fees apply' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Deposit {currency}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {currency === 'NGN' ? '₦' : '$'}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b61c2] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="space-y-2">
              {depositMethods.map((method) => (
                <label key={method.id} className="flex items-center justify-between p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="depositMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="text-[#8b61c2] focus:ring-[#8b61c2]"
                    />
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{method.fee}</span>
                </label>
              ))}
            </div>
          </div>

          {currency === 'NGN' && selectedMethod === 'bank_transfer' && (
            <Card className="bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Bank Transfer Details</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Bank:</strong> GTBank</p>
                <p><strong>Account:</strong> 0123456789</p>
                <p><strong>Name:</strong> PaySlab Limited</p>
                <p className="text-xs mt-2">Use your PaySlab ID as reference</p>
              </div>
            </Card>
          )}

          {currency === 'USDC' && (
            <Card className="bg-purple-50 border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">USDC Deposit Address</h4>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                <span className="font-mono text-sm">0x1234...5678</span>
                <Button size="small" variant="outline">
                  <QrCode size={16} className="mr-1" />
                  QR Code
                </Button>
              </div>
            </Card>
          )}

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1" disabled={!amount}>
              {currency === 'NGN' ? 'Generate Instructions' : 'Copy Address'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Withdraw Modal Component
const WithdrawModal = ({ isOpen, onClose, currency }: {
  isOpen: boolean;
  onClose: () => void;
  currency: 'NGN' | 'USDC';
}) => {
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Withdraw {currency}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {currency === 'NGN' ? '₦' : '$'}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b61c2] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currency === 'NGN' ? 'Bank Account' : 'USDC Address'}
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={currency === 'NGN' ? 'Account number' : '0x...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b61c2] focus:border-transparent"
            />
          </div>

          {currency === 'USDC' && (
            <Card className="bg-yellow-50 border-yellow-200">
              <div className="flex items-start space-x-2">
                <Warning size={20} className="text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important:</p>
                  <p>Only send to Base network addresses. Incorrect network will result in loss of funds.</p>
                </div>
              </div>
            </Card>
          )}

          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">{amount || '0'} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network Fee:</span>
              <span className="font-medium">{currency === 'NGN' ? '₦50' : '$2'}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">You'll receive:</span>
              <span className="font-bold">
                {amount ? (parseFloat(amount) - (currency === 'NGN' ? 50 : 2)).toFixed(2) : '0'} {currency}
              </span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1" disabled={!amount || !destination}>
              Withdraw
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function WalletPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isNgnHidden, setIsNgnHidden] = useState(false);
  const [isUsdcHidden, setIsUsdcHidden] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [modalCurrency, setModalCurrency] = useState<'NGN' | 'USDC'>('USDC');

  // Sample transaction data
  const transactions: Transaction[] = [
    {
      id: 'tx1',
      type: 'conversion',
      amount: '1,000',
      currency: 'USDC',
      status: 'completed',
      description: 'NGN to USDC Conversion',
      date: '2 hours ago',
      fee: '$15',
      reference: 'CNV-001'
    },
    {
      id: 'tx2',
      type: 'trade_payment',
      amount: '2,500',
      currency: 'USDC',
      status: 'completed',
      description: 'Payment to Shanghai Electronics',
      date: '1 day ago',
      reference: 'TRD-001'
    },
    {
      id: 'tx3',
      type: 'deposit',
      amount: '1,580,000',
      currency: 'NGN',
      status: 'completed',
      description: 'Bank Transfer Deposit',
      date: '2 days ago',
      fee: 'Free'
    },
    {
      id: 'tx4',
      type: 'trade_received',
      amount: '500',
      currency: 'USDC',
      status: 'pending',
      description: 'Payment from Cashew Export LoC',
      date: '3 days ago',
      reference: 'LOC-001'
    },
    {
      id: 'tx5',
      type: 'withdrawal',
      amount: '100,000',
      currency: 'NGN',
      status: 'failed',
      description: 'Bank Withdrawal',
      date: '5 days ago',
      fee: '₦50'
    }
  ];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    switch (selectedFilter) {
      case 'deposits':
        return transactions.filter(tx => tx.type === 'deposit' || tx.type === 'trade_received');
      case 'withdrawals':
        return transactions.filter(tx => tx.type === 'withdrawal' || tx.type === 'trade_payment');
      case 'conversions':
        return transactions.filter(tx => tx.type === 'conversion');
      default:
        return transactions;
    }
  }, [selectedFilter]);

  const handleDeposit = (currency: 'NGN' | 'USDC') => {
    setModalCurrency(currency);
    setDepositModalOpen(true);
  };

  const handleWithdraw = (currency: 'NGN' | 'USDC') => {
    setModalCurrency(currency);
    setWithdrawModalOpen(true);
  };

  return (
    <Layout>
      <div className="p-6 w-full">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
              <p className="text-gray-600 mt-1">Manage your NGN and USDC balances</p>
            </div>
            <Button>
              <ArrowsLeftRight size={16} className="mr-2" />
              Convert Currency
            </Button>
          </div>

          {/* Wallet Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WalletBalanceCard
              currency="USDC"
              balance="$2,450.00"
              change="+15.2%"
              isHidden={isUsdcHidden}
              onToggleVisibility={() => setIsUsdcHidden(!isUsdcHidden)}
              onDeposit={() => handleDeposit('USDC')}
              onWithdraw={() => handleWithdraw('USDC')}
            />
            <WalletBalanceCard
              currency="NGN"
              balance="₦450,000"
              usdValue="$284.81"
              change="+8.5%"
              isHidden={isNgnHidden}
              onToggleVisibility={() => setIsNgnHidden(!isNgnHidden)}
              onDeposit={() => handleDeposit('NGN')}
              onWithdraw={() => handleWithdraw('NGN')}
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="flex items-center justify-center py-4">
                <ArrowsLeftRight size={20} className="mr-2" />
                Convert NGN to USDC
              </Button>
              <Button variant="outline" className="flex items-center justify-center py-4">
                <Plus size={20} className="mr-2" />
                Deposit Funds
              </Button>
              <Button variant="outline" className="flex items-center justify-center py-4">
                <Minus size={20} className="mr-2" />
                Withdraw Funds
              </Button>
            </div>
          </Card>

          {/* Transaction History */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              <div className="flex space-x-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'deposits', label: 'Deposits' },
                  { id: 'withdrawals', label: 'Withdrawals' },
                  { id: 'conversions', label: 'Conversions' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                      selectedFilter === filter.id
                        ? 'bg-[#8b61c2] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Wallet size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
                  <p className="text-gray-600">No {selectedFilter} transactions in your history.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        currency={modalCurrency}
      />
      
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        currency={modalCurrency}
      />
    </Layout>
  );
}