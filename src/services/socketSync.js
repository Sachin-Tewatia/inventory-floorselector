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
};

/**
 * Emit sync event with roomId from URL
 * @param {string} eventType - Type of sync event (use SYNC_EVENTS constants)
 * @param {object} data - Data to sync
 * @param {string} roomId - Optional room ID (uses current room if not provided)
 */
export const emitSync = (eventType, data, roomId = null) => {
  if (isReceivingSync) {
    console.log('🔄 Skipping emit - currently receiving sync');
    return;
  }

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

  const syncEvent = {
    event: eventType,
    rmId: targetRoomId, // Room ID from URL
    sessionId: sessionStorage.getItem('sessionId') || `session_${Date.now()}`, // Optional session tracking
    timestamp: Date.now(),
    data,
  };
  
  console.log(`📤 Emitting sync event:`, {
    type: eventType,
    room: targetRoomId,
    socketId: socket.id,
    data
  });
  
  socket.emit("sync_event", syncEvent);
  
  console.log('✅ Sync event emitted successfully');
};

/**
 * Set receiving flag (to prevent circular updates)
 * @param {boolean} value - True if currently receiving sync, false otherwise
 */
export const setReceivingSync = (value) => {
  isReceivingSync = value;
};

/**
 * Get receiving flag status
 * @returns {boolean} True if currently receiving sync
 */
export const getReceivingSync = () => isReceivingSync;

/**
 * Debounce helper for rapid sync events (like slider changes)
 */
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

