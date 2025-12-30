import React from "react";
import styled from "styled-components";

function UnitStatusLegend(props) {
  const legends = [
    {
      color: "var(--clr-available)",
      text: "Available",
    },
    // {
    //   color: "var(--clr-mixed-faded)",
    //   text: "Partial Available",
    // },
    {
      color: "var(--clr-booked)",
      text: "Sold",
    },
    {
      color: "var(--clr-hold)",
      text: "Hold",
    },
  ];

  return (
    <Style className="overlay-can-fade-out">
      <div className="title">Unit Status Legend</div>
      <div className="body">
        {legends.map((legend) => (
          <div className="row">
            <div
              className="mark"
              style={{ backgroundColor: legend.color }}
            ></div>
            <div className="text">{legend.text}</div>
          </div>
        ))}
      </div>
    </Style>
  );
}

const Style = styled.div`
  color: var(--color_text);
  background: var(--panel_background);
  position: absolute;
  padding: 0.5rem 0.8rem;
  padding-bottom: 1rem;
  border-radius: 8px;
  top: 6rem;
  right: 1rem;
  z-index: 90;
  .title {
    color: var(--color_text);
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    padding: 10px 0;
    opacity: 0.9;
  }
  .body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 0.5rem;
    gap: 0.3rem;
    width: fit-container;
  }
  .row {
    display: flex;
    align-items: center;
    color: var(--color_text);
    .mark {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      opacity: 0.8;
    }
    .text {
      margin-left: 0.5rem;
      font-size: 0.8rem;
      font-weight: 400;
    }
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    padding: 0.2rem 0.4rem;
    padding-bottom: 0.5rem;
    border-radius: 3px;
    top: 3.2rem;
    right: 0.5rem;

    .title {
      font-size: 6px;
      padding: 4px 0;
    }

    .body {
      margin-top: 0.2rem;
      gap: 0.2rem;
    }

    .row {
      .mark {
        width: 5px;
        height: 5px;
      }
      .text {
        margin-left: 0.2rem;
        font-size: 0.4rem;
      }
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    padding: 0.5rem 0.7rem;
    padding-bottom: 0.8rem;
    border-radius: 6px;
    top: 3.5rem;
    right: 1rem;

    .title {
      font-size: 9px;
      padding: 7px 0;
    }

    .body {
      margin-top: 0.4rem;
      gap: 0.3rem;
    }

    .row {
      .mark {
        width: 8px;
        height: 8px;
      }
      .text {
        margin-left: 0.5rem;
        font-size: 0.7rem;
      }
    }
  }
`;

export default UnitStatusLegend;
