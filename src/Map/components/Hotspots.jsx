

import React, { useContext, useEffect, useRef } from "react";
import { useLandmark } from "../hooks";
import tippy, { sticky } from "tippy.js";
import ActiveRoute from "./ActiveRoute";
import { tippyLocationInfo } from "./TippyLocationInfo";
import { AppContext } from "../../Contexts/AppContext";
let tippyInstance = null;

export default function Hotspots({ children }) {
  const { label, setLabel } = useContext(AppContext);
  const ref = useRef();
  const mouseDownRef = useRef(null);
  const prevSelectedLandmarkId = useRef(null); // Track previous selectedLandmarkId
  const { selectedLandmarkId, setSelectedLandmarkId } = useLandmark();
  const isMobile = window.innerWidth <= 1024;

  const isLandmark = (element) => {
    return element.id.includes("__landmark ");
  };

  const getLandmarkId = (id) => id.split("__landmark ")?.[1];

  const onClick = (e) => {
    let element = e.target;
    while (element && element.id !== "parent-svg") {
      if (isLandmark(element)) {
        const landmarkId = getLandmarkId(element.id);
        setSelectedLandmarkId(landmarkId);
        if(isMobile)setLabel(null); // Set label to null when a landmark is selected
        return;
      }
      element = element.parentElement;
    }
    // Clear the selected landmark if clicking outside
    if (prevSelectedLandmarkId.current) {
      setSelectedLandmarkId(false);
    }
  };

  const onMouseDown = (e) => {
    mouseDownRef.current = {
      x: e.screenX,
      y: e.screenY,
    };
  };

  const onMouseUp = (e) => {
    if (mouseDownRef.current) {
      const { x, y } = mouseDownRef.current;
      if (Math.abs(x - e.screenX) < 10 && Math.abs(y - e.screenY) < 10) {
        onClick(e);
      }
    }
    mouseDownRef.current = null;
  };

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      Array.from(ref.current.children).forEach((child) => {
        if (isLandmark(child)) {
          const landmarkId = getLandmarkId(child.id);
          const isSelected = landmarkId === selectedLandmarkId;
          child.style.transition =
            "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
          child.style.transform = isSelected ? "scale(1.20)" : "scale(1)";
          child.style.opacity = isSelected ? "1" : "";
          child.style.background = isSelected ? "#FFFFFF" : "";
          child.style.transformBox = "fill-box";
          child.style.transformOrigin = "center";
          child.style.fillOpacity = "1";

          const paths = child.querySelectorAll("path");
          if (isSelected) {
            if (paths.length > 0) {
              paths[0].style.fillOpacity = "1";
              paths[0].style.opacity = "1";
            }
            paths.forEach((path, index) => {
              if (index > 0) {
                path.style.fillOpacity = 1;
              }
            });
          } else {
            paths.forEach((path) => {
              path.style.fill = "";
              path.style.fillOpacity = "1";
            });
          }
        }
      });
    }
  }, [ref, selectedLandmarkId]);

  useEffect(() => {
    return () => {
      if (ref.current)
        Array.from(ref.current.children).forEach((child) => {
          child.classList.add("opacity-1");
        });
    };
  }, []);

  useEffect(() => {
    // Update prevSelectedLandmarkId before processing new selection
    prevSelectedLandmarkId.current = selectedLandmarkId;

    if (selectedLandmarkId) {
      const element = document.getElementById(
        `__landmark ${selectedLandmarkId}`
      );
      // if (isMobile) setLabel(null);
      if (element) {
        // Create tippy instance with loading content first
        tippyInstance = tippy(element, {
          content: `<div class="overlay-can-hide route-details flex flex-col gap-2 bg-[rgba(0,0,0,0.0)] text-slate-200 rounded-md px-3 py-2">
            <div class="flex gap-2 font-light">
            <div class="distance flex flex-col items-center justify-center ">
            <div class="time font-medium" style="color:white">Loading...</div>
            </div>
          </div>`,
          animation: "shift-toward",
          placement:
            selectedLandmarkId == "SilverOak Estate" ||
            selectedLandmarkId == "NSCB International Airport"
              ? "left"
              : "bottom",
          allowHTML: true,
          arrow: false,
          followCursor: false,
          offset: [10, 0],
          trigger: "manual",
          sticky: true,
          plugins: [sticky],
          zIndex: 2,
          showOnCreate: true,
          hideOnClick: "toggle",
          appendTo: document.getElementById("app"),
        });

        // Update content with actual title once loaded
        tippyLocationInfo(selectedLandmarkId).then(content => {
          if (tippyInstance && content) {
            tippyInstance.setContent(content);
          }
        });
      }
    }

    return () => {
      if (tippyInstance) {
        tippyInstance.destroy();
      }
    };
  }, [selectedLandmarkId]);

  return (
    <>
      <ActiveRoute selectedLandmarkId={selectedLandmarkId} />
      <g style={{ cursor: "pointer" }} ref={ref} onClick={onClick}>
        {children}
      </g>
    </>
  );
}