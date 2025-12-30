import React, { useEffect, useState, useRef } from "react";
import { MapInteractionCSS } from "react-map-interaction";
import { useRoomId } from "../../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync, emitSyncDebounced, setReceivingSync } from "../../services/socketSync";
import { useZoomSync } from "../../Hooks/useZoomSync";

function Zoomable({ children }) {
  const [mapValue, setMapValue] = useState({
    scale: 1,
    translation: { x: 0, y: 0 },
  });
  const { roomId } = useRoomId();
  const mapValueRef = useRef(mapValue);
  
  // Keep ref updated
  useEffect(() => {
    mapValueRef.current = mapValue;
  }, [mapValue]);

  // Listen for zoom sync events via SyncContext (sockets as single source of truth)
  useZoomSync((data) => {
    const { scale, translation } = data || {};
    const currentValue = mapValueRef.current;

    if (scale !== undefined && translation !== undefined) {
      // Only update if values are different (avoid unnecessary updates)
      if (
        scale !== currentValue.scale ||
        translation.x !== currentValue.translation.x ||
        translation.y !== currentValue.translation.y
      ) {
        console.log('🔍 [Zoomable] Syncing zoom state:', { scale, translation });
        setReceivingSync(true);
        setMapValue({
          scale,
          translation: { ...translation }
        });
        requestAnimationFrame(() => {
          setReceivingSync(false);
        });
      }
    }
  });

  // useEffect(() => {
  //   const eles = document.getElementsByClassName("unit-explore-panel");
  //   for (let i = 0; i < eles.length; i++) {
  //     const ele = eles[i];
  //     ele.style.transform = `translate(-50%, -50%) scale(${
  //       1 / mapValue.scale
  //     })`;
  //   }
  // }, [mapValue.scale]);

  return (
    <MapInteractionCSS
      key={"map-interaction"}
      minScale={1}
      style={{ cursor: "pointer" }}
      maxScale={6}
      showControls
      value={mapValue}
      controlsClass="zoom-control"
      btnClass="zoom-btn"
      plusBtnClass={`${
        mapValue.scale !== 6 ? "plus-btn" : `plus-btn zoom-btn-disabled`
      } `}
      minusBtnClass={`${
        mapValue.scale !== 1 ? "plus-btn" : `plus-btn zoom-btn-disabled`
      } `}
      onChange={(value) => {
        // if (value.scale !== mapValue.scale) setScale(value.scale);
        let factor = value.scale - 1;
        let x =
          value.translation.x > 0
            ? 0
            : value.translation.x < -window.innerWidth * factor
            ? -window.innerWidth * factor
            : value.translation.x;
        let y =
          value.translation.y > 0
            ? 0
            : value.translation.y < -window.innerHeight * factor
            ? -window.innerHeight * factor
            : value.translation.y;
        
        const newMapValue = {
            ...value,
            translation: {
              x: x,
              y: y,
            },
        };
        
        setMapValue(newMapValue);
        
        // Sync zoom state if not receiving sync (debounced to avoid too many events)
        if (!getReceivingSync() && roomId) {
          emitSyncDebounced(SYNC_EVENTS.ZOOM, {
            scale: newMapValue.scale,
            translation: newMapValue.translation,
          }, roomId, 150);
        }
      }}
    >
      {children}
    </MapInteractionCSS>
  );
}

export default Zoomable;
