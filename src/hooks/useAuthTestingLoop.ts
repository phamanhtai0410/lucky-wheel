import { useEffect, useState } from 'react';

interface AuthTestingLoopProps {
  enabled: boolean;
  interval?: number; // seconds between loops
  onAuthComplete?: (provider: string, success: boolean) => void;
}

export function useAuthTestingLoop({ enabled, interval = 10, onAuthComplete }: AuthTestingLoopProps) {
  const [currentProvider, setCurrentProvider] = useState<'google' | 'twitter' | null>(null);
  const [loopCount, setLoopCount] = useState(0);
  const [isLooping, setIsLooping] = useState(false);

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    console.log('🧹 Authentication cleared for testing');
  };

  const triggerAuth = (provider: 'google' | 'twitter') => {
    setCurrentProvider(provider);
    console.log(`🚀 Auto-triggering ${provider} authentication (Loop #${loopCount + 1})`);
    
    // Clear previous auth
    clearAuth();
    
    // Trigger authentication by clicking the appropriate button
    setTimeout(() => {
      const buttonText = provider === 'google' ? 'Continue with Google' : 'Continue with X (Twitter)';
      const button = document.querySelector(`button:has-text("${buttonText}"), [role="button"]:has-text("${buttonText}")`) as HTMLElement;
      
      if (button) {
        button.click();
        console.log(`✅ Clicked ${provider} button`);
      } else {
        // Try alternative selectors
        const buttons = Array.from(document.querySelectorAll('button'));
        const targetButton = buttons.find(btn => 
          btn.textContent?.toLowerCase().includes(provider) ||
          btn.textContent?.toLowerCase().includes(provider === 'google' ? 'google' : 'twitter')
        );
        
        if (targetButton) {
          targetButton.click();
          console.log(`✅ Clicked ${provider} button (alternative selector)`);
        } else {
          console.error(`❌ Could not find ${provider} login button`);
          onAuthComplete?.(provider, false);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    if (!enabled) {
      setIsLooping(false);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const startLoop = () => {
      setIsLooping(true);
      
      const runAuthCycle = () => {
        // Alternate between Google and Twitter
        const provider = loopCount % 2 === 0 ? 'google' : 'twitter';
        triggerAuth(provider);
        
        // Monitor for authentication completion
        const checkAuth = () => {
          const token = localStorage.getItem('token');
          const userData = localStorage.getItem('userData');
          
          if (token && userData) {
            console.log(`✅ ${provider} authentication completed successfully!`);
            const parsedData = JSON.parse(userData);
            console.log(`👤 Authenticated user:`, parsedData);
            
            onAuthComplete?.(provider, true);
            setLoopCount(prev => prev + 1);
            
            // Wait before next iteration
            timeoutId = setTimeout(() => {
              runAuthCycle();
            }, interval * 1000);
          }
        };
        
        // Check for auth completion every 2 seconds for up to 2 minutes
        let checkCount = 0;
        const maxChecks = 60; // 2 minutes
        
        const authCheckInterval = setInterval(() => {
          checkCount++;
          checkAuth();
          
          if (checkCount >= maxChecks) {
            clearInterval(authCheckInterval);
            console.log(`⏰ ${provider} authentication timeout, continuing to next iteration`);
            onAuthComplete?.(provider, false);
            setLoopCount(prev => prev + 1);
            
            timeoutId = setTimeout(() => {
              runAuthCycle();
            }, interval * 1000);
          }
        }, 2000);
        
        // Store interval ID for cleanup
        intervalId = authCheckInterval;
      };

      // Start the first cycle
      runAuthCycle();
    };

    startLoop();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      setIsLooping(false);
    };
  }, [enabled, interval, onAuthComplete]);

  return {
    isLooping,
    currentProvider,
    loopCount,
    clearAuth
  };
}
