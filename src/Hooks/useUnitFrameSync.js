import { useEffect, useRef } from 'react';
import { useSyncContext } from '../Contexts/SyncContext';
import { SYNC_EVENTS } from '../services/socketSync';

/**
 * Hook to handle unit frame sync events
 * 
 * @param {Object} options
 * @param {string} options.unitType - Unit type identifier (e.g., 'c', 'd', 'e')
 * @param {string} options.unitId - Optional unit ID for filtering
 * @param {Function} options.onSync - Callback when sync event received: (frameIndex) => void
 */
export const useUnitFrameSync = ({ unitType, unitId, onSync }) => {
  const { registerHandler } = useSyncContext();
  const onSyncRef = useRef(onSync);
  const unitTypeRef = useRef(unitType);
  const unitIdRef = useRef(unitId);

  // Keep refs updated
  useEffect(() => {
    onSyncRef.current = onSync;
    unitTypeRef.current = unitType;
    unitIdRef.current = unitId;
  }, [onSync, unitType, unitId]);

  useEffect(() => {
    // Register handler for unit frame sync events
    const unsubscribe = registerHandler(SYNC_EVENTS.UNIT_FRAME, (data) => {
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🎬 Invalid unit frame sync data:', data);
        return;
      }

      const { unitType: eventUnitType, unitId: eventUnitId, frameIndex } = data;

      // Check if event is for this component
      if (eventUnitType !== unitTypeRef.current) {
        return;
      }

      // If unitId is provided, check if it matches
      if (unitIdRef.current && eventUnitId && eventUnitId !== unitIdRef.current) {
        return;
      }

      if (frameIndex !== undefined && onSyncRef.current) {
        console.log(`🎬 [UnitFrame] Frame sync:`, { unitType: eventUnitType, frameIndex });
        onSyncRef.current(frameIndex);
      }
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [registerHandler]);
};

