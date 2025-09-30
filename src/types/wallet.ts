export enum WalletType {
  EOA_WALLET = 'eoa-wallet',
  SMART_ACCOUNT = 'smart-account'
}

export interface WalletOption {
  id: WalletType;
  name: string;
  description: string;
  endpoint: string;
  icon?: string;
}

export interface WalletSelection {
  selectedWallet: WalletType;
  availableWallets: WalletOption[];
}

export interface WalletAPIEndpoints {
  [WalletType.EOA_WALLET]: string;
  [WalletType.SMART_ACCOUNT]: string;
}

// New types for user's specific wallets
export interface EmbeddedWallet {
  id: string;
  app_user_id: string;
  address: string;
  chain_type: string;
  encrypted_auth_key_share: string;
  created_at: string;
  updated_at: string;
  connector_type: string;
  wallet_client_type: string;
  recovery_method: string;
}

export interface SmartAccount {
  id: string;
  chain: string;
  address: string;
  deployed: boolean;
  app_user_id: string;
  wallet_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserWalletData {
  walletType: WalletType;
  walletAddress: string;
  walletId: string;
  // Add other wallet-specific data as needed
}

export interface UserWallets {
  embedded_wallets: EmbeddedWallet[];
  smart_accounts: SmartAccount[];
}

export interface WalletSelectionState {
  walletType: WalletType;
  selectedWallet: EmbeddedWallet | SmartAccount | null;
  availableWallets: UserWallets;
}