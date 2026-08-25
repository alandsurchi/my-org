import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '@/contexts/StaffAuthContext';

interface UseSecretAccessProps {
  enabled?: boolean;
  keySequence?: string[];
  clickSequence?: {
    selector: string;
    clicks: number;
    timeWindow: number;
  };
}

export const useSecretAccess = ({
  enabled = true,
  keySequence = ['Control', 'Alt', 'KeyA'],
  clickSequence = {
    selector: '.logo-trigger',
    clicks: 3,
    timeWindow: 2000
  }
}: UseSecretAccessProps = {}) => {
  const navigate = useNavigate();
  const { logout } = useStaffAuth();
  
  // Always redirect to staff-login page for proper authentication
  const staffLoginPath = '/staff-login';

  // Track pressed keys
  const pressedKeys = new Set<string>();
  
  // Track clicks
  let clickCount = 0;
  let lastClickTime = 0;

  const performSecretAccess = useCallback(() => {
    // Always logout first to clear any existing session
    logout();
    
    // Clear any localStorage authentication data
    localStorage.removeItem('staffUser');
    localStorage.removeItem('staffAuthTimestamp');
    localStorage.removeItem('staffSessionExpiry');
    
    
    // Navigate to login page
    navigate(staffLoginPath, { replace: true });
  }, [logout, navigate, staffLoginPath]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    pressedKeys.add(event.code);
    pressedKeys.add(event.key);

    // Check if all required keys are pressed
    const allKeysPressed = keySequence.every(key => 
      pressedKeys.has(key) || pressedKeys.has(key.toLowerCase())
    );

    if (allKeysPressed) {
      event.preventDefault();
      performSecretAccess();
      pressedKeys.clear();
    }
  }, [enabled, keySequence, performSecretAccess]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    pressedKeys.delete(event.code);
    pressedKeys.delete(event.key);
  }, []);

  const handleSecretClick = useCallback((event: Event) => {
    if (!enabled) return;

    const currentTime = Date.now();
    
    // Reset click count if too much time has passed
    if (currentTime - lastClickTime > clickSequence.timeWindow) {
      clickCount = 0;
    }
    
    clickCount++;
    lastClickTime = currentTime;
    
    if (clickCount >= clickSequence.clicks) {
      event.preventDefault();
      performSecretAccess();
      clickCount = 0;
    }
  }, [enabled, clickSequence, performSecretAccess]);

  useEffect(() => {
    if (!enabled) return;

    // Add keyboard listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Add click listeners for secret elements
    const secretElements = document.querySelectorAll(clickSequence.selector);
    secretElements.forEach(element => {
      element.addEventListener('click', handleSecretClick);
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      secretElements.forEach(element => {
        element.removeEventListener('click', handleSecretClick);
      });
    };
  }, [enabled, handleKeyDown, handleKeyUp, handleSecretClick, clickSequence.selector]);

  return {
    staffLoginPath,
    navigateToStaffLogin: () => performSecretAccess()
  };
};
