
import { useState, useEffect } from 'react';
import { EmbeddedWallet, SmartAccount } from '@/types/wallet';

export interface UserData {
  id: string;
  email: string;
  name: string;
  walletAddress?: string;
  avatar?: string;
  embedded_wallets?: EmbeddedWallet[];
  smart_accounts?: SmartAccount[];
  oauthProvider?: {
    name: string;
    icon: string;
    color: string;
  };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      const userDataStr = localStorage.getItem('userData');
      
      if (token && userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);

          let lastName = ''
          if (userData.googleLastName) {
            lastName = userData.googleLastName
          } else if (userData.twitterLastName) {
            lastName = userData.twitterLastName
          } else if (userData.twitterLastName) {
            lastName = userData.twitterLastName
          }else if (userData.telegramLastName) {
            lastName = userData.telegramLastName
          }

          let firstName = ''
          if (userData.googleFirstName) {
            firstName = userData.googleFirstName
          } else if (userData.twitterFirstName) {
            firstName = userData.twitterFirstName
          } else if (userData.twitterFirstName) {
            firstName = userData.twitterFirstName
          }else if (userData.telegramFirstName) {
            firstName = userData.telegramFirstName
          }
          
          // Detect OAuth provider
          let oauthProvider = undefined;
          if (userData.googleFirstName || userData.googleLastName || userData.googleAvatarUrl) {
            oauthProvider = { name: 'Google', icon: '🔍', color: 'bg-red-100 text-red-800' };
          } else if (userData.twitterFirstName || userData.twitterLastName || userData.twitterAvatarUrl) {
            oauthProvider = { name: 'Twitter', icon: '🐦', color: 'bg-blue-100 text-blue-800' };
          } else if (userData.facebookFirstName || userData.facebookLastName || userData.facebookAvatarUrl) {
            oauthProvider = { name: 'Facebook', icon: '📘', color: 'bg-blue-100 text-blue-800' };
          } else if (userData.telegramFirstName || userData.telegramLastName) {
            oauthProvider = { name: 'Telegram', icon: '✈️', color: 'bg-sky-100 text-sky-800' };
          }
          
          const avatarUrl = userData.googleAvatarUrl ? userData.googleAvatarUrl : (userData.twitterAvatarUrl ? userData.twitterAvatarUrl : userData.facebookAvatarUrl) || ''
          setUser({
            id: userData.id,
            email: userData.email,
            name: `${lastName} ${firstName}`,
            walletAddress: `${userData.eoaWallet}`,
            avatar: avatarUrl,
            embedded_wallets: userData.embedded_wallets || [],
            smart_accounts: userData.smart_accounts || [],
            oauthProvider,
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
          setIsAuthenticated(false);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Add listener for storage events (for multi-tab support)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'userData') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    logout
  };
}