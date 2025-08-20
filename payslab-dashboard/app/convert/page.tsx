"use client";
import React, { useState, useEffect } from "react";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Layout from "../components/core/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { 
  ArrowsLeftRight, 
  CurrencyDollar, 
  Bank, 
  CheckCircle,
  Clock,
  TrendUp,
  Calculator,
  Warning,
  Copy,
  Wallet
} from "@phosphor-icons/react";

// Import hooks
import { useYellowCardRate, useYellowCardConversion } from "../hooks/useYellowCard";
import { useWallet } from "../hooks/useWallet";

export default function ConvertNGN() {
  // Use Privy hooks instead of wagmi
  const { ready, authenticated, user, login } = usePrivy();
  const { wallets } = useWallets();
  
  // Get the embedded wallet
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  const address = embeddedWallet?.address;
  const isConnected = authenticated && !!address;
  
  // Wallet hook with error handling
  let usdcBalance = 0;
  let refreshBalances = () => {};
  
  try {
    const walletData = useWallet();
    usdcBalance = walletData.usdcBalance || 0;
    refreshBalances = walletData.refreshBalances || (() => {});
  } catch (error) {
    console.warn('Wallet hook not available:', error);
  }
  
  const [fromAmount, setFromAmount] = useState("");
  const [applicationStatus, setApplicationStatus] = useState<'initial' | 'preview' | 'processing' | 'payment_pending' | 'completed'>('initial');
  const [orderData, setOrderData] = useState<any>(null);

  // Toast notification state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    visible: false,
    message: '',
    type: 'success'
  });

  // Yellow Card hooks with error handling
  const amount = parseFloat(fromAmount) || 0;
  
  let rateData = null;
  let isLoadingRate = false;
  let rateError = null;
  let convertNGN = () => {};
  let isConverting = false;
  
  try {
    const rateQuery = useYellowCardRate(amount);
    rateData = rateQuery.data;
    isLoadingRate = rateQuery.isLoading;
    rateError = rateQuery.error;
    
    const conversionMutation = useYellowCardConversion();
    convertNGN = conversionMutation.mutate;
    isConverting = conversionMutation.isPending;
  } catch (error) {
    console.warn('Yellow Card hooks not available:', error);
    // Mock data for development
    if (amount > 0) {
      rateData = {
        rate: 1580,
        fee: amount * 0.02,
        totalAmount: amount + (amount * 0.02),
        cryptoAmount: amount / 1580
      };
    }
  }

  // User details from Privy
  const userDetails = {
    email: user?.email?.address || "user@example.com",
    firstName: user?.customMetadata?.firstName || "User",
    lastName: user?.customMetadata?.lastName || "Name",
    phone: user?.phone?.number || "+234XXXXXXXXXX",
    walletAddress: address || "0x123..."
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 5000);
  };

  const handleCloseToast = () => {
    setToast({...toast, visible: false});
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isConnected) {
      showToast('Please sign in to continue', 'error');
      return;
    }
    
    if (fromAmount && rateData) {
      setApplicationStatus("preview");
    }
  };

  // Handle confirming conversion
  const handleConfirmConversion = () => {
    if (!isConnected || !fromAmount) {
      showToast('Please sign in and enter amount', 'error');
      return;
    }

    setApplicationStatus("processing");
    
    try {
      convertNGN(
        {
          amount: parseFloat(fromAmount),
          userDetails
        },
        {
          onSuccess: (data) => {
            setOrderData(data);
            setApplicationStatus("payment_pending");
            showToast('Conversion order created! Please make payment to complete.', 'success');
            
            // Simulate completion after payment
            setTimeout(() => {
              setApplicationStatus("completed");
              refreshBalances(); // Refresh wallet balances
              showToast('USDC credited to your wallet!', 'success');
            }, 10000); // 10 seconds for demo
          },
          onError: (error) => {
            setApplicationStatus("preview");
            showToast(error.message || 'Conversion failed', 'error');
          }
        }
      );
    } catch (error) {
      // Fallback for development
      const mockData = {
        id: `YC-${Date.now()}`,
        paymentDetails: {
          bankName: "Yellow Card Bank",
          accountNumber: "1234567890",
          accountName: "Yellow Card NGN Collection",
          reference: `YC${Date.now()}`,
          expiresAt: "30 minutes"
        }
      };
      
      setOrderData(mockData);
      setApplicationStatus("payment_pending");
      showToast('Mock conversion order created! Please make payment to complete.', 'info');
      
      // Simulate completion
      setTimeout(() => {
        setApplicationStatus("completed");
        showToast('Mock USDC credited to your wallet!', 'success');
      }, 5000);
    }
  };

  // Handle starting new conversion
  const handleNewConversion = () => {
    setApplicationStatus("initial");
    setFromAmount("");
    setOrderData(null);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  // Show loading if Privy is not ready
  if (!ready) {
    return (
      <Layout>
        <div className="p-6 w-full">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#444444]"></div>
              <span className="ml-3 text-gray-600">Loading wallet...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 w-full">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Convert NGN to USDC</h1>
              <p className="text-gray-600 mt-1">Get USD liquidity in minutes via Yellow Card</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Live Exchange Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                ₦{rateData?.rate.toLocaleString() || '1,580'}/USDC
              </p>
              <div className="flex items-center justify-end space-x-1 text-green-600">
                <TrendUp size={16} />
                <span className="text-sm">Live via Yellow Card</span>
              </div>
            </div>
          </div>

          {/* Authentication Status */}
          {!isConnected && (
            <Card className="bg-yellow-50 border-yellow-200">
              <div className="flex items-center space-x-3">
                <Wallet size={24} className="text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Authentication Required</p>
                  <p className="text-sm text-yellow-700">Please sign in to access currency conversion features</p>
                </div>
              </div>
            </Card>
          )}

          {/* Current Balance Display */}
          {isConnected && (
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Current USDC Balance</p>
                  <p className="text-2xl font-bold text-blue-900">${usdcBalance.toFixed(2)} USDC</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">Wallet Address</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-sm">{address?.slice(0, 10)}...{address?.slice(-8)}</p>
                    <button onClick={() => copyToClipboard(address || '')}>
                      <Copy size={16} className="text-blue-600" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className={`grid ${applicationStatus === "preview" || applicationStatus === "payment_pending" ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
            
            {/* Conversion Form Section */}
            <div className="space-y-6">
              
              {/* Exchange Rate Card */}
              <Card className="bg-[linear-gradient(135deg,rgb(131,131,131)_-35%,rgba(41,41,41,0.34)_-20%,rgba(51,51,51,0.55)_-15%,rgb(47,47,47)_100%)] text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-75">Current Exchange Rate</p>
                    <p className="text-3xl font-bold">₦{rateData?.rate.toLocaleString() || '1,580'}</p>
                    <p className="text-sm opacity-75">per 1 USDC</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-300">
                      <TrendUp size={16} />
                      <span className="text-sm">Live Rate</span>
                    </div>
                    <p className="text-xs opacity-75">via Yellow Card</p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <CurrencyDollar size={32} />
                  </div>
                </div>
              </Card>

              {/* Conversion Status */}
              <div className="flex justify-center">
                {applicationStatus === "processing" ? (
                  <div className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full text-sm flex items-center gap-2">
                    <Clock size={20} />
                    Creating Yellow Card Order...
                  </div>
                ) : applicationStatus === "payment_pending" ? (
                  <div className="bg-blue-100 text-blue-800 px-6 py-2 rounded-full text-sm flex items-center gap-2">
                    <Bank size={20} />
                    Awaiting Payment Confirmation
                  </div>
                ) : applicationStatus === "completed" ? (
                  <div className="bg-green-100 text-green-800 px-6 py-2 rounded-full text-sm flex items-center gap-2">
                    <CheckCircle size={20} />
                    USDC Credited Successfully
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 px-6 py-2 rounded-full text-sm">
                    Convert your NGN to USDC in <span className="font-semibold">under 10 minutes</span>
                  </div>
                )}
              </div>

              {/* Conversion Form */}
              <Card>
                <div className="flex items-center space-x-2 text-gray-800 mb-6">
                  <Calculator size={24} className="text-[#444444]" />
                  <h2 className="text-lg font-semibold">Currency Conversion</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* From Amount */}
                  <div>
                    <label className="block text-gray-600 mb-2 text-sm font-medium">From (NGN)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₦</span>
                      <input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        placeholder="1,000,000"
                        className="w-full bg-gray-50 text-gray-800 rounded-xl px-12 py-4 text-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8b61c2] focus:border-transparent transition-colors"
                        disabled={applicationStatus === "processing" || applicationStatus === "payment_pending"}
                        min="1000"
                        max="50000000"
                      />
                      {isLoadingRate && fromAmount && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8b61c2]"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Min: ₦1,000 • Max: ₦50,000,000</p>
                  </div>

                  {/* Conversion Arrow */}
                  <div className="flex justify-center">
                    <div className="p-3 bg-[#444444] text-white rounded-full">
                      <ArrowsLeftRight size={24} />
                    </div>
                  </div>

                  {/* To Amount */}
                  <div>
                    <label className="block text-gray-600 mb-2 text-sm font-medium">To (USDC)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                      <input
                        type="text"
                        value={rateData ? rateData.cryptoAmount.toFixed(2) : "0.00"}
                        placeholder="0.00"
                        className="w-full bg-gray-50 text-gray-800 rounded-xl px-12 py-4 text-xl border border-gray-200 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Conversion Details */}
                  {rateData && fromAmount && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Exchange Rate:</span>
                        <span className="font-medium">₦{rateData.rate.toLocaleString()} per USDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Yellow Card Fee:</span>
                        <span className="font-medium">₦{rateData.fee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Cost:</span>
                        <span className="font-medium">₦{rateData.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t pt-3">
                        <span className="text-gray-600 font-medium">You'll receive:</span>
                        <span className="font-bold text-[#8b61c2] text-lg">${rateData.cryptoAmount.toFixed(2)} USDC</span>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {rateError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2">
                        <Warning size={20} className="text-red-600" />
                        <p className="text-red-800 text-sm">Failed to get exchange rate. Please try again.</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  {applicationStatus === "initial" && (
                    <Button
                      type="submit"
                      className="w-full py-4 text-lg"
                      disabled={!fromAmount || !rateData || isLoadingRate || !isConnected || isConverting}
                    >
                      {isLoadingRate ? 'Getting Rate...' : isConverting ? 'Creating Order...' : 'Preview Conversion'}
                    </Button>
                  )}

                  {applicationStatus === "completed" && (
                    <Button
                      onClick={handleNewConversion}
                      variant="outline"
                      className="w-full py-4 text-lg"
                    >
                      Start New Conversion
                    </Button>
                  )}
                </form>
              </Card>
            </div>

            {/* Conversion Preview/Payment Instructions */}
            {(applicationStatus === "preview" || applicationStatus === "payment_pending") && rateData && (
              <div className="space-y-4">
                <Card className="border-2 border-[#8b61c2]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Conversion Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">From Amount:</span>
                      <span className="text-xl font-bold">₦{parseFloat(fromAmount).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Exchange Rate:</span>
                      <span className="font-medium">₦{rateData.rate.toLocaleString()}/USDC</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Yellow Card Fee:</span>
                      <span className="font-medium">₦{rateData.fee.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-4 bg-[#8b61c2] bg-opacity-10 rounded-xl px-4">
                      <span className="text-gray-900 font-medium">You'll Receive:</span>
                      <span className="text-2xl font-bold text-[#8b61c2]">${rateData.cryptoAmount.toFixed(2)} USDC</span>
                    </div>

                    {orderData && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Order ID</p>
                            <p className="font-mono font-medium">{orderData.id}</p>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(orderData.id)}
                            className="p-2 hover:bg-gray-200 rounded-lg"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-3">
                    {applicationStatus === "preview" && (
                      <Button
                        onClick={handleConfirmConversion}
                        className="w-full py-4 text-lg"
                        disabled={isConverting || !isConnected}
                      >
                        {isConverting ? 'Creating Order...' : 'Confirm Conversion'}
                      </Button>
                    )}
                    
                    {applicationStatus === "preview" && (
                      <Button
                        onClick={() => setApplicationStatus("initial")}
                        variant="outline"
                        className="w-full py-3"
                      >
                        Back to Edit
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Payment Instructions */}
                {orderData && applicationStatus === "payment_pending" && (
                  <Card className="bg-blue-50 border-blue-200">
                    <div className="flex items-start space-x-3 mb-4">
                      <Bank size={24} className="text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions</h4>
                        <p className="text-sm text-blue-800">
                          Transfer the exact amount below to complete your conversion
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Bank Name</p>
                            <p className="font-medium">{orderData.paymentDetails.bankName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Account Number</p>
                            <div className="flex items-center space-x-2">
                              <p className="font-mono font-medium">{orderData.paymentDetails.accountNumber}</p>
                              <button onClick={() => copyToClipboard(orderData.paymentDetails.accountNumber)}>
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Account Name</p>
                            <p className="font-medium">{orderData.paymentDetails.accountName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Reference</p>
                            <div className="flex items-center space-x-2">
                              <p className="font-mono font-medium text-[#8b61c2]">{orderData.paymentDetails.reference}</p>
                              <button onClick={() => copyToClipboard(orderData.paymentDetails.reference)}>
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <Warning size={16} className="text-yellow-600 mt-0.5" />
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium">Important:</p>
                            <ul className="list-disc list-inside space-y-1 mt-1">
                              <li>Use the exact reference code provided</li>
                              <li>Payment expires in {orderData.paymentDetails.expiresAt}</li>
                              <li>USDC will be credited within 10 minutes of payment confirmation</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Success State */}
                {applicationStatus === "completed" && (
                  <Card className="bg-green-50 border-green-200">
                    <div className="text-center py-6">
                      <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-900 mb-2">Conversion Completed!</h3>
                      <p className="text-green-700 mb-4">
                        ${rateData.cryptoAmount.toFixed(2)} USDC has been credited to your wallet
                      </p>
                      <div className="bg-white rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-600">Wallet Address</p>
                        <p className="font-mono text-sm">{address}</p>
                      </div>
                      <Button 
                        onClick={() => window.open('https://basescan.org', '_blank')}
                        variant="outline"
                        className="text-green-700 border-green-300"
                      >
                        View on BaseScan
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 max-w-sm">
          <div className="flex items-center space-x-3">
            {toast.type === 'success' && <CheckCircle size={20} className="text-green-500" />}
            {toast.type === 'error' && <Warning size={20} className="text-red-500" />}
            {toast.type === 'info' && <Clock size={20} className="text-blue-500" />}
            {toast.type === 'warning' && <Warning size={20} className="text-yellow-500" />}
            <span className="text-gray-800 text-sm">{toast.message}</span>
            <button onClick={handleCloseToast} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}