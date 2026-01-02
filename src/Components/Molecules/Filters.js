import React, { useState } from "react";
import UnitTypeFilter from "./UnitTypeFilter"; // Import the existing filter component
import styled from "styled-components";
import FloorSelector from "./FloorSelector";

function Filters({
  unitTypeFilters,
  minMaxArea,
  totalUnits,
  currentFloor,
  selectedFloor,
  setSelectedFloor,
  currentTower,
  selectedTower,
  setSelectedTower,
  floor = null,
  filter = null,
}) {
  const [isFilterVisible, setIsFilterVisible] = useState(null);

  const toggleFilterVisibility = (id) => {
    setIsFilterVisible(isFilterVisible == id ? null : id);
  };

  return (
    <Container className="overlay-can-fade-out">
      <ButtonContainer className="flex gap-2 absolute bottom-10 left-2">
        {floor && (
          <ToggleButton
            style={{
              backgroundColor:
                isFilterVisible === "floors"
                  ? "var(--button_background_blue)"
                  : "",
            }}
            onClick={() => toggleFilterVisibility("floors")}
          >
            {filterIcon} Floors
            <ArrowIcon isFilterVisible={isFilterVisible === "floors"} />
          </ToggleButton>
        )}
        {/* <ToggleButton
          style={{
            backgroundColor:
              isFilterVisible === "filters"
                ? "var(--button_background_blue)"
                : "",
          }}
          onClick={() => toggleFilterVisibility("filters")}
        >
          {filterIcon}Filters
          <ArrowIcon isFilterVisible={isFilterVisible === "filters"} />
        </ToggleButton> */}
      </ButtonContainer>
      {/* {isFilterVisible == "filters" && (
        <FilterPanel>
          <UnitTypeFilter
            unitTypeFilters={unitTypeFilters}
            minMaxArea={minMaxArea}
            totalUnits={totalUnits}
          />
        </FilterPanel>
      )} */}
      {isFilterVisible == "floors" && (
        <FloorPanel>
          {" "}
          <FloorSelector
            currentFloor={currentFloor}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
            currentTower={currentTower}
            selectedTower={selectedTower}
            setSelectedTower={setSelectedTower}
          />
        </FloorPanel>
      )}
    </Container>
  );
}

export default Filters;

const Container = styled.div`
  /* position: relative; */
`;

const ButtonContainer = styled.div`
  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    bottom: 1.3rem !important;
    left: 0.5rem !important;
    gap: 0.5rem;
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    bottom: 0.8rem !important;
    left: 0.8rem !important;
    gap: 0.7rem;
  }
`;

const ToggleButton = styled.button`
  background-color: var(--background_panel);
  transition: all 0.2s ease-in-out;
  border-radius: 5px;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  z-index: 9;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    padding: 5px 10px;
    font-size: 9px;
    border-radius: 3px;
    gap: 5px;

    svg {
      width: 13px;
      height: 13px;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    padding: 8px 16px;
    font-size: 12px;
    border-radius: 5px;
    gap: 7px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const FilterPanel = styled.div`
  position: absolute;
  bottom: 60px;
  left: 10px;
  width: 220px;
  height: 350px;
  /* background: var(--panel_background); */
  background: rgba(35, 35, 35, 0.85);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  border-radius: var(--radius);
  z-index: 99;
  overflow-y: auto;
  transition: transform 0.7s ease-in-out;
  padding: 20px;  
`;
const FloorPanel = styled.div`
  position: absolute;
  bottom: 86px;
  left: 10px;
  width: 200px;
  height: 450px;
  /* background: var(--panel_background); */
  background: rgba(35, 35, 35, 0.85);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  border-radius: var(--radius);
  z-index: 99;
  overflow-y: auto;
  transition: transform 0.7s ease-in-out;
  padding: 20px;

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    bottom: 50px;
    left: 0.5rem;
    width: 100%;
    max-width: 150px;
    height: 60vh;
    max-height: 400px;
    padding: 12px;
    border-radius: 6px;
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    bottom: 70px;
    left: 1rem;
    width: 240px;
    max-width: 240px;
    height: 65vh;
    max-height: 500px;
    padding: 16px;
    border-radius: 8px;
  }
`;
const filterIcon = (
  <>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.9454 11.1866V2.49996C5.9454 2.27895 5.85997 2.06698 5.7079 1.9107C5.55584 1.75442 5.3496 1.66663 5.13455 1.66663C4.9195 1.66663 4.71325 1.75442 4.56119 1.9107C4.40913 2.06698 4.3237 2.27895 4.3237 2.49996V11.1866C3.7944 11.3597 3.3324 11.7014 3.00456 12.1622C2.67671 12.623 2.5 13.1791 2.5 13.75C2.5 14.3208 2.67671 14.8769 3.00456 15.3377C3.3324 15.7985 3.7944 16.1402 4.3237 16.3133V17.5C4.3237 17.721 4.40913 17.9329 4.56119 18.0892C4.71325 18.2455 4.9195 18.3333 5.13455 18.3333C5.3496 18.3333 5.55584 18.2455 5.7079 18.0892C5.85997 17.9329 5.9454 17.721 5.9454 17.5V16.3133C6.4747 16.1402 6.93669 15.7985 7.26454 15.3377C7.59239 14.8769 7.76909 14.3208 7.76909 13.75C7.76909 13.1791 7.59239 12.623 7.26454 12.1622C6.93669 11.7014 6.4747 11.3597 5.9454 11.1866ZM5.13455 14.7916C4.93408 14.7916 4.73812 14.7305 4.57144 14.6161C4.40476 14.5016 4.27485 14.3389 4.19814 14.1486C4.12142 13.9582 4.10135 13.7488 4.14046 13.5467C4.17957 13.3447 4.2761 13.1591 4.41785 13.0134C4.5596 12.8677 4.7402 12.7685 4.93681 12.7283C5.13342 12.6881 5.33722 12.7087 5.52242 12.7876C5.70762 12.8664 5.86592 12.9999 5.97729 13.1712C6.08866 13.3425 6.14811 13.5439 6.14811 13.75C6.14768 14.0261 6.04076 14.2908 5.85077 14.486C5.66078 14.6813 5.40323 14.7912 5.13455 14.7916Z"
        fill="white"
        strokeWidth="0.1"
      ></path>
      <path
        d="M17.5 13.75C17.4981 13.1795 17.3205 12.6243 16.9928 12.1638C16.6651 11.7034 16.204 11.3613 15.6756 11.1866V2.49996C15.6756 2.27895 15.5902 2.06698 15.4381 1.9107C15.286 1.75442 15.0798 1.66663 14.8647 1.66663C14.6497 1.66663 14.4434 1.75442 14.2914 1.9107C14.1393 2.06698 14.0539 2.27895 14.0539 2.49996V11.1866C13.5246 11.3597 13.0626 11.7014 12.7347 12.1622C12.4069 12.623 12.2302 13.1791 12.2302 13.75C12.2302 14.3208 12.4069 14.8769 12.7347 15.3377C13.0626 15.7985 13.5246 16.1402 14.0539 16.3133V17.5C14.0539 17.721 14.1393 17.9329 14.2914 18.0892C14.4434 18.2455 14.6497 18.3333 14.8647 18.3333C15.0798 18.3333 15.286 18.2455 15.4381 18.0892C15.5902 17.9329 15.6756 17.721 15.6756 17.5V16.3133C16.204 16.1386 16.6651 15.7966 16.9928 15.3361C17.3205 14.8757 17.4981 14.3204 17.5 13.75ZM14.8647 14.7916C14.6643 14.7916 14.4683 14.7305 14.3016 14.6161C14.135 14.5016 14.005 14.3389 13.9283 14.1486C13.8516 13.9582 13.8315 13.7488 13.8707 13.5467C13.9098 13.3447 14.0063 13.1591 14.148 13.0134C14.2898 12.8677 14.4704 12.7685 14.667 12.7283C14.8636 12.6881 15.0674 12.7087 15.2526 12.7876C15.4378 12.8664 15.5961 12.9999 15.7075 13.1712C15.8189 13.3425 15.8783 13.5439 15.8783 13.75C15.8779 14.0261 15.7709 14.2908 15.581 14.486C15.391 14.6813 15.1334 14.7912 14.8647 14.7916Z"
        fill="white"
        strokeWidth="0.1"
      ></path>
      <path
        d="M12.6349 6.24996C12.633 5.67948 12.4554 5.12426 12.1277 4.66381C11.8 4.20336 11.3389 3.8613 10.8105 3.68663V2.49996C10.8105 2.27895 10.7251 2.06698 10.573 1.9107C10.4209 1.75442 10.2147 1.66663 9.99964 1.66663C9.78459 1.66663 9.57835 1.75442 9.42629 1.9107C9.27422 2.06698 9.18879 2.27895 9.18879 2.49996V3.68663C8.65949 3.85974 8.1975 4.20141 7.86965 4.66223C7.5418 5.12304 7.3651 5.6791 7.3651 6.24996C7.3651 6.82082 7.5418 7.37687 7.86965 7.83769C8.1975 8.2985 8.65949 8.64018 9.18879 8.81329V17.5C9.18879 17.721 9.27422 17.9329 9.42629 18.0892C9.57835 18.2455 9.78459 18.3333 9.99964 18.3333C10.2147 18.3333 10.4209 18.2455 10.573 18.0892C10.7251 17.9329 10.8105 17.721 10.8105 17.5V8.81329C11.3389 8.63862 11.8 8.29656 12.1277 7.83611C12.4554 7.37566 12.633 6.82044 12.6349 6.24996ZM9.99964 7.29163C9.79918 7.29163 9.60322 7.23053 9.43654 7.11607C9.26986 7.00161 9.13995 6.83893 9.06323 6.64859C8.98652 6.45825 8.96645 6.2488 9.00556 6.04674C9.04466 5.84468 9.1412 5.65907 9.28295 5.51339C9.4247 5.36771 9.60529 5.2685 9.80191 5.22831C9.99852 5.18812 10.2023 5.20874 10.3875 5.28758C10.5727 5.36643 10.731 5.49994 10.8424 5.67124C10.9538 5.84254 11.0132 6.04394 11.0132 6.24996C11.0128 6.52609 10.9059 6.79079 10.7159 6.98604C10.5259 7.1813 10.2683 7.29119 9.99964 7.29163Z"
        fill="white"
        strokeWidth="0.1"
      ></path>
    </svg>
  </>
);
const ArrowIcon = ({ isFilterVisible }) => {
  return (
    <>
      <svg
        data-v-28ad6d4b=""
        className={`w-3.5 h-3.5 transition-transform duration-500 ${isFilterVisible ? "" : "rotate-180"
          }`}
        width="2"
        height="2"
        viewBox="0 0 14 14"
      >
        <g data-v-28ad6d4b="" id="chevron-down-outline">
          <path
            data-v-28ad6d4b=""
            id="Vector"
            d="M7.01568 10.5C6.68153 10.4999 6.3611 10.3772 6.12486 10.1589L1.08486 5.50174C0.964516 5.39434 0.868526 5.26586 0.802491 5.12382C0.736455 4.98177 0.701697 4.82899 0.700243 4.6744C0.698789 4.51981 0.730669 4.36649 0.794023 4.22341C0.857377 4.08032 0.950936 3.95033 1.06924 3.84101C1.18755 3.73169 1.32823 3.64524 1.48308 3.5867C1.63793 3.52816 1.80384 3.4987 1.97114 3.50004C2.13845 3.50139 2.30378 3.53351 2.45751 3.59452C2.61123 3.65554 2.75027 3.74424 2.8665 3.85544L7.01568 7.68942L11.1649 3.85544C11.4025 3.64336 11.7208 3.52601 12.0511 3.52866C12.3815 3.53131 12.6975 3.65376 12.9311 3.86962C13.1648 4.08549 13.2973 4.37751 13.3001 4.68278C13.303 4.98805 13.176 5.28215 12.9465 5.50174L7.9065 10.1589C7.67026 10.3772 7.34982 10.4999 7.01568 10.5Z"
            fill="currentColor"
          ></path>
        </g>
      </svg>{" "}
    </>
  );
};
