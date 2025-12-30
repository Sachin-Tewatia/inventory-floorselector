import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Compass from "../Components/Atoms/Compass";
import IconButton from "../Components/Atoms/IconButton";
import { FullScreenIcon, HideIcon } from "../Icons";
import { toggleFullScreen, toogleHideOverlays } from "../Utility/function";
import SVG from "../Components/Atoms/SVG";
import { useLandmark, useMapFilter } from "../Hooks";
import LocationInfo from "../Components/Atoms/LocationInfo";
import { screen2PageMapFilters } from "../Data";
import {
  hartland_mark_location,
  hartland_site_waves,
  hartland_site_waves_grande,
  smart_world_site_2,
} from "../Data/Screen2PageSvgs";
import CollapsiblePanel from "../Components/Molecules/CollapsiblePanel";
import ApartmentsDetails from "../Components/Molecules/ApartmentsDetails";
import HartlandPageMapFilter from "../Components/Molecules/Screen2PageMapFilter";
import Screen2PageMapFilter from "../Components/Molecules/Screen2PageMapFilter";
import Amenities from "../Components/Atoms/Amenities";
import { Link, useNavigate } from "react-router-dom";
import Navigator from "../Components/Molecules/Navigator";
import TowersSvg from "../Components/Atoms/TowersSvg";
import { screen2_landmarks_with_routes } from "../Data/landmarksRoutes";
import Legends from "../Components/Atoms/Legends";

function DwarkaExpresswayMap(props) {
  const { isFilterActive, activeMapFilterIds } = useMapFilter();
  const [showOverlays, setShowOverlays] = useState(true);
  const { setSelectedLandmarkId } = useLandmark();

  useEffect(() => {
    toogleHideOverlays(showOverlays);
    setSelectedLandmarkId(false);
  }, [showOverlays]);

  return (
    <Style id="home-page">
      <Navigator
        className="navigator"
        prevPages={[
          { title: "India", path: "/india" },
          { title: "Delhi", path: "" },
        ]}
        currentPage={{
          title: "Dwarka Expressway",
          path: "",
        }}
        landmarks_with_routes={screen2_landmarks_with_routes}
      />
      <CollapsiblePanel
        title="Map Filters"
        SecondaryBody={
          activeMapFilterIds.includes("map-filter-highways") ? Legends : null
        }
      >
        <Screen2PageMapFilter />
      </CollapsiblePanel>

      <LocationInfo
        className={"location-info"}
        landmarks_with_routes={screen2_landmarks_with_routes}
      />
      <div className="right-btn-group absolute right top">
        <IconButton
          className="icon-btn"
          icon={HideIcon}
          tooltip="Hide Overlays"
          activeTooltip="Show Overlay"
          onClick={() => setShowOverlays((old) => !old)}
        />
      </div>
      <div className="compass-fullscreen-wrapper absolute bottom right flex row">
        <div className="col flex j-end">
          <Compass />
        </div>
        <div className="col w-space flex j-end">
          <IconButton
            icon={FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            onClick={() => toggleFullScreen()}
          />
        </div>
      </div>
      <svg
        preserveAspectRatio="xMidYMid slice"
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        fill="none"
      >
        <foreignObject x="0" y="0" width="100%" height="100%">
          <video
            autoPlay
            loop
            muted
            // height="100%"
            style={{ objectFit: "contain" }}
            src={"https://dlf-models.s3.ap-south-1.amazonaws.com.mp4"}
          />
        </foreignObject>
        {/* <image
          height="100%"
          style={{ objectFit: "contain", backdropFilter: "opacity(10%)" }}
          xlinkHref={`${process.env.PUBLIC_URL}/maps/screen2-map.jpg`}
        /> */}
        {/* <TowersSvg /> */}
        {/* <SVG
          renderer={
            <g className="overlay-can-hide">{hartland_mark_location}</g>
          }
        /> */}

        {screen2PageMapFilters.map(
          (filter) =>
            filter.landmarks &&
            isFilterActive(filter.id) && <SVG renderer={filter.landmarks} />
        )}

        <Link to={"/m3m-crown"}>
          <SVG
            renderer={
              <g className="overlay-can-hide m3m-crown-site">
                {smart_world_site_2}
              </g>
            }
          />
          {/* <SVG renderer={<g className="overlay-can-hide">{sobha_label}</g>} /> */}
        </Link>
      </svg>
    </Style>
  );
}

// const SVG = ({ Renderer }) => Renderer;
export default DwarkaExpresswayMap;

const Style = styled.main`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  /* background-image: url(${process.env.PUBLIC_URL}/dubai_map.jpg); */
  background-position: center;

  svg {
    height: 100%;
    width: 100%;
    /* background: red; */
  }

  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
  }

  .m3m-crown-site {
    [id="smart-world-site-area"] {
      transition: all 0.2s linear;
      fill: #c8f7c1;
      fill-opacity: 0.31;
    }
    :hover {
      [id="smart-world-site-area"] {
        fill: #87f077;
        stroke: #9fe804;
      }
    }
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
    top: unset;
    bottom: 2rem;
    left: unset;
    right: 12rem;
  }

  .left-interface {
    position: absolute;
    top: 0;
    left: 0;
    padding: 2rem;
    .map-filters {
      margin-top: 11px;
      width: fit-content;
    }
    .location-info {
      margin-top: 11px;
      margin-left: 11px;
    }
  }

  .right-btn-group {
    margin: 1rem;
    .icon-btn {
      margin: 1rem;
    }
  }

  .compass-fullscreen-wrapper {
    padding: 1rem;
    padding-right: 2rem;
  }
`;
