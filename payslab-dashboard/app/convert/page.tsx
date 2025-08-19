"use client";
import React, { useState, useEffect } from "react";
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
  Calculator
} from "@phosphor-icons/react";

export default function ConvertNGN() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1580);
  const [conversionFee, setConversionFee] = useState(1.5);
  const [applicationStatus, setApplicationStatus] = useState("initial");
  const [conversionData, setConversionData] = useState<{
    fromAmount: number;
    toAmount: number;
    fee: number;
    rate: number;
  } | null>(null);

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

  // Calculate conversion when NGN amount changes
  useEffect(() => {
    if (fromAmount) {
      const ngnAmount = parseFloat(fromAmount);
      const usdAmount = ngnAmount / exchangeRate;
      const fee = ngnAmount * (conversionFee / 100);
      const finalUsdAmount = (ngnAmount - fee) / exchangeRate;
      setToAmount(finalUsdAmount.toFixed(2));
    } else {
      setToAmount("");
    }
  }, [fromAmount, exchangeRate, conversionFee]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (fromAmount && toAmount) {
      const ngnAmount = parseFloat(fromAmount);
      const usdAmount = parseFloat(toAmount);
      const fee = ngnAmount * (conversionFee / 100);
      
      setConversionData({
        fromAmount: ngnAmount,
        toAmount: usdAmount,
        fee: fee,
        rate: exchangeRate
      });
      
      setApplicationStatus("preview");
    }
  };

  // Handle confirming conversion
  const handleConfirmConversion = () => {
    setApplicationStatus("processing");
    setToast({
      visible: true,
      message: 'Conversion initiated successfully!',
      type: 'success'
    });

    // Simulate processing time
    setTimeout(() => {
      setApplicationStatus("completed");
      setToast({
        visible: true,
        message: 'Conversion completed! USDC has been credited to your wallet.',
        type: 'success'
      });
    }, 3000);
  };

  // Handle starting new conversion
  const handleNewConversion = () => {
    setApplicationStatus("initial");
    setFromAmount("");
    setToAmount("");
    setConversionData(null);
  };

  // Close toast handler
  const handleCloseToast = () => {
    setToast({...toast, visible: false});
  };

  return (
    <Layout>
      <div className="p-6 w-full">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Convert NGN to USDC</h1>
              <p className="text-gray-600 mt-1">Get USD liquidity in minutes with competitive rates</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Exchange Rate (NGN/USD)</p>
              <p className="text-2xl font-bold text-gray-900">₦{exchangeRate.toLocaleString()}</p>
              <div className="flex items-center justify-end space-x-1 text-green-600">
                <TrendUp size={16} />
                <span className="text-sm font-medium">+2.3% vs bank rate</span>
              </div>
            </div>
          </div>

          <div className={`grid ${applicationStatus === "preview" ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
            
            {/* Conversion Form Section */}
            <div className="space-y-6">
              
              {/* Exchange Rate Card */}
              <Card className="bg-gradient-to-r from-[#8b61c2] to-[#7952a8] text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-75">Current Exchange Rate</p>
                    <p className="text-3xl font-bold">₦{exchangeRate.toLocaleString()}</p>
                    <p className="text-sm opacity-75">per 1 USD</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-300">
                      <TrendUp size={16} />
                      <span className="text-sm">+2.3%</span>
                    </div>
                    <p className="text-xs opacity-75">vs bank rate</p>
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
                    Processing Conversion...
                  </div>
                ) : applicationStatus === "completed" ? (
                  <div className="bg-green-100 text-green-800 px-6 py-2 rounded-full text-sm flex items-center gap-2">
                    <CheckCircle size={20} />
                    Conversion Completed
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
                  <Calculator size={24} className="text-[#8b61c2]" />
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
                        placeholder="0.00"
                        className="w-full bg-gray-50 text-gray-800 rounded-xl px-12 py-4 text-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8b61c2] focus:border-transparent transition-colors"
                        disabled={applicationStatus === "processing" || applicationStatus === "completed"}
                      />
                    </div>
                  </div>

                  {/* Conversion Arrow */}
                  <div className="flex justify-center">
                    <div className="p-3 bg-[#8b61c2] text-white rounded-full">
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
                        value={toAmount}
                        placeholder="0.00"
                        className="w-full bg-gray-50 text-gray-800 rounded-xl px-12 py-4 text-xl border border-gray-200 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Conversion Details */}
                  {fromAmount && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Exchange Rate:</span>
                        <span className="font-medium">₦{exchangeRate.toLocaleString()} per USD</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Conversion Fee ({conversionFee}%):</span>
                        <span className="font-medium">₦{(parseFloat(fromAmount || "0") * (conversionFee / 100)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t pt-3">
                        <span className="text-gray-600 font-medium">You'll receive:</span>
                        <span className="font-bold text-[#8b61c2] text-lg">${toAmount} USDC</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  {applicationStatus === "initial" && (
                    <Button
                      type="submit"
                      className="w-full py-4 text-lg"
                      disabled={!fromAmount || !toAmount}
                    >
                      Preview Conversion
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

            {/* Conversion Preview/Confirmation */}
            {applicationStatus === "preview" && conversionData && (
              <div className="space-y-4">
                <Card className="border-2 border-[#8b61c2]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Conversion Preview</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">From Amount:</span>
                      <span className="text-xl font-bold">₦{conversionData.fromAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Exchange Rate:</span>
                      <span className="font-medium">₦{conversionData.rate.toLocaleString()}/USD</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Platform Fee:</span>
                      <span className="font-medium">₦{conversionData.fee.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-4 bg-[#8b61c2] bg-opacity-10 rounded-xl px-4">
                      <span className="text-gray-900 font-medium">You'll Receive:</span>
                      <span className="text-2xl font-bold text-[#8b61c2]">${conversionData.toAmount} USDC</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={handleConfirmConversion}
                      className="w-full py-4 text-lg"
                    >
                      Confirm Conversion
                    </Button>
                    
                    <Button
                      onClick={() => setApplicationStatus("initial")}
                      variant="outline"
                      className="w-full py-3"
                    >
                      Back to Edit
                    </Button>
                  </div>
                </Card>

                {/* Payment Instructions */}
                <Card className="bg-blue-50 border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Bank size={24} className="text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions</h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Transfer ₦{conversionData.fromAmount.toLocaleString()} to our NGN account</li>
                        <li>2. Use your PaySlab ID as payment reference</li>
                        <li>3. USDC will be credited within 10 minutes</li>
                      </ol>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
          <div className="flex items-center space-x-3">
            <CheckCircle size={20} className="text-green-500" />
            <span className="text-gray-800">{toast.message}</span>
            <button onClick={handleCloseToast} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}