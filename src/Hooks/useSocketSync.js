import { useEffect, useRef, useContext, useCallback } from 'react';
import { getSocket } from '../socket';
import { setReceivingSync, getReceivingSync, SYNC_EVENTS } from '../services/socketSync';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../Contexts/AppContext';
import { useRoomId } from './useRoomId';
import { useSyncContext } from '../Contexts/SyncContext';

/**
 * Hook to listen for and handle sync events from other browsers
 * Automatically syncs navigation, filters, selections, and state across all browsers in the same room
 */
export const useSocketSync = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useRoomId(); // Get roomId from URL
  const { triggerHandlers } = useSyncContext(); // Get sync context
  
  // Use refs to avoid re-creating handlers and store current values
  const contextRef = useRef(useContext(AppContext));
  contextRef.current = useContext(AppContext);
  
  const roomIdRef = useRef(roomId);
  roomIdRef.current = roomId; // Always keep updated

  const setupListenersRef = useRef(false);
  const socketCheckIntervalRef = useRef(null);

  useEffect(() => {
    // If no roomId provided, sync is disabled - don't set up listeners
    if (!roomId) {
      return;
    }

    // Only setup once
    if (setupListenersRef.current) {
      console.log('✅ Socket sync listeners already set up');
      return;
    }

    // Function to setup listeners when socket is ready
    const setupSocketListeners = () => {
      const socket = getSocket();
      
      if (!socket || !socket.connected) {
        console.log('⏳ useSocketSync: Waiting for socket connection...');
        return false;
      }

      setupListenersRef.current = true;
      console.log('🔄 Setting up socket sync listeners for room:', roomIdRef.current);

    // Main sync event handler
    const handleSyncEvent = (socketEvent) => {
      console.log('📨 Received sync_event:', socketEvent);
      
      const currentRoomId = roomIdRef.current; // Use ref value
      console.log('🔍 Current roomId:', currentRoomId, 'Event roomId:', socketEvent.rmId);

      // Only process events from the same room
      if (!currentRoomId || socketEvent.rmId !== currentRoomId) {
        console.log('🔄 Ignoring sync event from different room:', {
          event: socketEvent.rmId,
          current: currentRoomId
        });
        return;
      }
      
      console.log('✅ Processing sync event for room:', currentRoomId);

      // Set flag to prevent circular updates
      setReceivingSync(true);

      // Route to appropriate handler based on event type
      switch (socketEvent.event) {
        case SYNC_EVENTS.NAVIGATION:
          handleNavigationSync(socketEvent);
          break;
        
        case SYNC_EVENTS.FILTERS:
          handleFilterSync(socketEvent);
          break;
        
        case SYNC_EVENTS.UNIT_SELECTION:
        case SYNC_EVENTS.FLOOR_SELECTION:
        case SYNC_EVENTS.TOWER_SELECTION:
          handleSelectionSync(socketEvent);
          break;
        
        case SYNC_EVENTS.FULLSCREEN:
          handleFullscreenSync(socketEvent);
          break;
        
        case SYNC_EVENTS.OVERLAY_VISIBILITY:
          handleOverlaySync(socketEvent);
          break;
        
        case SYNC_EVENTS.NAVIGATOR_STATE:
          handleNavigatorSync(socketEvent);
          break;
        
        case SYNC_EVENTS.IMAGE_NAVIGATION:
          handleImageNavigationSync(socketEvent);
          break;
        
        case SYNC_EVENTS.ZOOM:
          handleZoomSync(socketEvent);
          break;
        
        case SYNC_EVENTS.DISCLAIMER_MODAL:
          handleDisclaimerModalSync(socketEvent);
          break;
        
        case SYNC_EVENTS.VIDEO_PLAYBACK:
          handleVideoPlaybackSync(socketEvent);
          break;
        
        case SYNC_EVENTS.TIPPY_SHOW:
          handleTippyShowSync(socketEvent);
          break;
        
        case SYNC_EVENTS.TIPPY_HIDE:
          handleTippyHideSync(socketEvent);
          break;
        
        case SYNC_EVENTS.UNIT_FRAME:
          handleUnitFrameSync(socketEvent);
          break;
        
        case SYNC_EVENTS.SVG_HOVER:
          handleSvgHoverSync(socketEvent);
          break;
        
        default:
          console.log('Unknown sync event type:', socketEvent.event);
      }

      // Clear flag immediately after handlers are triggered
      // Using requestAnimationFrame ensures state updates are committed
      requestAnimationFrame(() => {
        setReceivingSync(false);
      });
    };

    // Navigation sync handler
    const handleNavigationSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🚀 Invalid navigation sync event data:', data);
        return;
      }
      
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const fromPath = currentPath + currentSearch;
      const toPath = data.path || (data.pathname + (data.search || ''));
      
      console.log('🚀 Navigation sync event received:', {
        from: fromPath,
        to: toPath,
        currentRoomId: roomIdRef.current,
        eventRoomId: socketEvent.rmId
      });
      
      if (toPath && fromPath !== toPath) {
        console.log('✅ Navigating from:', fromPath, 'to:', toPath);
        navigate(toPath);
      } else {
        console.log('⏭️ Skipping navigation - already on target path or path missing');
      }
    };

    // Filter sync handler
    const handleFilterSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🔍 Invalid filter sync event data:', data);
        return;
      }
      
      const context = contextRef.current;
      console.log('🔍 Syncing filters:', data);
      
      if (data.activeMapFilterIds !== undefined) {
        context.setActiveMapFilterIds(data.activeMapFilterIds);
      }
      if (data.flatFilterSizeValues !== undefined) {
        context.setFlatFilterSizeValues(data.flatFilterSizeValues);
      }
      if (data.flatFilterPriceValues !== undefined) {
        context.setFlatFilterPriceValues(data.flatFilterPriceValues);
      }
      if (data.selectedLandmarkId !== undefined) {
        context.setSelectedLandmarkId(data.selectedLandmarkId);
      }
      if (data.showRadius !== undefined) {
        context.setShowRadius(data.showRadius);
      }
      if (data.satelliteView !== undefined) {
        context.setSatelliteView(data.satelliteView);
      }
      if (data.showAll !== undefined) {
        context.setShowAll(data.showAll);
      }
    };

    // Selection sync handler (unit/floor/tower)
    const handleSelectionSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🎯 Invalid selection sync event data:', data);
        return;
      }
      
      const currentPath = window.location.pathname + window.location.search;
      const targetPath = data.path || (data.pathname + (data.search || ''));
      
      console.log('🎯 Selection sync event received:', {
        from: currentPath,
        to: targetPath,
        eventType: socketEvent.event,
        currentRoomId: roomIdRef.current,
        eventRoomId: socketEvent.rmId
      });
      
      if (targetPath && currentPath !== targetPath) {
        console.log('✅ Navigating from:', currentPath, 'to:', targetPath);
        navigate(targetPath, { state: data.state });
      } else {
        console.log('⏭️ Skipping selection navigation - already on target path');
      }
    };

    // Fullscreen sync handler
    const handleFullscreenSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🖥️ Invalid fullscreen sync event data:', data);
        return;
      }
      
      const context = contextRef.current;
      console.log('🖥️ Syncing fullscreen state:', data.isFullScreen);
      if (data.isFullScreen !== undefined) {
        context.setFullScreen(data.isFullScreen);
      }
    };

    // Overlay visibility sync handler
    const handleOverlaySync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('👁️ Invalid overlay visibility sync event data:', data);
        return;
      }
      
      console.log('👁️ Syncing overlay visibility:', data);
      
      // Use SyncContext to trigger handlers (sockets as single source of truth)
      triggerHandlers(SYNC_EVENTS.OVERLAY_VISIBILITY, data);
    };

    // Zoom sync handler
    const handleZoomSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🔍 Invalid zoom sync event data:', data);
        return;
      }
      
      console.log('🔍 Syncing zoom state:', data);
      
      // Use SyncContext to trigger handlers (sockets as single source of truth)
      triggerHandlers(SYNC_EVENTS.ZOOM, data);
    };

    // Disclaimer modal sync handler
    const handleDisclaimerModalSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('📋 Invalid disclaimer modal sync event data:', data);
        return;
      }
      
      console.log('📋 Syncing disclaimer modal state:', data);
      
      // Use SyncContext to trigger handlers (sockets as single source of truth)
      triggerHandlers(SYNC_EVENTS.DISCLAIMER_MODAL, data);
    };

    // Video playback sync handler
    const handleVideoPlaybackSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🎬 Invalid video playback sync event data:', data);
        return;
      }
      
      console.log('🎬 Syncing video playback:', data);
      
      // Use SyncContext to trigger handlers (sockets as single source of truth)
      triggerHandlers(SYNC_EVENTS.VIDEO_PLAYBACK, data);
    };

    // Tippy show sync handler
    const handleTippyShowSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('💬 Invalid tippy show sync event data:', data);
        return;
      }
      
      console.log('💬 Syncing tippy show:', data);
      
      // Use SyncContext to trigger handlers (sockets as single source of truth)
      triggerHandlers(SYNC_EVENTS.TIPPY_SHOW, data);
    };

    // Tippy hide sync handler
    const handleTippyHideSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('💬 Invalid tippy hide sync event data:', data);
        return;
      }
      
      console.log('💬 Syncing tippy hide:', data);
      
      // Use SyncContext to trigger handlers (sockets as single source of truth)
      triggerHandlers(SYNC_EVENTS.TIPPY_HIDE, data);
    };

    // Unit frame sync handler
    const handleUnitFrameSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🎬 Invalid unit frame sync event data:', data);
        return;
      }
      
      console.log('🎬 Syncing unit frame:', data);
      
      // Use SyncContext to trigger handlers (sockets as single source of truth)
      triggerHandlers(SYNC_EVENTS.UNIT_FRAME, data);
    };

    // SVG hover sync handler
    const handleSvgHoverSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🎨 Invalid SVG hover sync event data:', data);
        return;
      }
      
      console.log('🎨 Syncing SVG hover:', data);
      
      // Use SyncContext to trigger handlers (sockets as single source of truth)
      triggerHandlers(SYNC_EVENTS.SVG_HOVER, data);
    };

    // Navigator state sync handler
    const handleNavigatorSync = (socketEvent) => {
      const { data } = socketEvent;
      console.log('🧭 Syncing navigator state:', data);
      // This can be used for syncing image carousel navigation
    };

    // Image navigation sync handler
    const handleImageNavigationSync = (socketEvent) => {
      const { data } = socketEvent;
      
      // Validate event data
      if (!data || typeof data !== 'object') {
        console.warn('🖼️ Invalid image navigation sync event data:', data);
        return;
      }
      
      console.log('🖼️ Syncing image navigation:', data);
      
      // Trigger registered handlers via context
      triggerHandlers(SYNC_EVENTS.IMAGE_NAVIGATION, data);
    };

      // Register event listener
      socket.on("sync_event", handleSyncEvent);
      
      console.log('✅ Socket sync listeners registered successfully for room:', roomIdRef.current);
      return true;
    };

    // Try to setup immediately
    if (!setupSocketListeners()) {
      // If socket not ready, poll until it is
      console.log('⏳ Socket not ready, will retry every 500ms...');
      socketCheckIntervalRef.current = setInterval(() => {
        console.log('🔄 Retrying socket listener setup...');
        if (setupSocketListeners()) {
          console.log('✅ Socket listeners setup successful after retry');
          clearInterval(socketCheckIntervalRef.current);
          socketCheckIntervalRef.current = null;
        }
      }, 500); // Check every 500ms
    }

    // Cleanup only on unmount
    return () => {
      console.log('🧹 Cleaning up socket sync listeners');
      
      // Clear interval if still running
      if (socketCheckIntervalRef.current) {
        clearInterval(socketCheckIntervalRef.current);
        socketCheckIntervalRef.current = null;
      }
      
      // Remove event listener
      const socket = getSocket();
      if (socket) {
        socket.off("sync_event");
      }
      
      setupListenersRef.current = false;
    };
  }, [roomId, navigate]); // Minimal dependencies - only roomId and navigate

  return {};
};

