import { track } from "./track";

let currentPath = null;
let enterTime = null;

export function pageEnter(path) {
  if (!path) return;

  currentPath = path;
  enterTime = Date.now();

  track("page_enter", { path });
}

export function pageExit() {
  if (!currentPath || !enterTime) return;

  const duration = Math.floor((Date.now() - enterTime) / 1000);

  // ✅ Ignore tiny or invalid durations
  if (duration < 1) {
    currentPath = null;
    enterTime = null;
    return;
  }

  track("page_exit", {
    path: currentPath,
    duration
  });

  currentPath = null;
  enterTime = null;
}
