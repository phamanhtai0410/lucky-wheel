"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletType, UserWallets, EmbeddedWallet, SmartAccount } from '@/types/wallet';

interface WalletContextType {
  selectedWallet: WalletType;
  selectedSpecificWallet: EmbeddedWallet | SmartAccount | null;
  userWallets: UserWallets | null;
  setSelectedWallet: (wallet: WalletType) => void;
  setSelectedSpecificWallet: (wallet: EmbeddedWallet | SmartAccount | null) => void;
  setUserWallets: (wallets: UserWallets) => void;
  getAPIEndpoint: () => string;
  getCurrentWalletAddress: () => string | null;
  getCurrentWalletId: () => string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // Default to Smart Account (first option)
  const [selectedWallet, setSelectedWalletState] = useState<WalletType>(WalletType.SMART_ACCOUNT);
  const [selectedSpecificWallet, setSelectedSpecificWalletState] = useState<EmbeddedWallet | SmartAccount | null>(null);
  const [userWallets, setUserWalletsState] = useState<UserWallets | null>(null);

  // Load saved wallet preference from localStorage
  useEffect(() => {
    const savedWallet = localStorage.getItem('selectedWalletType');
    if (savedWallet && Object.values(WalletType).includes(savedWallet as WalletType)) {
      setSelectedWalletState(savedWallet as WalletType);
    }

    // Load saved specific wallet
    const savedSpecificWallet = localStorage.getItem('selectedSpecificWallet');
    if (savedSpecificWallet) {
      try {
        const parsed = JSON.parse(savedSpecificWallet);
        setSelectedSpecificWalletState(parsed);
      } catch (error) {
        console.error('Error parsing saved specific wallet:', error);
      }
    }
  }, []);

  // Save wallet preference to localStorage
  const setSelectedWallet = (wallet: WalletType) => {
    setSelectedWalletState(wallet);
    localStorage.setItem('selectedWalletType', wallet);
    console.log(`🔄 Wallet type changed to: ${wallet}`);
    
    // Reset specific wallet when changing type
    setSelectedSpecificWalletState(null);
    localStorage.removeItem('selectedSpecificWallet');
  };

  // Save specific wallet selection
  const setSelectedSpecificWallet = (wallet: EmbeddedWallet | SmartAccount | null) => {
    setSelectedSpecificWalletState(wallet);
    if (wallet) {
      localStorage.setItem('selectedSpecificWallet', JSON.stringify(wallet));
      console.log(`🔄 Specific wallet changed to: ${wallet.address}`);
    } else {
      localStorage.removeItem('selectedSpecificWallet');
    }
  };

  // Set user wallets (called after authentication)
  const setUserWallets = (wallets: UserWallets) => {
    setUserWalletsState(wallets);
    
    // Auto-select first wallet if none selected (only once)
    if (!selectedSpecificWallet && wallets) {
      if (selectedWallet === WalletType.SMART_ACCOUNT && wallets.smart_accounts.length > 0) {
        setSelectedSpecificWallet(wallets.smart_accounts[0]);
      } else if (selectedWallet === WalletType.EOA_WALLET && wallets.embedded_wallets.length > 0) {
        setSelectedSpecificWallet(wallets.embedded_wallets[0]);
      }
    }
  };

  // Get the API endpoint for the selected wallet
  const getAPIEndpoint = (): string => {
    return selectedWallet === WalletType.SMART_ACCOUNT ? 'smart-account' : 'eoa-wallet';
  };

  // Get current wallet address
  const getCurrentWalletAddress = (): string | null => {
    return selectedSpecificWallet?.address || null;
  };

  // Get current wallet ID
  const getCurrentWalletId = (): string | null => {
    return selectedSpecificWallet?.id || null;
  };

  const value: WalletContextType = {
    selectedWallet,
    selectedSpecificWallet,
    userWallets,
    setSelectedWallet,
    setSelectedSpecificWallet,
    setUserWallets,
    getAPIEndpoint,
    getCurrentWalletAddress,
    getCurrentWalletId
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};