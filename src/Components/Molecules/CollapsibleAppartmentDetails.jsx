import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";

function CollapsibleAppartmentDetails({
  className,
  children,
  title,
  SecondaryBody,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const bodyRef = useRef();

  useEffect(() => {
    var body = bodyRef.current;
    if (body) {
      // Set dynamic height based on content
      body.style.height = body.scrollHeight + "px";
    }
  }, [isOpen, children]);

  // Update height when window resizes or content changes
  useEffect(() => {
    const updateHeight = () => {
      if (bodyRef.current) {
        bodyRef.current.style.height = bodyRef.current.scrollHeight + "px";
      }
    };

    window.addEventListener("resize", updateHeight);
    // Use MutationObserver to detect content changes
    const observer = new MutationObserver(updateHeight);
    if (bodyRef.current) {
      observer.observe(bodyRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener("resize", updateHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <Style className={className + " overlay-can-fade-out"}>
      <div class="panel MapFilters">
        <div class="title ">
          <h2 class="filter-title-mob" slot="title">
            {title}
          </h2>
        </div>
        <div
          class={
            isOpen
              ? "body body--margin collapsible"
              : "body body--margin hidden collapsible"
          }
          ref={bodyRef}
        >
          {children}
        </div>
      </div>

      {SecondaryBody && <SecondaryBody className={isOpen ? "" : "hidden"} />}
      <CloseBtn
        isOpen={isOpen}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      />
    </Style>
  );
}

export default CollapsibleAppartmentDetails;

const CloseBtn = ({ onClick, isOpen }) => (
  <div class="close-button" onClick={onClick}>
    <button class="hidden__button">
      <svg
        width="16"
        height="8"
        viewBox="0 0 16 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isOpen ? "" : "rotated"}
      >
        <path
          d="M15 7L8 1L0.999999 7"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </button>
  </div>
);

const Style = styled.div`
  position: absolute;
  top: 6.5rem; /* top: 7rem; // initialy 130px */
  /* left: 14rem; // initialy 2rem */
  left: 5rem;
  /* margin-top: 6rem; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  /* width: fit-content; */
  transition: all 800ms linear;
  .body {
    /* overflow: hidden; */
    transition: height 60ms linear;
  }
  .panel {
    display: flex;
    flex-direction: column;
    background: var(--panel_background);
    /* background: transparent; */
    border-radius: var(--radius);
    padding: var(--panel_paddings);
    width: 240px;
    max-width: 240px;
    min-width: 200px;
    /* max-width: var(--panel_max_width); */
    /* min-width: var(--panel_min_width); */
    transition: opacity var(--transition);
    pointer-events: all;
    z-index: 13;
    position: relative;
  }
  .panel + .close-btn {
    margin-top: 70px;
  }
  .close-button {
    margin-top: 20px;
  }
    
.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 10;
  svg {
    transform: rotate(0deg);
    &.rotated {
      transform: rotate(180deg);
    }
  }
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
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    color: var(--panel_title_color);
    /* background-color: var(--panel_background); */
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
  element.style {
    --paddings: 5px 8px;
  }
  .button.button-show_all {
    margin: 0;
  }
  .button-group {
    margin-top: 18px;
    button {
      border-radius: 0;
      margin: 1px;
    }
  }
  .button-group {
    button {
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
  .button.button-icon .icon {
    width: 18px;
    height: 20px;
  }
  .button.button-icon.landmarks.active .icon {
    :before {
      content: " ";
      position: absolute;
      margin: 2px;
      z-index: -1;
      background-color: white;
      border-radius: 50%;
      width: 15px;
      height: 15px;
    }
  }
  .button.active {
    background: var(--button_background_active);
    box-shadow: var(--button_shadow_active);
    color: var(--button_color_active);
    font-weight: 500;
  }
  /* style for each icon */
  .button.button-icon.highway.active svg {
    path {
      fill: #ffffff;
      &:nth-child(1) {
        &:nth-child(1) {
          fill: #ce457e !important;
        }
      }
    }
  }
  .button.button-icon.retail.active svg {
    path {
      fill: #4dbce0;
      &:nth-child(2) {
        fill: white !important;
      }
    }
  }
  .button.button-icon.retail.active svg circle {
    fill: #ffffff;
  }

  .button.button-icon.education.active svg circle {
    fill: #ffffff;
  }

  .button.button-icon.education.active svg {
    path {
      fill: #95c040;
      &:nth-child(2) {
        fill: white !important;
      }
    }
  }

  .button.button-icon.hotels.active svg circle {
    fill: #ffffff;
  }

  .button.button-icon.hotels.active svg {
    path {
      fill: #fcb270;
      &:nth-child(2) {
        fill: white !important;
      }
      &:nth-child(3) {
        fill: white !important;
      }
    }
  }

  .button.button-icon.cinema.active svg circle {
    fill: #916edc;
  }
  .button.button-icon.cinema.active svg path {
    fill: #fff;
  }
  .button.button-icon.metro.active svg path {
    fill: #636363;
  }
  .button.button-icon.metro.active svg circle {
    fill: #ffffff;
  }
  .button.button-icon.mosque.active svg path {
    fill: #b777a6;
  }
  .button.button-icon.mosque.active svg circle {
    fill: #ffffff;
  }
  .button.button-icon.garden.active svg circle {
    fill: #ffffff;
  }
  .button.button-icon.garden.active svg path {
    fill: rgba(81, 173, 107, 0.9528);
  }
  .button.button-icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 4px 9px 4px 9px;
  }
  .button-group {
    border-radius: 0;
    margin-bottom: 1px;
  }
  .button.button-icon.landmarks {
    z-index: 1;
  }
  .close-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 1;
    .rotated {
      transform: rotate(180deg);
    }
  }
  .hidden__button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 60px;
    padding: 8px 22px;
    margin: 0;
    border: 0;
    border-radius: var(--radius);
    background: var(--hidden_background);
    transition: var(--transition);
    pointer-events: all;
    cursor: pointer;
    overflow: hidden;
  }
  .hidden__button svg {
    width: 16px;
    height: 8px;
    transition: var(--transition);
  }
  .hidden {
    height: 0px !important;
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    left: 0.2rem !important;
    top: 4.5rem !important;

    .panel {
      padding: 0.4rem 0.5rem !important;
      border-radius: 6px;
      width: 115px !important;
      max-width: 140px !important;
      min-width: 130px !important;
    }

    .panel .title {
      font-size: 7px !important;
      padding: 3px 0 !important;
    }

    .panel .title .filter-title-mob {
      font-size: 7px !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .panel .title h2 {
      font-size: 7px !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .panel .body--margin {
      padding-top: 3px !important;
    }

    .panel .body {
      font-size: 0.7rem !important;
      /* height is dynamic, not fixed */
    }

    .button-group {
      margin-top: 10px !important;
      button {
        padding: 2px 5px !important;
        font-size: 8px !important;
        margin: 0.5px !important;
      }
    }

    .button.button-icon {
      padding: 2px 5px 2px 5px !important;
      font-size: 8px !important;
    }

    .button.button-icon .icon {
      width: 12px !important;
      height: 14px !important;
    }

    .close-button {
      margin-top: 15px !important;
    }

    .panel + .close-btn {
      margin-top: 15px !important;
    }

    .close-button .hidden__button {
      max-width: 40px !important;
      padding: 4px 14px !important;
    }

    .close-button .hidden__button svg {
      width: 10px !important;
      height: 5px !important;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    left: 0.5rem !important;
    top: 6rem !important;

    .panel {
      padding: 0.7rem 0.9rem !important;
      border-radius: 7px;
      width: 180px !important;
      max-width: 180px !important;
      min-width: 170px !important;
    }

    .panel .title {
      font-size: 9px !important;
      padding: 5px 0 !important;
    }

    .panel .title .filter-title-mob,
    .panel .title h2 {
      font-size: 10px !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .panel .body--margin {
      padding-top: 6px !important;
    }

    .panel .body {
      font-size: 0.8rem !important;
    }

    .button-group {
      margin-top: 12px !important;
      button {
        padding: 3px 7px !important;
        font-size: 9px !important;
        margin: 0.5px !important;
      }
    }

    .button.button-icon {
      padding: 3px 7px 3px 7px !important;
      font-size: 9px !important;
    }

    .button.button-icon .icon {
      width: 14px !important;
      height: 16px !important;
    }

    .close-button {
      margin-top: 18px !important;
    }

    .panel + .close-btn {
      margin-top: 18px !important;
    }

    .close-button .hidden__button {
      max-width: 45px !important;
      padding: 5px 16px !important;
    }

    .close-button .hidden__button svg {
      width: 11px !important;
      height: 6px !important;
    }
  }
`;
