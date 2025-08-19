"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/core/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { 
  FileText, 
  CheckCircle,
  Clock,
  CurrencyDollar,
  Globe,
  Truck,
  Shield,
  Calculator,
  ChartLineUp
} from "@phosphor-icons/react";

// Custom Dropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder, disabled = false }: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full bg-gray-50 text-gray-800 rounded-xl px-4 py-3 text-left border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#444444] transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
      >
        {value || placeholder}
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function LetterOfCredit() {
  const [exportType, setExportType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [valueUSD, setValueUSD] = useState("");
  const [buyerCountry, setBuyerCountry] = useState("");
  const [deliveryTerms, setDeliveryTerms] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("initial");
  const [locData, setLocData] = useState<{
    exportType: string;
    quantity: number;
    valueUSD: number;
    buyerCountry: string;
    deliveryTerms: string;
    locFee: number;
    inspectionFee: number;
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

  const exportTypes = [
    "Cashew Nuts",
    "Cocoa Beans", 
    "Sesame Seeds",
    "Ginger",
    "Hibiscus Flowers",
    "Shea Butter",
    "Palm Oil",
    "Yam",
    "Cassava"
  ];

  const countries = [
    "Germany",
    "Netherlands", 
    "United Kingdom",
    "United States",
    "Turkey",
    "India",
    "China",
    "Vietnam"
  ];

  const deliveryOptions = [
    "FOB (Free on Board)",
    "CIF (Cost, Insurance, Freight)",
    "CFR (Cost and Freight)", 
    "EXW (Ex Works)"
  ];

  // Calculate fees when value changes
  useEffect(() => {
    if (valueUSD) {
      const value = parseFloat(valueUSD);
      // LoC fee is 1% of trade value
      const locFee = value * 0.01;
      // Inspection fee is fixed at $200
      const inspectionFee = 200;
    }
  }, [valueUSD]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (exportType && quantity && valueUSD && buyerCountry && deliveryTerms) {
      const value = parseFloat(valueUSD);
      const locFee = value * 0.01; // 1% fee
      const inspectionFee = 200; // Fixed inspection fee
      
      setLocData({
        exportType,
        quantity: parseFloat(quantity),
        valueUSD: value,
        buyerCountry,
        deliveryTerms,
        locFee,
        inspectionFee
      });
      
      setApplicationStatus("preview");
    }
  };

  // Handle LoC application submission
  const handleSubmitApplication = () => {
    setApplicationStatus("pending");
    setToast({
      visible: true,
      message: 'Letter of Credit application submitted successfully!',
      type: 'success'
    });

    // Simulate processing time
    setTimeout(() => {
      setApplicationStatus("approved");
      setToast({
        visible: true,
        message: 'Letter of Credit has been approved and issued!',
        type: 'success'
      });
    }, 5000);
  };

  // Handle starting new application
  const handleNewApplication = () => {
    setApplicationStatus("initial");
    setExportType("");
    setQuantity("");
    setValueUSD("");
    setBuyerCountry("");
    setDeliveryTerms("");
    setLocData(null);
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
              <h1 className="text-3xl font-bold text-gray-900">Letter of Credit</h1>
              <p className="text-gray-600 mt-1">Secure your agricultural exports with smart contracts</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Processing Time</p>
              <p className="text-2xl font-bold text-[#444444]">24-48 Hours</p>
              <p className="text-sm text-[#444444] font-medium">vs 6-8 weeks traditional</p>
            </div>
          </div>

          <div className={`grid ${applicationStatus === "preview" ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
            
            {/* Application Form Section */}
            <div className="space-y-6">
              
              {/* Benefits Card */}
              <Card className="bg-[linear-gradient(135deg,rgb(131,131,131)_-35%,rgba(41,41,41,0.34)_-20%,rgba(51,51,51,0.55)_-15%,rgb(47,47,47)_100%)] text-white border-0">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl mx-auto w-fit mb-2">
                      <Shield size={24} />
                    </div>
                    <p className="text-sm font-medium">Secure Payments</p>
                    <p className="text-xs opacity-75">Zero fraud risk</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl mx-auto w-fit mb-2">
                      <Globe size={24} />
                    </div>
                    <p className="text-sm font-medium">Global Reach</p>
                    <p className="text-xs opacity-75">Export worldwide</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl mx-auto w-fit mb-2">
                      <CheckCircle size={24} />
                    </div>
                    <p className="text-sm font-medium">Quality Assured</p>
                    <p className="text-xs opacity-75">SGS certification</p>
                  </div>
                </div>
              </Card>

              {/* Application Status */}
              <div className="flex justify-center">
                {applicationStatus === "pending" ? (
                  <div className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full text-sm flex items-center gap-2">
                    <Clock size={20} />
                    Processing Application...
                  </div>
                ) : applicationStatus === "approved" ? (
                  <div className="bg-green-100 text-green-800 px-6 py-2 rounded-full text-sm flex items-center gap-2">
                    <CheckCircle size={20} />
                    Letter of Credit Issued
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 px-6 py-2 rounded-full text-sm">
                    Get your LoC approved in <span className="font-semibold">24-48 hours</span>
                  </div>
                )}
              </div>

              {/* Application Form */}
              <Card>
                <div className="flex items-center space-x-2 text-gray-800 mb-6">
                  <FileText size={24} className="text-[#444444]" />
                  <h2 className="text-lg font-semibold">LoC Application</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Export Type */}
                  <div>
                    <label className="block text-gray-600 mb-2 text-sm font-medium">Export Product</label>
                    <CustomDropdown
                      options={exportTypes}
                      value={exportType}
                      onChange={setExportType}
                      placeholder="Select Export Product"
                      disabled={applicationStatus === "pending" || applicationStatus === "approved"}
                    />
                  </div>

                  {/* Quantity and Value */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-2 text-sm font-medium">Quantity (MT)</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                        className="w-full bg-gray-50 text-gray-800 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#444444] focus:border-transparent transition-colors"
                        disabled={applicationStatus === "pending" || applicationStatus === "approved"}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-2 text-sm font-medium">Value (USD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={valueUSD}
                          onChange={(e) => setValueUSD(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-gray-50 text-gray-800 rounded-xl px-8 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#444444] focus:border-transparent transition-colors"
                          disabled={applicationStatus === "pending" || applicationStatus === "approved"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buyer Country */}
                  <div>
                    <label className="block text-gray-600 mb-2 text-sm font-medium">Buyer Country</label>
                    <CustomDropdown
                      options={countries}
                      value={buyerCountry}
                      onChange={setBuyerCountry}
                      placeholder="Select Destination Country"
                      disabled={applicationStatus === "pending" || applicationStatus === "approved"}
                    />
                  </div>

                  {/* Delivery Terms */}
                  <div>
                    <label className="block text-gray-600 mb-2 text-sm font-medium">Delivery Terms</label>
                    <CustomDropdown
                      options={deliveryOptions}
                      value={deliveryTerms}
                      onChange={setDeliveryTerms}
                      placeholder="Select Delivery Terms"
                      disabled={applicationStatus === "pending" || applicationStatus === "approved"}
                    />
                  </div>

                  {/* Cost Breakdown */}
                  {valueUSD && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Trade Value:</span>
                        <span className="font-medium">${parseFloat(valueUSD).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">LoC Fee (1%):</span>
                        <span className="font-medium">${(parseFloat(valueUSD) * 0.01).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Inspection Fee:</span>
                        <span className="font-medium">$200</span>
                      </div>
                      <div className="flex justify-between text-sm border-t pt-3">
                        <span className="text-gray-600 font-medium">Total Cost:</span>
                        <span className="font-bold text-[#444444] text-lg">${(parseFloat(valueUSD) * 0.01 + 200).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  {applicationStatus === "initial" && (
                    <Button
                      type="submit"
                      className="w-full py-4 text-lg bg-[#8b61c2] hover:bg-[#7952a8]"
                      disabled={!exportType || !quantity || !valueUSD || !buyerCountry || !deliveryTerms}
                    >
                      Preview Application
                    </Button>
                  )}

                  {applicationStatus === "approved" && (
                    <Button
                      onClick={handleNewApplication}
                      variant="outline"
                      className="w-full py-4 text-lg border-[#8b61c2] text-[#8b61c2] hover:bg-purple-50"
                    >
                      Create New LoC
                    </Button>
                  )}
                </form>
              </Card>

              {/* Additional Information */}
              <Card className="bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <ChartLineUp size={24} className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Why Choose PaySlab LoC?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 95% cheaper than traditional banks ($1,200 vs $5,000+)</li>
                      <li>• 48-hour approval vs 6-8 weeks</li>
                      <li>• Professional SGS quality inspection</li>
                      <li>• Smart contract automation</li>
                      <li>• No minimum trade requirements</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Application Preview/Confirmation */}
            {applicationStatus === "preview" && locData && (
              <div className="space-y-4">
                <Card className="border-2 border-[#8b61c2]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Letter of Credit Preview</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Export Product:</span>
                      <span className="font-medium">{locData.exportType}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{locData.quantity} MT</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Trade Value:</span>
                      <span className="font-medium">${locData.valueUSD.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Destination:</span>
                      <span className="font-medium">{locData.buyerCountry}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Delivery Terms:</span>
                      <span className="font-medium">{locData.deliveryTerms}</span>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">LoC Fee:</span>
                        <span className="font-medium">${locData.locFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inspection Fee:</span>
                        <span className="font-medium">${locData.inspectionFee}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium text-gray-900">Total Cost:</span>
                        <span className="text-xl font-bold text-[#8b61c2]">${(locData.locFee + locData.inspectionFee).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={handleSubmitApplication}
                      className="w-full py-4 text-lg bg-[#8b61c2] hover:bg-[#7952a8]"
                    >
                      Submit Application
                    </Button>
                    
                    <Button
                      onClick={() => setApplicationStatus("initial")}
                      variant="outline"
                      className="w-full py-3 border-[#8b61c2] text-[#8b61c2] hover:bg-purple-50"
                    >
                      Back to Edit
                    </Button>
                  </div>
                </Card>

                {/* Quality Standards */}
                <Card className="bg-purple-50 border-purple-200">
                  <div className="flex items-start space-x-3">
                    <CheckCircle size={24} className="text-[#8b61c2] mt-1" />
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">Quality Standards</h4>
                      <div className="text-sm text-purple-800 space-y-1">
                        {exportType === "Cashew Nuts" && (
                          <div>
                            <p>• Grade: W-320 Premium</p>
                            <p>• Moisture: Max 8%</p>
                            <p>• Foreign Matter: Max 1%</p>
                            <p>• Broken: Max 5%</p>
                          </div>
                        )}
                        {exportType === "Cocoa Beans" && (
                          <div>
                            <p>• Grade A Quality</p>
                            <p>• Moisture: Max 7.5%</p>
                            <p>• Bean Count: 100 beans/100g</p>
                            <p>• Defective: Max 3%</p>
                          </div>
                        )}
                        {exportType === "Sesame Seeds" && (
                          <div>
                            <p>• Purity: Min 98%</p>
                            <p>• Moisture: Max 6%</p>
                            <p>• Oil Content: Min 50%</p>
                            <p>• Foreign Matter: Max 2%</p>
                          </div>
                        )}
                        {!["Cashew Nuts", "Cocoa Beans", "Sesame Seeds"].includes(exportType) && (
                          <div>
                            <p>• International quality standards</p>
                            <p>• SGS pre-shipment inspection</p>
                            <p>• Compliance certificates included</p>
                            <p>• Grade A export quality</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Process Timeline */}
                <Card className="bg-blue-50 border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Truck size={24} className="text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Process Timeline</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>• Day 1-2: Application review & approval</p>
                        <p>• Day 3-5: Quality inspection scheduling</p>
                        <p>• Day 6-10: SGS inspection & certification</p>
                        <p>• Day 11-15: Shipment & documentation</p>
                        <p>• Day 16-30: Delivery & payment release</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Processing/Approved Status Display */}
            {(applicationStatus === "pending" || applicationStatus === "approved") && (
              <div className="col-span-full max-w-2xl mx-auto">
                <Card className="text-center">
                  {applicationStatus === "pending" ? (
                    <div className="py-8">
                      <Clock size={48} className="text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Under Review</h3>
                      <p className="text-gray-600 mb-4">Your Letter of Credit application is being processed by our team.</p>
                      <div className="bg-yellow-50 rounded-xl p-4">
                        <p className="text-sm text-yellow-800">Expected approval time: 24-48 hours</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Letter of Credit Issued!</h3>
                      <p className="text-gray-600 mb-4">Your LoC has been approved and is ready for use.</p>
                      <div className="bg-green-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-green-800">LoC Reference: LOC-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                      </div>
                      <Button className="bg-[#8b61c2] hover:bg-[#7952a8]">
                        Download LoC Document
                      </Button>
                    </div>
                  )}
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
            <CheckCircle size={20} className="text-[#8b61c2]" />
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