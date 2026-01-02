import React, { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import tippy, { createSingleton } from "tippy.js";
import "tippy.js/animations/shift-toward.css";
import FloorNoIndicator from "../Molecules/FloorNoIndicator";
import { useLocation } from "react-router-dom";
import { getSVGID } from "../../Utility/function";
import { getTowerFromCombinedTowersAndIndex } from "../../Utility/Constants";
import { useInventories } from "../../Hooks";
import { useRoomId } from "../../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync } from "../../services/socketSync";
import { useTippyShowSync } from "../../Hooks/useTippyShowSync";
import { useTippyHideSync } from "../../Hooks/useTippyHideSync";
import { useSvgHoverSync } from "../../Hooks/useSvgHoverSync";

let singleton = false;
const tippyInstanceMap = new Map();
let currentShowingElementId = null;
const hoverHandlers = new Map();
let tippySetupComplete = false;

function FloorsWithTippy({ children, floorsData, tower, rotation, onFloorClick }) {
  const ref = useRef(null);
  const location = useLocation();
  const clickTimers = useRef({});
  const { getUnitById } = useInventories();
  const { roomId } = useRoomId();
  const roomIdRef = useRef(roomId);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const getTowerCodeFromURL = () => {
    const clusterMatch = location.pathname.match(/cluster(\d+)/);
    return clusterMatch ? `t${clusterMatch[1]}` : "t1";
  };

  const extractTowerNumber = (towerString) => {
    const match = towerString.match(/\d+/);
    return match ? match[0] : "";
  };

  const emitSyncEvent = (eventType, data) => {
    const currentRoomId = roomIdRef.current;
    if (!getReceivingSync() && currentRoomId) {
      emitSync(eventType, { page: 'tower', ...data, tower }, currentRoomId);
    }
  };

  const setTippyShowing = (element, elementId, show) => {
    element.classList.toggle('tippy-showing', show);
    emitSyncEvent(SYNC_EVENTS.SVG_HOVER, { elementId, tippyShowing: show });
  };

  const tippySetup = () => {
    if (!ref.current) return;

    if (singleton) singleton.destroy();
    tippyInstanceMap.clear();
    hoverHandlers.clear();
    currentShowingElementId = null;
    tippySetupComplete = false;

    const TippyInstances = [];
    const towerCode = getTowerCodeFromURL();
    const towersRef = ref.current.children;

    for (const towerRef of towersRef) {
      const currentTower = getTowerFromCombinedTowersAndIndex(tower, parseInt(towerRef.id) - 1);
      const towerNumber = extractTowerNumber(currentTower);
      const floors = towerRef.children;

      for (const floor of floors) {
        if (!floor) continue;

        floor.classList.remove("available", "sold", "hold", "mixed");
        floor.classList.add("active");
        floor.style.setProperty('pointer-events', 'all', 'important');
        if (floor._tippy) floor._tippy.destroy();

        const unitID = `${towerCode}_${floor.id}`;
        const flatDetails = getUnitById(unitID);
        const floorNo = flatDetails?.floor;
        if (flatDetails?.status) floor.classList.add(flatDetails.status);

        const instance = tippy(floor, {
          offset: [0, 35],
          content: ReactDOMServer.renderToStaticMarkup(
            <FloorNoIndicator tower={currentTower} floorData={flatDetails} />
          ),
          trigger: 'manual',
          allowHTML: true,
          onShow: () => {
            if (currentShowingElementId && currentShowingElementId !== floor.id && ref.current) {
              const prevFloor = document.getElementById(currentShowingElementId);
              if (prevFloor && ref.current.contains(prevFloor)) {
                prevFloor.classList.remove('tippy-showing');
              }
            }
            floor.classList.add('tippy-showing');
            currentShowingElementId = floor.id;
          },
          onHide: () => {
            floor.classList.remove('tippy-showing');
            if (currentShowingElementId === floor.id) currentShowingElementId = null;
            emitSyncEvent(SYNC_EVENTS.TIPPY_HIDE, { elementId: floor.id });
          },
        });

        tippyInstanceMap.set(floor.id, instance);

        const handleMouseEnter = () => setTippyShowing(floor, floor.id, true);
        const handleMouseLeave = () => setTippyShowing(floor, floor.id, false);
        floor.addEventListener('mouseenter', handleMouseEnter);
        floor.addEventListener('mouseleave', handleMouseLeave);
        hoverHandlers.set(floor.id, { element: floor, enter: handleMouseEnter, leave: handleMouseLeave });

        const navPath = `/inspire/tower/cluster${towerNumber}/floor/${floorNo}`;

        if (isTouchDevice) {
          floor.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const now = Date.now();
            const lastClick = clickTimers.current[floor.id];

            if (lastClick && now - lastClick < 300) {
              clearTimeout(clickTimers.current[floor.id + '_timeout']);
              delete clickTimers.current[floor.id];
              onFloorClick?.(navPath);
            } else {
              clickTimers.current[floor.id] = now;
              if (singleton) {
                singleton.show(instance);
              } else {
                instance.show();
              }
              setTippyShowing(floor, floor.id, true);
              emitSyncEvent(SYNC_EVENTS.TIPPY_SHOW, { elementId: floor.id });
              clickTimers.current[floor.id + '_timeout'] = setTimeout(() => {
                delete clickTimers.current[floor.id];
              }, 300);
            }
          };
        } else {
          floor.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setTippyShowing(floor, floor.id, true);
            onFloorClick?.(navPath);
          };
        }

        TippyInstances.push(instance);
      }
    }

    singleton = createSingleton(TippyInstances, {
      delay: 0,
      arrow: false,
      moveTransition: "transform 0.2s ease-out",
      allowHTML: true,
      placement: "left-start",
      overrides: ["offset"],
      appendTo: document.body,
      trigger: 'manual mouseenter',
    });
    tippySetupComplete = true;
  };

  useEffect(() => {
    tippySetupComplete = false;
    if (singleton) {
      try {
        singleton.hide();
        singleton.destroy();
      } catch (e) { }
      singleton = false;
    }
    currentShowingElementId = null;

    if (ref.current) {
      ref.current.querySelectorAll('.tippy-showing').forEach(floor => floor.classList.remove('tippy-showing'));
    }

    const timeoutId = setTimeout(tippySetup, 100);

    return () => {
      clearTimeout(timeoutId);
      if (singleton) {
        try {
          singleton.hide();
          singleton.destroy();
        } catch (e) { }
        singleton = false;
      }
      currentShowingElementId = null;

      if (!ref.current) return;

      hoverHandlers.forEach(({ element, enter, leave }) => {
        element?.removeEventListener('mouseenter', enter);
        element?.removeEventListener('mouseleave', leave);
      });
      hoverHandlers.clear();

      ref.current.querySelectorAll('.tippy-showing').forEach(floor => floor.classList.remove('tippy-showing'));

      for (const towerRef of ref.current.children) {
        if (towerRef._tippy) towerRef._tippy.destroy();
        if (towerRef.children) {
          for (const floor of towerRef.children) {
            if (floor._tippy) floor._tippy.destroy();
            const timeout = clickTimers.current[floor.id + '_timeout'];
            if (timeout) clearTimeout(timeout);
            delete clickTimers.current[floor.id];
          }
        }
      }
      Object.keys(clickTimers.current).forEach(key => {
        if (key.endsWith('_timeout')) clearTimeout(clickTimers.current[key]);
      });
      clickTimers.current = {};
    };
  }, [floorsData, tower, rotation, location.pathname, onFloorClick, isTouchDevice]);

  const retryUntilReady = (fn, maxAttempts = 20) => {
    const attempt = (count = 0) => {
      if (!ref.current || !tippySetupComplete) {
        if (count < maxAttempts) setTimeout(() => attempt(count + 1), 100);
        return;
      }
      fn();
    };
    setTimeout(() => attempt(), 50);
  };

  useTippyShowSync({
    page: 'tower',
    tower: tower,
    onSync: ({ elementId }) => {
      if (!elementId) return;
      retryUntilReady(() => {
        const towersRef = ref.current.children;
        let targetFloor = null;
        for (const towerRef of towersRef) {
          targetFloor = Array.from(towerRef.children).find(f => f.id === elementId);
          if (targetFloor) break;
        }

        const instance = tippyInstanceMap.get(elementId);
        if (instance && singleton) {
          if (currentShowingElementId && currentShowingElementId !== elementId && ref.current) {
            const prevFloor = document.getElementById(currentShowingElementId);
            if (prevFloor && ref.current.contains(prevFloor)) {
              prevFloor.classList.remove('tippy-showing');
            }
          }
          if (targetFloor) targetFloor.classList.add('tippy-showing');
          currentShowingElementId = elementId;
          try {
            singleton.show(instance);
          } catch (error) {
            instance?.show();
          }
        }
      });
    }
  });

  useTippyHideSync({
    page: 'tower',
    tower: tower,
    onSync: ({ elementId }) => {
      if (!elementId) return;
      retryUntilReady(() => {
        if (singleton) {
          ref.current.querySelectorAll('.tippy-showing').forEach(floor => floor.classList.remove('tippy-showing'));
          currentShowingElementId = null;
          try {
            singleton.hide();
          } catch (error) { }
        }
      });
    }
  });

  useSvgHoverSync({
    page: 'tower',
    tower: tower,
    onSync: ({ elementId, tippyShowing }) => {
      if (!elementId || tippyShowing === undefined) return;
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.toggle('tippy-showing', tippyShowing);
        } else {
          setTimeout(() => {
            const retryElement = document.getElementById(elementId);
            if (retryElement) retryElement.classList.toggle('tippy-showing', tippyShowing);
          }, 100);
        }
      }, 0);
    }
  });

  return <Style ref={ref}>{children}</Style>;
}

export default FloorsWithTippy;

const Style = styled.g`
  cursor: pointer;
  user-select: all;
`;
