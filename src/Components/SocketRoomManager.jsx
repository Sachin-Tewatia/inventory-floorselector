import { useEffect, useRef } from 'react';
import { useRoomId } from '../Hooks/useRoomId';
import { socketChangeRoom, getSocket, ensureRoomMembership } from '../socket';
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
  const retryTimeoutRef = useRef(null);
  
  // Setup socket sync listeners ONCE at app level
  useSocketSync();
  
  // Listen for socket connection events to retry room joining
  useEffect(() => {
    const handleSocketConnected = (event) => {
      const { roomId: eventRoomId } = event.detail || {};
      const currentRoomId = roomId;
      
      // Always try to join if we have a roomId (even if event says different room)
      // This handles the case where socket connected before roomId was available
      if (currentRoomId) {
        console.log('🔄 SocketRoomManager: Socket connected event received, ensuring room join:', currentRoomId);
        const socket = getSocket();
        if (socket && socket.connected) {
          // Use a small delay to ensure socket is fully ready
          setTimeout(() => {
            const success = socketChangeRoom(currentRoomId);
            if (success) {
              previousRoomIdRef.current = currentRoomId;
            }
          }, 50);
        }
      }
    };
    
    const handleSocketReconnected = (event) => {
      const { roomId: eventRoomId } = event.detail || {};
      const currentRoomId = roomId;
      
      // Always try to join if we have a roomId
      if (currentRoomId) {
        console.log('🔄 SocketRoomManager: Socket reconnected event received, ensuring room join:', currentRoomId);
        const socket = getSocket();
        if (socket && socket.connected) {
          setTimeout(() => {
            const success = socketChangeRoom(currentRoomId);
            if (success) {
              previousRoomIdRef.current = currentRoomId;
            }
          }, 50);
        }
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('socketConnected', handleSocketConnected);
      window.addEventListener('socketReconnected', handleSocketReconnected);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('socketConnected', handleSocketConnected);
        window.removeEventListener('socketReconnected', handleSocketReconnected);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [roomId]);
  
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

    // Function to join room with retry logic
    const joinRoomWithRetry = (targetRoomId, maxRetries = 15, initialDelay = 100) => {
      let attempts = 0;
      let currentDelay = initialDelay;
      
      const tryJoin = () => {
        const socket = getSocket();
        
        if (socket && socket.connected) {
          // Socket is ready, join the room
          console.log(`🏠 SocketRoomManager: Joining room ${targetRoomId} (attempt ${attempts + 1})`);
          const success = socketChangeRoom(targetRoomId);
          if (success) {
            previousRoomIdRef.current = targetRoomId;
            return true;
          }
        }
        
        // Socket not ready yet or join failed, retry
        attempts++;
        if (attempts < maxRetries) {
          console.log(`⏳ SocketRoomManager: Socket not ready, retrying in ${currentDelay}ms (attempt ${attempts}/${maxRetries})`);
          retryTimeoutRef.current = setTimeout(tryJoin, currentDelay);
          // Exponential backoff: increase delay with each retry (capped at 1000ms)
          currentDelay = Math.min(currentDelay * 1.3, 1000);
          return false;
        } else {
          console.warn(`⚠️ SocketRoomManager: Failed to join room after ${maxRetries} attempts`);
          return false;
        }
      };
      
      // Start trying immediately
      tryJoin();
    };

    // Check if roomId has changed
    if (roomId !== previousRoomIdRef.current) {
      console.log('🔄 SocketRoomManager: Room changed:', {
        from: previousRoomIdRef.current,
        to: roomId,
      });

      // Join room with retry logic
      joinRoomWithRetry(roomId);
    } else {
      // Same roomId, but ensure we're still in the room (fixes sync issues)
      const socket = getSocket();
      if (socket && socket.connected) {
        ensureRoomMembership(roomId);
      } else {
        // Socket not ready, retry joining
        console.log('⏳ SocketRoomManager: Socket not ready for room membership check, will retry');
        joinRoomWithRetry(roomId, 5, 300);
      }
    }
  }, [roomId]);

  // Periodic room membership verification (every 2 minutes)
  useEffect(() => {
    if (!roomId) return;

    const membershipCheckInterval = setInterval(() => {
      const socket = getSocket();
      if (socket && socket.connected && roomId) {
        console.log('🔍 Verifying room membership:', roomId);
        ensureRoomMembership(roomId);
      }
    }, 120000); // Every 2 minutes

    return () => {
      clearInterval(membershipCheckInterval);
    };
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

