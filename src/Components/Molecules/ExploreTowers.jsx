import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  COMMBINED_TOWERS_LIST,
  TOWERS_LIST,
  getTowerNumberFromName,
} from "../../Data";
import {
  COMBINED_TOWERS_MAP,
  getCombinedTowerFromTower,
} from "../../Utility/Constants";

function ExploreTowers({ currentTower }) {
  return (
    <Style className="overlay-can-fade-out">
      <div className="title">Explore Towers</div>
      <div className="towers">
        {COMMBINED_TOWERS_LIST.map((tower) =>
          COMBINED_TOWERS_MAP[tower].map((tower) => (
            <Link
              to={`/inspire/tower/${getCombinedTowerFromTower(tower)}`}
              className="no-dec towerlink"
              key={tower}
            >
              <div
                className={
                  COMBINED_TOWERS_MAP[currentTower].includes(tower)
                    ? "tower active"
                    : "tower"
                }
              >
                {/* {getTowerNumberFromName(tower)} */}
                {tower}
              </div>
            </Link>
          ))
        )}
      </div>
    </Style>
  );
}

const Style = styled.div`
  color: var(--color_text);
  background: var(--panel_background);
  position: absolute;
  right: 1rem;
  top: 35vh;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  width: fit-content;
  padding: 1rem;
  z-index: 5;
  .no-dec {
    text-decoration: none;
  }
  .title {
    color: var(--color_text);
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    padding: 10px 0;
    opacity: 0.9;
  }
  .towers {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    width: fit-content;
    margin: 0;
    margin-top: 0.7rem;
    .tower {
      background-color: var(--background_panel);
      color: var(--color_text);
      border: 1px solid #3e3e3e;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      padding: 0.3rem 0.7rem;
      font-size: 12px;
      :hover {
        background-color: var(--background_panel_hover);
      }
    }
    .tower.active {
      background-color: var(--blue-theme);
      border-color: var(--blue-theme);
    }
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    right: 0.6rem;
    top: 38vh;
    padding: 0.3rem 0.5rem;
    border-radius: 5px;

    .title {
      font-size: 7px;
      padding: 6px 0;
    }

    .towers {
      gap: 0.2rem;
      margin-top: 0.4rem;
      .tower {
        padding: 0.15rem 0.3rem;
        font-size: 6px;
        border-radius: 2px;
      }
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    right: 1rem;
    top: 39vh;
    padding: 0.7rem 0.9rem;
    border-radius: 8px;

    .title {
      font-size: 10px;
      padding: 9px 0;
    }

    .towers {
      gap: 0.5rem;
      margin-top: 0.6rem;
      .tower {
        padding: 0.35rem 0.6rem;
        font-size: 10px;
        border-radius: 3px;
      }
    }
  }
`;

export default ExploreTowers;
