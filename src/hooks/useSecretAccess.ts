import { useEffect, useCallback, useRef } from 'react';
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

const STAFF_LOGIN_PATH = '/staff-login';

/**
 * Hidden shortcuts to the staff login page:
 * - press the key combination (default Ctrl+Alt+A), or
 * - click the element matching `clickSequence.selector` N times quickly.
 */
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

  // Mutable trackers must survive re-renders, so they live in refs.
  const pressedKeys = useRef(new Set<string>());
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  const performSecretAccess = useCallback(() => {
    // Always start from a clean session
    logout();
    localStorage.removeItem('staffUser');
    localStorage.removeItem('staffAuthTimestamp');
    localStorage.removeItem('staffSessionExpiry');
    navigate(STAFF_LOGIN_PATH, { replace: true, state: { fromSecret: true } });
  }, [logout, navigate]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    pressedKeys.current.add(event.code);
    pressedKeys.current.add(event.key);

    const allKeysPressed = keySequence.every(
      (key) => pressedKeys.current.has(key) || pressedKeys.current.has(key.toLowerCase())
    );
    if (allKeysPressed) {
      event.preventDefault();
      pressedKeys.current.clear();
      performSecretAccess();
    }
  }, [enabled, keySequence, performSecretAccess]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    pressedKeys.current.delete(event.code);
    pressedKeys.current.delete(event.key);
  }, []);

  const handleSecretClick = useCallback((event: Event) => {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastClickTime.current > clickSequence.timeWindow) {
      clickCount.current = 0;
    }
    clickCount.current += 1;
    lastClickTime.current = now;

    if (clickCount.current >= clickSequence.clicks) {
      event.preventDefault();
      clickCount.current = 0;
      performSecretAccess();
    }
  }, [enabled, clickSequence.clicks, clickSequence.timeWindow, performSecretAccess]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const secretElements = document.querySelectorAll(clickSequence.selector);
    secretElements.forEach((element) => element.addEventListener('click', handleSecretClick));

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      secretElements.forEach((element) => element.removeEventListener('click', handleSecretClick));
    };
  }, [enabled, handleKeyDown, handleKeyUp, handleSecretClick, clickSequence.selector]);

  return {
    staffLoginPath: STAFF_LOGIN_PATH,
    navigateToStaffLogin: performSecretAccess
  };
};
