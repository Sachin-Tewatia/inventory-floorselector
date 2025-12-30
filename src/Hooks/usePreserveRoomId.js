import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Hook that provides a navigate function that automatically preserves the roomId query parameter
 * Use this instead of useNavigate() directly to ensure roomId persists across navigation
 */
export const usePreserveRoomId = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const navigatePreservingRoomId = useCallback((to, options = {}) => {
    const roomId = searchParams.get('roomId') || sessionStorage.getItem('roomId');
    
    if (roomId) {
      // Parse the destination to add roomId
      if (typeof to === 'string') {
        const [pathname, existingSearch] = to.split('?');
        const newSearchParams = new URLSearchParams(existingSearch);
        
        // Only add roomId if not already present
        if (!newSearchParams.has('roomId')) {
          newSearchParams.set('roomId', roomId);
        }
        
        const newSearch = newSearchParams.toString();
        const newTo = newSearch ? `${pathname}?${newSearch}` : pathname;
        
        console.log('🔗 Navigating with preserved roomId:', { from: pathname, roomId });
        navigate(newTo, options);
      } else {
        // If 'to' is a number (for navigate(-1), etc)
        navigate(to, options);
      }
    } else {
      // No roomId, navigate normally
      navigate(to, options);
    }
  }, [navigate, searchParams]);

  return navigatePreservingRoomId;
};

