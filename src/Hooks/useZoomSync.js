import { useEffect, useRef } from 'react';
import { useSyncContext } from '../Contexts/SyncContext';
import { SYNC_EVENTS } from '../services/socketSync';

/**
 * Hook to handle zoom sync events
 * 
 * @param {Function} onSync - Callback when sync event received: (data) => void
 */
export const useZoomSync = (onSync) => {
  const { registerHandler } = useSyncContext();
  const onSyncRef = useRef(onSync);

  // Keep ref updated
  useEffect(() => {
    onSyncRef.current = onSync;
  }, [onSync]);

  useEffect(() => {
    // Register handler for zoom sync events
    const unsubscribe = registerHandler(SYNC_EVENTS.ZOOM, (data) => {
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🔍 Invalid zoom sync data:', data);
        return;
      }

      if (onSyncRef.current) {
        console.log('🔍 Zoom sync:', data);
        onSyncRef.current(data);
      }
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [registerHandler]);
};

