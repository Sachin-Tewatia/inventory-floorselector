// src/analytics/deviceUtils.js

/**
 * Detect if device is touch-enabled
 */
export function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}

/**
 * Get device type string
 */
export function getDeviceType() {
  return isTouchDevice() ? 'touch' : 'non-touch';
}

/**
 * Get screen size info
 */
export function getScreenInfo() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    userAgent: navigator.userAgent
  };
}










