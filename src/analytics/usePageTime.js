import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { pageEnter, pageExit } from "./pageTime";

export function usePageTime() {
  const location = useLocation();
  const lastPathRef = useRef(null);

  useEffect(() => {
    const path = location.pathname;

    // 🛡️ Guard: Ignore duplicate renders for same path
    if (lastPathRef.current === path) {
      return;
    }

    // Exit previous page
    if (lastPathRef.current) {
      pageExit();
    }

    // Enter new page
    pageEnter(path);
    lastPathRef.current = path;

    // Cleanup when component unmounts
    return () => {
      pageExit();
    };
  }, [location.pathname]);
}
