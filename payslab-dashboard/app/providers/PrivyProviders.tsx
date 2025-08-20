'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import WagmiProviderWrapper from '../wagmi/WagmiProviderWrapper';

interface PrivyProviderWrapperProps {
  children: React.ReactNode;
}

export default function PrivyProviderWrapper({ children }: PrivyProviderWrapperProps) {
  const router = useRouter();

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#444444',
          logo: '/Payslab-logo.svg',
        },
        loginMethods: ['email', 'google', 'facebook'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
      onSuccess={(user) => {
        console.log('User authenticated in dashboard:', user);
      }}
    >
      <WagmiProviderWrapper>
        {children}
      </WagmiProviderWrapper>
    </PrivyProvider>
  );
}