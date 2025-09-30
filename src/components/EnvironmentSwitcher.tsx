"use client";

import React, { useState, useEffect } from 'react';
import { Environment } from '@/types/environment';
import { 
  switchEnvironment, 
  getCurrentEnvironmentName
} from '@/constants/constant';

const EnvironmentSwitcher: React.FC = () => {
  const [currentEnv, setCurrentEnv] = useState<Environment>(Environment.STAGING);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const env = getCurrentEnvironmentName();
    console.log('Initial environment loaded:', env);
    setCurrentEnv(env);
  }, []);

  const handleToggle = async () => {
    console.log('Toggle clicked, current env:', currentEnv);
    
    // Toggle between development and staging
    const newEnv = currentEnv === Environment.DEVELOPMENT ? Environment.STAGING : Environment.DEVELOPMENT;
    console.log('Switching to:', newEnv);
    
    setIsChanging(true);
    
    try {
      const confirmed = window.confirm(
        `Switch to ${newEnv.toUpperCase()} environment?\n\nThis will reload the page.`
      );
      
      console.log('User confirmed:', confirmed);

      if (confirmed) {
        console.log('Switching environment to:', newEnv);
        switchEnvironment(newEnv);
      } else {
        console.log('Environment switch cancelled');
        setIsChanging(false);
      }
    } catch (error) {
      console.error('Error during environment switch:', error);
      setIsChanging(false);
    }
  };

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200">
        {/* Current Environment Label */}
        <div className="text-sm font-medium text-gray-800">
          Environment:
        </div>
        
        {/* Toggle Switch */}
        <div 
          onClick={handleToggle}
          className={`
            relative inline-flex h-8 w-16 items-center rounded-full cursor-pointer transition-colors duration-200 shadow-md
            ${currentEnv === Environment.DEVELOPMENT ? 'bg-blue-500' : 'bg-orange-500'}
            ${isChanging ? 'opacity-50 pointer-events-none' : 'hover:opacity-90'}
          `}
        >
          {/* Toggle Button */}
          <div
            className={`
              inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 shadow-lg
              ${currentEnv === Environment.DEVELOPMENT ? 'translate-x-1' : 'translate-x-9'}
            `}
          />
          
          {/* Labels */}
          <div className="absolute inset-0 flex items-center justify-between px-1 text-xs font-bold text-white">
            <span className={currentEnv === Environment.DEVELOPMENT ? 'opacity-100' : 'opacity-70'}>
              DEV
            </span>
            <span className={currentEnv === Environment.STAGING ? 'opacity-100' : 'opacity-70'}>
              STG
            </span>
          </div>
        </div>
        
        {/* Current Environment Display */}
        <div className={`
          px-3 py-1 rounded-md text-sm font-bold text-white shadow-md
          ${currentEnv === Environment.DEVELOPMENT ? 'bg-blue-500' : 'bg-orange-500'}
        `}>
          {currentEnv === Environment.DEVELOPMENT ? '🔧 DEVELOPMENT' : '🚀 STAGING'}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSwitcher;