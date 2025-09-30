# Environment Switching Implementation

## 🎯 Overview

I've successfully implemented a dynamic environment switching system for the Mars Life application that allows switching between Development and Staging environments with the following components:

## 📁 Files Created/Modified

### 1. **Types** (`src/types/environment.ts`)
- `Environment` enum (DEVELOPMENT, STAGING, LOCAL)
- `EnvironmentConfig` interface
- `EnvironmentConfigs` type mapping

### 2. **Updated Constants** (`src/constants/constant.ts`)
- Dynamic environment configuration system
- Backward-compatible static exports
- Reactive getters for current environment values
- Environment switching utilities

### 3. **Environment Component**
- **`EnvironmentSwitcher.tsx`** - Full featured environment selector with all 3 environments

### 4. **Environment Hook** (`src/hooks/useEnvironment.ts`)
- React hook for environment-aware constants
- Automatic updates when environment changes

## 🎮 Environment Configurations

### **Development Environment** 🔧
```typescript
BUNDLER_ENDPOINT: 'https://api-dev.u3id.io/api/v3/'
API_KEY: "romEr6NRmjOhuJ8n2nIngTzE-zeH20UcjfyjTetsyVE"
TELEGRAM_REDIRECT_BOT: "layerg_ua_verification_dev_bot"
```

### **Staging Environment** 🚀 (Default)
```typescript
BUNDLER_ENDPOINT: "https://api-stg.u3id.io/api/v3/"
API_KEY: "JYcLrlBf53Uxr70eBEqKi8Fzda-UMeKnDHdju_qaYTk"
TELEGRAM_REDIRECT_BOT: "layerg_ua_verification_stg_bot"
```

### **Local Environment** 💻
```typescript
BUNDLER_ENDPOINT: "http://localhost:3003/api/v3/"
API_KEY: "tNSgo3zmkaxQTi4iKupFQ-wDDxq2MN4Foq7zrgalilU"
TELEGRAM_REDIRECT_BOT: "layerg_ua_verification_dev_bot"
```

## 🎛️ Environment Switcher Component

### **EnvironmentSwitcher** (Full Options)
- **Location**: Top-left corner  
- **Style**: Dropdown with all environment options
- **Function**: Switch between ALL environments (Dev, Staging, Local)
- **Features**: 
  - Current environment indicator
  - Configuration preview
  - Color-coded environments
  - Detailed endpoint information

## 🔧 How It Works

1. **Environment Selection**: User clicks toggle or dropdown
2. **Confirmation**: System shows confirmation dialog with endpoint details
3. **Storage**: Selection saved to localStorage as 'app-environment'
4. **Reload**: Page automatically reloads to apply new configuration
5. **Dynamic Constants**: All API calls use new environment endpoints

## 🎨 Visual Features

### Toggle Switch Indicators:
- **Development**: 🔧 Blue indicator, "DEV" label
- **Staging**: 🚀 Orange indicator, "STG" label  
- **Local**: 💻 Green indicator, "LOCAL" label

### Real-time Display:
- Current environment name and icon
- Active API endpoint URL
- Truncated API key for verification

## 🔒 Security & Behavior

- **Development Only**: Components only show in development mode
- **Persistent**: Environment choice persists across page reloads
- **Safe Switching**: Confirmation dialogs prevent accidental switches
- **SSR Compatible**: Defaults to Staging for server-side rendering
- **Graceful Fallback**: Falls back to Staging if invalid environment stored

## 🎯 Integration Points

The environment switching is integrated into:
- **API Calls**: All fetch requests use dynamic endpoints
- **Authentication**: OAuth redirects use environment-specific bots
- **Wallet Operations**: Both EOA and Smart Account APIs respect environment
- **Game Functions**: Lucky wheel spins use correct environment

## 🚀 Usage

### Quick Toggle (Recommended)
1. Look for the toggle switch in top-left: `DEV ⟷ STG`
2. Click to switch between Development and Staging
3. Confirm the switch in the dialog
4. Page reloads with new environment

### Full Environment Selector
1. Click the environment indicator (🚀 STAGING)
2. Select desired environment from dropdown
3. View configuration details before switching
4. Confirm and reload

## 📱 Mobile Friendly

Both components are responsive and work well on mobile devices with appropriate touch targets and readable text sizes.

## 🎉 Benefits

✅ **No Code Changes**: Switch environments without editing code  
✅ **Real-time Feedback**: Always know which environment you're using  
✅ **Safe Switching**: Confirmation prevents accidents  
✅ **Persistent**: Remembers your choice between sessions  
✅ **Developer Friendly**: Only shows in development mode  
✅ **Backward Compatible**: Existing code continues to work  

The environment switching system is now fully functional and ready for testing different backend environments!