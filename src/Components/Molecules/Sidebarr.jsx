import React from "react";
import styled from "styled-components";
// import TooltipWrapper from "../wrappers/TooltipWrappper";
import { useLocation, useNavigate } from "react-router-dom";
import { LocationIcon } from "../../Data/icons";

const Sidebarr = ({ handleSidebarLinkClick, selectedCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <Sidebar>
      <div
        className={`link ${
          selectedCategory === "exterior" ? "selected" : "typical"
        }`}
        onClick={() => handleSidebarLinkClick("exterior")}
      >
        {/* <TooltipWrapper title="Exterior"> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="#fff"
          viewBox="0 0 19.77 19.77"
        >
          {" "}
          <g id="drone2" transform="translate(-10 -10)">
            {" "}
            <path
              id="Path_17"
              data-name="Path 17"
              d="M13.295,10a3.295,3.295,0,1,0,3.3,3.295A3.295,3.295,0,0,0,13.295,10Zm0,4.531a1.236,1.236,0,1,1,1.236-1.236A1.236,1.236,0,0,1,13.295,14.531Z"
              transform="translate(0 0)"
            ></path>{" "}
            <path
              id="Path_18"
              data-name="Path 18"
              d="M66.628,63.333a3.3,3.3,0,1,0,3.295,3.3A3.295,3.295,0,0,0,66.628,63.333Zm0,4.531a1.236,1.236,0,1,1,1.236-1.236A1.236,1.236,0,0,1,66.628,67.864Z"
              transform="translate(-40.153 -40.153)"
            ></path>{" "}
            <path
              id="Path_19"
              data-name="Path 19"
              d="M13.295,63.333a3.3,3.3,0,1,0,3.295,3.3A3.295,3.295,0,0,0,13.295,63.333Zm0,4.531a1.236,1.236,0,1,1,1.236-1.236A1.236,1.236,0,0,1,13.295,67.864Z"
              transform="translate(0 -40.153)"
            ></path>{" "}
            <path
              id="Path_20"
              data-name="Path 20"
              d="M66.628,10a3.3,3.3,0,1,0,3.295,3.3A3.295,3.295,0,0,0,66.628,10Zm0,4.531a1.236,1.236,0,1,1,1.236-1.236A1.236,1.236,0,0,1,66.628,14.531Z"
              transform="translate(-40.153 0)"
            ></path>{" "}
            <path
              id="Path_21"
              data-name="Path 21"
              d="M38.954,34.3l1.278-1.278a4.551,4.551,0,0,1-2.33-2.33l-1.278,1.278a1.653,1.653,0,0,1-2.33,0l-1.278-1.278a4.552,4.552,0,0,1-2.33,2.33L31.965,34.3a1.652,1.652,0,0,1,0,2.33L30.687,37.9a4.553,4.553,0,0,1,2.33,2.33L34.3,38.954a1.653,1.653,0,0,1,2.33,0L37.9,40.233a4.551,4.551,0,0,1,2.33-2.33l-1.278-1.278A1.653,1.653,0,0,1,38.954,34.3Zm-2.465,2.194H34.43V34.43h2.059Z"
              transform="translate(-15.575 -15.575)"
            ></path>{" "}
          </g>{" "}
        </svg>
        {/* </TooltipWrapper> */}
        <div className="linkname "> Exterior </div>
      </div>

      <div
        className={`link ${
          selectedCategory === "interior" ? "selected" : "typical"
        }`}
        // onClick={() => handleSidebarLinkClick("interior")}
        onClick={() => {
          handleSidebarLinkClick("interior");
          if (pathname === "/vr-home") {
            navigate("/salarpuria");
          } else {
            navigate(pathname);
          }
        }}
      >
        <svg
          viewBox="0 0 24 24"
          height="24"
          width="24"
          style={{ scale: 1.3 }}
          fill="#fff"
        >
          <g data-name="Layer 2">
            <g data-name="cube">
              <rect width="24" height="24" opacity="0"></rect>
              <path d="M20.66 7.26c0-.07-.1-.14-.15-.21l-.09-.1a2.5 2.5 0 0 0-.86-.68l-6.4-3a2.7 2.7 0 0 0-2.26 0l-6.4 3a2.6 2.6 0 0 0-.86.68L3.52 7a1 1 0 0 0-.15.2A2.39 2.39 0 0 0 3 8.46v7.06a2.49 2.49 0 0 0 1.46 2.26l6.4 3a2.7 2.7 0 0 0 2.27 0l6.4-3A2.49 2.49 0 0 0 21 15.54V8.46a2.39 2.39 0 0 0-.34-1.2zm-8.95-2.2a.73.73 0 0 1 .58 0l5.33 2.48L12 10.15 6.38 7.54zM5.3 16a.47.47 0 0 1-.3-.43V9.1l6 2.79v6.72zm13.39 0L13 18.61v-6.72l6-2.79v6.44a.48.48 0 0 1-.31.46z"></path>
            </g>
          </g>
        </svg>
        {/* </TooltipWrapper> */}

        <div className="linkname"> Interior </div>
      </div>
      <div
        className={`link ${
          selectedCategory === "amenities" ? "selected" : "typical"
        }`}
        onClick={() => handleSidebarLinkClick("amenities")}
      >
        {/* <TooltipWrapper title="Amenities"> */}
        <svg viewBox="0 0 24 24" height="24" width="24" fill="#fff">
          <g data-name="Layer 2">
            <g data-name="award">
              <rect width="24" height="24" opacity="0"></rect>
              <path d="M19 20.75l-2.31-9A5.94 5.94 0 0 0 18 8 6 6 0 0 0 6 8a5.94 5.94 0 0 0 1.34 3.77L5 20.75a1 1 0 0 0 1.48 1.11l5.33-3.13 5.68 3.14A.91.91 0 0 0 18 22a1 1 0 0 0 1-1.25zM12 4a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm.31 12.71a1 1 0 0 0-1 0l-3.75 2.2L9 13.21a5.94 5.94 0 0 0 5.92 0L16.45 19z"></path>
            </g>
          </g>
        </svg>
        {/* </TooltipWrapper> */}

        <div className="linkname">Amenities</div>
      </div>
      <div
        className={`link ${"typical"}`}
        onClick={() => navigate("/india/delhi")}
      >
        {/* <TooltipWrapper title="Amenities"> */}
        {/* <svg viewBox="0 0 24 24" height="24" width="24" fill="#fff">
          <g data-name="Layer 2">
            <g data-name="award">
              <rect width="24" height="24" opacity="0"></rect>
              <path d="M19 20.75l-2.31-9A5.94 5.94 0 0 0 18 8 6 6 0 0 0 6 8a5.94 5.94 0 0 0 1.34 3.77L5 20.75a1 1 0 0 0 1.48 1.11l5.33-3.13 5.68 3.14A.91.91 0 0 0 18 22a1 1 0 0 0 1-1.25zM12 4a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm.31 12.71a1 1 0 0 0-1 0l-3.75 2.2L9 13.21a5.94 5.94 0 0 0 5.92 0L16.45 19z"></path>
            </g>
          </g>
        </svg> */}
        <LocationIcon />
        {/* </TooltipWrapper> */}

        <div className="linkname">Map</div>
      </div>
    </Sidebar>
  );
};
const Sidebar = styled.div`
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  cursor: pointer;
  /* padding: 10px 5px 10px 10px; */
  text-decoration: none;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  color: #818181;
  overflow: hidden;
  position: relative;
  z-index: 10;

  .selected {
    /* background: rgba(161, 110, 68, 1); */
    border: 4px solid var(--brand-color-fadded);
  }
  .typical {
    background-color: rgba(48, 48, 48, 0.25);
    border: 4px solid #4b5563;
  }

  .location-icon-svg {
    stroke: white;
    path {
      stroke: white;
    }
  }
  .link {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-decoration: none;
    gap: 5px;
    /* box-shadow: 4px 2.72px 7.2px 0px rgba(0, 0, 0, 0.15); */
    width: 80px;
    height: 80px;
    backdrop-filter: blur(8px);
    background-color: #5554546d;
    /* margin-left: 20px; */
    /* padding: 10px 5px 10px 25px; */
    border-radius: 50%;
    text-transform: uppercase !important;
    /* border-radius: 50%; */
    cursor: pointer;
    /* :hover {
      fill: #a16e44;
    } */
    &:hover {
      border: 4px solid var(--brand-color);
    }

    svg {
      display: flex;
      align-items: center;
    }

    .linkname {
      margin-top: 1px;
      text-decoration: none;
      /* font-weight: 430; */
      justify-content: center;
      color: white;
      font-size: 13x;
      /* margin-bottom: 11px; */
    }
  }
`;
export default Sidebarr;
