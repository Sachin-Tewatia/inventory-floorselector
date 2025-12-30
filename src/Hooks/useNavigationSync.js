import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoomId } from './useRoomId';
import { emitSync, SYNC_EVENTS, getReceivingSync } from '../services/socketSync';

/**
 * Hook that intercepts navigation and emits sync events
 * Should be called in components that need to sync navigation
 */
export const useNavigationSync = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useRoomId();
  const lastPathRef = useRef(location.pathname + location.search);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const previousPath = lastPathRef.current;

    // Only emit if path actually changed and we're not receiving sync
    if (currentPath !== previousPath && !getReceivingSync() && !isNavigatingRef.current && roomId) {
      console.log('📤 Navigation detected - emitting sync event:', {
        from: previousPath,
        to: currentPath,
        roomId: roomId
      });

      // Emit navigation sync event
      emitSync(SYNC_EVENTS.NAVIGATION, {
        pathname: location.pathname,
        search: location.search,
        path: currentPath, // Full path with query params
        state: location.state,
      }, roomId);

      lastPathRef.current = currentPath;
    } else {
      if (getReceivingSync()) {
        console.log('⏭️ Skipping navigation emit - currently receiving sync');
      } else if (!roomId) {
        console.log('⏭️ Skipping navigation emit - no roomId');
      } else if (isNavigatingRef.current) {
        console.log('⏭️ Skipping navigation emit - navigation in progress');
      } else {
        console.log('⏭️ Skipping navigation emit - path unchanged');
      }
    }

    // Reset navigating flag after navigation completes
    if (isNavigatingRef.current) {
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
    }
  }, [location.pathname, location.search, location.state, roomId]);

  // Return enhanced navigate function that marks navigation as in progress
  return {
    navigate: (to, options) => {
      if (!getReceivingSync() && roomId) {
        isNavigatingRef.current = true;
        console.log('🎯 Programmatic navigation:', { to, options, roomId });
      }
      navigate(to, options);
    }
  };
};

