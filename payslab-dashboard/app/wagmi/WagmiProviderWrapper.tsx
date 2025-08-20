'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

// Configure Wagmi
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

interface WagmiProviderWrapperProps {
  children: React.ReactNode;
}

// Custom hook to connect Privy with Wagmi
function usePrivyWagmiAdapter() {
  const { user, ready } = usePrivy();
  const [walletClient, setWalletClient] = useState<any>(null);

  useEffect(() => {
    if (ready && user?.wallet) {
      // In a real implementation, you would create a wallet client from the Privy wallet
      // For now, we'll just set a placeholder
      setWalletClient({
        // Mock wallet client methods
        getAddress: async () => user.wallet?.address,
        signMessage: async (message: string) => {
          // This would use Privy's signing methods
          return '0x' + Math.random().toString(16).substring(2, 66);
        }
      });
    }
  }, [user, ready]);

  return walletClient;
}

export default function WagmiProviderWrapper({ children }: WagmiProviderWrapperProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}