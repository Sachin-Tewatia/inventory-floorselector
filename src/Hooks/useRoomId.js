import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

/**
 * Hook to extract and manage roomId from URL query parameters
 * Usage: ?roomId=abc123
 * 
 * roomId is OPTIONAL - if not provided, sync features are disabled (no errors)
 * If provided by user in URL, it will be preserved across page navigations
 * 
 * The roomId persists across page navigations by storing it in sessionStorage
 * while it's in use, and is cleared when removed from URL
 */
export const useRoomId = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Extract roomId from URL query params (optional - only if provided by user)
    const roomIdFromUrl = searchParams.get('roomId');
    
    if (roomIdFromUrl) {
      // Use roomId from URL (provided by user)
      setRoomId(roomIdFromUrl);
      // Store in sessionStorage for persistence across navigations
      sessionStorage.setItem('roomId', roomIdFromUrl);
      console.log('🏠 Room ID from URL:', roomIdFromUrl);
      initializedRef.current = true;
    } else {
      // No roomId in URL - check sessionStorage to restore it (only if already initialized)
      const storedRoomId = sessionStorage.getItem('roomId');
      
      if (storedRoomId) {
        if (initializedRef.current) {
          // Already initialized - roomId should be preserved, restore it to URL
          console.log('🔗 Restoring roomId from sessionStorage after navigation:', storedRoomId);
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set('roomId', storedRoomId);
          const newSearch = newSearchParams.toString();
          navigate(`${location.pathname}?${newSearch}`, { replace: true });
          setRoomId(storedRoomId);
        } else {
          // First initialization - restore from sessionStorage if available
          console.log('🔗 Restoring roomId from sessionStorage on first load:', storedRoomId);
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set('roomId', storedRoomId);
          const newSearch = newSearchParams.toString();
          navigate(`${location.pathname}?${newSearch}`, { replace: true });
          setRoomId(storedRoomId);
          initializedRef.current = true;
        }
      } else {
        // No roomId in URL or sessionStorage - sync disabled
        setRoomId(null);
        initializedRef.current = true;
      }
    }
  }, [location.pathname, location.search, searchParams, navigate]);

  // Function to update roomId in URL
  const updateRoomId = (newRoomId) => {
    if (newRoomId) {
      searchParams.set('roomId', newRoomId);
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.delete('roomId');
      setSearchParams(searchParams, { replace: true });
    }
  };

  // Function to generate and set a new roomId
  const generateRoomId = () => {
    const newRoomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    updateRoomId(newRoomId);
    return newRoomId;
  };

  return {
    roomId,
    updateRoomId,
    generateRoomId,
    hasRoomId: !!roomId,
  };
};

