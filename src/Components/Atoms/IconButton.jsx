import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import tippy from "tippy.js";
import "tippy.js/animations/shift-away.css";

function IconButton({
  icon,
  activeTooltip = "Hide",
  tooltip = "Activate",
  className = "",
  onClick,
  isFullScreen, // Add isFullScreen prop to sync with AppContext
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current._tippy) ref.current._tippy.destroy();
    tippy(ref.current, {
      content: `<div style='font-family: Roboto, sans-serif;color: var(--panel_title_color);background-color:#333; padding: 6px 10px; border-radius:4px'>${
        isFullScreen ? activeTooltip : tooltip
      }</div>`,
      animation: "shift-away",
      placement: "left",
      allowHTML: true,
      arrow: false,
    });
  }, [isFullScreen, activeTooltip, tooltip]); // Update tooltip when isFullScreen changes

  return (
    <Style
      onClick={onClick} // Simplified to call onClick directly
      className={className}
    >
      <div className={`iconbutton-button ${isFullScreen ? "active" : ""}`} ref={ref}>
        {icon}
      </div>
    </Style>
  );
}

export default IconButton;

const Style = styled.div`
  z-index: 1;
  font-family: "Roboto", sans-serif;
  transition: all linear 200ms;
  :hover {
    opacity: 0.9;
  }
  .iconbutton-button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--button_panel_width);
    height: var(--button_panel_height);
    border-radius: var(--radius);
    background: var(--button_panel_background);
    box-shadow: var(--button_panel_shadow);
    pointer-events: all;
    transition: var(--transition);
    z-index: 2;
  }

  .iconbutton-button svg {
    width: 19px;
    height: 19px;
  }

  .iconbutton-button svg path {
    transition: 0.3s;
    fill: var(--button_panel_fill);
  }

  .iconbutton-button.active {
    background: var(--button_panel_disabled_background);
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    .iconbutton-button {
      width: calc(var(--button_panel_width) * 0.7);
      height: calc(var(--button_panel_height) * 0.7);
    }

    .iconbutton-button svg {
      width: 15px;
      height: 15px;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    .iconbutton-button {
      width: calc(var(--button_panel_width) * 0.8);
      height: calc(var(--button_panel_height) * 0.8);
    }

    .iconbutton-button svg {
      width: 18px;
      height: 18px;
    }
  }

  /* TV responsive styles */
  @media screen and (min-width: 1920px) and (pointer: coarse), 
         screen and (min-width: 1920px) and (pointer: none) {
    .iconbutton-button {
      width: calc(var(--button_panel_width) * 1.2);
      height: calc(var(--button_panel_height) * 1.2);
    }

    .iconbutton-button svg {
      width: 23px;
      height: 23px;
    }
  }
`;