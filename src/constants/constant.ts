import { Environment, EnvironmentConfig, EnvironmentConfigs } from '@/types/environment';

// Static contracts (same across environments)
export const LUCKY_WHEEL_CONTRACT =
  "0xaB6Cdd1e0F6C884638C1BfF759EC7D1104ce3713";
export const LUCKY_WHEEL_CONTRACT_A8_TESTNET =
  "0x7b5EcFe4D59ba08b85e5230e3E2a2Aca7f476692";

// Environment configurations
const ENVIRONMENT_CONFIGS: EnvironmentConfigs = {
  [Environment.DEVELOPMENT]: {
    BUNDLER_ENDPOINT: 'https://api-dev.u3id.io/api/v3/',
    TELEGRAM_REDIRECT_BOT: "https://t.me/layerg_ua_verification_dev_bot?start=login-1-romEr6NRmjOhuJ8n2nIngTzE-zeH20UcjfyjTetsyVE",
    API_KEY: "romEr6NRmjOhuJ8n2nIngTzE-zeH20UcjfyjTetsyVE",
    SECRET_KEY: "rtengzStS0NwWbo0PEabitiBWWqW7CloUkh1ckWvcpIlVP4jxvOvOp0WixdQ-lkhOVHf5-QiI4Cp_5B-fGKHAQ"
  },
  [Environment.STAGING]: {
    BUNDLER_ENDPOINT: "https://api-stg.u3id.io/api/v3/",
    TELEGRAM_REDIRECT_BOT: "https://t.me/layerg_ua_verification_stg_bot?start=login-1-JYcLrlBf53Uxr70eBEqKi8Fzda-UMeKnDHdju_qaYTk",
    API_KEY: "JYcLrlBf53Uxr70eBEqKi8Fzda-UMeKnDHdju_qaYTk",
    SECRET_KEY: "ZK_Sp1gHsABqUF6f3MB4XieOSPKrHlyelkli30nmWorPDKZREWSZoZNkyQooCTfSsRg1C9DpcaGYz6D_0VL_OQ"
  },
  [Environment.LOCAL]: {
    BUNDLER_ENDPOINT: "http://localhost:3003/api/v3/",
    TELEGRAM_REDIRECT_BOT: "https://t.me/layerg_ua_verification_dev_bot?start=login-1-tNSgo3zmkaxQTi4iKupFQ-wDDxq2MN4Foq7zrgalilU",
    API_KEY: "tNSgo3zmkaxQTi4iKupFQ-wDDxq2MN4Foq7zrgalilU",
    SECRET_KEY: "f_AH46D7wROsaTZv-Ti6TzJdUVLMhczjh3r3plP-ANhPJcB2EDcJbneUYQeadZTTovn9iSpktW21OA2US4Y-Dg"
  }
};

// Get current environment from localStorage or default to staging
function getCurrentEnvironment(): Environment {
  if (typeof window === 'undefined') {
    return Environment.STAGING; // Default for SSR
  }
  
  const stored = localStorage.getItem('app-environment');
  if (stored && Object.values(Environment).includes(stored as Environment)) {
    return stored as Environment;
  }
  
  return Environment.STAGING; // Default environment
}

// Get current environment config
function getCurrentConfig(): EnvironmentConfig {
  const env = getCurrentEnvironment();
  return ENVIRONMENT_CONFIGS[env];
}

// Export reactive getters instead of static values
export const getBundlerEndpoint = (): string => getCurrentConfig().BUNDLER_ENDPOINT;
export const getTelegramRedirectBot = (): string => getCurrentConfig().TELEGRAM_REDIRECT_BOT;
export const getApiKey = (): string => getCurrentConfig().API_KEY;
export const getSecretKey = (): string => getCurrentConfig().SECRET_KEY;

// Export static values for backward compatibility
export const BUNDLER_ENDPOINT = ENVIRONMENT_CONFIGS[Environment.STAGING].BUNDLER_ENDPOINT;
export const TELEGRAM_REDIRECT_BOT = ENVIRONMENT_CONFIGS[Environment.STAGING].TELEGRAM_REDIRECT_BOT;
export const API_KEY = ENVIRONMENT_CONFIGS[Environment.STAGING].API_KEY;
export const SECRET_KEY = ENVIRONMENT_CONFIGS[Environment.STAGING].SECRET_KEY;

// Export utility functions for environment switching
export const switchEnvironment = (env: Environment): void => {
  console.log('switchEnvironment called with:', env);
  
  if (typeof window !== 'undefined') {
    console.log('Setting localStorage and reloading...');
    localStorage.setItem('app-environment', env);
    // Reload the page to apply new configuration
    window.location.reload();
  } else {
    console.log('Window not available (SSR)');
  }
};

export const getCurrentEnvironmentName = (): Environment => {
  return getCurrentEnvironment();
};

export const getEnvironmentConfig = (env: Environment): EnvironmentConfig => {
  return ENVIRONMENT_CONFIGS[env];
};

export const getAllEnvironments = (): Environment[] => {
  return Object.values(Environment);
};