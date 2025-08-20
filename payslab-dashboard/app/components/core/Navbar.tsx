// components/core/Navbar.tsx (Enhanced)
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, MagnifyingGlass, CaretDown, SignOut, User } from '@phosphor-icons/react';
import { usePrivy } from '@privy-io/react-auth';

const Navbar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { user, logout } = usePrivy();

  // Auto-logout after 20 minutes of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let warningTimeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      clearTimeout(warningTimeout);
      
      // Show warning at 19 minutes (1 minute before logout)
      warningTimeout = setTimeout(() => {
        const shouldContinue = window.confirm(
          'You will be logged out in 1 minute due to inactivity. Click OK to stay logged in.'
        );
        if (shouldContinue) {
          resetTimer(); // Reset the timer if user wants to continue
        }
      }, 19 * 60 * 1000); // 19 minutes

      // Auto-logout at 20 minutes
      timeout = setTimeout(() => {
        alert('You have been logged out due to inactivity.');
        handleLogout();
      }, 20 * 60 * 1000); // 20 minutes
    };

    const handleActivity = () => {
      resetTimer();
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetTimer();

    return () => {
      clearTimeout(timeout);
      clearTimeout(warningTimeout);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  // Load business name and email from localStorage
  useEffect(() => {
    const savedBusinessName = localStorage.getItem('payslab_business_name');
    const savedEmail = localStorage.getItem('payslab_user_email');
    
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
    }
    
    // Prioritize saved email, then fallback to Privy user data
    if (savedEmail) {
      setUserEmail(savedEmail);
    } else if (user?.email?.address) {
      setUserEmail(user.email.address);
    } else if (user?.google?.email) {
      setUserEmail(user.google.email);
    }
  }, [user]);

  const handleLogout = useCallback(() => {
    // Clear localStorage data
    localStorage.removeItem('payslab_business_name');
    localStorage.removeItem('payslab_user_email');
    
    logout();
    setShowDropdown(false);
    
    // Redirect to sign-in page
    setTimeout(() => {
      window.location.href = process.env.NEXT_PUBLIC_WEBSITE_URL + '/sign-in' || '/sign-in';
    }, 100);
  }, [logout]);

  const getUserDisplayName = () => {
    // Use business name if available, otherwise fall back to user name
    if (businessName) {
      return businessName;
    }
    
    if (user?.email?.address) {
      return user.email.address.split('@')[0];
    }
    if (user?.google?.name) {
      return user.google.name;
    }
    if (user?.twitter?.name) {
      return user.twitter.name;
    }
    if (user?.farcaster?.displayName) {
      return user.farcaster.displayName;
    }
    return 'User';
  };

  const getDisplayEmail = () => {
    return userEmail || getUserEmail();
  };

  const getUserEmail = () => {
    if (user?.email?.address) {
      return user.email.address;
    }
    if (user?.google?.email) {
      return user.google.email;
    }
    return '';
  };

  const getUserInitials = () => {
    const name = businessName || getUserDisplayName();
    if (name.includes(' ')) {
      // If name has spaces, use first letter of first and last word
      const words = name.split(' ');
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    // If single word, use first two characters
    return name.substring(0, 2).toUpperCase();
  };

  const getAccountType = () => {
    return businessName ? 'Business Account' : 'Personal Account';
  };

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative w-full">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search trades, suppliers, or tracking..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#444444] focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
            {getUserInitials()}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900 truncate max-w-32">
              {getUserDisplayName()}
            </p>
            <p className="text-xs text-gray-500">{getAccountType()}</p>
          </div>
          
          {/* Dropdown Container */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <CaretDown size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                
                <div className="absolute right-0 top-8 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {getUserDisplayName()}
                        </p>
                        {getDisplayEmail() && (
                          <p className="text-sm text-gray-500 truncate">
                            {getDisplayEmail()}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Verified Trader
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {getAccountType()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Business Info (if available) */}
                  {businessName && (
                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Business Information</p>
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {businessName}
                      </p>
                      {getDisplayEmail() && (
                        <p className="text-xs text-gray-500">
                          Contact: {getDisplayEmail()}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Wallet Info (if available) */}
                  {user?.wallet?.address && (
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Wallet Address</p>
                      <p className="text-sm font-mono text-gray-700 truncate">
                        {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
                      </p>
                    </div>
                  )}
                  
                  {/* Session Info */}
                  <div className="px-4 py-2 border-b border-gray-100 bg-yellow-50">
                    <p className="text-xs text-yellow-700">
                      🔒 Auto-logout in 20 minutes of inactivity
                    </p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        // Add profile navigation logic here
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User size={16} />
                      <span>Profile Settings</span>
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <SignOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;