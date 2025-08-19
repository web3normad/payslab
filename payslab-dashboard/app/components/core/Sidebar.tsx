'use client';

import React from 'react';
import { 
  House, 
  ArrowsLeftRight, 
  ShoppingBag, 
  FileText, 
  Wallet,
  Gear,
  CurrencyDollar
} from '@phosphor-icons/react';
import Card from '../ui/Card';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: House },
    { id: 'convert', label: 'Convert NGN', icon: ArrowsLeftRight },
    { id: 'trades', label: 'My Trades', icon: ShoppingBag },
    { id: 'credit', label: 'Letter of Credit', icon: FileText },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Gear }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#373941]">PaySlab</h1>
        <p className="text-sm text-gray-500">Trade Platform</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-[#8b61c2] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <Card className="bg-gradient-to-r from-[#8b61c2] to-[#7952a8] text-white border-0 p-4">
          <div className="flex items-center space-x-3">
            <CurrencyDollar size={24} />
            <div>
              <p className="text-sm font-medium">USDC Balance</p>
              <p className="text-lg font-bold">$2,450.00</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;