import { useEffect, useRef, useContext } from 'react';
import { getSocket } from '../socket';
import { setReceivingSync, getReceivingSync, SYNC_EVENTS } from '../services/socketSync';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../Contexts/AppContext';
import { useRoomId } from './useRoomId';
import { useSyncContext } from '../Contexts/SyncContext';

export const useSocketSync = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useRoomId();
  const { triggerHandlers } = useSyncContext();
  const contextRef = useRef(useContext(AppContext));
  contextRef.current = useContext(AppContext);
  const roomIdRef = useRef(roomId);
  roomIdRef.current = roomId;
  const locationRef = useRef(location);
  locationRef.current = location;
  const lastNavRef = useRef(null);
  const setupRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (lastNavRef.current === location.pathname) lastNavRef.current = null;
  }, [location.pathname]);

  useEffect(() => {
    if (!roomId || setupRef.current) return;

    const setupSocketListeners = () => {
      const socket = getSocket();
      if (!socket?.connected) return false;

      setupRef.current = true;

    const handleSyncEvent = (socketEvent) => {
      if (!roomIdRef.current || socketEvent.rmId !== roomIdRef.current) return;

      setReceivingSync(true);

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
        
        case SYNC_EVENTS.PANEL_VISIBILITY:
          handlePanelVisibilitySync(socketEvent);
          break;
        
        default:
          break;
      }

      requestAnimationFrame(() => setReceivingSync(false));
    };

    const handleNavigationSync = (socketEvent) => {
      const { data } = socketEvent;
      if (!data || typeof data !== 'object') return;

      const fromPath = window.location.pathname + window.location.search;
      const toPath = data.path || (data.pathname + (data.search || ''));
      if (toPath && fromPath !== toPath) {
        lastNavRef.current = data.pathname || toPath.split('?')[0];
        navigate(toPath);
      }
    };

    const handleFilterSync = (socketEvent) => {
      const { data } = socketEvent;
      if (!data || typeof data !== 'object') return;

      const path = lastNavRef.current ?? locationRef.current.pathname;
      if (data.pathname != null && data.pathname !== path) return;

      const ctx = contextRef.current;
      if (data.activeMapFilterIds !== undefined) ctx.setActiveMapFilterIds(data.activeMapFilterIds);
      if (data.flatFilterSizeValues !== undefined) ctx.setFlatFilterSizeValues(data.flatFilterSizeValues);
      if (data.flatFilterViewValues !== undefined) ctx.setFlatFilterViewValues(data.flatFilterViewValues);
      if (data.flatFilterPriceValues !== undefined) ctx.setFlatFilterPriceValues(data.flatFilterPriceValues);
      if (data.selectedLandmarkId !== undefined) ctx.setSelectedLandmarkId(data.selectedLandmarkId);
      if (data.showRadius !== undefined) ctx.setShowRadius(data.showRadius);
      if (data.satelliteView !== undefined) ctx.setSatelliteView(data.satelliteView);
      if (data.showAll !== undefined) ctx.setShowAll(data.showAll);
    };

    const handleSelectionSync = (e) => {
      const { data } = e;
      if (!data || typeof data !== 'object') return;
      const cur = window.location.pathname + window.location.search;
      const to = data.path || (data.pathname + (data.search || ''));
      if (to && cur !== to) navigate(to, { state: data.state });
    };

    const handleFullscreenSync = (e) => {
      if (e.data?.isFullScreen !== undefined) contextRef.current.setFullScreen(e.data.isFullScreen);
    };
    const handleNavigatorSync = () => {};

    const handleOverlaySync = (e) => e.data && typeof e.data === 'object' && triggerHandlers(SYNC_EVENTS.OVERLAY_VISIBILITY, e.data);
    const handleZoomSync = (e) => e.data && typeof e.data === 'object' && triggerHandlers(SYNC_EVENTS.ZOOM, e.data);
    const handleDisclaimerModalSync = (e) => e.data && typeof e.data === 'object' && triggerHandlers(SYNC_EVENTS.DISCLAIMER_MODAL, e.data);
    const handleVideoPlaybackSync = (e) => e.data && typeof e.data === 'object' && triggerHandlers(SYNC_EVENTS.VIDEO_PLAYBACK, e.data);

    const handleTippyShowSync = (e) => e.data && typeof e.data === 'object' && triggerHandlers(SYNC_EVENTS.TIPPY_SHOW, e.data);
    const handleTippyHideSync = (e) => e.data && typeof e.data === 'object' && triggerHandlers(SYNC_EVENTS.TIPPY_HIDE, e.data);
    const handleUnitFrameSync = (e) => e.data && typeof e.data === 'object' && triggerHandlers(SYNC_EVENTS.UNIT_FRAME, e.data);
    const handleSvgHoverSync = (e) => e.data && typeof e.data === 'object' && triggerHandlers(SYNC_EVENTS.SVG_HOVER, e.data);
    const handlePanelVisibilitySync = (e) => e.data && typeof e.data === 'object' && triggerHandlers(SYNC_EVENTS.PANEL_VISIBILITY, e.data);
    const handleImageNavigationSync = (e) => e.data && typeof e.data === 'object' && triggerHandlers(SYNC_EVENTS.IMAGE_NAVIGATION, e.data);

    socket.on("sync_event", handleSyncEvent);
    return true;
    };
    if (!setupSocketListeners()) {
      intervalRef.current = setInterval(() => {
        if (setupSocketListeners()) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 500);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      const s = getSocket();
      if (s) s.off("sync_event");
      setupRef.current = false;
    };
  }, [roomId, navigate]);

  return {};
};

