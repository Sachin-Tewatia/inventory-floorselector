import { useEffect, useRef } from 'react';
import { useSyncContext } from '../Contexts/SyncContext';
import { SYNC_EVENTS } from '../services/socketSync';

/**
 * Hook to handle video playback sync events
 * 
 * @param {Object} options
 * @param {string} options.page - Page identifier ('home', 'tower')
 * @param {string} options.tower - Tower identifier (for tower page, optional)
 * @param {Function} options.onSync - Callback when sync event received: (data) => void
 */
export const useVideoPlaybackSync = ({ page, tower, onSync }) => {
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
    // Register handler for video playback sync events
    const unsubscribe = registerHandler(SYNC_EVENTS.VIDEO_PLAYBACK, (data) => {
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🎬 Invalid video playback sync data:', data);
        return;
      }

      const { page: eventPage, tower: eventTower } = data;

      // Check if event is for this component
      if (eventPage !== pageRef.current) {
        return;
      }

      // For tower page, also check tower matches
      if (pageRef.current === 'tower' && eventTower && eventTower !== towerRef.current) {
        return;
      }

      if (onSyncRef.current) {
        console.log(`🎬 [${pageRef.current}] Video playback sync:`, data);
        onSyncRef.current(data);
      }
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [registerHandler]);
};

