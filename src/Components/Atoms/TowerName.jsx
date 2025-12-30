import React from "react";
import styled from "styled-components";
import { COMBINED_TOWERS_LIST } from "../../Data";
import { COMBINED_TOWERS_MAP } from "../../Utility/Constants";

const Towers = ["A", "B", "C", "D", "E", "F", "G", "H"];

function TowerName({ combinedTower, rotation }) {
  const getTowerName = (combinedTower, rotation) => {
    let towerName = [];

    let towersName = COMBINED_TOWERS_MAP[combinedTower];
    let towers;
    if (combinedTower === "cluster3") {
      towers = towersName.slice().reverse();
    } else {
      towers = towersName;
    }

    if ([0, 1, 2, 3, 14, 13, 12].includes(rotation))
      return (towerName = towers.slice().reverse());

    if ([4].includes(rotation)) return (towerName[0] = [towers[0]]);
    if ([11].includes(rotation)) return (towerName[0] = [towers[1]]);
    return (towerName = towers);
  };

  return (
    <Style className="overlay-can-fade-out">
      {getTowerName(combinedTower, rotation).map((tower) => (
        <div className="tower">{tower}</div>
      ))}
    </Style>
  );
}

const Style = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 2rem;
  width: 100vw;
  height: 100vh;
  font-size: 1rem;
  pointer-events: none;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 6vw;
  .tower {
    background-color: var(--background_panel);
    color: var(--color_text);
    width: fit-content;
    padding: 0.3rem 2rem;
    border-radius: 5px;
  }
`;

export default TowerName;
