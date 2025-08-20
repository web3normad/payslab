'use client';

import { PrivyProvider, User } from '@privy-io/react-auth';

interface PrivyProviderWrapperProps {
  children: React.ReactNode;
}

export default function PrivyProviderWrapper({ children }: PrivyProviderWrapperProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#000000',
          logo: '/images/logo-removebg-preview(1).png',
        },
        loginMethods: ['email', 'google', 'twitter'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        // Add network configuration for better reliability
        rpcConfig: {
          timeout: 30000, // 30 seconds timeout
        },
        // Add additional configuration for better error handling
        authFlow: {
          showWalletUIs: false, // Hide wallet UIs during email flow
        }
      }}
      onSuccess={(user: User, isNewUser: boolean, wasAlreadyAuthenticated: boolean) => {
        console.log('PrivyProvider: User authenticated successfully');
        console.log('User:', user);
        console.log('Is new user:', isNewUser);
        console.log('Was already authenticated:', wasAlreadyAuthenticated);
        
        // Only redirect if this is a fresh authentication (not already authenticated)
        if (!wasAlreadyAuthenticated) {
          const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001/dashboard';
          console.log('Redirecting to:', dashboardUrl);
          
          // Use a slight delay to ensure all state is updated
          setTimeout(() => {
            window.location.href = dashboardUrl;
          }, 500);
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}