import { useEffect, useRef } from 'react';
import { useSyncContext } from '../Contexts/SyncContext';
import { SYNC_EVENTS } from '../services/socketSync';

/**
 * Hook to handle image/rotation navigation sync events
 * 
 * @param {Object} options
 * @param {string} options.page - Page identifier ('home', 'tower')
 * @param {string} options.tower - Tower identifier (for tower page)
 * @param {Function} options.onSync - Callback when sync event received: (imageNumber) => void
 */
export const useImageNavigationSync = ({ page, tower, onSync }) => {
  const { registerHandler } = useSyncContext();
  const onSyncRef = useRef(onSync);
  const pageRef = useRef(page);
  const towerRef = useRef(tower);

  // Keep refs updated
  useEffect(() => {
    onSyncRef.current = onSync;
    pageRef.current = page;
    towerRef.current = tower;
  }, [onSync, page, tower]);

  useEffect(() => {
    // Register handler for image navigation sync events
    const unsubscribe = registerHandler(SYNC_EVENTS.IMAGE_NAVIGATION, (data) => {
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🖼️ Invalid image navigation sync data:', data);
        return;
      }

      const { imageNumber, rotation, page: eventPage, tower: eventTower } = data;

      // Check if event is for this component
      if (eventPage !== pageRef.current) {
        return;
      }

      // For tower page, also check tower matches
      if (pageRef.current === 'tower' && eventTower && eventTower !== towerRef.current) {
        return;
      }

      // Use rotation if available (for tower), otherwise use imageNumber
      const syncValue = rotation !== undefined ? rotation : imageNumber;

      if (syncValue !== undefined && onSyncRef.current) {
        console.log(`🖼️ [${pageRef.current}] Image navigation sync:`, syncValue);
        onSyncRef.current(syncValue);
      }
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [registerHandler]);
};

