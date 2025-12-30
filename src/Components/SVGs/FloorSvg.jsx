import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import UnitMark from "../Atoms/UnitMark";
import { FlatSvgs } from "../../Data/flatSvgs";
import tippy, { createSingleton } from "tippy.js";
import "tippy.js/animations/shift-toward.css";
import ReactDOMServer from "react-dom/server";
import { useMapFilter } from "../../Hooks";
import { AppContext } from "../../Contexts/AppContext";
import { getFloorType } from "../../Data";
import { FLAT_SVG_NO_MAP } from "../../Utility/Constants";
import { useRoomId } from "../../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync } from "../../services/socketSync";
import { useTippyShowSync } from "../../Hooks/useTippyShowSync";
import { useTippyHideSync } from "../../Hooks/useTippyHideSync";

const checkMobile = () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const mobile = isTouchDevice || isSmallScreen || isMobileUserAgent;
  return mobile;
};

function FloorSvg({ isActive, units, tower, floor, combinedTower, onUnitClick }) {
  const { activeMapFilterIds } = useMapFilter();
  const { flatFilterPriceValues, flatFilterSizeValues } = useContext(AppContext);
  const ref = useRef(null);
  const isMobile = checkMobile();
  const singleton = useRef(null);
  const selectedPathRef = useRef(null);
  const { roomId } = useRoomId();
  const roomIdRef = useRef(roomId);
  const tippyInstanceMap = useRef(new Map());
  const tippySetupComplete = useRef(false);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    if (!ref.current) return;

    const svgs = ref.current.querySelectorAll("path");

    if (svgs.length === 0) return;

    for (const flatSvg of svgs) {
      const flatSvgNo = (flatSvg.id.split("_")[0]);

      let flatIndex = FLAT_SVG_NO_MAP[flatSvgNo];
      const unit = units[flatIndex - 1];

      if (isActive(unit)) flatSvg.classList.add("active");
      else flatSvg.classList.remove("active");
    }
  }, [flatFilterPriceValues, flatFilterSizeValues, activeMapFilterIds, units]);

  const emitSyncEvent = useRef((eventType, data) => {
    if (!getReceivingSync() && roomIdRef.current) {
      emitSync(eventType, { page: 'floor', ...data, tower, floor }, roomIdRef.current);
    }
  });

  useEffect(() => {
    emitSyncEvent.current = (eventType, data) => {
      if (!getReceivingSync() && roomIdRef.current) {
        emitSync(eventType, { page: 'floor', ...data, tower, floor }, roomIdRef.current);
      }
    };
  }, [tower, floor]);

  useEffect(() => {
    if (!ref.current) return;

    tippySetupComplete.current = false;
    if (singleton.current) {
      try {
        singleton.current.hide();
        singleton.current.destroy();
      } catch (e) {}
      singleton.current = null;
    }
    tippyInstanceMap.current.clear();
    selectedPathRef.current = null;

    const TippyInstances = [];

    const svgs = ref.current.querySelectorAll("path");

    if (svgs.length === 0) return;

    for (const flatSvg of svgs) {
      flatSvg.classList.remove("hold");
      flatSvg.classList.remove("sold");
      flatSvg.classList.remove("available");
      const flatSvgNo = (flatSvg.id.split("_")[0]);

      let flatIndex = FLAT_SVG_NO_MAP[flatSvgNo];
      const currentUnit = units[flatIndex - 1];
      if (!currentUnit) continue;

      const { status, id } = currentUnit;
      
      flatSvg.classList.add(status);

      const showTippy = (instance, skipSync = false) => {
        if (selectedPathRef.current && selectedPathRef.current !== flatSvg) {
          selectedPathRef.current.style.fill = '';
        }
        if (singleton.current) {
          try {
            singleton.current.show(instance);
          } catch {
            instance?.show();
          }
        } else {
          instance?.show();
        }
        flatSvg.style.fill = 'transparent';
        selectedPathRef.current = flatSvg;
        if (!skipSync) emitSyncEvent.current(SYNC_EVENTS.TIPPY_SHOW, { elementId: flatSvg.id });
      };

      const hideTippy = (skipSync = false) => {
        if (singleton.current) {
          try {
            singleton.current.hide();
          } catch {
            instance?.hide();
          }
        } else {
          instance?.hide();
        }
        if (flatSvg) flatSvg.style.fill = '';
        if (selectedPathRef.current === flatSvg) selectedPathRef.current = null;
        if (!skipSync) emitSyncEvent.current(SYNC_EVENTS.TIPPY_HIDE, { elementId: flatSvg.id });
      };

      const instance = tippy(flatSvg, {
        content: ReactDOMServer.renderToStaticMarkup(
          <UnitMark
            isActive={true}
            isSelected={true}
            selectedUnit={currentUnit}
          />
        ),
        allowHTML: true,
        trigger: 'manual',
        interactive: isMobile,
        appendTo: document.getElementById("floor-container"),
        delay: isMobile ? [0, 0] : [100, 100],
        duration: isMobile ? [200, 150] : [300, 250],
        onShow: () => showTippy(instance, true),
        onHide: () => hideTippy(true),
      });

      // Handle mobile vs desktop interactions
      if (isMobile) {
        let touchStartTime = 0;
        let touchCount = 0;
        let singleTapTimeout = null;
        
        flatSvg.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (flatSvg._tippy && singleton.current) {
            showTippy(flatSvg._tippy);
          }
        };
        
        // Add touch event listeners for mobile with higher priority
        const handleTouchStart = (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          touchStartTime = Date.now();
          touchCount++;
        };
        
        const handleTouchEnd = (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const touchEndTime = Date.now();
          const touchDuration = touchEndTime - touchStartTime;
          
          // Clear any existing single tap timeout
          if (singleTapTimeout) {
            clearTimeout(singleTapTimeout);
          }
          
          if (touchDuration < 300 && touchCount === 1) {
            singleTapTimeout = setTimeout(() => {
              if (touchCount === 1 && flatSvg._tippy && singleton.current) {
                showTippy(flatSvg._tippy);
              }
            }, 200);
            flatSvg._singleTapTimeout = singleTapTimeout;
          }
          
          if (touchCount >= 2) {
            if (singleTapTimeout) {
              clearTimeout(singleTapTimeout);
              singleTapTimeout = null;
            }
            if (selectedPathRef.current && selectedPathRef.current._tippy) {
              const prevInstance = selectedPathRef.current._tippy;
              if (singleton.current) {
                try {
                  singleton.current.hide();
                } catch {}
              }
              if (selectedPathRef.current) {
                selectedPathRef.current.style.fill = '';
                emitSyncEvent.current(SYNC_EVENTS.TIPPY_HIDE, { elementId: selectedPathRef.current.id });
                selectedPathRef.current = null;
              }
            }
            onUnitClick?.(`/inspire/unit/${id}`);
            touchCount = 0;
          }
          
          // Reset touch count after a delay
          setTimeout(() => {
            touchCount = 0;
          }, 500);
        };
        
        flatSvg._touchStartHandler = handleTouchStart;
        flatSvg._touchEndHandler = handleTouchEnd;
        flatSvg.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
        flatSvg.addEventListener('touchend', handleTouchEnd, { passive: false, capture: true });
        
        flatSvg.ondblclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (selectedPathRef.current && singleton.current) {
            try {
              singleton.current.hide();
            } catch {}
            if (selectedPathRef.current) {
              selectedPathRef.current.style.fill = '';
              emitSyncEvent.current(SYNC_EVENTS.TIPPY_HIDE, { elementId: selectedPathRef.current.id });
              selectedPathRef.current = null;
            }
          }
          onUnitClick?.(`/inspire/unit/${id}`);
        };
      } else {
        const handleMouseEnter = () => {
          if (flatSvg._tippy && singleton.current) showTippy(flatSvg._tippy);
        };
        
        const handleMouseLeave = () => {
          if (singleton.current) {
            try {
              singleton.current.hide();
            } catch {}
            if (selectedPathRef.current === flatSvg) {
              flatSvg.style.fill = '';
              emitSyncEvent.current(SYNC_EVENTS.TIPPY_HIDE, { elementId: flatSvg.id });
              selectedPathRef.current = null;
            }
          }
        };
        
        flatSvg.addEventListener('mouseenter', handleMouseEnter);
        flatSvg.addEventListener('mouseleave', handleMouseLeave);
        flatSvg._mouseHandlers = { enter: handleMouseEnter, leave: handleMouseLeave };
        
        flatSvg.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (singleton.current) {
            try {
              singleton.current.hide();
            } catch {}
          }
          if (selectedPathRef.current) {
            selectedPathRef.current.style.fill = '';
            emitSyncEvent.current(SYNC_EVENTS.TIPPY_HIDE, { elementId: selectedPathRef.current.id });
            selectedPathRef.current = null;
          }
          onUnitClick?.(`/inspire/unit/${id}`);
        };
      }

      tippyInstanceMap.current.set(flatSvg.id, instance);
      TippyInstances.push(instance);
    }

    singleton.current = createSingleton(TippyInstances, {
      trigger: 'manual',
      delay: 0,
      arrow: false,
      moveTransition: "transform 0.2s ease-out",
      allowHTML: true,
      placement: "right-start",
      appendTo: document.getElementById("floor-container"),
      overrides: ["offset"],
      interactive: true,
      hideOnClick: isMobile ? true : false,
    });
    tippySetupComplete.current = true;

    let touchOutsideHandler = null;
    if (isMobile) {
      touchOutsideHandler = (e) => {
        const touch = e.touches?.[0] || e.changedTouches?.[0];
        if (!touch) return;
        
        const touchedElement = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!touchedElement) return;
        
        const isOnPath = ref.current && Array.from(ref.current.querySelectorAll("path")).some(
          path => path.contains(touchedElement) || path === touchedElement
        );
        const tippyPopper = document.querySelector('.tippy-box');
        const isOnTippy = tippyPopper && (tippyPopper.contains(touchedElement) || tippyPopper === touchedElement);
        
        if (!isOnPath && !isOnTippy && selectedPathRef.current && singleton.current) {
          try {
            singleton.current.hide();
          } catch {}
          if (selectedPathRef.current) {
            const elementId = selectedPathRef.current.id;
            selectedPathRef.current.style.fill = '';
            emitSyncEvent.current(SYNC_EVENTS.TIPPY_HIDE, { elementId });
            selectedPathRef.current = null;
          }
        }
      };
      document.addEventListener('touchstart', touchOutsideHandler, { passive: true });
    }

    return () => {
      if (singleton.current) {
        try {
          singleton.current.hide();
          singleton.current.destroy();
        } catch (e) {}
        singleton.current = null;
      }
      tippySetupComplete.current = false;
      
      if (touchOutsideHandler) {
        document.removeEventListener('touchstart', touchOutsideHandler);
      }
      
      for (const flatSvg of svgs) {
        if (flatSvg._tippy) flatSvg._tippy.destroy();
        if (selectedPathRef.current === flatSvg) {
          flatSvg.style.fill = '';
        }
        if (isMobile && flatSvg._touchStartHandler && flatSvg._touchEndHandler) {
          flatSvg.removeEventListener('touchstart', flatSvg._touchStartHandler);
          flatSvg.removeEventListener('touchend', flatSvg._touchEndHandler);
          delete flatSvg._touchStartHandler;
          delete flatSvg._touchEndHandler;
        }
        if (flatSvg._mouseHandlers) {
          flatSvg.removeEventListener('mouseenter', flatSvg._mouseHandlers.enter);
          flatSvg.removeEventListener('mouseleave', flatSvg._mouseHandlers.leave);
          delete flatSvg._mouseHandlers;
        }
        if (flatSvg._singleTapTimeout) {
          clearTimeout(flatSvg._singleTapTimeout);
        }
      }
      selectedPathRef.current = null;
    };
  }, [ref, units, isMobile, tower, floor]);

  const retryUntilReady = (fn, maxAttempts = 20) => {
    const attempt = (count = 0) => {
      if (!ref.current || !tippySetupComplete.current) {
        if (count < maxAttempts) setTimeout(() => attempt(count + 1), 100);
        return;
      }
      fn();
    };
    setTimeout(() => attempt(), 50);
  };

  useTippyShowSync({
    page: 'floor',
    tower,
    floor,
    onSync: ({ elementId }) => {
      if (!elementId) return;
      retryUntilReady(() => {
        const flatSvg = ref.current?.querySelector(`path#${elementId}`);
        const instance = tippyInstanceMap.current.get(elementId);
        if (flatSvg && instance && singleton.current) {
          if (selectedPathRef.current && selectedPathRef.current !== flatSvg) {
            selectedPathRef.current.style.fill = '';
          }
          try {
            singleton.current.show(instance);
          } catch {
            instance?.show();
          }
          flatSvg.style.fill = 'transparent';
          selectedPathRef.current = flatSvg;
        }
      });
    }
  });

  useTippyHideSync({
    page: 'floor',
    tower,
    floor,
    onSync: ({ elementId }) => {
      if (!elementId) return;
      retryUntilReady(() => {
        const flatSvg = ref.current?.querySelector(`path#${elementId}`);
        const instance = tippyInstanceMap.current.get(elementId);
        
        if (singleton.current) {
          try {
            singleton.current.hide();
          } catch {
            if (instance) instance?.hide();
          }
        } else if (instance) {
          instance?.hide();
        }
        
        const element = flatSvg || selectedPathRef.current;
        if (element) {
          element.style.fill = '';
          if (selectedPathRef.current === element) selectedPathRef.current = null;
        }
      });
    }
  });

  return (
    <Style width="1920" height="1080" viewBox="0 0 1920 1080" fill="transparent">
      <g id="units-svg" ref={ref}>
        {FlatSvgs[`${getFloorType(combinedTower, floor)}`]}
      </g>
    </Style>
  );
}

export default FloorSvg;

const Style = styled.svg`
  height: 100%;
  width: 100%;
  path {
    cursor: pointer;
    transition: all 200ms;
    fill-opacity: 0.4;
    fill: var(--clr-available);
    stroke: #151616d4;
    stroke-width: 2px;
    opacity: 0;
    pointer-events: none;
    :hover {
      fill: transparent !important;
    }
    :focus {
      outline: none !important;
      fill: transparent !important;
    }
    &.active {
      pointer-events: all;
      opacity: 1;
    }
  }

  /* path.Available {
    fill: #53fa53;
  } */

  path.hold {
    fill: var(--clr-hold-faded);
    stroke: var(--clr-hold-faded);
  }

  path.available {
    fill: var(--clr-available-faded);
    stroke: var(--clr-available-faded);
  }

  path.sold {
    fill: var(--clr-booked-faded);
    stroke: var(--clr-booked-faded);
  }
`;

