import { getSocket, getCurrentRoomId } from '../socket';

// Flag to prevent circular updates
let isReceivingSync = false;

// Event types for synchronization
export const SYNC_EVENTS = {
  NAVIGATION: 'navigation',
  FILTERS: 'filters',
  UNIT_SELECTION: 'unitSelection',
  FLOOR_SELECTION: 'floorSelection',
  TOWER_SELECTION: 'towerSelection',
  NAVIGATOR_STATE: 'navigatorState',
  FULLSCREEN: 'fullscreen',
  OVERLAY_VISIBILITY: 'overlayVisibility',
  EXPLORE_VIEW: 'exploreView',
  IMAGE_NAVIGATION: 'imageNavigation',
  ZOOM: 'zoom',
  DISCLAIMER_MODAL: 'disclaimerModal',
  VIDEO_PLAYBACK: 'videoPlayback',
  TIPPY_SHOW: 'tippyShow',
  TIPPY_HIDE: 'tippyHide',
  UNIT_FRAME: 'unitFrame',
  SVG_HOVER: 'svgHover',
  PANEL_VISIBILITY: 'panelVisibility',
};

export const emitSync = (eventType, data, roomId = null) => {
  if (isReceivingSync) return;

  const socket = getSocket();
  if (!socket || !socket.connected) {
    // Socket not available or not connected - silently skip (sync disabled)
    return;
  }

  // Get roomId from parameter or current room
  const targetRoomId = roomId || getCurrentRoomId();
  
  if (!targetRoomId) {
    // No roomId provided - silently skip (sync disabled)
    return;
  }

  socket.emit("sync_event", {
    event: eventType,
    rmId: targetRoomId,
    sessionId: sessionStorage.getItem('sessionId') || `session_${Date.now()}`,
    timestamp: Date.now(),
    data,
  });
};

export const setReceivingSync = (value) => {
  isReceivingSync = value;
};

export const getReceivingSync = () => isReceivingSync;

let debounceTimers = {};

export const emitSyncDebounced = (eventType, data, roomId = null, delay = 300) => {
  // Clear existing timer for this event type
  if (debounceTimers[eventType]) {
    clearTimeout(debounceTimers[eventType]);
  }

  // Set new timer
  debounceTimers[eventType] = setTimeout(() => {
    emitSync(eventType, data, roomId);
    delete debounceTimers[eventType];
  }, delay);
};

export const cancelSyncDebounce = (eventType) => {
  if (debounceTimers[eventType]) {
    clearTimeout(debounceTimers[eventType]);
    delete debounceTimers[eventType];
  }
};

