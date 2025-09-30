import { useEffect, useState } from 'react';

interface AutoAuthLoopProps {
  enabled: boolean;
  interval: number; // seconds between loops
}

export const useAutoAuthLoop = ({ enabled, interval }: AutoAuthLoopProps) => {
  const [loopCount, setLoopCount] = useState(0);
  const [currentProvider, setCurrentProvider] = useState<'google' | 'twitter'>('google');

  useEffect(() => {
    if (!enabled) return;

    const runLoop = () => {
      console.log(`🔄 Auto Auth Loop #${loopCount + 1} - Using ${currentProvider}`);
      
      // Clear existing auth
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Increment counter and switch provider for next iteration
      setLoopCount(prev => prev + 1);
      setCurrentProvider(prev => prev === 'google' ? 'twitter' : 'google');
      
      // Force page reload to reset auth state and show login form
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    };

    // Start the loop after initial delay
    const timeoutId = setTimeout(runLoop, interval * 1000);

    return () => clearTimeout(timeoutId);
  }, [enabled, loopCount, currentProvider, interval]);

  return { loopCount, currentProvider };
};

// Auto-clicker for login buttons
export const useAutoLoginClicker = (enabled: boolean, targetProvider: 'google' | 'twitter') => {
  useEffect(() => {
    if (!enabled) return;

    const clickLogin = () => {
      const buttonText = targetProvider === 'google' ? 'Google' : 'Twitter';
      
      // Find buttons containing the provider name
      const buttons = Array.from(document.querySelectorAll('button'));
      const targetButton = buttons.find(btn => 
        btn.textContent?.toLowerCase().includes(buttonText.toLowerCase()) &&
        !btn.disabled &&
        btn.offsetParent !== null // is visible
      );

      if (targetButton) {
        console.log(`🎯 Auto-clicking ${targetProvider} login button`);
        targetButton.click();
        return true;
      }
      return false;
    };

    // Try clicking immediately
    if (!clickLogin()) {
      // If not found, keep trying every second for up to 10 seconds
      let attempts = 0;
      const maxAttempts = 10;
      
      const intervalId = setInterval(() => {
        attempts++;
        
        if (clickLogin() || attempts >= maxAttempts) {
          clearInterval(intervalId);
          if (attempts >= maxAttempts) {
            console.log(`❌ Could not find ${targetProvider} button after ${maxAttempts} attempts`);
          }
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [enabled, targetProvider]);
};
