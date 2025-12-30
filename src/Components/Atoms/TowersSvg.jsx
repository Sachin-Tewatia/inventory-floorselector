import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import tippy, { createSingleton } from "tippy.js";
import { useRoomId } from "../../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync } from "../../services/socketSync";
import { useTippyShowSync } from "../../Hooks/useTippyShowSync";
import { useSvgHoverSync } from "../../Hooks/useSvgHoverSync";
import { ALL_TOWERS_SVGS, CLUB_SVGS } from "../../Data";
import SVG from "./SVG";
import ReactDOMServer from "react-dom/server";
import { useInventories } from "../../Hooks";
import HoverInfo from "../Molecules/HoverInfo";
import { getCombinedTowerFromTower } from "../../Utility/Constants";

let singleton = false;
const tippyInstanceMap = new Map();

export const hideTowersTippy = () => {
  try {
    if (singleton) singleton.hide();
    document.querySelectorAll('.tippy-box').forEach(box => {
      box._tippy?.hide();
      if (box.style) {
        box.style.display = 'none';
        box.style.visibility = 'hidden';
      }
    });
    document.querySelectorAll('.svg-hover-active').forEach(el => {
      el.classList.remove('svg-hover-active');
      el.style?.setProperty('opacity', '0', 'important');
    });
    document.querySelectorAll('[data-tippy-root]').forEach(root => {
      if (root.style) {
        root.style.display = 'none';
        root.style.visibility = 'hidden';
      }
    });
  } catch (e) {}
};

function TowersSvg({ imageNumber, onTowerClick }) {
  const { getAllFloorsInTower, getAllUnitsInTower, getMinMaxSBUInTower, getAllUnitTypesInTower } = useInventories();
  const TOWERS_LIST = Object.keys(ALL_TOWERS_SVGS[imageNumber]);
  const clickTimers = useRef({});
  const hoverHandlers = useRef(new Map());
  const { roomId } = useRoomId();
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || 
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  const cleanupSingleton = () => {
    if (singleton) {
      try {
        singleton.hide();
        singleton.destroy();
      } catch (e) {}
      singleton = false;
    }
  };

  useEffect(() => {
    cleanupSingleton();
    tippyInstanceMap.clear();
    hoverHandlers.current.clear();
    document.querySelectorAll('.svg-hover-active').forEach(el => el.classList.remove('svg-hover-active'));

    const setupTippyAndEvents = () => {
      cleanupSingleton();
      tippyInstanceMap.clear();
      hoverHandlers.current.clear();

    const TippyInstances = [];
    const elements = [];
      
    TOWERS_LIST.forEach((tower) => {
        const element = document.getElementById(`${tower}-tower-svg`);
        if (element) elements.push({ ref: element, tower });
    });

    if (CLUB_SVGS?.[imageNumber]) {
        const clubhouseElement = document.getElementById(`clubhouse-svg`);
        if (clubhouseElement) elements.push({ ref: clubhouseElement, club: true });
    }

      if (elements.length === 0) {
        setTimeout(setupTippyAndEvents, 100);
        return;
      }

      const setOpacity = (element, elementId, opacity) => {
        element.classList.toggle('svg-hover-active', opacity === 1);
        element.style.setProperty('opacity', opacity, 'important');
        if (!getReceivingSync() && roomId) {
          emitSync(SYNC_EVENTS.SVG_HOVER, { page: 'home', elementId, opacity }, roomId);
        }
      };

      const createHoverHandlers = (element, elementId) => {
        const enter = () => setOpacity(element, elementId, 1);
        const leave = () => setOpacity(element, elementId, 0);
        element.addEventListener('mouseenter', enter);
        element.addEventListener('mouseleave', leave);
        hoverHandlers.current.set(elementId, { element, enter, leave });
      };

      elements.forEach((ele) => {
        if (!ele.ref) return;

        const elementId = ele.club ? 'clubhouse-svg' : `${ele.tower}-tower-svg`;
        const instance = tippy(ele.ref, {
          content: ReactDOMServer.renderToStaticMarkup(
            <HoverInfo
              className="towers-hover-info"
              title={ele.club ? 'Club Inspire' : ele.tower}
              features={ele.club ? [] : [
                `${getAllFloorsInTower(ele.tower).length} Floors | ${getAllUnitsInTower(ele.tower).length} Apartments`,
                `${getAllUnitTypesInTower(ele.tower).join("\n | ")}`
              ]}
            />
          ),
          allowHTML: true,
          trigger: 'manual', // Use manual trigger so singleton controls it
        });

        TippyInstances.push(instance);
        if (ele.ref.id) tippyInstanceMap.set(ele.ref.id, instance);

        if (ele.club) {
          createHoverHandlers(ele.ref, elementId);
        } else {
          const towerPath = `tower/${getCombinedTowerFromTower(ele.tower)}`;
          
          if (isTouchDevice) {
            ele.ref.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              const now = Date.now();
              const lastClick = clickTimers.current[elementId];
              
              if (lastClick && now - lastClick < 300) {
                clearTimeout(clickTimers.current[elementId + '_timeout']);
                delete clickTimers.current[elementId];
                onTowerClick?.(`/inspire/${towerPath}`);
              } else {
                clickTimers.current[elementId] = now;
                if (singleton) singleton.show(instance);
                else instance.show();
                setOpacity(ele.ref, elementId, 1);
                if (!getReceivingSync() && roomId) {
                  emitSync(SYNC_EVENTS.TIPPY_SHOW, { page: 'home', elementId }, roomId);
                }
                clickTimers.current[elementId + '_timeout'] = setTimeout(() => {
                  delete clickTimers.current[elementId];
                }, 300);
              }
            };
          } else {
            ele.ref.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpacity(ele.ref, elementId, 1);
              onTowerClick?.(`/inspire/${towerPath}`);
            };
          }
          createHoverHandlers(ele.ref, elementId);
        }
      });

    singleton = createSingleton(TippyInstances, {
      delay: 0,
      arrow: false,
      moveTransition: "transform 0.2s ease-out",
      allowHTML: true,
      appendTo: document.getElementById("m3m-crown-page"),
      placement: "right",
    });
    };

    const timeoutId = setTimeout(setupTippyAndEvents, 50);

    return () => {
      clearTimeout(timeoutId);
      cleanupSingleton();
      hoverHandlers.current.forEach(({ element, enter, leave }) => {
        element?.removeEventListener('mouseenter', enter);
        element?.removeEventListener('mouseleave', leave);
      });
      hoverHandlers.current.clear();
      Object.keys(clickTimers.current).forEach(key => {
        if (key.endsWith('_timeout')) clearTimeout(clickTimers.current[key]);
      });
      clickTimers.current = {};
      document.querySelectorAll('style[id^="svg-hover-"]').forEach(style => style.remove());
      document.querySelectorAll('.svg-hover-active').forEach(el => el.classList.remove('svg-hover-active'));
    };
  }, [imageNumber, roomId, getAllFloorsInTower, getAllUnitsInTower, getAllUnitTypesInTower, onTowerClick, isTouchDevice]);

  useTippyShowSync({
    page: 'home',
    onSync: ({ elementId }) => {
      if (!elementId) return;
      setTimeout(() => {
        const instance = tippyInstanceMap.get(elementId);
        if (instance && singleton) {
          try {
            singleton.show(instance);
          } catch {
            instance?.show();
          }
        }
      }, 100);
    }
  });

  useSvgHoverSync({
    page: 'home',
    onSync: ({ elementId, opacity }) => {
      if (!elementId || opacity === undefined) return;
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (!element) {
          setTimeout(() => {
            const retryElement = document.getElementById(elementId);
            if (retryElement) {
              retryElement.classList.toggle('svg-hover-active', opacity === 1);
              retryElement.style.setProperty('opacity', opacity, 'important');
              if (opacity === 0 && singleton) singleton.hide();
            }
          }, 100);
          return;
        }

        element.classList.toggle('svg-hover-active', opacity === 1);
        element.style.setProperty('opacity', opacity, 'important');
        if (opacity === 0 && singleton) singleton.hide();
        
        const parent = element.parentElement;
        if (parent?.tagName === 'g' && window.getComputedStyle(parent).opacity === '0') {
          parent.style.setProperty('opacity', '1', 'important');
        }

        if (opacity === 1 && window.getComputedStyle(element).opacity === '0') {
          const styleId = `svg-hover-${elementId}`;
          let styleEl = document.getElementById(styleId);
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
          }
          styleEl.textContent = `#${elementId}.svg-hover-active { opacity: 1 !important; }`;
        } else if (opacity === 0) {
          document.getElementById(`svg-hover-${elementId}`)?.remove();
        }
      }, 0);
    }
  });

  return (
    <>
      {/* Tower overlays */}
      {TOWERS_LIST.map((tower) => (
        <TowerStyle key={tower}>
          <SVG
            renderer={
              <g id={`${tower}-tower-svg`} className="overlay-can-hide">
                <path d={ALL_TOWERS_SVGS[imageNumber][tower]} className="Available" />
              </g>
            }
          />
        </TowerStyle>
      ))}

      {/* Clubhouse overlay (rendered last to be on top) */}
      {CLUB_SVGS?.[imageNumber] && (
        <TowerStyle>
          <SVG
            renderer={
              <g id={`clubhouse-svg`} className="overlay-can-hide">
                <path d={CLUB_SVGS[imageNumber]} className="Available" />
              </g>
            }
          />
        </TowerStyle>
      )}
    </>
  );
}

const TowerStyle = styled.g`
  opacity: 1 !important;
  g {
    transition: all 200ms linear !important;
    opacity: 0 !important;
    pointer-events: all !important;
    path {
      transition: all 200ms linear !important;
      stroke: transparent !important;
      fill-opacity: 0.8 !important;
      stroke: rgba(0, 0, 0, 0.4) !important;
      fill: transparent;
      pointer-events: all !important;
    }
    :focus {
      outline: none !important;
    }
    :hover,
    &.svg-hover-active {
      opacity: 1 !important;
      cursor: pointer;
    }
    .Hold { fill: var(--clr-hold-faded); }
    .Available { fill: var(--clr-available-faded); }
    .Booked { fill: var(--clr-booked-faded); }
    .Blocked { fill: var(--clr-blocked-faded); }
  }
`;

export default TowersSvg;
