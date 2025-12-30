import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Compass from "../Components/Atoms/Compass";
import IconButton from "../Components/Atoms/IconButton";
import { CloseFullScreenIcon, FullScreenIcon, HideIcon, RadiusIcon } from "../Icons";
import { toggleFullScreen, toogleHideOverlays } from "../Utility/function";
import {
  mark_radius,
  screen1_landmarks_with_routes,
  smart_world_site_1,
} from "../Data/Screen1PageSvg";
import SVG from "../Components/Atoms/SVG";
import { useMapFilter } from "../Hooks";
import LocationInfo from "../Components/Atoms/LocationInfo";
import { Link, useNavigate } from "react-router-dom";
import { screen1PageMapFilters } from "../Data";
import CollapsiblePanel from "../Components/Molecules/CollapsiblePanel";
import Screen1PageMapFilter from "../Components/Molecules/Screen1PageMapFilter";
import Legends from "../Components/Atoms/Legends";
import UnitTypeFilter from "../Components/Molecules/UnitTypeFilter";
import Navigator from "../Components/Molecules/Navigator";
import TowersSvg, { hideTowersTippy } from "../Components/Atoms/TowersSvg";
import ProjectVideoBtn from "../Components/Molecules/ProjectVideoBtn";
import { COMPASS_ANGLES } from "../Utility/Constants";
import VrTourBtn from "../Components/Molecules/VrTourBtn";
import ReraNumber from "../Components/Molecules/ReraNumber";
import VrHome from "./VrHome";
import { AppContext } from "../Contexts/AppContext";
import { useRoomId } from "../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync } from "../services/socketSync";
import { useImageNavigationSync } from "../Hooks/useImageNavigationSync";
import { useVideoPlaybackSync } from "../Hooks/useVideoPlaybackSync";

function HomePage(props) {
  const [imageNumber, setImageNumber] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [hideSvg, setHideSvg] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const {isFullScreen,setFullScreen} = useContext(AppContext);
  const { roomId } = useRoomId();
  
  const totalImages = [0, 1, 2];
  
  // Function to hide all visible tippy instances (same method as FloorSvg)
  const hideAllTippyInstances = useCallback(() => {
    // Hide TowersSvg tippy singleton (same method as FloorSvg)
    hideTowersTippy();
  }, []);

  const handlePrevImage = useCallback(() => {
    hideAllTippyInstances();
    const newImageNumber = imageNumber <= 0 ? totalImages.length - 1 : imageNumber - 1;
    setImageNumber(newImageNumber);
    
    if (!getReceivingSync() && roomId) {
      emitSync(SYNC_EVENTS.IMAGE_NAVIGATION, {
        imageNumber: newImageNumber,
        page: 'home'
      }, roomId);
    }
  }, [imageNumber, roomId, hideAllTippyInstances]);
  
  const handleNextImage = useCallback(() => {
    hideAllTippyInstances();
    const newImageNumber = imageNumber >= totalImages.length - 1 ? 0 : imageNumber + 1;
    setImageNumber(newImageNumber);
    
    if (!getReceivingSync() && roomId) {
      emitSync(SYNC_EVENTS.IMAGE_NAVIGATION, {
        imageNumber: newImageNumber,
        page: 'home'
      }, roomId);
    }
  }, [imageNumber, roomId, hideAllTippyInstances]);
  
  // Handle image navigation sync events via context (no window events)
  useImageNavigationSync({
    page: 'home',
    onSync: (syncedImageNumber) => {
      if (syncedImageNumber !== imageNumber) {
        hideAllTippyInstances();
        setImageNumber(syncedImageNumber);
      }
    }
  });

  // Preload video on mount and ensure it's ready
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.preload = 'auto';
      videoRef.current.load();
      
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

  // Hide tippy on component unmount
  useEffect(() => {
    return () => {
      hideAllTippyInstances();
    };
  }, [hideAllTippyInstances]);

  const handleVideoComplete = useCallback((navPath) => {
    setIsPlayingVideo(false);
    setHideSvg(false);
    hideAllTippyInstances();
    if (navPath) {
      navigate(navPath);
    }
    setPendingNavigation(null);
  }, [navigate, hideAllTippyInstances]);

  // Play video helper function
  const playVideo = useCallback((navPath) => {
    hideAllTippyInstances();
    setPendingNavigation(navPath);
    setIsPlayingVideo(true);
    setHideSvg(true);
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
        handleVideoComplete(navPath);
      });
    }
  }, [handleVideoComplete, hideAllTippyInstances]);

  // Handle tower click events from TowersSvg
  const handleTowerClick = useCallback((navPath) => {
    // Play video locally
    playVideo(navPath);
    
    // Sync video playback if not receiving sync
    if (!getReceivingSync() && roomId) {
      emitSync(SYNC_EVENTS.VIDEO_PLAYBACK, {
        page: 'home',
        navPath: navPath,
      }, roomId);
    }
  }, [roomId, playVideo]);

  // Listen for video playback sync events via SyncContext (sockets as single source of truth)
  const handleVideoPlaybackSync = useCallback((data) => {
    const { navPath } = data;
    if (navPath) {
      console.log('🎬 [HomePage] Syncing video playback:', navPath);
      playVideo(navPath);
    }
  }, [playVideo]);

  useVideoPlaybackSync({
    page: 'home',
    onSync: handleVideoPlaybackSync
  });


  const handleVideoEnded = () => {
    if (pendingNavigation) {
      handleVideoComplete(pendingNavigation);
    }
  };
  return (
    <Style id="m3m-crown-page">
      <Navigator
        className="navigator"
        // prevPages={[
        //   { title: "India", path: "/india" },
        //   { title: "Delhi", path: "" },
        //   {
        //     title: "Dwarka Expressway",
        //     path: "",
        //   },
        // ]}
        currentPage={{
          title: "Inspire",
          path: "/inspire",
        }}
      />
      {/* <ProjectVideoBtn /> */}
      {/* <VrTourBtn /> */}
      {/* <VrHome /> */}
      <div className="compass-fullscreen-wrapper absolute top right flex row">
        {/* <div className="col flex j-end">
          <Compass angle={COMPASS_ANGLES.PROJECT_PAGE[imageNumber]} />
        </div> */}
        <div className="col w-space flex j-end z-10">
          <IconButton
            icon={isFullScreen ? CloseFullScreenIcon : FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            isFullScreen={isFullScreen} // Pass isFullScreen from context
            onClick={() => {
              const newFullScreenState = !isFullScreen;
              setFullScreen(newFullScreenState);
              toggleFullScreen();
              
              // Sync fullscreen state if not receiving sync
              if (!getReceivingSync() && roomId) {
                emitSync(SYNC_EVENTS.FULLSCREEN, {
                  isFullScreen: newFullScreenState
                }, roomId);
              }
            }}
          />
        </div>
      </div>
      <div className="overlay-can-fade-out">
        <button
          className={`absolute top-[50%] right-[10%]  px-8 py-1  rounded-xl cursor-pointer z-30 arrow-left `}
          style={{ backgroundColor: 'var(--background_panel)' }}
          onClick={handleNextImage}
        >
          {" "}
          <img
            className="hover:scale-110 rotate-90 arrow-animate   "
            alt="next-arrow"
            src={`/up_arrow.svg`}
          />
        </button>
        <button
          className={`absolute top-[50%] left-[10%] px-8 py-1 rounded-xl cursor-pointer z-30 arrow-right`}
          style={{ backgroundColor: 'var(--background_panel)' }}
          onClick={handlePrevImage}
        >
          {" "}
          <img
            className="hover:scale-110 -rotate-90 arrow-animate "
            alt="next-arrow"
            src={`/up_arrow.svg`}
          />
        </button>
      </div>
      <VideoWrapper>
        {/* Video overlay for iPhone compatibility - positioned absolutely over SVG */}
        {/* Always render video (hidden when not playing) for preloading */}
        <VideoOverlay
          ref={videoRef}
          src={`${process.env.PUBLIC_URL}/homepage/0.mp4`}
          muted
          playsInline
          preload="auto"
          style={{ display: isPlayingVideo ? 'block' : 'none' }}
          autoPlay={isPlayingVideo}
          onEnded={handleVideoEnded}
          onError={() => {
            console.error("Video error occurred");
            if (pendingNavigation) {
              handleVideoComplete(pendingNavigation);
            }
          }}
        />
      <svg
        preserveAspectRatio="xMidYMid slice"
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        fill="none"
        className="home-svg"
      >
        <g>
            {/* Show images when not playing */}
            {!isPlayingVideo && totalImages.map((val, index) => (
            <image
                key={index}
              height="100%"
              hidden={val !== imageNumber}
              style={{ objectFit: "contain", backdropFilter: "opacity(10%)" }}
              xlinkHref={`${process.env.PUBLIC_URL}/homepage/${val}.webp`}
            />
          ))}
        </g>
          {/* svg for all towers with tippy - hide when video is playing */}
          {!hideSvg && <TowersSvg imageNumber={imageNumber} onTowerClick={handleTowerClick} />}
      </svg>
      </VideoWrapper>
      <ReraNumber />
      {/* <ProjectVideoBtn /> */}
    </Style>
  );
}

// const SVG = ({ Renderer }) => Renderer;
export default HomePage;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const VideoOverlay = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  pointer-events: none;
`;

const Style = styled.main`
  height: 100vh;
  overflow: hidden;
  width: 100%;
  background-color: #050a06;

  .home-svg {
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 1;
    /* background: red; */
  }

  .right-btn-group {
    margin: 1rem;
    .icon-btn {
      margin: 1rem;
    }
  }
  .arrow-left {
    transform: rotate(90deg);
  }
  .arrow-right {
    transform: rotate(-90deg);
  }
  .arrow-animate {
    animation: arrow 0.9s 0.3s infinite alternate ease-in-out;

    @keyframes arrow {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(1.2);
      }
    }
  }
  .compass-fullscreen-wrapper {
    padding: 1rem;
    padding-right: 2rem;
  }

  .overlay-can-fade-out {
    button {
      /* Mobile responsive styles */
      @media screen and (max-width: 860px) {
        padding: 0.4rem 0.7rem !important;
        border-radius: 6px !important;
        
        img {
          width: 18px;
          height: 18px;
        }
      }

      /* Medium screen responsive styles (860px - 1080px) */
      @media screen and (min-width: 861px) and (max-width: 1080px) {
        padding: 0.7rem 1rem !important;
        border-radius: 9px !important;
        
        img {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
`;
