'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '@/public/Payslab-logo.svg'; 
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
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set initial date/time
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );

    setCurrentTime(
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="relative w-8 h-8 flex-shrink-0">
            {/* Replace with your actual logo or use placeholder */}
            <Image src={Logo} alt="PaySlab Logo" layout="fill" objectFit="contain" />
          </div>
          <h1 className="text-2xl font-bold text-[#373941]" style={{ fontFamily: 'ClashDisplay-Bold, sans-serif' }}>
            PaySlab
          </h1>
        </div>
        {/* Date and Time */}
        <div className="text-sm text-gray-400 mt-1">
          {currentDate} | {currentTime}
        </div>
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
                  ? 'bg-[#444444] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium" style={{ fontFamily: 'ClashDisplay-Bold, sans-serif' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <Card className="bg-[linear-gradient(135deg,rgb(131,131,131)_-35%,rgba(41,41,41,0.34)_-20%,rgba(51,51,51,0.55)_-15%,rgb(47,47,47)_100%)] text-white border-0 p-4">
          <div className="flex items-center space-x-3">
            <CurrencyDollar size={24} />
            <div>
              <p className="text-sm font-medium">USDC Balance</p>
              <p className="text-lg font-bold" style={{ fontFamily: 'ClashDisplay-Bold, sans-serif' }}>
                $2,450.00
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;