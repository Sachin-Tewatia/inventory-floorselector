import React, { useEffect, useRef, useState } from "react";
import { mark_landmarks_routes , mark_landmarks_satellite_routes } from "../data/marks";
import { mark_landmark_routes , mark_landmark_twenty_routes } from "../data/mark";
import DrawLine from "./DrawLine";

export default function ActiveRoute({ selectedLandmarkId }) {
  const ref = useRef();

  const [activeRouteAttributes, setActiveRouteAttributes] = useState(null);

  const Routepath = window.location;

  const isTenKm = Routepath.pathname === "/tenkm";
  const isFiveKm = Routepath.pathname === "/fivekm";
  const isTenKmSatellite = Routepath.pathname === "/tenkmSatellite";
  const isFiveKmSatellite = Routepath.pathname === "/fivekmSatellite";
  const isTwentyKm = Routepath.pathname === "/twentykm";
  const isTwentyKmSatellite = Routepath.pathname === "/twentykmSatellite";
  
  useEffect(() => {
    if (selectedLandmarkId) {
      const routeId = `__route ${selectedLandmarkId}`;
      if (ref.current) {
        Array.from(ref.current.children).forEach((child) => {
          if (!child.tagName === "path") {
            return;
          }
          
          if (child.id == routeId) {
            const attributes = {};
            Array.from(child.attributes).forEach((attr) => {
              attributes[attr.name] = attr.value;
            });
            setActiveRouteAttributes(attributes);
          }
        });
      }
    } else {
      setActiveRouteAttributes(null);
    }
  }, [selectedLandmarkId]);


  return (
    <>
      <g className="hidden" ref={ref}>
        {isTenKm ? mark_landmark_routes : 
         isFiveKm ? mark_landmarks_routes :
         isTenKmSatellite ? mark_landmark_routes :
         isFiveKmSatellite ? mark_landmarks_routes :
         isTwentyKm ? mark_landmark_twenty_routes :
         isTwentyKmSatellite ? mark_landmark_twenty_routes :
           []}
      </g>
      {activeRouteAttributes && (
        <DrawLine>
          <path
            {...activeRouteAttributes}
            className={"stroke-white stroke-[5] route"}
          ></path>
        </DrawLine>
      )}
    </>
  );
}
