import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Compass from "../Components/Atoms/Compass";
import IconButton from "../Components/Atoms/IconButton";
import { CloseFullScreenIcon, FullScreenIcon, HideIcon, RadiusIcon } from "../Icons";
import { toggleFullScreen, toogleHideOverlays } from "../Utility/function";
import { useInventories, useMapFilter } from "../Hooks";
import { screen1PageMapFilters, TOWERS } from "../Data";
import CollapsiblePanel from "../Components/Molecules/CollapsiblePanel";
import UnitTypeFilter from "../Components/Molecules/UnitTypeFilter";
import { TowerSvg } from "../Data/TowerSvg";
import Navigator from "../Components/Molecules/Navigator";
import { useNavigate, useParams } from "react-router-dom";
import Amenities from "../Components/Atoms/Amenities";
import TowerName from "../Components/Atoms/TowerName";
import ExploreTowers from "../Components/Molecules/ExploreTowers";
import TowerRotateInstruction from "../Components/Atoms/TowerRotateInstruction";
import ProjectVideoBtn from "../Components/Molecules/ProjectVideoBtn";
import PopupVideoPlayer from "../Components/Molecules/PopupVideoPlayer";
import UnitStatusLegend from "../Components/Atoms/UnitStatusLegend";
import FloorSelector from "../Components/Molecules/FloorSelector";
import ReturnToPrev from "../Components/Atoms/ReturnToPrev";
import { AppContext } from "../Contexts/AppContext";
import ReraNumber from "../Components/Molecules/ReraNumber";
import Filters from "../Components/Molecules/Filters";
import VrHome from "./VrHome";
import { useRoomId } from "../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync } from "../services/socketSync";
import { useOverlayVisibilitySync } from "../Hooks/useOverlayVisibilitySync";

function Tower(props) {
  const { tower } = useParams();
  const [showOverlays, setShowOverlays] = useState(true);
  const navigate = useNavigate();
    const invalidTowers = ['cluster1', 'cluster2', 'cluster3', 'cluster4', 'cluster12', 'cluster13', 'cluster14'];
   if(invalidTowers.includes(tower)) navigate('/');
  const { setActiveMapFilterIds } = useMapFilter();
  const { setFlatFilterSizeValues,isFullScreen,setFullScreen } = useContext(AppContext);
  const { roomId } = useRoomId();

  const {
    getAllUnitTypesInCombinedTowers,
    getAllUnitsInCombinedTowers,
    getMinMaxSBUInCombinedTowers,
  } = useInventories();

  useEffect(() => {
    toogleHideOverlays(showOverlays);
  }, [showOverlays]);

  // Listen for overlay visibility sync events via SyncContext (sockets as single source of truth)
  useOverlayVisibilitySync({
    page: 'tower',
    onSync: (syncedShowOverlays) => {
      if (syncedShowOverlays !== undefined && syncedShowOverlays !== showOverlays) {
        console.log('👁️ [Tower] Syncing overlay visibility:', syncedShowOverlays);
        setShowOverlays(syncedShowOverlays);
      }
    }
  });

  // Handle video completion from TowerSvg
  const handleVideoComplete = useCallback((navPath) => {
    // Immediately navigate - no delay
    if (navPath) {
      navigate(navPath, { state: { fromTower: true } });
    }
  }, [navigate]);

  const minMaxArea = getMinMaxSBUInCombinedTowers(tower);

  useEffect(() => {
    setFlatFilterSizeValues(minMaxArea);
    setActiveMapFilterIds([...unitTypeFilters.map((filter) => filter.id)]);
  }, [tower]);

  const unitTypeFilters = getAllUnitTypesInCombinedTowers(tower).map(
    (type) => ({
      title: type,
      id: type,
    })
  );
  return (
    <Style>
      <Navigator
        className="navigator"
        prevPages={[
          // { title: "Delhi", path: "" },
          // {
          //   title: "Dwarka Expressway",
          //   path: "",
          // },
          {
            title: "Inspire",
            path: "/inspire",
          },
        ]}
        currentPage={{
          title: `Tower ${tower.replace("cluster","")}`,
          path: "tower",
        }}
      />
      {/* <VrHome /> */}
      {/* <ExploreTowers currentTower={tower} /> */}
      <ReturnToPrev text="Return To Aerial View" to={`/inspire`} />
      <Filters
        minMaxArea={minMaxArea}
        unitTypeFilters={unitTypeFilters}
        totalUnits={getAllUnitsInCombinedTowers(tower).length}
        filter
      />
      <UnitStatusLegend />
      {/* <div className="left-panels">
        <CollapsiblePanel className="filters" title={"Filters"}>
          <UnitTypeFilter
            minMaxArea={minMaxArea}
            unitTypeFilters={unitTypeFilters}
            totalUnits={getAllUnitsInCombinedTowers(tower).length}
          />
        </CollapsiblePanel>
      </div> */}
      <ExploreTowers currentTower={tower} />
      {/* <FloorSelector /> */}
      <div className="right-btn-group absolute flex gap-2  z-10 right-0 top-0">
        <IconButton
          className=""
          icon={HideIcon}
          tooltip="Hide Overlays"
          activeTooltip="Show Overlay"
          onClick={() => {
            const newShowOverlays = !showOverlays;
            setShowOverlays(newShowOverlays);
            
            // Sync overlay visibility if not receiving sync
            if (!getReceivingSync() && roomId) {
              emitSync(SYNC_EVENTS.OVERLAY_VISIBILITY, {
                showOverlays: newShowOverlays,
                page: 'tower'
              }, roomId);
            }
          }}
        />
        <div className="overlay-can-fade-out">
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
      {/* <TowerRotateInstruction /> */}
      {/* <ProjectVideoBtn /> */}

      <div className="compass-fullscreen-wrapper absolute bottom right flex row overlay-can-fade-out"></div>

      <div className="svg-wrapper" id="tower-page-svg-wrapper">
        {/* change this when you get complete data */}
        {tower && <TowerSvg tower={tower} onVideoComplete={handleVideoComplete} />}
      </div>
      <ReraNumber />
    </Style>
  );
}

// const SVG = ({ Renderer }) => Renderer;
export default Tower;

const Style = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden !important;
  /* background-image: url(${process.env.PUBLIC_URL}/dubai_map.jpg); */
  background-position: center;
  background-color: #87cfeb98;
  position: relative;

  /* 
  #return-to-tower {
    position: relative;
    left: 0;
    transform: unset;
    top: 0vh;
    background-color: rgba(41, 57, 160, 0.8);
  } */

  .svg-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    height: 100vh;
    width: 100%;
    overflow: hidden !important;
    display: flex;
    align-items: flex-end;
  }


  .map-filters,
  .location-info {
    position: absolute;
    top: 0;
    left: 2rem;
    margin-top: 8rem;
  }

  .location-info {
    margin-left: 12rem;
  }

  .left-panels {
    position: absolute;
    top: 1vh;
    left: 2rem;
    display: flex;
    flex-direction: column;
    z-index: 10;
    justify-content: space-between;
    height: 75vh;
    gap: 2rem;

    .filters {
      position: relative !important;
      left: 0;
      top: 0;
    }
  }

  .right-btn-group {
    margin: 1rem;
    z-index: 2;
    .icon-btn {
      margin: 1rem;
    }
  }
  @media screen and (max-width: 860px) {
    .right-btn-group {
      margin: 0.5rem 0.7rem;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    .right-btn-group {
      margin: 0.8rem 1.2rem;
    }
  }

  .compass-fullscreen-wrapper {
    padding: 1rem;
    align-items: center;
    padding-right: 2rem;
  }
`;
