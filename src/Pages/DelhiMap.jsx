import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Compass from "../Components/Atoms/Compass";
import IconButton from "../Components/Atoms/IconButton";
import { FullScreenIcon, HideIcon, RadiusIcon } from "../Icons";
import { toggleFullScreen, toogleHideOverlays } from "../Utility/function";
import { mark_radius, smart_world_site_1 } from "../Data/Screen1PageSvg";
import SVG from "../Components/Atoms/SVG";
import { useLandmark, useMapFilter } from "../Hooks";
import LocationInfo from "../Components/Atoms/LocationInfo";
import { Link } from "react-router-dom";
import { screen1PageMapFilters } from "../Data";
import CollapsiblePanel from "../Components/Molecules/CollapsiblePanel";
import Screen1PageMapFilter from "../Components/Molecules/Screen1PageMapFilter";
import Legends from "../Components/Atoms/Legends";
import UnitTypeFilter from "../Components/Molecules/UnitTypeFilter";
import Navigator from "../Components/Molecules/Navigator";
import IndiaMapVideo from "../Components/Atoms/IndiaMapVideo";
import { screen1_landmarks_with_routes } from "../Data/landmarksRoutes";

function DelhiMap(props) {
  const { isFilterActive, activeMapFilterIds, setActiveMapFilterIds } =
    useMapFilter();
  const [showRadius, setShowRadius] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const { setSelectedLandmarkId } = useLandmark();

  useEffect(() => {
    toogleHideOverlays(showOverlays);
    setSelectedLandmarkId(false);
  }, [showOverlays]);
  // useEffect(() => {
  //   setActiveMapFilterIds(["map-filter-landmarks", "map-filter-highways"]);
  // }, []);

  return (
    <Style>
      <Navigator
        className="navigator"
        // prevPages={[{ title: "India", path: "/india" }]}
        currentPage={{ title: "Kolkata", path: "" }}
        nextPages={[
          {
            title: "Salarpuria",
            path: "",
          },
        ]}
        landmarks_with_routes={screen1_landmarks_with_routes}
      />

      {/* <MapFilters className="map-filters" /> */}
      <CollapsiblePanel
        title="Map Filters"
        SecondaryBody={null}
      // SecondaryBody={
      //   activeMapFilterIds.includes("map-filter-highways") ? Legends : null
      // }
      >
        <Screen1PageMapFilter />
      </CollapsiblePanel>
      <Legends />
      <LocationInfo
        className={"location-info"}
        landmarks_with_routes={screen1_landmarks_with_routes}
      />
      <div className="right-btn-group absolute right top">
        <IconButton
          className="icon-btn"
          icon={HideIcon}
          tooltip="Hide Overlays"
          activeTooltip="Show Overlay"
          onClick={() => setShowOverlays((old) => !old)}
        />
        {/* <IconButton
          className="icon-btn"
          icon={RadiusIcon}
          tooltip="Show Radius"
          activeTooltip="Hide Radius"
          onClick={() => setShowRadius((old) => !old)}
        /> */}
      </div>

      <div className="compass-fullscreen-wrapper absolute bottom right flex row">
        {/* <div className="col flex j-end">
          <Compass />
        </div> */}
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
        height="100%"
        viewBox="0 0 1920 1080"
        fill="none"
      // style={{ background: "red" }}
      >
        <image
          height="100%"
          style={{ objectFit: "contain", backdropFilter: "opacity(10%)" }}
          xlinkHref={`${process.env.PUBLIC_URL}/maps/screen1-map.jpg`}
        />

        {/* <foreignObject x="0" y="0" width="100%" height="100%">
          <video
            autoPlay
            loop
            muted
            // height="100%"
            style={{ objectFit: "contain" }}
            src={"https://dlf-models.s3.ap-south-1.amazonaws.com/delhi-map.mp4"}
          />
        </foreignObject> */}
        <image
          draggable="false"
          xlinkHref={`${process.env.PUBLIC_URL}/maps/map.webp`}
          alt=""
          width={"100%"}
          height={"100%"}
        // onLoad={() => setLoading(false)}
        />
        {showRadius && (
          <SVG renderer={<g className="overlay-can-hide">{mark_radius}</g>} />
        )}
        {screen1PageMapFilters.map(
          (filter) =>
            filter.landmarks &&
            isFilterActive(filter.id) && <SVG renderer={filter.landmarks} />
        )}
        <Link to={"/salarpuria"}>
          <SVG
            renderer={
              <g className="overlay-can-hide m3m-crown-site">
                {smart_world_site_1}
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
export default DelhiMap;

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
    top: unset;
    bottom: 2rem;
    /* left: unset; */
    left: 14rem;
    /* margin-right: 12rem; */
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
