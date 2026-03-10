'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, lightTheme, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = {
  children: ReactNode;
};

// TODO: mets ton vrai projectId WalletConnect ici (env var recommandé)
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'CHANGE_ME_PROJECT_ID';

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "ROUL'ETH",
    projectId: WALLETCONNECT_PROJECT_ID,
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
    ssr: true,
  })
);

const queryClient = new QueryClient();

export function Web3Provider({ children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme({
              accentColor: '#ef4444',
            }),
          }}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

