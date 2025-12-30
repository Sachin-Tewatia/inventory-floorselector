import { useEffect, useRef } from 'react';
import { useSyncContext } from '../Contexts/SyncContext';
import { SYNC_EVENTS } from '../services/socketSync';

/**
 * Hook to handle disclaimer modal sync events
 * 
 * @param {Function} onSync - Callback when sync event received: (isOpen) => void
 */
export const useDisclaimerModalSync = (onSync) => {
  const { registerHandler } = useSyncContext();
  const onSyncRef = useRef(onSync);

  // Keep ref updated
  useEffect(() => {
    onSyncRef.current = onSync;
  }, [onSync]);

  useEffect(() => {
    // Register handler for disclaimer modal sync events
    const unsubscribe = registerHandler(SYNC_EVENTS.DISCLAIMER_MODAL, (data) => {
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('📋 Invalid disclaimer modal sync data:', data);
        return;
      }

      const { isOpen } = data;

      if (isOpen !== undefined && onSyncRef.current) {
        console.log('📋 Disclaimer modal sync:', isOpen);
        onSyncRef.current(isOpen);
      }
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [registerHandler]);
};

