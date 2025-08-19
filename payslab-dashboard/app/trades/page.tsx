"use client";
import React, { useState, useMemo } from "react";
import Layout from "../components/core/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { 
  MagnifyingGlass,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  Warning,
  X,
  DownloadSimple,
  FileText,
  CurrencyDollar,
  Calendar,
  MapPin,
  Eye,
  Package
} from "@phosphor-icons/react";

// Trade data interface
interface Trade {
  id: string;
  supplier: string;
  product: string;
  amount: string;
  quantity: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Processing' | 'Pending Payment' | 'Disputed';
  created: string;
  expectedDelivery: string;
  progress: number;
  trackingNumber?: string;
  documents?: string[];
}

// Trade Modal Component
const TradeModal = ({ isOpen, onClose, trade, onDownloadPDF }: {
  isOpen: boolean;
  onClose: () => void;
  trade: Trade | null;
  onDownloadPDF: (tradeId: string, docType: string) => void;
}) => {
  if (!isOpen || !trade) return null;

  const statusColors = {
    'In Transit': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Truck },
    'Delivered': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    'Processing': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    'Pending Payment': { bg: 'bg-purple-100', text: 'text-purple-800', icon: CurrencyDollar },
    'Disputed': { bg: 'bg-red-100', text: 'text-red-800', icon: Warning }
  };

  const statusConfig = statusColors[trade.status];
  const StatusIcon = statusConfig.icon;

  const documents = [
    { name: 'Trade Agreement', type: 'agreement' },
    { name: 'Invoice', type: 'invoice' },
    { name: 'Bill of Lading', type: 'bill_of_lading' },
    { name: 'Quality Certificate', type: 'quality_cert' },
    { name: 'Shipping Documents', type: 'shipping_docs' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trade #{trade.id}</h2>
            <p className="text-gray-600">{trade.supplier}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
              <StatusIcon size={16} className={statusConfig.text} />
              <span className={`text-sm font-medium ${statusConfig.text}`}>{trade.status}</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Trade Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Package size={20} className="text-[#444444]" />
                <div>
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="font-medium">{trade.product}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CurrencyDollar size={20} className="text-[#444444]" />
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">{trade.amount}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={20} className="text-[#444444]" />
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-medium">{trade.destination}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-[#444444]" />
                <div>
                  <p className="text-sm text-gray-600">Expected Delivery</p>
                  <p className="font-medium">{trade.expectedDelivery}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-[#444444] h-3 rounded-full transition-all duration-300" 
                style={{ width: `${trade.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{trade.progress}% Complete</p>
          </div>

          {/* Tracking Information */}
          {trade.trackingNumber && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tracking Number</p>
                    <p className="font-mono font-medium">{trade.trackingNumber}</p>
                  </div>
                  <Button variant="outline" size="small">
                    <Eye size={16} className="mr-1" />
                    Track Package
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Documents Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Documents</h3>
            <div className="grid grid-cols-1 gap-3">
              {documents.map((doc) => (
                <div key={doc.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <FileText size={20} className="text-[#444444]" />
                    <span className="font-medium">{doc.name}</span>
                  </div>
                  <Button
                    onClick={() => onDownloadPDF(trade.id, doc.type)}
                    variant="outline"
                    size="small"
                  >
                    <DownloadSimple size={16} className="mr-1" />
                    Download PDF
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button className="flex-1">
              Contact Supplier
            </Button>
            <Button variant="outline" className="flex-1">
              Report Issue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Filter Dropdown Component
const FilterDropdown = ({ options, onApplyFilters }: {
  options: any[];
  onApplyFilters: (filters: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const applyFilters = () => {
    onApplyFilters(selectedFilters);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="small"
        onClick={() => setIsOpen(!isOpen)}
      >
        Filter ({selectedFilters.length})
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4">
          <div className="space-y-3">
            {options.map((option) => (
              <label key={option.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(option.id)}
                  onChange={() => handleFilterToggle(option.id)}
                  className="rounded border-gray-300 text-[#8b61c2] focus:ring-[#8b61c2] accent-[#444444]"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          <div className="flex space-x-2 mt-4">
            <Button size="small" onClick={applyFilters} className="flex-1 focus:ring-0">
              Apply
            </Button>
            <Button variant="outline" size="small" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Trade Card Component for stats
const TradeCard = ({ title, value, highlight, isLoading = false }: {
  title: string;
  value: string | number;
  highlight?: string;
  isLoading?: boolean;
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded mt-2"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          )}
          {highlight && (
            <p className="text-sm text-[#444444] font-medium mt-1">{highlight}</p>
          )}
        </div>
        <div className="p-3 bg-[#444444] bg-opacity-10 rounded-xl">
          <ShoppingBag size={24} className="text-[#444444]" />
        </div>
      </div>
    </Card>
  );
};

export default function MyTrades() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTradeId, setSelectedTradeId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Sample trade data
  const allTrades: Trade[] = [
    {
      id: 'TRD-001',
      supplier: 'Shanghai Electronics Co.',
      product: 'Smartphone Components',
      amount: '$12,500',
      quantity: '100 units',
      destination: 'Lagos, Nigeria',
      status: 'In Transit',
      created: '2024-12-20',
      expectedDelivery: 'Dec 28, 2024',
      progress: 65,
      trackingNumber: 'DHL1234567890'
    },
    {
      id: 'TRD-002',
      supplier: 'Dubai Textile Mills',
      product: 'Cotton Fabric',
      amount: '$8,200',
      quantity: '50 meters',
      destination: 'Kano, Nigeria',
      status: 'Delivered',
      created: '2024-12-10',
      expectedDelivery: 'Dec 15, 2024',
      progress: 100,
      trackingNumber: 'FDX9876543210'
    },
    {
      id: 'TRD-003',
      supplier: 'German Machinery Ltd',
      product: 'Industrial Equipment',
      amount: '$25,000',
      quantity: '1 unit',
      destination: 'Abuja, Nigeria',
      status: 'Processing',
      created: '2024-12-22',
      expectedDelivery: 'Jan 15, 2025',
      progress: 25
    },
    {
      id: 'TRD-004',
      supplier: 'Indian Spice Exports',
      product: 'Cashew Processing Equipment',
      amount: '$15,800',
      quantity: '1 set',
      destination: 'Ilorin, Nigeria',
      status: 'Pending Payment',
      created: '2024-12-18',
      expectedDelivery: 'Jan 05, 2025',
      progress: 15
    },
    {
      id: 'TRD-005',
      supplier: 'Turkish Textile Co.',
      product: 'Raw Materials',
      amount: '$6,750',
      quantity: '200 kg',
      destination: 'Port Harcourt, Nigeria',
      status: 'Disputed',
      created: '2024-12-15',
      expectedDelivery: 'Dec 25, 2024',
      progress: 45
    }
  ];

  // Filter options
  const filterOptions = [
    { id: 'status', label: 'Trade Status' },
    { id: 'amount', label: 'Amount Range' },
    { id: 'date', label: 'Date Range' },
    { id: 'supplier', label: 'Supplier' },
    { id: 'destination', label: 'Destination' }
  ];

  // Filter trades based on search and filters
  const filteredTrades = useMemo(() => {
    let filtered = allTrades;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trade => 
        trade.id.toLowerCase().includes(query) ||
        trade.supplier.toLowerCase().includes(query) ||
        trade.product.toLowerCase().includes(query) ||
        trade.destination.toLowerCase().includes(query)
      );
    }

    // Apply tab filter
    switch (selectedTab) {
      case 'active':
        filtered = filtered.filter(trade => 
          ['In Transit', 'Processing', 'Pending Payment'].includes(trade.status)
        );
        break;
      case 'completed':
        filtered = filtered.filter(trade => trade.status === 'Delivered');
        break;
      case 'disputed':
        filtered = filtered.filter(trade => trade.status === 'Disputed');
        break;
      default:
        break;
    }

    return filtered;
  }, [allTrades, searchQuery, selectedTab, activeFilters]);

  // Calculate statistics
  const totalTrades = allTrades.length;
  const activeTrades = allTrades.filter(t => ['In Transit', 'Processing', 'Pending Payment'].includes(t.status)).length;
  const completedTrades = allTrades.filter(t => t.status === 'Delivered').length;
  const totalValue = allTrades.reduce((sum, trade) => {
    const value = parseFloat(trade.amount.replace('$', '').replace(',', ''));
    return sum + value;
  }, 0);

  const handleApplyFilters = (selectedFilters: string[]) => {
    setActiveFilters(selectedFilters);
  };

  const handleRowClick = (tradeId: string) => {
    setSelectedTradeId(tradeId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTradeId('');
  };

  const handleDownloadPDF = (tradeId: string, docType: string) => {
    console.log(`Downloading ${docType} for trade ${tradeId}`);
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#'; // Would be actual PDF URL
    link.download = `${tradeId}_${docType}.pdf`;
    link.click();
  };

  const selectedTrade = selectedTradeId 
    ? allTrades.find(trade => trade.id === selectedTradeId)
    : null;

  // Get status color configuration
  const getStatusConfig = (status: Trade['status']) => {
    const configs = {
      'In Transit': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
      'Delivered': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
      'Processing': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
      'Pending Payment': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
      'Disputed': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' }
    };
    return configs[status];
  };

  return (
    <Layout>
      <div className="p-6 w-full">
        <div className="w-full max-w-8xl mx-auto">
          
          {/* Statistics Cards */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <TradeCard 
              title="Total Trades"
              value={totalTrades}
              highlight={`$${totalValue.toLocaleString()} total value`}
            />
            <TradeCard 
              title="Active Trades"
              value={activeTrades}
              highlight={`${completedTrades} completed`}
            />
          </div>
          
          {/* Search, Filter and Tab Navigation */}
          <div className="flex justify-between items-center mb-6">
            {/* Search and Filter on the left */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlass size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-[250px] pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#444444]"
                  placeholder="Search trades..."
                />
              </div>

              <FilterDropdown 
                options={filterOptions}
                onApplyFilters={handleApplyFilters}
              />
            </div>
            
            {/* Tab Navigation on the right */}
            <div className="flex space-x-1">
              {[
                { id: 'all', label: 'All Trades' },
                { id: 'active', label: 'Active' },
                { id: 'completed', label: 'Completed' },
                { id: 'disputed', label: 'Disputed' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-[#444444] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map(filterId => {
                const option = filterOptions.find(opt => opt.id === filterId);
                return option ? (
                  <div 
                    key={filterId}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm"
                  >
                    {option.label}
                    <button 
                      onClick={() => setActiveFilters(prev => prev.filter(id => id !== filterId))}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : null;
              })}
              <button 
                onClick={() => setActiveFilters([])}
                className="text-xs text-red-500"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Trades Table */}
          <div className="w-full">
            <div className="overflow-y-auto max-h-[510px] border rounded-lg bg-white border-gray-200">
              <table className="min-w-full table-fixed">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="py-4 text-left text-xs font-medium uppercase pl-6 w-32 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-600" />
                        <span>Trade ID</span>
                      </div>
                    </th>
                    <th className="py-4 text-left text-xs font-medium uppercase pl-4 w-48 text-gray-600">
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-gray-600" />
                        <span>Supplier</span>
                      </div>
                    </th>
                    <th className="py-4 text-left text-xs font-medium uppercase pl-4 w-40 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-gray-600" />
                        <span>Product</span>
                      </div>
                    </th>
                    <th className="py-4 text-left text-xs font-medium uppercase pl-4 w-28 text-gray-600">
                      <div className="flex items-center gap-2">
                        <CurrencyDollar size={16} className="text-gray-600" />
                        <span>Amount</span>
                      </div>
                    </th>
                    <th className="py-4 text-left text-xs font-medium uppercase pl-4 w-36 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-600" />
                        <span>Destination</span>
                      </div>
                    </th>
                    <th className="py-4 text-left text-xs font-medium uppercase pl-4 w-32 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-600" />
                        <span>Status</span>
                      </div>
                    </th>
                    <th className="py-4 text-left text-xs font-medium uppercase pl-4 w-32 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-600" />
                        <span>Expected</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white divide-gray-200">
                  {filteredTrades.map((trade) => {
                    const statusConfig = getStatusConfig(trade.status);
                    return (
                      <tr 
                        key={trade.id}
                        onClick={() => handleRowClick(trade.id)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="py-4 pl-6 text-sm font-medium text-gray-900">
                          {trade.id}
                        </td>
                        <td className="py-4 pl-4 text-sm text-gray-800">
                          <div className="truncate max-w-[180px]" title={trade.supplier}>
                            {trade.supplier}
                          </div>
                        </td>
                        <td className="py-4 pl-4 text-sm text-gray-800">
                          <div className="truncate max-w-[150px]" title={trade.product}>
                            {trade.product}
                          </div>
                        </td>
                        <td className="py-4 pl-4 text-sm font-medium text-gray-900">
                          {trade.amount}
                        </td>
                        <td className="py-4 pl-4 text-sm text-gray-800">
                          {trade.destination}
                        </td>
                        <td className="py-4 pl-4 text-sm">
                          <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${statusConfig.dot}`}></span>
                            {trade.status}
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-sm text-gray-800">
                          {trade.expectedDelivery}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredTrades.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No trades found</h3>
                <p className="text-gray-600">
                  {searchQuery ? `No trades match "${searchQuery}"` : `No ${selectedTab} trades found`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      <TradeModal
        isOpen={modalOpen}
        onClose={closeModal}
        trade={selectedTrade}
        onDownloadPDF={handleDownloadPDF}
      />
    </Layout>
  );
}