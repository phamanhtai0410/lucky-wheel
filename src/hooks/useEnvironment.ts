"use client";

import { useState, useEffect } from 'react';
import { Environment, EnvironmentConfig } from '@/types/environment';
import { 
  getCurrentEnvironmentName, 
  getEnvironmentConfig, 
  getBundlerEndpoint,
  getApiKey,
  getSecretKey,
  getTelegramRedirectBot
} from '@/constants/constant';

export const useEnvironment = () => {
  const [currentEnv, setCurrentEnv] = useState<Environment>(Environment.STAGING);
  const [config, setConfig] = useState<EnvironmentConfig>(getEnvironmentConfig(Environment.STAGING));

  useEffect(() => {
    const updateEnvironment = () => {
      const env = getCurrentEnvironmentName();
      const envConfig = getEnvironmentConfig(env);
      setCurrentEnv(env);
      setConfig(envConfig);
    };

    updateEnvironment();

    // Listen for environment changes
    const handleStorageChange = () => {
      updateEnvironment();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    environment: currentEnv,
    config,
    BUNDLER_ENDPOINT: getBundlerEndpoint(),
    API_KEY: getApiKey(),
    SECRET_KEY: getSecretKey(),
    TELEGRAM_REDIRECT_BOT: getTelegramRedirectBot()
  };
};