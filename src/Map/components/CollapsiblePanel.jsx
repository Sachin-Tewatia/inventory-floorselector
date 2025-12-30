

import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { ChevronDown } from "lucide-react";

function CollapsiblePanel({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [panelHeight, setPanelHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const initialPanelHeight = useRef(60);
  const panelRef = useRef(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  
  // Function to determine if the device is in landscape mode
  const isLandscape = () => window.matchMedia("(orientation: landscape)").matches;

  // Function to calculate isMobile synchronously
  const calculateIsMobile = () => {
    const inLandscape = isLandscape();
    const mobileByWidth = window.innerWidth <= 768;
    // alert(`isLandscape: ${inLandscape}, mobileByWidth: ${mobileByWidth}`);
    return inLandscape ? false : mobileByWidth;
  };

  const getDesktopHeight = () => {
    switch (location.pathname) {
      case '/':
        return '230px';
      case '/tenkm':
        return '330px';
      case '/fivekm':
        return '330px';
      default:
        return '300px';
    }
  };


  return (
    <>
      {/* {!isMobile && ( */}
        <div className="md:top-[70%] top-[70%] absolute lg:top-1/2 -translate-y-1/2 left-2 mt-[-1rem]" style={{ height: getDesktopHeight() }}>
          <DesktopPanelStyle
            className={"overlay-can-hide"}
            style={{
              left: isOpen ? "0" : "-200px",
            }}
          >
            <div className="panel MapFilters">
              <div className={"body body--margin"} style={{ marginRight: "0.5rem" }}>
                {children}
              </div>
            </div>
          </DesktopPanelStyle>

          <div className="relative mt-[10.4rem] ml-9 lg:mt-[14rem] md:mt-[10.5rem]">
            <CloseBtn
              isOpen={isOpen}
              onClick={() => setIsOpen((isOpen) => !isOpen)}
            />
          </div>
        </div>
    </>
  );
}

export default CollapsiblePanel;

const CloseBtn = ({ onClick, isOpen }) => (
  <button
    className={isOpen ? "close-btn overlay-can-hide" : "close-btn collapsed overlay-can-hide"}
    onClick={onClick}
    style={{
      background: "rgba(255, 255, 255, 0.3)",
      border: "1.1px solid black",
    }}
  >
    <svg
      width="auto"
      height="auto"
      viewBox="0 0 16 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isOpen ? "rotated" : ""}
      style={{
        transform: isOpen ? "rotate(270deg)" : "rotate(90deg)"
      }}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M15 7L8 1L0.999999 7"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  </button>
);

const DesktopPanelStyle = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  transition: all 300ms linear;
  z-index: 100;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  padding: 0.4rem;
  padding-left: 0.8rem;
  padding-right: 0rem;
  border: 1px solid grey;
  border-radius: var(--radius);

  left: 5px;

  &.collapsed {
    left: -200px;
  }

  .body {
    overflow: hidden;
    transition: height 200ms linear;
  }
  .panel {
    display: flex;
    flex-direction: column;
    border-radius: var(--radius);
    width: 100%;
    max-width: var(--panel_max_width);
    transition: opacity var(--transition);
    pointer-events: all;
    z-index: 13;
    position: relative;
  }

  .hidden-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 1;
  }
  .panel .title {
    font-size: 9px;
    text-transform: uppercase;
    text-align: center;
    color: var(--panel_title_color);
  }
  .panel .title .filter-title-mob {
    color: var(--panel_title_color);
  }
  .panel .body--margin {
    padding-top: 10px;
  }
  .panel .body {
    flex-shrink: 0;
  }
  .button.button-show_all {
    margin: 0;
  }
  .button-group {
    margin-top: 5px;
    button {
      border-radius: 0;
      margin: 1px;
    }
  }
  .button-group {
    button {
      display: flex;
      flex-direction: column;
      gap: 2px;
      :first-child {
        border-top-left-radius: var(--radius) !important;
        border-top-right-radius: var(--radius) !important;
      }
      :last-child {
        border-bottom-left-radius: var(--radius) !important;
        border-bottom-right-radius: var(--radius) !important;
      }
    }
  }

  .button.button-icon .icon svg {
    width: 1.5rem;
    height: auto;
  }
  .button.button-icon.landmarks {
    z-index: 1;
  }

  .hidden {
    height: 0px !important;
  }

  .button.button-icon.highway.active svg { path { fill: #ffffff; &:nth-child(1) { fill: #ce457e !important; } } }
  .button.button-icon.midcarea.active svg { path { fill: #5BB8B8; &:nth-child(2) { fill: white; } } }
  .button.button-icon.retail.active svg { path { fill: #4dbce0; &:nth-child(2) { fill: white !important; } } }
  .button.button-icon.temple.active svg { path { fill: white; fill: white; &:nth-child(1) { fill: #5bb8b8; } } }
  .button.button-icon.hospital.active svg { path { fill: white; &:nth-child(2) { fill: #ec1c24; } } }
  .button.button-icon.busstand.active svg { path { fill: #ec1e24; &:nth-child(2) { fill: #fefefe; } } }
  .button.button-icon.residentail.active svg { path { fill: #c226a9; &:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5), &:nth-child(6), &:nth-child(7), &:nth-child(8), &:nth-child(9) { fill: #f4f4f4; } } }
  .button.button-icon.railwaystation.active svg { path { fill: #de8d43; &:nth-child(2) { fill: #f9f7f7; } } }
  .button.button-icon.active svg { path { fill: red; stroke: white; stroke-width: 0.1; } }
  .button.button-icon.retail.active svg circle { fill: #ffffff; }
  .button.button-icon.education.active svg circle { fill: #ffffff; }
  .button.button-icon.education.active svg { path { fill: #417fc1; &:nth-child(2) { fill: white !important; } } }
  .button.button-icon.hotels.active svg circle { fill: #ffffff; }
  .button.button-icon.hotel.active svg { path { fill: #6667af; &:nth-child(2), &:nth-child(3) { fill: white !important; } } }
  .button.button-icon.cinema.active svg circle { fill: #916edc; }
  .button.button-icon.cinema.active svg path { fill: #fff; }
  .button.button-icon.metro.active svg path { fill: #f74e1b; }
  .button.button-icon.metro.active svg circle { fill: #ffffff; }
  .button.button-icon.mosque.active svg path { fill: #b777a6; }
  .button.button-icon.mosque.active svg circle { fill: #ffffff; }
  .button.button-icon.garden.active svg circle { fill: #ffffff; }
  .button.button-icon.garden.active svg path { fill: rgba(81, 173, 107, 0.9528); }
  .button.button-icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 4px 9px 4px 9px;
  }
  .button-group { border-radius: 0; margin-bottom: 1px; }
  .button.button-icon.landmarks { z-index: 1; }
  .hidden { height: 0px !important; }
`;