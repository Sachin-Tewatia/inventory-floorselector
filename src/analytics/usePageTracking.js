import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageEnter, pageExit } from "./pageTime";

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // ENTER new page
    pageEnter(location.pathname);

    // EXIT previous page
    return () => {
      pageExit();
    };
  }, [location.pathname]);
}










