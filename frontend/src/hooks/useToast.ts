/**
 * useToast Hook
 * Manages toast notification state and display logic
 *
 * @module hooks/useToast
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { TOAST_DURATION } from '@/constants';

export interface UseToastReturn {
  /** Whether toast is currently visible */
  isVisible: boolean;
  /** Current toast message */
  message: string;
  /** Show toast with a message */
  showToast: (message: string, duration?: number) => void;
  /** Hide toast immediately */
  hideToast: () => void;
}

/**
 * Custom hook for managing toast notifications
 * Automatically hides toast after specified duration
 *
 * @param defaultDuration - Default display duration in milliseconds
 * @returns Toast state and control functions
 *
 * @example
 * function MyComponent() {
 *   const { isVisible, message, showToast } = useToast();
 *
 *   const handleClick = () => {
 *     showToast('Operation successful!');
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleClick}>Click me</button>
 *       {isVisible && <Toast message={message} />}
 *     </>
 *   );
 * }
 */
export function useToast(defaultDuration: number = TOAST_DURATION): UseToastReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const hideToast = useCallback(() => {
    setIsVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (msg: string, duration: number = defaultDuration) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setMessage(msg);
      setIsVisible(true);

      // Auto-hide after duration
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        timeoutRef.current = null;
      }, duration);
    },
    [defaultDuration]
  );

  return {
    isVisible,
    message,
    showToast,
    hideToast,
  };
}
