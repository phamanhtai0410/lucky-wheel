"use client";

import React, { useState } from 'react';
import { ChevronDown, Wallet, Settings } from 'lucide-react';
import { WalletType, WalletOption, EmbeddedWallet, SmartAccount } from '@/types/wallet';
import { useWallet } from '@/contexts/WalletContext';

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: WalletType.SMART_ACCOUNT,
    name: 'Smart Account',
    description: 'Account abstraction with advanced features',
    endpoint: '/smart-account',
    icon: '🔮'
  },
  {
    id: WalletType.EOA_WALLET,
    name: 'EOA Wallet',
    description: 'External owned account (traditional wallet)',
    endpoint: '/eoa-wallet',
    icon: '👛'
  }
];

const WalletSelector: React.FC = () => {
  const {
    selectedWallet,
    selectedSpecificWallet,
    userWallets,
    setSelectedWallet,
    setSelectedSpecificWallet,
    getCurrentWalletAddress
  } = useWallet();

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);

  const selectedOption = WALLET_OPTIONS.find(option => option.id === selectedWallet) || WALLET_OPTIONS[0];

  const handleWalletTypeSelect = (option: WalletOption) => {
    setSelectedWallet(option.id);
    setIsTypeDropdownOpen(false);
    // Reset specific wallet selection when changing type
    setSelectedSpecificWallet(null);
  };

  const handleSpecificWalletSelect = (wallet: EmbeddedWallet | SmartAccount) => {
    setSelectedSpecificWallet(wallet);
    setIsWalletDropdownOpen(false);
  };

  const getAvailableWallets = (): (EmbeddedWallet | SmartAccount)[] => {
    if (!userWallets) return [];
    
    return selectedWallet === WalletType.SMART_ACCOUNT
      ? userWallets.smart_accounts
      : userWallets.embedded_wallets;
  };

  const formatWalletAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getWalletTypeInfo = (wallet: EmbeddedWallet | SmartAccount): string => {
    if (selectedWallet === WalletType.SMART_ACCOUNT) {
      const smartAccount = wallet as SmartAccount;
      return `${smartAccount.chain} • ${smartAccount.deployed ? 'Deployed' : 'Not Deployed'}`;
    } else {
      const embeddedWallet = wallet as EmbeddedWallet;
      return `${embeddedWallet.chain_type} • ${embeddedWallet.wallet_client_type}`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Debug Information */}
      <div className="p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
        <div><strong>Debug Info:</strong></div>
        <div>User wallets loaded: {userWallets ? 'Yes' : 'No'}</div>
        <div>Embedded wallets: {userWallets?.embedded_wallets?.length || 0}</div>
        <div>Smart accounts: {userWallets?.smart_accounts?.length || 0}</div>
        <div>Selected type: {selectedWallet}</div>
        <div>Available for current type: {getAvailableWallets().length}</div>
      </div>
      
      {/* Wallet Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Wallet Type</h3>
        <div className="relative">
          <div
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedOption.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">{selectedOption.name}</div>
                  <div className="text-sm text-gray-500">{selectedOption.description}</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {isTypeDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {WALLET_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleWalletTypeSelect(option)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0 ${
                    option.id === selectedWallet ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          Using <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">{selectedOption.endpoint}</code> APIs
        </div>
      </div>

      {/* Specific Wallet Selection - Always show */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Specific Wallet</h3>
        <div className="relative">
          <div
            onClick={() => {
              if (userWallets && getAvailableWallets().length > 0) {
                setIsWalletDropdownOpen(!isWalletDropdownOpen);
              }
            }}
            className={`w-full p-3 border border-gray-300 rounded-lg transition-colors bg-white ${
              userWallets && getAvailableWallets().length > 0 
                ? 'cursor-pointer hover:border-gray-400' 
                : 'cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-gray-500" />
                <div>
                  {!userWallets ? (
                    <div className="text-gray-500">Please authenticate to load wallets...</div>
                  ) : getAvailableWallets().length === 0 ? (
                    <div className="text-gray-500">
                      No {selectedWallet === WalletType.SMART_ACCOUNT ? 'smart accounts' : 'embedded wallets'} available
                    </div>
                  ) : selectedSpecificWallet ? (
                    <>
                      <div className="font-medium text-gray-900">
                        {formatWalletAddress(selectedSpecificWallet.address)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getWalletTypeInfo(selectedSpecificWallet)}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500">Select a wallet...</div>
                  )}
                </div>
              </div>
              {userWallets && getAvailableWallets().length > 0 && (
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isWalletDropdownOpen ? 'rotate-180' : ''}`} />
              )}
            </div>
          </div>

          {isWalletDropdownOpen && userWallets && getAvailableWallets().length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {getAvailableWallets().map((wallet) => (
                <div
                  key={wallet.id}
                  onClick={() => handleSpecificWalletSelect(wallet)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    selectedSpecificWallet?.id === wallet.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatWalletAddress(wallet.address)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getWalletTypeInfo(wallet)}
                        </div>
                      </div>
                    </div>
                    {selectedSpecificWallet?.id === wallet.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedSpecificWallet && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Current wallet: <strong>{getCurrentWalletAddress()}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletSelector;