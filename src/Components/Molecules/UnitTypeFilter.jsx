import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useInventories, useMapFilter } from "../../Hooks";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import { useContext } from "react";
import { AppContext } from "../../Contexts/AppContext";
import { getFormalCurrencyFromNum } from "../../Utility/function";
import { useRoomId } from "../../Hooks/useRoomId";
import { emitSyncDebounced, SYNC_EVENTS, getReceivingSync } from "../../services/socketSync";

const PRICE_OFFSET = 100000;

function UnitTypeFilter({ unitTypeFilters, minMaxArea, totalUnits }) {
  const { flatFilterSizeValues, setFlatFilterSizeValues, activeMapFilterIds: contextActiveMapFilterIds } =
    useContext(AppContext);
  const { roomId } = useRoomId();

  const { activeMapFilterIds, isFilterActive, setActiveMapFilterIds } =
    useMapFilter();

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
    
    // Sync filter changes if not receiving sync
    if (!getReceivingSync() && roomId) {
      emitSyncDebounced(SYNC_EVENTS.FILTERS, {
        activeMapFilterIds: newFilters,
        flatFilterSizeValues,
      }, roomId, 100);
    }
  };

  const handleFilterClick = (id) => {
    let newFilters;
    if (isFilterActive(id)) {
      // should be deactivated
      if (isAllFiltersActive()) {
        newFilters = [
          ...unitTypeFilters
            .map((filter) => filter.id)
            .filter((_id) => _id !== id),
        ];
        setActiveMapFilterIds(newFilters);
      } else {
        setActiveMapFilterIds((old) => {
          newFilters = old.filter((_id) => _id !== id);
          return newFilters;
        });
      }
    } else {
      setActiveMapFilterIds((old) => {
        newFilters = [...old, id];
        return newFilters;
      });
    }
    
    // Sync filter changes if not receiving sync
    if (!getReceivingSync() && roomId) {
      setTimeout(() => {
        emitSyncDebounced(SYNC_EVENTS.FILTERS, {
          activeMapFilterIds: newFilters,
          flatFilterSizeValues,
        }, roomId, 100);
      }, 50);
    }
  };

  //size handler
  const handleSizeOnSliderChange = (value) => {
    setFlatFilterSizeValues(value);
    
    // Sync size filter changes with debouncing (since slider changes rapidly)
    if (!getReceivingSync() && roomId) {
      emitSyncDebounced(SYNC_EVENTS.FILTERS, {
        activeMapFilterIds,
        flatFilterSizeValues: value,
      }, roomId, 300);
    }
  };

  return (
    <Style>
      <div
        class="filters-control align-start"
        style={{ minHeight: "250px", height: "fit-content" }}
      >
        <div class="main-controls">
          {" "}
          <div class="available-title">{totalUnits} Units Total</div>{" "}
          <div class="button-group">
            {unitTypeFilters.map((filter) => (
              <button
                onClick={() => handleFilterClick(filter.id)}
                class={`button green ${
                  isFilterActive(filter.id) ? "active" : ""
                }`}
                value=""
                style={{ "--paddings": "5px 8px" }}
              >
                {filter.title}
              </button>
            ))}
          </div>{" "}
          <DoubleSlider
            title={"Size"}
            rangeLabel="Sq. Ft"
            value={flatFilterSizeValues}
            labelValues={flatFilterSizeValues}
            start={minMaxArea[0]}
            end={minMaxArea[1]}
            handleOnSliderChange={handleSizeOnSliderChange}
          />
        </div>
      </div>
      <div className="el-showall">
        {isAllFiltersActive() ? (
          <button
            className="button el-showall__button active"
            onClick={onShowAllClicked}
            value=""
            style={{ "--paddings": "5px 8px" }}
          >
            Hide All
          </button>
        ) : (
          <button
            className="button el-showall__button"
            onClick={onShowAllClicked}
            value=""
            style={{ "--paddings": "5px 8px" }}
          >
            Show All
          </button>
        )}
      </div>
    </Style>
  );
}

export default UnitTypeFilter;

export const DoubleSlider = ({
  title,
  rangeLabel,
  start,
  end,
  handleOnSliderChange,
  value,
  labelValues,
}) => {
  return (
    <div class="slider-group">
      <div class="slider-group__title">{title + " " + rangeLabel}</div>{" "}
      <div class="slider-group__body">
        <div class="slider-group__body--prices">
          <div class="input-minprice">{labelValues[0]}</div>{" "}
          <div class="input-maxprice">{labelValues[1]}</div>
        </div>{" "}
        <div style={{ marginTop: "10px" }}>
          <Range
            // range
            // disabled
            min={start}
            max={end}
            allowCross={false}
            value={value}
            onChange={handleOnSliderChange}
            railStyle={{
              height: 2,
            }}
            // className="background-red"
            handleStyle={[
              {
                backgroundColor: "var(--blue-theme)",
                border: "1px solid var(--blue-theme)",
              },
              {
                backgroundColor: "var(--blue-theme)",
                border: "1px solid var(--blue-theme)",
              },
            ]}
            trackStyle={[
              {
                background: "var(--blue-theme)",
              },
            ]}
            dotStyle={{
              backgroundColor: "var(--blue-theme)",
            }}
            activeDotStyle={{
              backgroundColor: "var(--blue-theme)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Style = styled.div`
  .button.active.green {
    color: var(--button_color_green);
    background: var(--button_background_blue);
    font-weight: 500;
  }
  .filters-control.align-start {
    align-items: flex-start;
  }
  .filters-control {
    position: relative;
    display: flex;
    overflow: hidden;
    transition: min-height 0.2s ease-out;
  }
  .el-showall {
    margin-top: 10px;
    margin-bottom: 7px;
  }
  .filters-control .main-controls {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
  }
  .available-title {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    margin-top: 9px;
    color: var(--slide_area_span_color_hover);
  }
  .button-group {
    margin-bottom: 20px;
  }
  .button-group {
    margin-top: 11px;
  }
  .button-group :first-child {
    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);
  }
  .button-group {
    border-radius: 0;
    margin-bottom: 30px;
  }
  .slider-group {
    margin-bottom: 30px;
    margin-top: 1.2rem;
    padding: 0 10px;
  }
  .slider-group__title {
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  .slider-group__title span {
    margin: 0 5px;
    color: #c7c7c7;
  }
  .slider-group__body--prices {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #c7c7c7;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    margin: 6px 0;
  }
  .double-range-container {
    width: 100%;
    height: 15px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    box-sizing: border-box;
    white-space: nowrap;
  }
  .slider {
    position: relative;
    width: 100%;
    height: 1px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #737373;
  }
  .body {
    top: -1px;
    position: absolute;
    background-color: #c7c7c7;
    bottom: -1px;
  }
  .body.active {
    background: var(--blue-theme);
  }
  .handle {
    position: absolute;
    top: 50%;
    width: var(--handleWidth);
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #c7c7c7;
    border-radius: 5px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .handle.active {
    background: var(--blue-theme);
  }
  .dots {
    position: relative;
    width: 6px;
    height: 5px;
    margin-left: -1px;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .dots__dot--1::before {
    right: 0;
  }
  .dots__dot--2::before {
    left: 0;
  }
  .dots__dot--1::before,
  .dots__dot--1::after {
    content: "";
    position: absolute;
    top: 0;
    width: 1px;
    height: 1px;
    display: block;
    background-color: #060606;
  }
  .dots__dot--2::after {
    left: 100%;
  }
  .dots__dot--2::before,
  .dots__dot--2::after {
    content: "";
    position: absolute;
    top: 100%;
    width: 1px;
    height: 1px;
    display: block;
    background-color: #060606;
  }
  .slider-group__title-square {
    cursor: pointer;
  }
  .views {
    margin-bottom: 10px;
    font-size: 12px;
    color: #9f9f9f;
  }
  .views-body {
    display: flex;
    flex-direction: column;
    padding: 7px;
    background: rgba(70, 70, 70, 0.5);
    border-radius: 8px;
  }
  .views-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    color: #bdbdbd;
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    .filters-control.align-start {
      min-height: 130px !important;
    }

    .available-title {
      font-size: 7px;
      margin-top: 0px;
    }

    .button-group {
      margin-top: 4px;
      margin-bottom: 11px;
    }

    .button-group button {
      font-size: 8px;
      padding: 2px 4px !important;
    }

    .slider-group {
      margin-bottom: 8px;
      margin-top: 0.5rem;
      padding: 0 7px;
    }

    .slider-group__title {
      font-size: 8px;
      line-height: 10px;
    }

    .slider-group__body--prices {
      font-size: 6px;
      line-height: 8px;
      margin: 4px 0;
    }

    .el-showall {
      margin-top: 0px;
      margin-bottom: 0px;
    }

    .el-showall__button {
      font-size: 9px;
      padding: 3px 5px !important;
    }
    .rc-slider-handle {
      width: 10px;
      height: 10px;
      margin-top: -4px;
    }
    .rc-slider {
      height: 2px;
    }
    .rc-slider-track {
      height: 2px;
    }
    .rc-slider-rail {
      height: 2px;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    .filters-control.align-start {
      min-height: 180px !important;
    }

    .available-title {
      font-size: 11px;
      margin-top: 7px;
    }

    .button-group {
      margin-top: 8px;
      margin-bottom: 15px;
    }

    .button-group button {
      font-size: 12px;
      padding: 4px 7px !important;
    }

    .slider-group {
      margin-bottom: 20px;
      margin-top: 0.8rem;
      padding: 0 10px;
    }

    .slider-group__title {
      font-size: 11px;
      line-height: 14px;
    }

    .slider-group__body--prices {
      font-size: 12px;
      line-height: 15px;
      margin: 6px 0;
    }

    .el-showall {
      margin-top: 10px;
      margin-bottom: 6px;
    }

    .el-showall__button {
      font-size: 12px;
      padding: 5px 8px !important;
    }
  }
`;