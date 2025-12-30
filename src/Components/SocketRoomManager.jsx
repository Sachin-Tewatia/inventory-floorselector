import { useEffect, useRef } from 'react';
import { useRoomId } from '../Hooks/useRoomId';
import { socketChangeRoom } from '../socket';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSocketSync } from '../Hooks/useSocketSync';
import { emitSync, SYNC_EVENTS, getReceivingSync } from '../services/socketSync';

/**
 * Component that manages socket room connections based on URL roomId
 * Must be rendered inside Router context
 * 
 * Also ensures roomId is preserved across all page navigations
 * AND sets up socket sync listeners globally (once for entire app)
 * AND emits navigation sync events when URL changes
 */
function SocketRoomManager() {
  const { roomId } = useRoomId();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const previousRoomIdRef = useRef(null);
  const lastPathRef = useRef(location.pathname + location.search);
  const lastPathnameRef = useRef(location.pathname);
  
  // Setup socket sync listeners ONCE at app level
  useSocketSync();
  
  // Track navigation changes and emit sync events
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const previousPath = lastPathRef.current;

    // Only emit if path actually changed and we're not receiving sync
    if (currentPath !== previousPath && !getReceivingSync() && roomId) {
      console.log('📤 [SocketRoomManager] Navigation detected - emitting sync event:', {
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
    }
  }, [location.pathname, location.search, roomId]);

  // Manage socket room connections (only if roomId is provided)
  useEffect(() => {
    // If no roomId provided, sync is disabled - don't connect to any room
    if (!roomId) {
      // If we were in a room before, leave it
      if (previousRoomIdRef.current) {
        console.log('ℹ️ SocketRoomManager: RoomId removed, leaving room:', previousRoomIdRef.current);
        socketChangeRoom(null);
        previousRoomIdRef.current = null;
      }
      return;
    }

    // Check if roomId has changed
    if (roomId !== previousRoomIdRef.current) {
      console.log('🔄 SocketRoomManager: Room changed:', {
        from: previousRoomIdRef.current,
        to: roomId,
      });

      // Change to new room
      socketChangeRoom(roomId);
      previousRoomIdRef.current = roomId;
    }
  }, [roomId]);

  // Ensure roomId is preserved in the URL when navigating (only if roomId was provided by user)
  useEffect(() => {
    if (!roomId) {
      // No roomId provided - don't modify URL
      return;
    }
    
    const currentRoomIdInUrl = searchParams.get('roomId');
    
    // If pathname changed (navigation occurred) and roomId is missing from URL
    if (location.pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = location.pathname;
      
      if (!currentRoomIdInUrl && roomId) {
        // Add roomId back to URL to preserve it across navigation (user provided it, keep it)
        console.log('🔗 SocketRoomManager: Preserving roomId in URL after navigation');
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('roomId', roomId);
        navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
      }
    }
  }, [location.pathname, searchParams, navigate, roomId]);

  // This component doesn't render anything
  return null;
}

export default SocketRoomManager;

