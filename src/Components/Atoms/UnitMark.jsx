import React from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { useInventories } from "../../Hooks";
import { useMapFilter } from "../../Hooks";
import { unitTypeFilters } from "../../Data";
import { LocationIcon } from "../../Data/icons";
import Price from "./Price";

const Title = ({ title }) => (
  <div className="title">
    <div className="icon">
      <LocationIcon />
    </div>
    <div className="text">{title}</div>
  </div>
);

export const Explore = ({ active, onClick, unitDetails }) => {
  return (
    <ExploreStyle active={active}>
      <div className="unit__info info">
        <div className="row-line">
          <Title title={`${unitDetails.unit_number}`} />
          {/* <Title title={`${unitDetails.tower} ${unitDetails.floor} ${unitDetails.unit_number}`} /> */}
        </div>
        <div className="row-line">
          <div className="left">{unitDetails.unit_type}</div>
        </div>
        <div className="row-line">
          <div className="left">
            {Math.ceil(parseFloat(unitDetails?.bua))} {" Sq. Ft. of BUA"}
          </div>
        </div>
        {/* <div className="row-line">
          <div className="left">
            {[1, 4].includes(flatNumber) ? "Park Facing" : "Road Facing"}
          </div>
        </div> */}

        <div className="row-line capitalize">
          <div className={`left status ${unitDetails.status}`}>
            {unitDetails.status}{" "}
          </div>
        </div>
        {/* {unitDetails?.booking && (
          <div className="row-line">
            <div className="left">
              RM Name : {unitDetails?.booking?.rm_name}
            </div>
          </div>
        )} */}
        {/* <div
          className="unit__button unit__button--plan wide"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Explore Plan
        </div> */}
      </div>
    </ExploreStyle>
  );
};

const ExploreStyle = styled.div`
  /* position: absolute; */
  transition: all 0.3s ease-in-out;
  z-index: 80;
  /* top: -1.4rem; */

  .status.available {
    color: var(--clr-available);
  }
  .status.sold {
    color: var(--clr-booked);
  }
  .status.hold {
    color: var(--clr-hold);
  }

  ${({ active }) =>
    active
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
        `}

  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 220px;
  max-width: 350px;

  .unit__button.unit__button--plan {
    background-color: var(--blue-theme);
    color: #ebe6e6;
    width: 100%;
    /* margin: 8px auto; */
    margin-top: 1rem;
    margin-bottom: 4px;
    :hover {
      opacity: 0.9;
    }
  }

  .unit__button {
    background-color: #353535;
    padding: 7px 10px;
    border-radius: 6px;
    box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    text-align: center;
    color: #fff;
    pointer-events: all;
    transition: background 0.3s, color 0.3s;
  }

  .unit__info {
    width: 100%;
    /* overflow: hidden; */
    transition: all 0.3s ease-in-out;
    z-index: 100;
    margin-top: 9px;
    display: flex;
    flex-direction: column;
    background-color: rgba(35, 35, 35, 0.849);
    /* background-color: #0f18617b; */
    backdrop-filter: blur(3px);
    border-radius: 6px;
    padding: 15px 18px;
    box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
  }
  .title {
    /* padding-left: 0.5rem; */
    height: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
    /* border-left: 3.5px solid var(--clr-orange-light); */
    display: flex;
    align-items: center;
    color: white;

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

  .capitalize {
    text-transform: capitalize;
  }

  .row-line {
    display: grid;
    grid-template-columns: 1fr;
    color: #c7c1c1;
    width: 100%;
    padding: 4px 0px;
    font-size: 0.9rem;
    .unit-status {
      opacity: 0.9;
    }
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    min-width: 120px !important;
    max-width: 150px !important;

    .unit__info {
      margin-top: 4px;
      padding: 7px 8px !important;
      border-radius: 3px;
    }

    .title {
      height: 0.5rem;
      margin-bottom: 0.4rem;
      font-size: 0.65rem !important;
      svg {
        width: 10px !important;
        height: 12px !important;
      }
      .text {
        margin: 0 0.4rem !important;
      }
    }

    .row-line {
      padding: 1px 0px;
      font-size: 0.55rem !important;
    }

    .unit__button {
      padding: 4px 6px !important;
      border-radius: 5px;
      font-size: 9px !important;
    }

    .unit__button.unit__button--plan {
      margin-top: 0.6rem;
      margin-bottom: 3px;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    min-width: 200px !important;
    max-width: 260px !important;

    .unit__info {
      margin-top: 8px;
      padding: 14px 16px !important;
      border-radius: 6px;
    }

    .title {
      height: 1rem;
      margin-bottom: 0.5rem;
      font-size: 0.95rem !important;
      svg {
        width: 20px !important;
        height: 22px !important;
      }
      .text {
        margin: 0 0.6rem !important;
      }
    }

    .row-line {
      padding: 4px 0px;
      font-size: 0.85rem !important;
    }

    .unit__button {
      padding: 7px 12px !important;
      border-radius: 6px;
      font-size: 11px !important;
    }

    .unit__button.unit__button--plan {
      margin-top: 0.9rem;
      margin-bottom: 4px;
    }
  }
`;

function UnitMark({
  left = "0",
  top,
  isSelected,
  unit,
  onExploreClick,
  selectedUnit,
  isActive,
}) {
  return isActive ? (
    <Style
      style={{
        inset: `${top} auto auto ${left}`,
      }}
      className="unit-explore-panel"
    /* onMouseEnter={(e) => alert("mouse entered")} */
    >
      {/* <div className={`unit__number ${isSelected ? "active" : ""} `}>{unit.unit_number}</div> */}
      {isSelected && (
        <Explore
          active={isSelected}
          onClick={onExploreClick}
          unitDetails={selectedUnit}
        />
      )}
    </Style>
  ) : (
    <></>
  );
}

export default UnitMark;

const Style = styled.div`
  z-index: 90;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* pointer-events: none; */
  transition: all 0.1s ease-in-out;
  width: fit-content;

  .unit__number {
    /* display: flex; */
    z-index: 100;
    align-items: center;
    justify-content: center;
    color: rgb(255, 255, 255);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
    padding: 5px 10px;
    border-radius: 8px;
    background-color: rgba(35, 35, 35, 0.6);
    /* background-color: #0f18617b; */
    pointer-events: none;
    transition: all 0.3s ease 0s;
    position: relative;
    box-shadow: 1px -1px 1px #585757df;
  }

  .unit__number.active {
    background-color: #dadada;
    color: #000;
    box-shadow: 1px -2px 2px #353434e1;
    transform: scale(1.1);
    border-radius: 5px;
  }
  .hidden {
    display: none;
  }
  .visible {
    display: block;
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    .unit__number {
      font-size: 9px !important;
      padding: 3px 6px !important;
      border-radius: 5px;
    }

    .unit__number.active {
      transform: scale(1.05);
      border-radius: 4px;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    .unit__number {
      font-size: 12px !important;
      padding: 5px 10px !important;
      border-radius: 7px;
    }

    .unit__number.active {
      transform: scale(1.08);
      border-radius: 5px;
    }
  }
  /* .unit__bedroom {
    position: absolute;
    top: 100%;
    margin-top: 4px;
    color: rgb(255, 255, 255);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.2;
    text-shadow: rgb(0 0 0 / 25%) 0px 2px 4px;
    white-space: nowrap;
    text-transform: capitalize;
  } */
`;
