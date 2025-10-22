"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { baseSepolia } from "wagmi/chains";
import { http, WagmiProvider, createConfig } from "wagmi";
import { coinbaseWallet, metaMask, injected } from "wagmi/connectors";
import type { ReactNode } from "react";

// Create query client for React Query
const queryClient = new QueryClient();

// Configure wagmi for Base Sepolia with enhanced wallet support
const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    metaMask(), // MetaMask support
    injected(), // Other injected wallets (including Farcaster)
    coinbaseWallet({
      appName: "DarkPool Vault",
      preference: "smartWalletOnly",
    }),
  ],
  ssr: true, // Server-side rendering support
  transports: {
    [baseSepolia.id]: http(), // RPC endpoint
  },
});

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
