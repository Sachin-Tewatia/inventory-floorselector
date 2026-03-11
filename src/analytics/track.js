// src/analytics/track.js
import { PROJECT_ID } from "../APIs";
import { getDeviceType, getScreenInfo } from "./deviceUtils";

// UUID generator fallback for browsers that don't support crypto.randomUUID()
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getUID() {
  let uid = localStorage.getItem("uid");

  if (!uid) {
    uid = generateUUID();
    localStorage.setItem("uid", uid);
  }

  return uid;
}

function getSessionId() {
  let sid = sessionStorage.getItem("sid");

  if (!sid) {
    sid = generateUUID();
    sessionStorage.setItem("sid", sid);
  }

  return sid;
}

export function track(event, payload = {}) {
  const screenInfo = getScreenInfo();
  
  const data = {
    uid: getUID(),
    sid: getSessionId(),
    event,
    path: window.location.pathname, // ✅ Always includes URL
    projectId: PROJECT_ID, // ✅ Project ID for multi-project support
    payload: {
      ...payload,
      // Add device info to every event
      deviceType: getDeviceType(),
      screenSize: {
        width: screenInfo.width,
        height: screenInfo.height
      }
    },
    ts: Date.now()
  };

  // ✅ Temporary: Log Phase 1 events for debugging
  if (['floor_select', 'unit_select', 'back_navigation'].includes(event)) {
    console.log(`📊 Phase 1 Event: ${event}`, data);
  }

  navigator.sendBeacon(
    "https://okfzoat67e.execute-api.ap-south-1.amazonaws.com/prod/track",
    JSON.stringify(data)
  );
}
