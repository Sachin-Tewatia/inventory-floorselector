import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import tippy, { sticky } from "tippy.js";
import "tippy.js/animations/shift-toward.css";
import { useBlackout } from "../hooks";
import {
  tippyLocationInfoForData,
} from "./TippyLocationInfo";
import { mapDataManager } from "../services/mapDataManager";

import { distaces } from "../data/distance.js";

// Cache for titles and distances to avoid repeated API calls
let titlesCache = {};
let distancesCache = {};
let dataCachePromise = null;

const getDataForMapElement = async (mapElementId) => {
  // Return cached data if available
  if (titlesCache[mapElementId] && distancesCache[mapElementId] !== undefined) {
    return { title: titlesCache[mapElementId], distance: distancesCache[mapElementId] };
  }

  // If already fetching, wait for the existing promise
  if (dataCachePromise) {
    await dataCachePromise;
    return { 
      title: titlesCache[mapElementId] || mapElementId, 
      distance: distancesCache[mapElementId] || null 
    };
  }

  // Fetch titles and distances from API
  dataCachePromise = (async () => {
    try {
      const [titlesResult, distancesResult] = await Promise.all([
        mapDataManager.getTitles(),
        mapDataManager.getDistances()
      ]);
      
      if (titlesResult.success && titlesResult.data) {
        titlesCache = { ...titlesCache, ...titlesResult.data };
      }
      
      if (distancesResult.success && distancesResult.data) {
        distancesCache = { ...distancesCache, ...distancesResult.data };
      }
    } catch (error) {
      console.error('Failed to fetch data for tooltip:', error);
    } finally {
      dataCachePromise = null;
    }
  })();

  await dataCachePromise;
  return { 
    title: titlesCache[mapElementId] || mapElementId, 
    distance: distancesCache[mapElementId] || null 
  };
};

function MarkWithTippy({ children, isTenKm,isTenkmSatellite, bgColor = "#ffffffdd" }) {
  const ref = useRef(null);
  const { blackout } = useBlackout();

  useEffect(() => {
    const instances = [];
    if (!ref.current) return;
    for (let i = 0; i < ref.current.children.length; i++) {
      if (ref.current.children[i]._tippy)
        ref.current.children[i]._tippy.destroy();
    }

    if (blackout) return;

    for (let i = 0; i < ref.current.children.length; i++) {
      const ele = ref.current.children[i];
      if(!ele) return;
      ele.style.zIndex = "999999";
      ele.style.cursor = "pointer";
      ele.addEventListener("click", () => {
        for (let j = 0; j < ref.current.children.length; j++) {
          ref.current.children[j].style.transform = "";
          ref.current.children[j].style.transformBox = "";
          ref.current.children[j].style.transformOrigin = "";
        }

     
      });
      let className = ele.id.substring(2, ele.id.indexOf(" ")).trim();
      
      // Extract map_element_id from the SVG element id
      let mapElementId =
        ele.id
          .replace("__mall ", "")
          .replace("__hospital ", "")
          .replace("__temple ", "")
          .replace("__hotel ", "")
          .replace("__residential", "")
          .replace("__landmark ", "")
          .replace("__metro ", "")
          .replace("__airport", "")
          .replace("__highway ", "")
          .replace("__school ", "")
          .replace("__restaurant ", "")
          .replace("__office ", "") 
          .replace("__flyover ", "") 
          .replace("__sports ", "") ||null;
          
      // Use map_element_id directly (no more splitting by underscore)
      let tippyText = mapElementId;
      let tippywithlowercase = mapElementId.toLowerCase();
      let isDriving = distaces[tippywithlowercase]?.isDriving;

      // Get distance from the static distance data
      let distance = distaces[tippywithlowercase]?.distance;
      let time = distaces[tippywithlowercase]?.time;
      
      // Get specific landmark class and color styling
      const getLandmarkSpecificClass = (mapId) => {
        const id = mapId?.toLowerCase() || '';
        if (id.includes('airport')) return 'landmark-airport';
        if (id.includes('city_center') || id.includes('city_centre')) return 'landmark-citycenter';
        if (id.includes('eco_park') || id.includes('eco park')) return 'landmark-ecopark';
        if (id.includes('biswa')) return 'landmark-biswa';
        if (id.includes('salt_lake') || id.includes('stadium')) return 'landmark-stadium';
        if (id.includes('estate')) return 'landmark-estate';
        return 'landmark-default';
      };
      
      const getLandmarkColor = (mapId) => {
        const id = mapId?.toLowerCase() || '';
        if (id.includes('airport')) return '#1F8BED'; // Blue (matches icon fill)
        if (id.includes('city_center') || id.includes('city_centre')) return '#1E429F'; // Dark Blue (matches icon fill)
        if (id.includes('eco_park') || id.includes('eco park')) return '#077246'; // Green (matches icon fill)
        if (id.includes('biswa')) return '#7CA21B'; // Green/Yellow (matches icon fill)
        if (id.includes('salt_lake') || id.includes('stadium')) return '#493EA1'; // Purple (matches icon fill)
        if (id.includes('estate')) return '#A45D04'; // Brown (matches icon fill)
        return '#FF5454'; // Red default
      };
      
      const specificLandmarkClass = className === 'landmark' ? getLandmarkSpecificClass(mapElementId) : '';
      const landmarkColor = className === 'landmark' ? getLandmarkColor(mapElementId) : '';
      
      if (tippyText) {
        // Create tooltip with loading content first
        const styleAttr = landmarkColor 
          ? `style="background-color: ${landmarkColor} !important; backdrop-filter: blur(2px) !important;"` 
          : '';
        
        const instance = tippy(ele, {
          content: `
           <div class="${className} ${specificLandmarkClass} tippy-mark m-0 capitalize overlay-can-hide flex flex-col gap-1 justify-start" ${styleAttr} id="${ele.id}">
            <p class="w-full text-center">Loading...</p>
            <p class="w-full text-center">${distance} KM</p>
           </div>
          `,
          animation: "shift-toward",
          placement: /iit/i.test(tippyText) || (/axis mall|novotel|tata/i.test(tippyText) && isTenKm || isTenkmSatellite) ? "top" : "bottom",
          allowHTML: true,
          arrow: false,
          //followCursor: false,
          interactive: true,
          offset: [0, 0],
          trigger: "mouseenter", // changes
          sticky: true,
          plugins: [sticky],
          zIndex: 5,
          showOnCreate: false, 
          hideOnClick: false,
          appendTo: document.getElementById("app"),
        });
        
        instances.push(instance); // Add instance to array for cleanup

        // Update content with actual title and distance once loaded
        getDataForMapElement(tippyText).then(({ title: displayTitle, distance: apiDistance }) => {
          if (instance && displayTitle) {
            // Use API distance if available, otherwise fallback to static distance
            const finalDistance = apiDistance || distance;
            instance.setContent(`
              <div class="${className} ${specificLandmarkClass} tippy-mark m-0 capitalize overlay-can-hide flex flex-col gap-1 justify-start" ${styleAttr} id="${ele.id}">
                <p class="w-full text-center">${displayTitle}</p>
                <p class="w-full text-center">${finalDistance} KM</p>
               </div>
            `);
          }
        });
      }
    }
    return () => {
      for (const instance of instances) {
        instance.destroy();
      }
    };
  }, [blackout, children]); // Add children to dependency array

  return <Style ref={ref}>{children}</Style>;
}

export default MarkWithTippy;

const Style = styled.g`
  cursor: pointer;
  z-index: 999999999999999;
`;



