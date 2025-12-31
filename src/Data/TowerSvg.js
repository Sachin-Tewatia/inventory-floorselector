import { useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { UNIT_STATUS } from ".";
import FloorsWithTippy from "../Components/Atoms/FloorWithTippy";
import { AppContext } from "../Contexts/AppContext";
import { useInventories, useMapFilter } from "../Hooks";
import RotateTower from "../Pages/RotateTower";
import { getSVGID } from "../Utility/function";
import { tower_floor_svgs } from "./floorSvgs";
import { useNavigate, useLocation } from "react-router-dom";
import Compass from "../Components/Atoms/Compass";
import {
  COMBINED_TOWERS_MAP,
  COMPASS_ANGLES,
  getTowerFromCombinedTowersAndIndex,
} from "../Utility/Constants";
import TowerName from "../Components/Atoms/TowerName";
import Loading from "../Components/Atoms/Loading";
import { useRoomId } from "../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync } from "../services/socketSync";
import { useImageNavigationSync } from "../Hooks/useImageNavigationSync";
import { useVideoPlaybackSync } from "../Hooks/useVideoPlaybackSync";

export const TowerSvg = ({ tower, onVideoComplete }) => {
  const {
    getAllFloorsInTower,
    getAllUnitsInFloor,
    getAllUnitStatusInFloor,
    getMinMaxSBUInFloor,
    getMinMaxTotalCostInFloor,
    getAllUnitTypesInTower,
    getAllUnitTypesInFloor,
    getUnitTypeBYId,
    getUnitById,
  } = useInventories();
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [hideSvg, setHideSvg] = useState(false);
  const [hideImage, setHideImage] = useState(false);
  const videoRef = useRef(null);
  const location = useLocation();
  const { roomId } = useRoomId();

  const totalRoation = Object.keys(tower_floor_svgs[tower]).length - 1;

  const ref = useRef(null);

  const [floorsData, setFloorsData] = useState([]);

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const { flatFilterPriceValues, flatFilterSizeValues } =
    useContext(AppContext);

  const { activeMapFilterIds } = useMapFilter();

  // Function to extract cluster number from URL and map to tower code
  const getTowerCodeFromURL = () => {
    const path = location.pathname;
    // Extract cluster number from URL (e.g., "cluster10" from "/salarpuria/tower/cluster10")
    const clusterMatch = path.match(/cluster(\d+)/);
    if (clusterMatch && clusterMatch[1]) {
      // Map cluster number to tower code (cluster1 -> t1, cluster2 -> t2, etc.)
      return `t${clusterMatch[1]}`;
    }
    // Return a default value if no match found
    return "t1";
  };

  // Function to extract only numeric part from tower (T1 -> 1, cluster2 -> 2)
  const extractTowerNumber = (towerString) => {
    // Match any digits in the string
    const match = towerString.match(/\d+/);
    return match ? match[0] : "";
  };

  const isFloorActive = (tower, area, unit_type) => {
    if (!activeMapFilterIds.includes(unit_type)) return false;

    if (!(area <= flatFilterSizeValues[1] && area >= flatFilterSizeValues[0]))
      return false;
    return true;
  };

  useEffect(() => {
    if (!ref.current) return;
    const towersRef = ref.current.children[1].children;

    // Get the tower code from URL
    const towerCode = getTowerCodeFromURL();

    for (const towerRef of towersRef) {
      const towerId = getSVGID(towerRef.id);
      const currentTower = getTowerFromCombinedTowersAndIndex(
        tower,
        parseInt(towerId) - 1
      );

      const floors = towerRef.children;

      for (let i = 0; i < floors.length; i++) {
        const floor = floors[i];
        // Use the towerCode to construct the unit ID
        const unitID = `${towerCode}_${floor.id}`;

        const flat = getUnitById(unitID);
        let floorNo = parseInt(getSVGID(floor.id));

        if (
          isFloorActive(currentTower, flat?.area || 0, flat?.unit_type || "")
        ) {
          floor.classList.add("active");
        } else floor.classList.remove("active");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    flatFilterPriceValues,
    flatFilterSizeValues,
    activeMapFilterIds,
    currentFrameIndex,
    tower,
    rotation,
    location.pathname,
  ]);

  const handlePrevImage = () => {
    // Go to previous rotation (decrement)
    const newRotation = rotation <= 0 ? totalRoation : rotation - 1;
    setRotation(newRotation);

    // Sync rotation navigation if not receiving sync
    if (!getReceivingSync() && roomId) {
      emitSync(SYNC_EVENTS.IMAGE_NAVIGATION, {
        imageNumber: newRotation,
        rotation: newRotation,
        page: 'tower',
        tower: tower
      }, roomId);
    }
  };

  const handleNextImage = () => {
    // Go to next rotation (increment)
    const newRotation = rotation >= totalRoation ? 0 : rotation + 1;
    setRotation(newRotation);

    // Sync rotation navigation if not receiving sync
    if (!getReceivingSync() && roomId) {
      emitSync(SYNC_EVENTS.IMAGE_NAVIGATION, {
        imageNumber: newRotation,
        rotation: newRotation,
        page: 'tower',
        tower: tower
      }, roomId);
    }
  };

  // Handle rotation navigation sync events via context (no window events)
  useImageNavigationSync({
    page: 'tower',
    tower: tower,
    onSync: (syncedRotation) => {
      if (syncedRotation !== rotation) {
        setRotation(syncedRotation);
      }
    }
  });

  // Function to hide all visible tippy instances
  const hideAllTippyInstances = () => {
    try {
      // Method 1: Hide all tippy boxes directly
      const tippyBoxes = document.querySelectorAll('.tippy-box');
      tippyBoxes.forEach(box => {
        if (box.style) {
          box.style.display = 'none';
        }
        const tippyInstance = box._tippy;
        if (tippyInstance && typeof tippyInstance.hide === 'function') {
          tippyInstance.hide();
        }
      });

      // Method 2: Find all elements with tippy instances and hide them
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el._tippy && typeof el._tippy.hide === 'function') {
          el._tippy.hide();
        }
      });

      // Method 3: Hide tippy root containers
      const tippyRoots = document.querySelectorAll('[data-tippy-root]');
      tippyRoots.forEach(root => {
        if (root.style) {
          root.style.display = 'none';
        }
        const tippyInstance = root._tippy;
        if (tippyInstance && typeof tippyInstance.hide === 'function') {
          tippyInstance.hide();
        }
      });

      // Method 4: Remove tippy elements from DOM after a short delay
      setTimeout(() => {
        const remainingTippyBoxes = document.querySelectorAll('.tippy-box');
        remainingTippyBoxes.forEach(box => {
          if (box.style && box.style.display !== 'none') {
            box.style.display = 'none';
          }
        });
      }, 100);
    } catch (error) {
      console.error('Error hiding tippy instances:', error);
    }
  };

  const handleVideoComplete = useCallback((navPath) => {
    setIsPlayingVideo(false);
    setHideSvg(false);
    setHideImage(false); // Reset image visibility
    // Hide all tippy instances before navigation
    hideAllTippyInstances();
    // Call callback to navigate after video completes
    if (navPath && onVideoComplete) {
      onVideoComplete(navPath);
    }
    setPendingNavigation(null);
  }, []);

  // Play video helper function
  const playVideo = useCallback((navPath) => {
    setPendingNavigation(navPath);
    setHideSvg(true); // Hide SVG elements when video starts
    setHideImage(true); // Start fade-out animation for image

    // Hide all tippy instances immediately
    hideAllTippyInstances();

    // Wait for fade animation to complete (0.5s) before showing video
    setTimeout(() => {
      setIsPlayingVideo(true); // Show video after fade completes

      // Hide tippy again after video appears (in case any reappeared)
      setTimeout(() => {
        hideAllTippyInstances();
      }, 100);

      // Start video playback after video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch((err) => {
            console.error("Error playing video:", err);
            // If autoplay fails, complete transition
            handleVideoComplete(navPath);
          });
        }
      }, 50);
    }, 500); // Wait for fade animation duration
  }, [handleVideoComplete]);

  // Handle floor click to play video and navigate
  const handleFloorClick = useCallback((navPath) => {
    // Play video locally
    playVideo(navPath);

    // Sync video playback if not receiving sync
    if (!getReceivingSync() && roomId) {
      emitSync(SYNC_EVENTS.VIDEO_PLAYBACK, {
        page: 'tower',
        tower: tower,
        navPath: navPath,
      }, roomId);
    }
  }, [roomId, tower, playVideo]);

  // Listen for video playback sync events via SyncContext (sockets as single source of truth)
  const handleVideoPlaybackSync = useCallback((data) => {
    const { navPath } = data;
    if (navPath) {
      console.log('🎬 [TowerSvg] Syncing video playback:', navPath);
      // Hide tippy instances before playing video
      hideAllTippyInstances();
      // Small delay to ensure tippy is hidden before video starts
      setTimeout(() => {
        playVideo(navPath);
      }, 50);
    }
  }, [playVideo]);

  useVideoPlaybackSync({
    page: 'tower',
    tower: tower,
    onSync: handleVideoPlaybackSync
  });

  // Preload video on mount and ensure it's ready
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.preload = 'auto';
      videoRef.current.load();

      // Ensure video is ready to play
      const handleCanPlay = () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('canplay', handleCanPlay);
        }
      };

      videoRef.current.addEventListener('canplay', handleCanPlay);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('canplay', handleCanPlay);
        }
      };
    }
  }, []);

  const handleVideoEnded = () => {
    if (pendingNavigation) {
      handleVideoComplete(pendingNavigation);
    }
  };

  return tower ? (
    <>
      {loading && <Loading />}
      <ArrowButtonsWrapper className="overlay-can-fade-out">
        <button
          className={`absolute top-[55%] right-[30%] rounded-2xl cursor-pointer z-30 bg-[#363636] px-2 py-3  ${"imageNumber" > 2 && "opacity-50"
            }`}
          onClick={handleNextImage}
        >
          {" "}
          <img
            className="hover:scale-110 rotate-90"
            alt="next-arrow"
            src={`/up_arrow.svg`}
          />
        </button>
        <button
          className={`absolute top-[55%] left-[30%] rounded-2xl cursor-pointer z-30  bg-[#363636] px-2 py-3  ${"imageNumber" < 2 && "opacity-50"
            }`}
          onClick={handlePrevImage}
        >
          {" "}
          <img
            className="hover:scale-110 -rotate-90"
            alt="next-arrow"
            src={`/up_arrow.svg`}
          />
        </button>
      </ArrowButtonsWrapper>
      {/* <TowerName combinedTower={tower} rotation={rotation} /> */}
      {/* <Compass angle={COMPASS_ANGLES.TOWERS[tower] + 30 * rotation} /> */}
      <VideoWrapper>
        {/* Video overlay for iPhone compatibility - positioned absolutely over SVG */}
        {/* Always render video (hidden when not playing) for preloading */}
        <VideoOverlay
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/animation.mp4`}
          muted
          playsInline
          preload="auto"
          width="1920"
          height="1080"
          style={{ display: isPlayingVideo ? 'block' : 'none' }}
          autoPlay={isPlayingVideo}
          onEnded={handleVideoEnded}
          onLoadedMetadata={(e) => {
            // Ensure video maintains its native 1920x1080 dimensions
            if (e.target) {
              e.target.width = 1920;
              e.target.height = 1080;
            }
          }}
          onError={() => {
            console.error("Video error occurred");
            if (pendingNavigation) {
              handleVideoComplete(pendingNavigation);
            }
          }}
        />
        <Style
          viewBox="0 0 1920 1080"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          ref={ref}
        >
          <g id="rotation-images">
            {/* Always render images - fade out when hideImage is true */}
            {Object.keys(tower_floor_svgs[tower]).map((val, index) => (
              <image
                key={index}
                draggable="false"
                hidden={val !== rotation.toString()}
                xlinkHref={`${process.env.PUBLIC_URL}/towers/${tower}/${val}.webp`}
                alt="rotate tower"
                className={hideImage ? "fade-out-animation" : ""}
                style={hideImage ? { pointerEvents: 'none' } : {}}
                onLoad={() => setLoading(false)}
              />
            ))}
          </g>

          {floorsData && !hideSvg && (
            <FloorsWithTippy
              floorsData={floorsData}
              tower={tower}
              rotation={rotation}
              onFloorClick={handleFloorClick}
            >
              {tower_floor_svgs[tower][rotation]}
            </FloorsWithTippy>
          )}
        </Style>
      </VideoWrapper>
    </>
  ) : (
    <></>
  );
};

const ArrowButtonsWrapper = styled.div`
  button {
  background-color: var(--background_panel) !important;
    /* Mobile responsive styles */
    @media screen and (max-width: 860px) {
      padding: 0.5rem 0.3rem !important;
      border-radius: 6px !important;

      img {
        width: 14px;
        height: 14px;
      }
    }

    /* Medium screen responsive styles (860px - 1080px) */
    @media screen and (min-width: 861px) and (max-width: 1080px) {
      padding: 0.85rem 0.7rem !important;
      border-radius: 9px !important;

      img {
        width: 22px;
        height: 22px;
      }
    }
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  /* Maintain 16:9 aspect ratio to match SVG viewBox (1920:1080) */
  aspect-ratio: 16 / 9;
  overflow: hidden;
`;

const VideoOverlay = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 1;
  pointer-events: none;
  /* Ensure video maintains 1920x1080 aspect ratio */
  min-width: 100%;
  min-height: 100%;
`;

const Style = styled.svg`
  height: 100%;
  width: 100%;
  fill: transparent;
  position: relative;
  z-index: 1;
  /* Ensure SVG maintains viewBox aspect ratio (1920:1080 = 16:9) */
  aspect-ratio: 16 / 9;

  #rotation-images {
    image {
      transition: opacity 0.5s ease-in-out;
    }

    image.fade-out-animation {
      animation: fadeOut 0.5s ease-in-out forwards;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  g {
    path {
      transition: all 200ms linear !important;
      opacity: 0 !important;
      fill-opacity: 0.8 !important;
      fill: transparent;
      pointer-events: none;
      stroke-width: 0;
      :hover {
        fill: transparent !important;
        /* stroke: rgba(255, 255, 255, 0.8); */
        stroke-width: 2px;
        transform: scale(1.001);
      }
      :focus {
        outline: none !important;
      }
      &.active {
        opacity: 1 !important;
        pointer-events: all;
        /* stroke-width: 1px; */
      }
      &.tippy-showing {
        fill: transparent !important;
        stroke-width: 2px;
        transform: scale(1.001);
      }
    }

    .active.hold {
      fill: var(--clr-hold-faded);
      stroke: var(--clr-hold);
    }

    .active.available {
      fill: var(--clr-available-faded);
      stroke: var(--clr-available);
    }

    .active.sold {
      fill: var(--clr-booked-faded);
      stroke: var(--clr-booked);
    }

    .active.mixed {
      fill: var(--clr-mixed-faded);
      stroke: var(--clr-mixed);
    }
  }
`;
