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
  // background: var(--panel_background);
  // position: absolute;
  padding: 0.2rem 0.5rem;
  padding-bottom: 1rem;
  // border-radius: 8px;
  // top: 6rem;
  // right: 2rem;
  // z-index: 90;
  .title {
    color: var(--color_text);
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    padding: 7px 0;
    opacity: 0.9;
  }
.body {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 equal columns */
  gap: 0.5rem; /* space between items */
  margin-top: 0.2rem;
  width: 100%; /* makes it responsive */
}
  .row {
    display: flex;
    align-items: center;
    color: var(--color_text);
     margin-right: 0.5rem;
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

  /* Tablet styles (861px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    padding: 0.15rem 0.4rem;
    padding-bottom: 0.7rem;

    .title {
      font-size: 9px;
      padding: 5px 0;
    }

    .body {
      gap: 0.35rem;
      margin-top: 0.15rem;
    }

    .row {
      margin-right: 0.35rem;
      .mark {
        width: 7px;
        height: 7px;
      }
      .text {
        margin-left: 0.35rem;
        font-size: 0.65rem;
      }
    }
  }

  /* Mobile styles (max-width: 860px) */
  @media screen and (max-width: 860px) {
    padding: 0.1rem 0.3rem;
    padding-bottom: 0.5rem;

    .title {
      font-size: 6px;
      padding: 3px 0;
    }

    .body {
      gap: 0.2rem;
      margin-top: 0.1rem;
    }

    .row {
      margin-right: 0.2rem;
      .mark {
        width: 4px;
        height: 4px;
      }
      .text {
        margin-left: 0.2rem;
        font-size: 5px;
      }
    }
  }
`;

export default UnitStatusLegend;