"use client";

import { WalletProvider } from '@/contexts/WalletContext';

interface ClientWalletProviderProps {
  children: React.ReactNode;
}

export default function ClientWalletProvider({ children }: ClientWalletProviderProps) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  );
}