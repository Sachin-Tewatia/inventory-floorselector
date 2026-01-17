import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TOWERS, TOWERS_LIST, getTowerNumberFromName, COMMBINED_TOWERS_LIST } from "../../Data";
import { getFormalNameFromNumber } from "../../Utility/function";
import { COMBINED_TOWERS_MAP, getCombinedTowerFromTower } from "../../Utility/Constants";
import { useEffect } from "react";
import { useInventories } from "../../Hooks";

function FloorSelector({ currentTower, currentFloor,towerName }) {
  const [selectedFloor, setSelectedFloor] = useState(currentFloor);
  const [selectedTower, setSelectedTower] = useState(currentTower);
  const [isOpen, setIsOpen] = useState(true);
  const [availableFloorsToggle, setAvailableFloorsToggle] = useState(false);

  const { getAllFloorsInTower } = useInventories();
  const navigate = useNavigate();

  const [floorGroups, setFloorGroups] = useState([]);

  useEffect(() => {
    // Fetch all floors for the given tower dynamically
    const towerKey = COMBINED_TOWERS_MAP[currentTower]?.[0] || currentTower;
    const allFloors = getAllFloorsInTower(towerKey.toUpperCase()) || [];

    // Sort numerically if needed
    const sortedFloors = [...allFloors].sort((a, b) => Number(a) - Number(b));

    // Group floors in batches of 10 (2–10, 11–20, 21–30, etc.)
    const groups = [];
    for (let i = 0; i < sortedFloors.length; i += 10) {
      const slice = sortedFloors.slice(i, i + 10);
      const first = slice[0];
      const last = slice[slice.length - 1];
      groups.push({
        label: `${first} - ${last}`,
        floors: slice,
      });
    }

    setFloorGroups(groups);
    setSelectedFloor(currentFloor);
    setSelectedTower(COMBINED_TOWERS_MAP[currentTower][0]);
  }, [currentTower, currentFloor]);

  const handleSelectedFloor = (e, floor) => {
    e.stopPropagation();
    setSelectedFloor(floor);
  };

  const handleSelectedTower = (e, tower) => {
    e.stopPropagation();
    setSelectedTower(tower);
  };

  // Get all available towers
  const availableTowers = COMMBINED_TOWERS_LIST.flatMap((towerGroup) => 
    COMBINED_TOWERS_MAP[towerGroup] || []
  );

  return (
    <Style>
      <div className="body info svelte-9mhvmf">
        <div className="floor-switcher-wrapper">
          <div className="panel floor-switcher svelte-1shyvx4">
            <div className="title svelte-1shyvx4">
              <h2 className="titleFloor" slot="title">
                {getFormalNameFromNumber(currentFloor)}
                <span>{` floor`}</span>
              </h2>
            </div>

            <div
              className={
                isOpen
                  ? "body active svelte-1shyvx4 body--margin"
                  : "body svelte-1shyvx4 body--margin"
              }
            >
              <div slot="body" className="floor__wrap svelte-6keq0u">
                <div className="inputs-container">
                  <div className="notBack">
                    <div className="input-group">
                      <label className="input-group-label">
                        <input
                          type="text"
                          name="floor_number"
                          placeholder={
                            selectedFloor !== currentFloor ||
                            selectedTower !== currentTower
                              ? `${selectedTower.toUpperCase()} Tower ${getFormalNameFromNumber(
                                  selectedFloor
                                )} Floor`
                              : "Enter or select a floor"
                          }
                          className={`${
                            selectedFloor !== currentFloor ||
                            selectedTower !== currentTower
                              ? "input-floor floor-selected"
                              : "input-floor"
                            }`}
                          onChange={(e) => {
                            if (e.key !== "Enter")
                              setSelectedFloor(e.target.value);
                          }}
                          autoComplete="off"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setSelectedFloor(e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="section-title">Towers</div>
                <div className="floor__buttons svelte-6keq0u">
                  <div className="floors__group svelte-6keq0u">
                    {availableTowers.map((tower) => {
                      const isInCurrentTowerGroup = COMBINED_TOWERS_MAP[currentTower]?.includes(tower);
                      const isCurrentTower = currentTower === tower;
                      const isSelected = selectedTower === tower || (selectedTower === currentTower && (isInCurrentTowerGroup || isCurrentTower));
                      return (
                        <div
                          key={tower}
                          onClick={(e) => handleSelectedTower(e, tower)}
                          className={`floors__group--item notBack svelte-6keq0u available ${
                            isSelected ? "selected" : ""
                          }`}
                        >
                          <button
                            value={tower}
                            className={`floors__group--button notBack svelte-6keq0u ${
                              isSelected ? "selected" : ""
                            }`}
                          >
                            {tower.toUpperCase()}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="section-title">Floors</div>
                <div className="floor__buttons svelte-6keq0u">
                  {floorGroups.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="floors__group svelte-6keq0u"
                    >
                      <div className="floors__group--numbers svelte-6keq0u">
                        {group.label}
                      </div>
                      {group.floors.map((floor) => (
                        <div
                          key={floor}
                          onClick={(e) => handleSelectedFloor(e, floor)}
                          className={`floors__group--item notBack svelte-6keq0u available ${
                            selectedFloor == floor ? "selected" : ""
                          }`}
                        >
                          <button
                            value={floor}
                            className={`floors__group--button notBack svelte-6keq0u ${
                              selectedFloor == floor ? "selected" : ""
                            }`}
                          >
                            {floor.toUpperCase()}
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="alwaysVisible">
              <div slot="alwaysVisible">
                <div>
                  <button
                    className={`button active toggleButton svelte-ynf51n ${
                      selectedFloor !== currentFloor ||
                      selectedTower !== currentTower
                        ? "explore"
                        : "select-floor"
                    } `}
                    value=""
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        selectedFloor !== currentFloor ||
                        selectedTower !== currentTower
                      )
                        navigate(
                          `/inspire/tower/${getCombinedTowerFromTower(selectedTower)}/floor/${selectedFloor}`
                        );
                    }}
                  >
                    {selectedFloor !== currentFloor ||
                      selectedTower !== currentTower
                      ? "Explore"
                      : "Select Floor"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Style>
  );
}
export default FloorSelector;

const Style = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  transition: all 800ms linear;
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  /* .body {
    z-index: 100;
  } */
  .interface.svelte-9mhvmf .info.svelte-9mhvmf {
    z-index: 100;
  }
  @media (max-width: 767px) {
    .body.info.svelte-9mhvmf.svelte-9mhvmf {
      margin-left: 0;
    }
  }

  .section-title {
    color: #6b6a6a;
    font-size: 10px;
    font-weight: 500;
    text-align: center;
    padding: 6px 0;
  }
  .towers-container {
    border-bottom: solid 1px #3e3e3e;
    margin-bottom: 10px;
    .towers {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      width: fit-content;
      margin: auto;
      flex-wrap: wrap;
      .tower {
        background-color: var(--background_panel);
        color: var(--color_text);
        border: 1px solid #3e3e3e;
        width: 30px;
        border-radius: 4px;
        text-align: center;
        margin: 0 2px;
        margin-bottom: 10px;
        cursor: pointer;
        padding: 0.2rem;
        font-size: 12px;
      }
      .tower.active {
        background-color: var(--blue-theme);
        border-color: var(--blue-theme);
      }
    }
  }

  // overlay of body
  .body.info.svelte-9mhvmf.svelte-9mhvmf {
    /* margin-left: 10px; */
    display: flex;
    position: absolute;
    /* top: 220px; // initialy 130px */
    /* left: 1rem; // initialy 200px */
    top: 0;
    left: 0;
  }
  .panel.svelte-1shyvx4.svelte-1shyvx4 {
    display: flex;
    flex-direction: column;
    background: var(--background_panel);
    backdrop-filter: var(--background_panel_blur);
    border-radius: var(--radius);
    padding: var(--panel_padding);
    width: 100%;
    /* max-width: var(--panel_max_width); */
    max-width: 14rem;
    min-width: var(--panel_min_width);

    transition: opacity var(--transition);
    pointer-events: all;
    z-index: 13;
    position: relative;
  }
  .panel.svelte-1shyvx4 .title.svelte-1shyvx4 {
    font-size: 9px;
    /* text-transform: uppercase; */
    text-align: center;
    color: var(--panel_title_color);
  }
  .floor-switcher > .title {
    margin-bottom: 15px;
  }
  .titleFloor {
    font-size: 15px;
    line-height: 15px;
    text-align: center;
    margin-top: 5px;
    color: var(--blue-theme);
  }
  .panel.svelte-1shyvx4 .body--margin.svelte-1shyvx4 {
    margin-top: 10px;
  }
  .panel.svelte-1shyvx4 .body.svelte-1shyvx4 {
    flex-shrink: 0;
  }
  .floor-switcher > .body {
    transition: all 200ms linear;
    /* Changed height to 0 and added overflow-y: hidden for initial state */
    height: 0;
    flex-shrink: 1 !important;
    overflow-y: hidden; /* Changed from scroll to hidden initially */
    margin-bottom: 0px;
    margin-top: 0 !important;
    max-height: 0; /* Changed from fixed height to 0 for transition */
  }

  .floor-switcher > .body.active {
    /* Set a sufficiently large max-height for dynamic content + scroll */
    max-height: 500px; /* Adjust this value if needed, but 500px is usually enough for most screens */
    height: auto; /* Not strictly necessary with a large max-height, but kept for clarity */
    overflow-y: scroll; /* Allow scroll only when active and content exceeds max-height */
  }

  .floor-switcher .floor__wrap.svelte-6keq0u.svelte-6keq0u {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0px 22px;
    min-height: auto; /* Changed from 369px */
    max-height: none; /* Changed from 369px */
  }
  @media (max-width: 767px) {
    .floor__wrap.svelte-6keq0u.svelte-6keq0u {
      padding: 7px 0;
    }
  }
  /* Works on Firefox */
  .body {
    scrollbar-width: none;
    scrollbar-color: #636363 #636363;
  }
  /* Works on Chrome, Edge, and Safari */
  .body::-webkit-scrollbar {
    width: 2px;
  }
  .body::-webkit-scrollbar-track {
    background: #636363;
  }
  .body::-webkit-scrollbar-thumb {
    background-color: #636363;
    border-radius: 20px;
    border: 0px solid #636363;
  }
  @media (max-width: 767px) {
    .input-group {
      margin-bottom: 15px;
    }
  }
  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  .inputs-container input[type="text"] {
    border: 1px solid #f9f9f9;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 13px;
  }
  .floor-switcher input[name="floor_number"] {
    max-width: 150px;
    margin: 0 auto;
    display: block;
  }
  .floor-switcher-wrapper input[name="floor_number"] {
    background-color: transparent;
    /* background-color: #313030; */
  }
  .input-group input {
    margin-top: 5px;
  }
  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  select,
  textarea {
    background: #333;
    color: #ffff;
    padding: 8px 14px;
    border-radius: 4px;
    border: var(--input_border);
    margin-top: 5px;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-user-select: text;
    transition: border var(--transition);
  }
  input {
    border: 0;
    border-radius: 0;
    width: 100%;
    outline: 0;
    margin: 0;
  }
  * {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    user-drag: none;
    -webkit-touch-callout: none;
  }
  .floor-switcher-wrapper .input-group {
    margin-bottom: 13px;
  }
  @media (max-width: 767px) {
    .input-group {
      margin-bottom: 15px;
    }
  }
  .floor-switcher .fake-checkbox-label {
    font-size: 11px;
    color: #a4d486 !important;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    max-width: 130px;
    margin: 0 auto;
  }
  .input-group label {
    color: var(--input_label_text_color);
    position: relative;
  }
  .fake-checkbox-label {
    cursor: pointer;
  }
  label {
    display: block;
  }
  input[type="checkbox"] {
    display: none;
  }
  input[type="checkbox"] + .fake-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    background-color: transparent;
    border: var(--input_radio_border);
    transition: var(--transition);
  }
  .fake-checkbox {
    display: inline-block;
    cursor: pointer;
  }
  .fake-checkbox {
    width: 24px !important;
    border-radius: 20px !important;
    background: #4a4a4a !important;
    border: none !important;
    height: 12px !important;
    position: relative;
    transition: var(--transition);
  }
  .fake-checkbox.toggle-button--checked {
    background: #77a641 !important;
    ::before {
      transform: translateY(-50%) translateX(100%);
      background: #333;
    }
  }
  .fake-checkbox::before {
    content: "";
    transition: var(--transition);
    width: 8px;
    height: 8px;
    border-radius: 20px;
    background: #fff;
    position: absolute;
    top: 50%;
    inset-inline-start: 3px;
    transform: translateY(-50%);
  }
  .floor__buttons.svelte-6keq0u.svelte-6keq0u {
    width: 100%;
    margin: 0 0 7px;
    padding: 0px !important;
  }
  .floor__buttons.svelte-6keq0u .floors__group.svelte-6keq0u:not(:last-child) {
    border-bottom: solid 1px #3e3e3e;
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.available.svelte-6keq0u {
    cursor: pointer;
    pointer-events: all;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.svelte-6keq0u:nth-child(-n + 2) {
    margin-bottom: 8px;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.ground-floor.svelte-6keq0u {
    width: 100%;
    border: 1px solid #3e3e3e;
    box-sizing: border-box;
    border-radius: 4px;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    margin: 0 !important;
  }
  .floor-switcher .inputs-container .floor-selected {
    max-width: 150px;
    background-color: rgba(119, 166, 65, 0.05) !important;
    border-color: var(--blue-theme) !important;
    color: #ffff;
  }
  .input-floor {
    background-color: #333;
    ::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #ffffff;
      opacity: 1; /* Firefox */
    }
    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #ffffff !important;
    }
    ::-ms-input-placeholder {
      /* Microsoft Edge */
      color: #ffffff !important;
    }
  }
  .input-floor.floor-selected {
    background-color: #95c55e;
    border: 2px solid #77a641;
    ::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #ffff;
      opacity: 1; /* Firefox */
    }
    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #ffff !important;
    }
    ::-ms-input-placeholder {
      /* Microsoft Edge */
      color: #ffff !important;
    }
  }
  //ground-floor hidden
  .ground-floor .color_retails .button__gf {
    opacity: 0;
    height: 0px;
    margin-top: -30px;
    line-height: 0px;
  }
  .floors__group.svelte-6keq0u.hide-ground-floor {
    opacity: 0;
    height: 0px;
    margin-top: 0px;
    line-height: 0px;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.available.color_retails.svelte-6keq0u
    button {
    color: #e3b22e;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.ground-floor.svelte-6keq0u
    button {
    width: 100%;
    height: 25px;
    background: transparent;
    color: #3e3e3e;
  }
  input,
  button,
  select,
  textarea {
    font-family: "Roboto", sans-serif;
    font-size: inherit;
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.svelte-6keq0u:nth-last-child(-n + 4) {
    margin-bottom: 0px;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.svelte-6keq0u:nth-child(4n + 4) {
    margin-left: 0px;
  }
  .floor__buttons.svelte-6keq0u .floors__group--numbers.svelte-6keq0u {
    width: 50px;
    height: 18px;
    color: #ffffffe0;
    font-size: 10px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.active.svelte-6keq0u {
    background-color: var(--blue-theme);
    border-color: var(--blue-theme);
  }
  .floor__buttons.svelte-6keq0u .floors__group.svelte-6keq0u {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    justify-content: flex-start;
    padding-bottom: 10px;
  }
  .floor__buttons.svelte-6keq0u .floors__group--button.svelte-6keq0u {
    font-size: 10px;
    font-weight: 500;
    background: transparent;
    color: #3e3e3e;
    padding: 0px;
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.selected.svelte-6keq0u {
    background-color: var(--blue-theme);
    border-color: var(--blue-theme);
    .floors__group--button.svelte-6keq0u {
      color: #fff;
    }
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.available
    .floors__group--button.svelte-6keq0u {
    color: var(--blue-theme);
  }
  button {
    border: 0;
    border-radius: 0;
    padding: 5px 10px;
    background-color: #006fff;
    color: #fff;
    flex-shrink: 0;
    cursor: pointer;
    margin: 0;
  }
  button {
    color: #333;
    background-color: #f4f4f4;
    outline: none;
  }
  .floor-switcher.alwaysVisible {
    width: 140px;
    margin: 0 auto;
  }
  .alwaysVisible {
    padding: 0px 15px;
  }
  //close button || Select floor
  .button.active {
    background: linear-gradient(180deg, #4391a5 0%, #245663 100%);
    box-shadow: 0 3px 0 rgba(0,0,0,0.2);
    color: #ffffff;
    font-weight: 700;
  }
  .button:last-child {
    margin-bottom: 0;
  }
  .floor-switcher-wrapper.toggleButton {
    background: #dadada !important;
  }
  .button {
    display: inline-block;
    border: none;
    width: 100%;
    padding: var(--paddings);
    background: var(--button_background);
    box-shadow: var(--button_shadow);
    border-radius: var(--radius);
    margin-bottom: 5px;
    font-size: 13px;
    line-height: 1.2;
    color: var(--button_color);
    text-align: center;
    pointer-events: auto;
    cursor: pointer;
    color: #bdbdbd;
    transition: var(--transition);
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.active.svelte-6keq0u {
    background-color: var(--blue-theme);
    border-color: var(--blue-theme);
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.available.svelte-6keq0u {
    cursor: pointer;
    pointer-events: all;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.svelte-6keq0u:nth-child(-n + 2) {
    margin-bottom: 8px;
  }
  .floor__buttons.svelte-6keq0u .floors__group--item.svelte-6keq0u {
    width: 28px;
    height: 22px;
    border: 1px solid #ffffff;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    transition: var(--transition);
    margin-left: 8px;
    pointer-events: none;
    /* :hover {
      background-color: var(--blue-theme);
      .floors__group--button.svelte-6keq0u {
        color: #fff;
      }} */
    /* .selected {
      background-color: var(--blue-theme);
      .floors__group--button.svelte-6keq0u {
        color: #fff;
      }
    }  */
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.active.available.svelte-6keq0u
    button {
    color: #edff9f;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.active
    .floors__group--button.svelte-6keq0u {
    color: #edff9f;
  }
  .floor__buttons.svelte-6keq0u
    .floors__group--item.available
    .floors__group--button.svelte-6keq0u {
    color: #ffff;
  }
  .button.toggleButton {
    font-size: 15px;
    padding: 8px 0px;
    margin-bottom: 10px;
  }
  .button.toggleButton.select-floor {
    background-color: var(--blue-theme);
    color: #fff;
  }
  .button.toggleButton.isOpen {
    background-color: #fff;
    color: #333;
  }
  .button.toggleButton.explore {
    background-color: var(--blue-theme);
    color: #fff;
  }

  /* Tablet styles (861px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    .panel.svelte-1shyvx4.svelte-1shyvx4 {
      max-width: 9rem;
      padding: 0.5rem;
    }

    .panel.svelte-1shyvx4 .title.svelte-1shyvx4 {
      font-size: 7px;
    }

    .titleFloor {
      font-size: 10px;
      line-height: 10px;
    }

    .section-title {
      font-size: 8px;
      padding: 4px 0;
    }

    .floor__buttons.svelte-6keq0u .floors__group--item.svelte-6keq0u {
      width: 20px;
      height: 18px;
      margin-left: 5px;
      margin-bottom: 5px;
    }

    .floor__buttons.svelte-6keq0u .floors__group--button.svelte-6keq0u {
      font-size: 8px;
    }

    .floor__buttons.svelte-6keq0u .floors__group--numbers.svelte-6keq0u {
      width: 40px;
      height: 14px;
      font-size: 8px;
    }

    .floor__buttons.svelte-6keq0u .floors__group.svelte-6keq0u {
      margin-bottom: 6px;
      padding-bottom: 6px;
    }

    .floor-switcher input[name="floor_number"] {
      max-width: 100px;
      font-size: 9px;
      padding: 5px 6px;
    }

    .button.toggleButton {
      font-size: 10px;
      padding: 5px 0px;
    }

    .floor-switcher > .title {
      margin-bottom: 8px;
    }
  }

  /* Mobile styles (max-width: 860px) */
  @media screen and (max-width: 860px) {
    .panel.svelte-1shyvx4.svelte-1shyvx4 {
      max-width: 7rem;
      padding: 0.2rem 0;
      min-width: 150px;
    }

    .panel.svelte-1shyvx4 .title.svelte-1shyvx4 {
      font-size: 6px;
    }

    .titleFloor {
      font-size: 8px;
      line-height: 8px;
    }

    .section-title {
      font-size: 7px;
      padding: 3px 0;
    }

    .floor__buttons.svelte-6keq0u .floors__group--item.svelte-6keq0u {
      width: 16px;
      height: 16px;
      margin-left: 4px;
      margin-bottom: 4px;
      border-radius: 3px;
    }

    .floor__buttons.svelte-6keq0u .floors__group--button.svelte-6keq0u {
      font-size: 7px;
    }

    .floor__buttons.svelte-6keq0u .floors__group--numbers.svelte-6keq0u {
      width: 35px;
      height: 12px;
      font-size: 7px;
    }

    .floor__buttons.svelte-6keq0u .floors__group.svelte-6keq0u {
      margin-bottom: 5px;
      padding-bottom: 5px;
    }

    .floor-switcher input[name="floor_number"] {
      max-width: 80px;
      font-size: 8px;
      padding: 4px 5px;
    }

    .button.toggleButton {
      font-size: 8px;
      padding: 4px 0px;
      margin-bottom: 6px;
    }

    .floor-switcher > .title {
      margin-bottom: 6px;
    }

    .floor-switcher .floor__wrap.svelte-6keq0u.svelte-6keq0u {
      padding: 0px 8px;
    }

    .input-group {
      margin-bottom: 8px;
    }

    .floor-switcher-wrapper .input-group {
      margin-bottom: 8px;
    }
  }
`;