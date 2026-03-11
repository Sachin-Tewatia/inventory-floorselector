import React, { useContext } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useMapFilter } from "../../Hooks";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import { AppContext } from "../../Contexts/AppContext";
import UnitStatusLegend from "../Atoms/UnitStatusLegend";
import ExploreTowers from "./ExploreTowers";
import { useRoomId } from "../../Hooks/useRoomId";
import { SYNC_EVENTS, getReceivingSync, emitSyncDebounced } from "../../services/socketSync";
import { track } from "../../analytics/track";

function UnitTypeFilter({ unitTypeFilters, minMaxArea, totalUnits, viewFilters = [], tower, showBandFilter = false }) {
  const location = useLocation();
  const { flatFilterSizeValues, setFlatFilterSizeValues } =
    useContext(AppContext);
  const { roomId } = useRoomId();
  const { activeMapFilterIds, isFilterActive, setActiveMapFilterIds } =
    useMapFilter();

  const filtersSyncData = (overrides = {}) => ({
    pathname: location.pathname,
    activeMapFilterIds,
    flatFilterSizeValues,
    ...overrides,
  });

  const isAllFiltersActive = () =>
    activeMapFilterIds.length == unitTypeFilters.length;

  const onShowAllClicked = () => {
    let newFilters;
    if (isAllFiltersActive()) {
      newFilters = [];
      setActiveMapFilterIds([]);
    } else {
      newFilters = [...unitTypeFilters.map((filter) => filter.id)];
      setActiveMapFilterIds(newFilters);
    }

    if (!getReceivingSync() && roomId) emitSyncDebounced(SYNC_EVENTS.FILTERS, filtersSyncData({ activeMapFilterIds: newFilters }), roomId, 100);
  };

  const handleFilterClick = (id) => {
    let newFilters;
    const clickedFilter = unitTypeFilters.find(f => f.id === id);
    const filterTitle = clickedFilter ? clickedFilter.title : id;
    if (isFilterActive(id)) {
      // should be deactivated
      if (isAllFiltersActive()) {
        newFilters = [
          ...unitTypeFilters
            .map((filter) => filter.id)
            .filter((_id) => _id !== id),
        ];
      } else {
        newFilters = activeMapFilterIds.filter((_id) => _id !== id);
      }
    } else {
      newFilters = [...activeMapFilterIds, id];
    }
    
    // Update state with the calculated newFilters
    setActiveMapFilterIds(newFilters);

     // ✅ Track BHK filter change
    track("filter_change", {
      filterType: "bhk",
      bhk: filterTitle,
      action: isFilterActive(id) ? "deselect" : "select",
      filterValue: filterTitle
    });
    
    if (!getReceivingSync() && roomId) emitSyncDebounced(SYNC_EVENTS.FILTERS, filtersSyncData({ activeMapFilterIds: newFilters }), roomId, 100);
  };

  const handleSizeOnSliderChange = (value) => {
    setFlatFilterSizeValues(value);
    // ✅ Track price/size slider change (debounced to avoid too many events)
    // Note: This will fire frequently, but Lambda handles it efficiently
    track("filter_change", {
      filterType: "size",
      minSize: value[0],
      maxSize: value[1],
      minPrice: value[0] * PRICE_OFFSET, // Convert to approximate price if needed
      maxPrice: value[1] * PRICE_OFFSET
    });
    
    if (!getReceivingSync() && roomId) emitSyncDebounced(SYNC_EVENTS.FILTERS, filtersSyncData({ flatFilterSizeValues: value }), roomId, 300);
  };

  return (
    <Style>
      <div className="filters-container">
        {/* Units + Active BHK */}
        {/* <div className="units-header">
          <span>{totalUnits} Units</span>
        </div> */}

        <div className="bhk-buttons">
           <div className="units-header">
            <span>{totalUnits} Units</span>
           </div>
          {unitTypeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`button bhk-btn ${isFilterActive(filter.id) ? "active" : ""}`}
            >
              {filter.title}
            </button>
          ))}
        </div>

        {/* Size Sq. Ft */}
        <div className="section">
          <div className="section-title">Size Sq. Ft.</div>
          <DoubleSlider
            value={flatFilterSizeValues}
            labelValues={flatFilterSizeValues}
            start={minMaxArea[0]}
            end={minMaxArea[1]}
            handleOnSliderChange={handleSizeOnSliderChange}
          />
        </div>

        {/* Towers */}
       {tower && <ExploreTowers currentTower={tower}/>}
        {/* {towerFilters && towerFilters.length > 0 && (
          <div className="section">
            <div className="section-title">Towers</div>
            <div className="button-group">
              {towerFilters.map((tower) => (
                <button key={tower.id} className="button tower-btn">
                  {tower.title}
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* Unit Status Legend */}
        <UnitStatusLegend/>

        {/* Show/Hide All */}
        <div className="section showall">
          {isAllFiltersActive() ? (
            <button className="button toggle-btn active" onClick={onShowAllClicked}>
              Hide All
            </button>
          ) : (
            <button className="button toggle-btn" onClick={onShowAllClicked}>
              Show All
            </button>
          )}
        </div>
      </div>
    </Style>
  );
}

export default UnitTypeFilter;

export const DoubleSlider = ({ start, end, handleOnSliderChange, value, labelValues }) => {
  return (
    <div className="slider-group">
      <div className="slider-labels">
        <span>{labelValues[0]}</span>
        <span>{labelValues[1]}</span>
      </div>
      <Range
        min={start}
        max={end}
        allowCross={false}
        step={0.1}
        value={value}
        onChange={handleOnSliderChange}
        railStyle={{ height: 4, backgroundColor: "#444" }}
        handleStyle={[
          { backgroundColor: "var(--blue-theme)", border: "2px solid var(--blue-theme)" },
          { backgroundColor: "var(--blue-theme)", border: "2px solid var(--blue-theme)" }
        ]}
        trackStyle={[{ background: "var(--blue-theme)", height: 4 }]}
      />
    </div>
  );
};

const Style = styled.div`
  .filters-container {
    background: var(--background_panel);
    backdrop-filter: var(--background_panel_blur);
    padding: 1rem 10px; /* reduced padding */
    border-radius: 6px; /* slightly smaller corners */
    font-family: "Inter", sans-serif;
    color: #fff;
    width: 220px; /* narrower width */
    z-index: 10;

    @media screen and (min-width: 861px) and (max-width: 1080px) {
      width: 200px;
    }

    @media screen and (max-width: 860px) {
      width: 170px;
    }
  }

  .units-header {
    text-align: center;
    margin: auto;
    font-weight: 600;
    font-size: 12px; /* smaller text */
    color: #fff;
  }

  .bhk-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.3rem; /* reduced gap */
    margin-bottom: 0.6rem;
    width: 100%;
  }

  .bhk-btn {
    flex: 1;
    background: #2a2a2a;
    border: 1px solid #fff;
    color: #fff;
    padding: 5px 7px; /* button size driven by padding + content */
    min-height: 30px;
    border-radius: 5px;
    font-size: 11px;
    cursor: pointer;
    margin-right: 4px;
  }

  .bhk-btn.active {
    background: var(--blue-theme);
    color: #000;
    font-weight: bold;
  }

  .section {
    margin-top: 12px; /* tighter spacing */
  }

  .section-title {
    font-size: 9px;
    color: #9f9f9f;
    margin-bottom: 6px;
    display: flex;
    flex-direction: column;
  }

  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .view-btn {
    background: #2a2a2a;
    border: 1px solid #fff;
    padding: 4px 7px;
    border-radius: 5px;
    font-size: 10px;
    cursor: pointer;
    text-transform: capitalize;
  }

  .band-btn {
    background: #2a2a2a;
    border: 1px solid #fff;
    padding: 4px 7px;
    border-radius: 5px;
    font-size: 10px;
    cursor: pointer;
    text-transform: capitalize;
  }

  .button.active {
    background: var(--blue-theme);
    color: #fbf8f8;
    font-weight: 400;
  }

  .slider-group {
    margin-top: 12px;
    padding: 0 0.3rem;
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    margin-bottom: 4px;
    color: #aaa;
  }

  .legend {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #bbb;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
  }
  .dot.available {
    background: #00c853;
  }
  .dot.sold {
    background: #d50000;
  }
  .dot.hold {
    background: #00bcd4;
  }

  .showall {
    text-align: center;
  }

  .toggle-btn {
    background: #2a2a2a;
    color: #fff;
    width: 100%;
    border-radius: 5px;
    padding: 6px; /* compact button */
    font-size: 14px;
  }

  .toggle-btn.active {
    background: linear-gradient(180deg, #4391a5 0%, #245663 100%);
    font-weight: 400;
  }

  /* Tablet styles (861px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    .filters-container {
      width: 100%;
      max-width: 200px;
      padding: 0.7rem 8px;
    }

    .units-header {
      font-size: 11px;
    }

    .bhk-buttons {
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .bhk-btn {
      padding: 4px 6px;
      min-height: 28px;
      font-size: 10px;
    }

    .section {
      margin-top: 10px;
    }

    .section-title {
      font-size: 8px;
      margin-bottom: 5px;
    }

    .slider-group {
      margin-top: 10px;
      padding: 0 0.25rem;
    }

    .slider-labels {
      font-size: 9px;
      margin-bottom: 4px;
    }

    .toggle-btn {
      padding: 5px;
      font-size: 12px;
      min-height: 28px;
    }
  }

  /* Mobile styles (max-width: 860px) */
  @media screen and (max-width: 860px) {
    .filters-container {
      width: 100%;
      max-width: 50%;
      padding: 0.3rem 4px;
      border-radius: 3px;
    }

    .units-header {
      font-size: 7px;
      margin-bottom: 0.15rem;
    }

    .bhk-buttons {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.1rem;
      margin-bottom: 0.25rem;
    }

    .bhk-btn {
      padding: 2px 3px;
      min-height: 18px;
      font-size: 6px;
      margin-right: 0;
      border-radius: 3px;
      -webkit-tap-highlight-color: transparent;
    }

    .section {
      margin-top: 0.3rem;
    }

    .section-title {
      font-size: 6px;
      margin-bottom: 2px;
    }

    .button-group {
      gap: 2px;
    }

    .view-btn,
    .band-btn {
      padding: 2px 3px;
      font-size: 5px;
      min-height: 14px;
      border-radius: 3px;
      -webkit-tap-highlight-color: transparent;
    }

    .slider-group {
      margin-top: 0.3rem;
      padding: 0 0.15rem;
    }

    .slider-labels {
      font-size: 5px;
      margin-bottom: 2px;
    }

    .legend {
      font-size: 5px;
    }

    .dot {
      width: 3px;
      height: 3px;
    }
    .rc-slider {
      width: 90% !important;
      margin: 0 auto !important;
    }
    .rc-slider-handle {
      width: 10px !important;
      height: 10px !important;
      border-radius: 50% !important;
      background: var(--blue-theme) !important;
      border: 2px solid var(--blue-theme) !important;
      margin-top: -4px !important;
    }

    .rc-slider-step {
      height: 2px !important;
    }
    .rc-slider-track {
      height: 2px !important;
    }
    .rc-slider-rail {
      height: 2px !important;
    }

    .toggle-btn {
      padding: 2px;
      font-size: 6px;
      min-height: 14px;
      border-radius: 3px;
      -webkit-tap-highlight-color: transparent;
    }
  }
`;