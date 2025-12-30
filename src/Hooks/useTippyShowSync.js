import { useEffect, useRef } from 'react';
import { useSyncContext } from '../Contexts/SyncContext';
import { SYNC_EVENTS } from '../services/socketSync';

/**
 * Hook to handle tippy show sync events
 * 
 * @param {Object} options
 * @param {string} options.page - Page identifier ('home', 'tower', 'floor')
 * @param {string} options.tower - Tower identifier (for tower/floor pages, optional)
 * @param {string} options.floor - Floor identifier (for floor page, optional)
 * @param {Function} options.onSync - Callback when sync event received: (data) => void
 */
export const useTippyShowSync = ({ page, tower, floor, onSync }) => {
  const { registerHandler } = useSyncContext();
  const onSyncRef = useRef(onSync);
  const pageRef = useRef(page);
  const towerRef = useRef(tower);
  const floorRef = useRef(floor);

  // Keep refs updated
  useEffect(() => {
    onSyncRef.current = onSync;
    pageRef.current = page;
    towerRef.current = tower;
    floorRef.current = floor;
  }, [onSync, page, tower, floor]);

  useEffect(() => {
    // Register handler for tippy show sync events
    const unsubscribe = registerHandler(SYNC_EVENTS.TIPPY_SHOW, (data) => {
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('💬 Invalid tippy show sync data:', data);
        return;
      }

      const { page: eventPage, tower: eventTower, floor: eventFloor } = data;

      // Check if event is for this component
      if (eventPage !== pageRef.current) {
        return;
      }

      // For tower page, check tower matches
      if (pageRef.current === 'tower' && eventTower && eventTower !== towerRef.current) {
        return;
      }

      // For floor page, check tower and floor match
      if (pageRef.current === 'floor') {
        if (eventTower && eventTower !== towerRef.current) {
          return;
        }
        if (eventFloor && eventFloor !== floorRef.current) {
          return;
        }
      }

      if (onSyncRef.current) {
        console.log(`💬 [${pageRef.current}] Tippy show sync:`, data);
        onSyncRef.current(data);
      }
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [registerHandler]);
};

