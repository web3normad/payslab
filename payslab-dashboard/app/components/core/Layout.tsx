'use client';

import React, { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Extract current tab from pathname
  const getCurrentTab = () => {
    if (pathname.startsWith('/dashboard')) return 'dashboard';
    if (pathname.startsWith('/convert')) return 'convert';
    if (pathname.startsWith('/trades')) return 'trades';
    if (pathname.startsWith('/credit')) return 'credit';
    if (pathname.startsWith('/wallet')) return 'wallet';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  const setActiveTab = (tab: string) => {
    router.push(`/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={getCurrentTab()} setActiveTab={setActiveTab} />
      <Navbar />
      
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;