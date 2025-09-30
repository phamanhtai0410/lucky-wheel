export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  LOCAL = 'local'
}

export interface EnvironmentConfig {
  BUNDLER_ENDPOINT: string;
  TELEGRAM_REDIRECT_BOT: string;
  API_KEY: string;
  SECRET_KEY: string;
}

export interface EnvironmentConfigs {
  [Environment.DEVELOPMENT]: EnvironmentConfig;
  [Environment.STAGING]: EnvironmentConfig;
  [Environment.LOCAL]: EnvironmentConfig;
}