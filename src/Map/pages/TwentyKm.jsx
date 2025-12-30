
import "../../../src/App.css";
import "../../../src/Attributes.css";
import "animate.css";
import ActionBtns from "../components/ActionBtns";
import CollapsiblePanel from "../components/CollapsiblePanel";
import Compass from "../components/Compass";
import MapFilters from "../components/MapFilter";
import { getMapFilterIds } from "../data/filters";
import ActiveMarksOnMap from "../components/ActiveMarksOnMap";
import LocationInfo from "../components/LocationInfo";
import Zoomable from "../components/Zoomable";
import styled from "styled-components";
import Blackout from "../components/Blackout";
import Radius from "../components/Radius";
import { homepage_highway, logoOnTwentyKm, logoOnTwentySatelliteKm } from "../components/Icons";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapToggleSatelite from "../components/MapToggleSatelite";
import CarArrow from "../components/CarArrow";
import LabelSvg from "../components/LabelSvg";
import LegendFilter from "../components/LegendFilter";
import Highway from "../components/Highway";
import Inventorybtns from "../components/Inventorybtns";
import { AppContext } from "../../Contexts/AppContext";

function TwentyKm() {
  const { label, setLabel, satelliteView, setSatelliteView } = useContext(AppContext);
  const mapFilterIds = getMapFilterIds("/");
  const [showButton, setShowButton] = useState(false);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [supportsForeignObject, setSupportsForeignObject] = useState(true);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      // console.log("Device info:", {
      //   isMobile: mobile,
      //   width: window.innerWidth,
      //   height: window.innerHeight,
      //   userAgent: navigator.userAgent,
      // });
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const preventZoom = (e) => {
      if (!isMobile && e.ctrlKey) {
        e.preventDefault();
      }
    };
    const preventGesture = (e) => {
      if (!isMobile) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", preventZoom, { passive: false });
    window.addEventListener("gesturestart", preventGesture);
    window.addEventListener("gesturechange", preventGesture);
    window.addEventListener("gestureend", preventGesture);
    return () => {
      window.removeEventListener("wheel", preventZoom);
      window.removeEventListener("gesturestart", preventGesture);
      window.removeEventListener("gesturechange", preventGesture);
      window.removeEventListener("gestureend", preventGesture);
    };
  }, [isMobile]);

  useEffect(() => {
    const calculateCenter = () => {
      const x = 923.5 * (window.innerWidth / 1920);
      const y = 408.5 * (window.innerHeight / 1080);
      setCenterX(x);
      setCenterY(y);
    };
    calculateCenter();
    window.addEventListener("resize", calculateCenter);
    return () => window.removeEventListener("resize", calculateCenter);
  }, []);

   useEffect(() => {
    // Check if foreignObject is supported
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    svg.appendChild(foreignObject);
    setSupportsForeignObject(foreignObject instanceof SVGForeignObjectElement);
  }, []);

  useEffect(() => {
    const hasButtonBeenShown = localStorage.getItem("buttonShown");
    if (!hasButtonBeenShown) {
      setShowButton(true);
      const timer = setTimeout(() => {
        setShowButton(false);
        localStorage.setItem("buttonShown", "true");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    setShowButton(false);
  };

  const handleToggleView = () => {
    setSatelliteView(!satelliteView);
  };

  return (
    <Style
      className="h-screen w-screen overflow-hidden no-scrollbar selection:bg-none"
      id="app"
    >
      <div className="backdrop-blur-[2px] absolute left-2 top-2 z-10 w-fit h-fit rounded-md bg-white/50">
        <img
          src={`${process.env.PUBLIC_URL}/inspire.png`}
          className="w-[100px] h-[50px] lg:w-[150px] lg:h-[70px] md:w-[100px] md:h-[49px] rounded-md"
          alt="Salarpuria"
        />
      </div>
      {showButton && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(201, 216, 213, 0.3)",
            color: "#000000",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(0, 0, 0, 1)",
          }}
          onClick={requestFullScreen}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(201, 216, 213, 1)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(201, 216, 213, 0.3)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          For Better Experience: Make it Fullscreen
        </div>
      )}

      {isMobile ? (
        <Zoomable>
          <svg
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1920 1080"
            fill="none"
            style={{ width: "100vw", height: "100vh" }}
          >
            <image
              id="image0_1_2"
              height="100%"
              style={{ objectFit: "contain" }}
              xlinkHref={`/images/${!satelliteView ? "twentykm.png" : "twentykmSatellite.webp"}`}
            />
            <Radius />
            <Highway />
            <Blackout />
            {!supportsForeignObject ? (
          // Render foreignObject if supported
          <foreignObject x="789.5" y="356.5" width="50" height="50">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%" }}>
              <style>
                  {`
                    @keyframes animate {
                      0% {
                        width: 10px;
                        height: 10px;
                        opacity: 1;
                      }
                      50% {
                        width: 25px;
                        height: 25px;
                        opacity: 1;
                      }
                      80% {
                        width: 50px;
                        height: 50px;
                        opacity: 0.5;
                      }
                      100% {
                        width: 50px;
                        height: 50px;
                        opacity: 0;
                      }
                    }

                    .pulse {
                      position: absolute;
                      width: 50px;
                      height: 50px;
                      border-radius: 50%;
                      top: 0;
                      left: 0;
                    }

                    .pulse span {
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      background: transparent;
                      border: 2px solid ${satelliteView ? "#ffffff" : "#000000"};
                      animation: animate 7s linear infinite;
                      border-radius: 50%;
                    }

                    .pulse span:nth-child(1) {
                      animation-delay: 0s;
                    }

                    .pulse span:nth-child(2) {
                      animation-delay: 2s;
                    }

                    .pulse span:nth-child(3) {
                      animation-delay: 4s;
                    }
                  `}
                </style>
              <div className="pulse">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </foreignObject>
        ) : (
          // Fallback: Simple SVG circle with pulse effect
          <g>
            <circle cx="814" cy="381" r="10" fill="none" stroke={satelliteView ? "#ffffff" : "#000000"} strokeWidth="2">
              <animate
                attributeName="r"
                values="10;25;50"
                dur="7s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;1;0.5;0"
                dur="7s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Additional circles for layered effect */}
            <circle cx="814" cy="381" r="10" fill="none" stroke={satelliteView ? "#ffffff" : "#000000"} strokeWidth="2">
              <animate
                attributeName="r"
                values="10;25;50"
                dur="7s"
                repeatCount="indefinite"
                begin="2s"
              />
              <animate
                attributeName="opacity"
                values="1;1;0.5;0"
                dur="7s"
                repeatCount="indefinite"
                begin="2s"
              />
            </circle>
            <circle cx="814" cy="381" r="10" fill="none" stroke={satelliteView ? "#ffffff" : "#000000"} strokeWidth="2">
              <animate
                attributeName="r"
                values="10;25;50"
                dur="7s"
                repeatCount="indefinite"
                begin="4s"
              />
              <animate
                attributeName="opacity"
                values="1;1;0.5;0"
                dur="7s"
                repeatCount="indefinite"
                begin="4s"
              />
            </circle>
          </g>
        )}


            <ActiveMarksOnMap
              filterIdsToShow={mapFilterIds.filter((filter) => filter === "map-filter-landmarks")}
            />
            <ActiveMarksOnMap
              filterIdsToShow={mapFilterIds.filter((filter) => filter !== "map-filter-landmarks")}
            />
            {label && <LabelSvg label={label} />}
            {!satelliteView ? logoOnTwentyKm : logoOnTwentySatelliteKm}
          </svg>
        </Zoomable>
      ) : (
        <svg
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1920 1080"
          fill="none"
          style={{ width: "100vw", height: "100vh" }}
        >
          <image
            id="image0_1_2"
            height="100%"
            style={{ objectFit: "contain" }}
            xlinkHref={`/images/${!satelliteView ? "twentykm.png" : "twentykmSatellite.webp"}`}
          />
          <Radius />
          <Highway />
          <Blackout />
          {!supportsForeignObject ? (
          // Render foreignObject if supported
          <foreignObject x="789.5" y="356.5" width="50" height="50">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: "100%", height: "100%" }}>
              <style>
                  {`
                    @keyframes animate {
                      0% {
                        width: 10px;
                        height: 10px;
                        opacity: 1;
                      }
                      50% {
                        width: 25px;
                        height: 25px;
                        opacity: 1;
                      }
                      80% {
                        width: 50px;
                        height: 50px;
                        opacity: 0.5;
                      }
                      100% {
                        width: 50px;
                        height: 50px;
                        opacity: 0;
                      }
                    }

                    .pulse {
                      position: absolute;
                      width: 50px;
                      height: 50px;
                      border-radius: 50%;
                      top: 0;
                      left: 0;
                    }

                    .pulse span {
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      background: transparent;
                      border: 2px solid ${satelliteView ? "#ffffff" : "#000000"};
                      animation: animate 7s linear infinite;
                      border-radius: 50%;
                    }

                    .pulse span:nth-child(1) {
                      animation-delay: 0s;
                    }

                    .pulse span:nth-child(2) {
                      animation-delay: 2s;
                    }

                    .pulse span:nth-child(3) {
                      animation-delay: 4s;
                    }
                  `}
                </style>
              <div className="pulse">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </foreignObject>
        ) : (
          // Fallback: Simple SVG circle with pulse effect
          <g>
            <circle cx="814" cy="380" r="6" fill="none" stroke={satelliteView ? "#ffffff" : "#000000"} strokeWidth="2">
              <animate
                attributeName="r"
                values="10;25;50"
                dur="7s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;1;0.5;0"
                dur="7s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Additional circles for layered effect */}
            <circle cx="814" cy="380" r="6" fill="none" stroke={satelliteView ? "#ffffff" : "#000000"} strokeWidth="2">
              <animate
                attributeName="r"
                values="10;25;50"
                dur="7s"
                repeatCount="indefinite"
                begin="2s"
              />
              <animate
                attributeName="opacity"
                values="1;1;0.5;0"
                dur="7s"
                repeatCount="indefinite"
                begin="2s"
              />
            </circle>
            <circle cx="814" cy="380" r="6" fill="none" stroke={satelliteView ? "#ffffff" : "#000000"} strokeWidth="2">
              <animate
                attributeName="r"
                values="10;25;50"
                dur="7s"
                repeatCount="indefinite"
                begin="4s"
              />
              <animate
                attributeName="opacity"
                values="1;1;0.5;0"
                dur="7s"
                repeatCount="indefinite"
                begin="4s"
              />
            </circle>
          </g>
        )}
          <ActiveMarksOnMap
            filterIdsToShow={mapFilterIds.filter((filter) => filter === "map-filter-landmarks")}
          />
          <ActiveMarksOnMap
            filterIdsToShow={mapFilterIds.filter((filter) => filter !== "map-filter-landmarks")}
          />
          {label && <LabelSvg label={label} />}
          {!satelliteView ? logoOnTwentyKm : logoOnTwentySatelliteKm}
        </svg>
      )}

      <LocationInfo />
      {label && <LegendFilter label={label} />}
      <ActionBtns />
      <MapToggleSatelite onClick={handleToggleView} />
      <div className={`absolute bottom-2 right-52 text-slate-${!satelliteView ? 600 : 200} underline underline-offset-2`}>
        *Map not to scale
      </div>
      <Compass angle={0} />
      {/* <Inventorybtns satelliteView={satelliteView} /> */}

      <CollapsiblePanel title="Map Filters">
        <MapFilters label={label} setLabel={setLabel} />
      </CollapsiblePanel>
    </Style>
  );
}

const Style = styled.div`
  touch-action: manipulation;
  .zoom-control {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 1rem;
    z-index: 8;
    display: flex;
    gap: 1rem;
  }
  .zoom-btn {
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
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
    cursor: pointer;
    color: #ffffff;
    transition: ease-in-out 100ms;
    line-height: 2rem;
    padding-bottom: 0.2rem;
    :hover {
      border: 2px solid white;
    }
    :active {
      background: #836262;
    }
  }
  .zoom-btn-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  .svg-wrapper {
    height: 100vh;
    width: 100vw;
    cursor: default;
  }
  #home-page {
    #location-icon {
      fill: #d6b454;
    }
  }
  #road-line {
    animation: moveRoad 1s linear infinite;
  }
  @keyframes moveRoad {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: 20;
    }
  }
  #Logo {
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      transform: scale(1) translateX(0) translateY(0);
    }
    50% {
      transform: scale(1.05) translateX(-3rem) translateY(-1.5rem);
    }
  }
`;

export default TwentyKm;