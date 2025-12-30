import { useEffect, useRef } from 'react';
import { useSyncContext } from '../Contexts/SyncContext';
import { SYNC_EVENTS } from '../services/socketSync';

/**
 * Hook to handle overlay visibility sync events
 * 
 * @param {Object} options
 * @param {string} options.page - Page identifier ('floor', etc.)
 * @param {Function} options.onSync - Callback when sync event received: (showOverlays) => void
 */
export const useOverlayVisibilitySync = ({ page, onSync }) => {
  const { registerHandler } = useSyncContext();
  const onSyncRef = useRef(onSync);
  const pageRef = useRef(page);

  // Keep refs updated
  useEffect(() => {
    onSyncRef.current = onSync;
    pageRef.current = page;
  }, [onSync, page]);

  useEffect(() => {
    // Register handler for overlay visibility sync events
    const unsubscribe = registerHandler(SYNC_EVENTS.OVERLAY_VISIBILITY, (data) => {
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('👁️ Invalid overlay visibility sync data:', data);
        return;
      }

      const { page: eventPage, showOverlays } = data;

      // Check if event is for this component
      if (eventPage !== pageRef.current) {
        return;
      }

      if (showOverlays !== undefined && onSyncRef.current) {
        console.log(`👁️ [${pageRef.current}] Overlay visibility sync:`, showOverlays);
        onSyncRef.current(showOverlays);
      }
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [registerHandler]);
};

