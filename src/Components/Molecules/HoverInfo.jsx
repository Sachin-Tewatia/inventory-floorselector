import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ArrowIcon, LocationIcon, TowerIcon } from "../../Data/icons";

const Title = ({ title }) => (
  <div className="title">
    <div className="icon">
      <TowerIcon/>
    </div>
    <div className="w-full flex" style={{justifyContent:"space-between"}}>
      <div className="text">{title}</div>
      <ArrowIcon/>
    </div>
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
      <div className="border"></div>
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
  width: 250px;
  /* background-color: var(--panel_background); */
  background-color: #ffffffb3;

  /* background-color: var(--clr-orange-light); */
  // padding: 1rem;
  // padding-right: 2rem;
  border-radius: 11px;
  /* box-shadow: 0px 0px 1px var(--clr-text); */
  color: var(--blue-theme);

  .title {
    padding-left: 0.5rem; 
    padding-bottom: 0.5rem; 
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
        stroke: var(--blue-theme);
      }
    }
    .text {
      margin: 0 0.5rem;
      color: var(--blue-theme);
    }
  }
  .border{
    border: 0.1px solid grey;
    width: 100%;
  }

  .features {
    /* temp comment remove this */
    margin-bottom: 0.4rem;
    font-size: 1rem;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    justify-content: center;
    div {
      background-color: transparent !important;
      border: 1px solid var(--clr-text) !important;
      // padding: 0.3rem;
      // padding-top: 0.5rem;
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
    width: 180px;
    border-radius: 8px;

    .title {
      padding-left: 0.4rem;
      padding-bottom: 0.3rem;
      font-size: 0.9rem;

      svg {
        width: 14px !important;
        height: 16px !important;
      }

      .text {
        margin: 0 0.3rem;
      }
    }

    .features {
      margin-bottom: 0.3rem;
      font-size: 0.8rem;

      div {
        padding-left: 0.35rem;
      }
    }

    .view-btn {
      padding: 0.15rem 1.4rem;
      font-size: 0.8rem;
      margin-top: 0.6rem;
    }
  }

  /* Tablet responsive styles (861px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    min-width: 220px;
    border-radius: 10px;

    .title {
      padding-left: 0.45rem;
      padding-bottom: 0.4rem;
      font-size: 1rem;

      svg {
        width: 18px !important;
        height: 20px !important;
      }

      .text {
        margin: 0 0.4rem;
      }
    }

    .features {
      margin-bottom: 0.35rem;
      font-size: 0.9rem;

      div {
        padding-left: 0.4rem;
      }
    }

    .view-btn {
      padding: 0.18rem 1.8rem;
      font-size: 0.9rem;
      margin-top: 0.8rem;
    }
  }
`;
