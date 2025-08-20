'use client';
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export default function Home() {
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready) {
      if (authenticated) {
        // If user is authenticated, redirect to dashboard
        window.location.href = process.env.NEXT_PUBLIC_DASHBOARD_URL || '/dashboard';
      } else {
        // If user is not authenticated, redirect to sign-in
        window.location.href = process.env.NEXT_PUBLIC_WEBSITE_URL + '/sign-in' || '/sign-in';
      }
    }
  }, [ready, authenticated]);

  // Show loading while determining where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Welcome to PaySlab</p>
        <p className="text-sm text-gray-500 mt-2">
          {ready 
            ? (authenticated ? 'Taking you to dashboard...' : 'Redirecting to sign-in...') 
            : 'Loading...'
          }
        </p>
      </div>
    </div>
  );
}