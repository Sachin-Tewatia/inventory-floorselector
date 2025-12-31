import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import Compass from "../Components/Atoms/Compass";
import IconButton from "../Components/Atoms/IconButton";
import { CloseFullScreenIcon, FullScreenIcon, HideIcon, RadiusIcon } from "../Icons";
import {
  getCombinedTowerName,
  toggleFullScreen,
  toogleHideOverlays,
} from "../Utility/function";
import { useInventories, useMapFilter } from "../Hooks";
import {
  getFloorType,
  getTowerNumber,
  screen1PageMapFilters,
  TOWERS,
  TOWERS_LIST,
  unitTypeFilters,
} from "../Data";
import CollapsiblePanel from "../Components/Molecules/CollapsiblePanel";
import Screen1PageMapFilter from "../Components/Molecules/Screen1PageMapFilter";
import Legends from "../Components/Atoms/Legends";
import UnitTypeFilter from "../Components/Molecules/UnitTypeFilter";
import { TowerSvg } from "../Data/TowerSvg";
import FloorNoIndicator from "../Components/Molecules/FloorNoIndicator";
import SVG from "../Components/Atoms/SVG";
import FloorSvg from "../Components/SVGs/FloorSvg";
import UnitMark from "../Components/Atoms/UnitMark";
import Zoomable from "../Components/Molecules/Zoomable";
import FloorSelector from "../Components/Molecules/FloorSelector";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import Navigator from "../Components/Molecules/Navigator";
import { useNavigate, useLocation } from "react-router-dom";
import ApartmentsDetails from "../Components/Molecules/ApartmentsDetails";
import { useContext } from "react";
import { AppContext, useLoading } from "../Contexts/AppContext";
import ReturnToPrev from "../Components/Atoms/ReturnToPrev";
import { FLOORS_IMGS } from "../Data/flatSvgs";
import ProjectVideoBtn from "../Components/Molecules/ProjectVideoBtn";
import {
  COMPASS_ANGLES,
  getCombinedTowerFromTower,
  getTowerFromCombinedTowersAndIndex,
} from "../Utility/Constants";
import UnitStatusLegend from "../Components/Atoms/UnitStatusLegend";
import Loading from "../Components/Atoms/Loading";
import ReraNumber from "../Components/Molecules/ReraNumber";
import Filters from "../Components/Molecules/Filters";
import VrHome from "./VrHome";
import { useRoomId } from "../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync } from "../services/socketSync";
import { useOverlayVisibilitySync } from "../Hooks/useOverlayVisibilitySync";

function Floor() {
  const towers = {
    a: "A",
    b: "B",
    c: "C",
    d: "D",
    e: "E",
    f: "F",
    g: "G",
    h: "H",
  };

  const { activeMapFilterIds, isFilterActive, setActiveMapFilterIds } =
    useMapFilter();
  const { getAllFlatsInFloor } = useInventories();
  const [showOverlays, setShowOverlays] = useState(true);
  const ref = useRef();
  const params = useParams();
  const { floor, tower, unit } = params;
  const { roomId } = useRoomId();

  const combinedTower = getTowerFromCombinedTowersAndIndex(tower, 0);
  const UNITS = getAllFlatsInFloor(combinedTower, floor);
  const currentFloor = (floor);
  const currentTower = tower;
  const [selectedFloor, setSelectedFloor] = useState(currentFloor);
  const [selectedTower, setSelectedTower] = useState(currentTower);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [exploreView, setExploreView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageAnimation, setImageAnimation] = useState(false);
  const [zoomOutAnimation, setZoomOutAnimation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const {
    flatFilterPriceValues,
    flatFilterSizeValues,
    setFlatFilterSizeValues,
    isFullScreen,
    setFullScreen,
  } = useContext(AppContext);
  const { getMinMaxSBUInFloor, getAllUnitTypesInFloor } = useInventories();

  useEffect(() => {
    if (params.unit) {
      setSelectedUnit(parseInt(unit.slice(2)));
      setExploreView(true);
      // setMapValue(mapValuesOfUnits[parseInt(unit.slice(2))]);
    } else {
      setSelectedUnit(null);
      setExploreView(false);
    }
  }, [location]);

  useEffect(() => {
    // Check if navigating from Tower page and trigger image animation
    const isFromTower = location.state?.fromTower === true;
    if (isFromTower) {
      // Trigger image animation after a short delay
      setTimeout(() => {
        setImageAnimation(true);
      }, 100);
    } else {
      setImageAnimation(false);
    }
  }, [location]);

  // Handle unit click events to trigger zoom-out animation
  const handleUnitClick = useCallback((navPath) => {
    setPendingNavigation(navPath);
    setZoomOutAnimation(true);

    // Navigate after animation completes
    setTimeout(() => {
      if (navPath) {
        navigate(navPath, { state: { fromFloor: true } });
      }
      setZoomOutAnimation(false);
      setPendingNavigation(null);
    }, 800); // Animation duration
  }, [navigate]);
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), [2000]);
    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    // adding animation in zoomable compoenent
    ref.current.parentElement.style.transition = "all linear 0.1s";
    toogleHideOverlays(showOverlays);
  }, [showOverlays]);

  // Listen for overlay visibility sync events via SyncContext (sockets as single source of truth)
  useOverlayVisibilitySync({
    page: 'floor',
    onSync: (syncedShowOverlays) => {
      if (syncedShowOverlays !== undefined && syncedShowOverlays !== showOverlays) {
        console.log('👁️ [Floor] Syncing overlay visibility:', syncedShowOverlays);
        setShowOverlays(syncedShowOverlays);
      }
    }
  });

  const minMaxArea = [
    Math.min(...getMinMaxSBUInFloor(combinedTower, floor)),
    Math.max(...getMinMaxSBUInFloor(combinedTower, floor)),
  ];

  useEffect(() => {
    setLoading(true);
    setFlatFilterSizeValues(minMaxArea);
    setActiveMapFilterIds([...unitTypeFilters.map((filter) => filter.id)]);
  }, [tower, floor]);

  const isUnitActive = (unit) => {
    if (!unit) return false;

    if (!activeMapFilterIds.includes(unit.unit_type)) return false;
    const flatSBU = unit.area;
    if (
      !(
        flatSBU <= flatFilterSizeValues[1] && flatSBU >= flatFilterSizeValues[0]
      )
    )
      return false;
    return true;
  };

  const unitTypeFilters = getAllUnitTypesInFloor(combinedTower, floor).map((type) => ({
    title: type,
    id: type,
  }));

  useEffect(() => {
    if (["T14"].includes(combinedTower) && ["g", "G"].includes(floor)) {
      navigate(`/inspire/tower/${tower}/floor/1`);
    }
  }, [floor, tower]);

  return (
    <Style
      onClick={() => {
        setSelectedFloor(currentFloor);
        setSelectedTower(currentTower);
        setSelectedUnit(false);
        setExploreView(false);
      }}
      id="floor-container"
    >
      {loading && <Loading />}
      {/* <ProjectVideoBtn /> */}

      <ReturnToPrev
        text="Return To Tower"
        to={`/inspire/tower/${tower}`}
      />

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
          {
            title: `Tower ${combinedTower.replace("T", '')}`,
            path: `/inspire/tower/${tower}`,
          },
        ]}
        currentPage={{
          title: `${floor == 0 ? `Ground Floor` : `Floor ${floor}`}`,
          path: `/inspire/tower/${tower}/floor/${floor}`,
        }}
      />
      <>
        <Filters
          unitTypeFilters={unitTypeFilters}
          minMaxArea={minMaxArea}
          totalUnits={getAllFlatsInFloor(combinedTower, floor).length}
          currentFloor={currentFloor}
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          currentTower={currentTower}
          selectedTower={selectedTower}
          setSelectedTower={setSelectedTower}

          floor
          filter
        />
        {/* <div className="floor-selector ">
          <FloorSelector
            currentFloor={currentFloor}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
            currentTower={currentTower}
            selectedTower={selectedTower}
            setSelectedTower={setSelectedTower}
          />
        </div> */}
        <div className="unit-type-filter overlay-can-fade-out">
          <CollapsiblePanel title={"Filters"}>
            <UnitTypeFilter
              unitTypeFilters={unitTypeFilters}
              minMaxArea={minMaxArea}
              totalUnits={getAllFlatsInFloor(combinedTower, floor).length}
            />
          </CollapsiblePanel>
        </div>
      </>
      <div className="col flex j-end">
        <Compass angle={COMPASS_ANGLES.TOWERS[tower]} />
      </div>
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
                page: 'floor'
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
      <UnitStatusLegend />

      {/* <div className="compass-fullscreen-wrapper absolute bottom right flex row overlay-can-fade-out">
        <div className="col w-space flex j-end">
          <IconButton
            icon={FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            onClick={() => toggleFullScreen()}
          />
        </div>
      </div> */}
      {/* <VrHome /> */}

      {/* <ApartmentsDetails /> */}
      <Zoomable>
        <div className="zoomable-container" ref={ref}>
          <div className={`img-wrapper ${imageAnimation ? "zoom-fade-animation" : ""} ${zoomOutAnimation ? "zoom-out-fade-animation" : ""}`}>

            <img
              ref={imgRef}
              src={`${process.env.PUBLIC_URL
                // }/floor/${`${getTowerNumber(tower,floor)}`}/${getFloorType(combinedTower,floor)}.webp`}
                }/floor/${getFloorType(combinedTower, floor)}.webp`}

              alt="floor"
              onLoad={() => setLoading(false)}
            />

          </div>
          {UNITS.length > 0 && (
            <div className={`svg-wrapper ${imageAnimation ? "zoom-fade-animation" : ""} ${zoomOutAnimation ? "zoom-out-fade-animation" : ""}`}>
              <FloorSvg
                isActive={isUnitActive}
                tower={tower}
                floor={floor}
                units={UNITS}
                combinedTower={combinedTower}
                onUnitClick={handleUnitClick}
              />
            </div>
          )}
        </div>
      </Zoomable>
      <ReraNumber />
    </Style>
  );
}

// const SVG = ({ Renderer }) => Renderer;
export default Floor;

const Style = styled.main`
  height: 100vh;
  width: 100%;
  /* background-image: url(${process.env.PUBLIC_URL}/dubai_map.jpg); */
  background-position: center;

  .unit-type-filter {
    position: absolute;
    top: 0;
    left: 0rem;

    /* Mobile responsive styles */
    @media screen and (max-width: 860px) {
      left: 0.5rem;
      top: 0;
    }

    /* Medium screen responsive styles (860px - 1080px) */
    @media screen and (min-width: 861px) and (max-width: 1080px) {
      left: 1rem;
      top: 0.5rem;
    }
  }

  .floor-selector {
    position: absolute;
    left: 8rem;
    top: 8rem;
  }

  .zoomable-container {
    cursor: default;
    width: 100vw;
    height: 100vh;
    transform-origin: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 12rem;

    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }

  @keyframes zoomFadeInOut {
    0% {
      opacity: 0;
      transform: scale(1.1);
    }
    30% {
      opacity: 1;
      transform: scale(1.05);
    }
    60% {
      opacity: 1;
      transform: scale(0.98);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .img-wrapper {
    background: rgb(48, 41, 32);
    background: linear-gradient(
      68deg,
      rgba(48, 41, 32, 1) 0%,
      rgba(124, 111, 91, 1) 15%,
      rgba(138, 124, 102, 1) 25%,
      rgba(134, 121, 99, 1) 32%,
      rgba(121, 109, 90, 1) 45%,
      rgba(92, 86, 74, 1) 100%
    );
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  }

  .img-wrapper,
  .svg-wrapper {
    padding: 20px;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  }

  .img-wrapper.zoom-fade-animation,
  .svg-wrapper.zoom-fade-animation {
    animation: zoomFadeInOut 1.5s ease-in-out;
  }

  .img-wrapper.zoom-out-fade-animation,
  .svg-wrapper.zoom-out-fade-animation {
    animation: zoomOutFade 0.8s ease-in-out forwards;
  }

  @keyframes zoomOutFade {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1.2);
    }
  }

  .svg-wrapper {
    z-index: 0;
  }

  .zoom-control {
    position: absolute;
    right: 0px;
    bottom: 45%;
    z-index: 8;
    margin-top: 0px !important;
    display: flex;
    flex-direction: column;
    margin: 1rem;

    /* Mobile responsive styles */
    @media screen and (max-width: 860px) {
      margin: 0.5rem;
      bottom: 36%;
    }

    /* Medium screen responsive styles (860px - 1080px) */
    @media screen and (min-width: 861px) and (max-width: 1080px) {
      margin: 1.2rem;
      bottom: 40%;
    }
  }

  .zoom-btn {
    width: 36px;
    height: 36px;
    background: var(--button_background_zoom);
    border-radius: 8px;
    display: inline-block;
    border: none;
    box-shadow: var(--button_shadow);
    border-radius: var(--radius);
    font-size: 22px;
    display: grid;
    place-items: center;
    text-align: center;
    pointer-events: auto;
    line-height: 19px;
    cursor: pointer;
    color: #a09c9c;
    transition: var(--transition);

    :hover {
      background: var(--button_background_zoom_hover);
    }

    /* Mobile responsive styles */
    @media screen and (max-width: 860px) {
      width: 22px;
      height: 22px;
      font-size: 13px;
      border-radius: 3px;
      line-height: 10px;
    }

    /* Medium screen responsive styles (860px - 1080px) */
    @media screen and (min-width: 861px) and (max-width: 1080px) {
      width: 32px;
      height: 32px;
      font-size: 20px;
      border-radius: 7px;
      line-height: 17px;
    }
  }

  .zoom-btn-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .plus-btn {
    margin-bottom: 10px;
  }

  .left-interface {
    position: absolute;
    top: 0;
    left: 0;
    padding: 2rem;
  }

  .right-btn-group {
    margin:  0.5rem;
    z-index: 2;
    .icon-btn {
      margin: 1rem;
    }
  }

  .compass-fullscreen-wrapper {
    padding: 1rem;
    padding-right: 2rem;
  }
`;
