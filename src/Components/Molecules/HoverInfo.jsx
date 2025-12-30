import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LocationIcon } from "../../Data/icons";

const Title = ({ title }) => (
  <div className="title">
    <div className="icon">
      <LocationIcon />
    </div>
    <div className="text">{title}</div>
  </div>
);

const Features = ({ features }) => (
  <div className="features">
    {features.map((feature) => (
      <div key={feature}>{feature}</div>
    ))}
  </div>
);

function HoverInfo({
  className = "info-body",
  title = "",
  features = [],
  onViewClick,
}) {
  return (
    <HoverInfoStyle className={className}>
      <Title title={title} />
      <Features features={features} />
      {onViewClick && <ViewButton onClick={onViewClick} />}
    </HoverInfoStyle>
  );
}

export default HoverInfo;

const ViewButton = ({ onClick }) => (
  <div className="view-btn" onClick={onClick}>
    view
  </div>
);

export const HoverInfoStyle = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 250px;
  /* background-color: var(--panel_background); */
  background-color: #ffffffb3;

  /* background-color: var(--clr-orange-light); */
  padding: 1rem;
  padding-right: 2rem;
  border-radius: 8px;
  /* box-shadow: 0px 0px 1px var(--clr-text); */
  color: var(--blue-theme);

  .title {
    /* padding-left: 0.5rem; */
    font-size: 1.2rem;
    font-weight: 400;
    /* border-left: 3.5px solid var(--clr-orange-light); */
    display: flex;
    align-items: center;
    text-transform: capitalize;
    svg {
      transform: translateY(2px);
      width: 20px !important;
      height: 22px !important;
      path {
        stroke: currentColor;
      }
    }
    .text {
      margin: 0 0.5rem;
    }
  }

  .features {
    /* temp comment remove this */
    margin-top: 0.6rem;
    font-size: 1rem;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    justify-content: center;
    div {
      background-color: transparent !important;
      border: 1px solid var(--clr-text) !important;
      padding: 0.3rem;
      padding-top: 0.5rem;
      padding-left: 0.5rem;
    }
  }

  .view-btn {
    background-color: var(--clr-orange);
    color: white;
    padding: 0.2rem 2rem;
    border-radius: 3px;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    margin-top: 1rem;
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    min-width: 160px !important;
    max-width: 160px !important;
    padding: 0.3rem 0.5rem !important;
    padding-right: 0.8rem !important;
    border-radius: 5px !important;

    .title {
      font-size: 0.8rem !important;
      svg {
        width: 14px !important;
        height: 16px !important;
      }
      .text {
        margin: 0 0.3rem !important;
      }
    }

    .features {
      margin-top: 0.2rem !important;
      font-size: 0.6rem !important;
      div {
        padding: 0.1rem !important;
        padding-top: 0.2rem !important;
        padding-left: 0.2rem !important;
        font-size: 9px !important;
      }
    }

    .view-btn {
      padding: 0.15rem 1.2rem !important;
      border-radius: 3px !important;
      font-size: 0.85rem !important;
      margin-top: 0.7rem !important;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    min-width: 200px !important;
    padding: 0.5rem 0.8rem !important;
    padding-right: 1.2rem !important;
    border-radius: 7px !important;

    .title {
      font-size: 1rem !important;
      svg {
        width: 20px !important;
        height: 22px !important;
      }
      .text {
        margin: 0 0.6rem !important;
      }
    }

    .features {
      margin-top: 0.5rem !important;
      font-size: 0.85rem !important;
      div {
        padding: 0.3rem !important;
        padding-top: 0.4rem !important;
        padding-left: 0.5rem !important;
      }
    }

    .view-btn {
      padding: 0.25rem 1.5rem !important;
      border-radius: 4px !important;
      font-size: 0.95rem !important;
      margin-top: 0.9rem !important;
    }
  }
`;
