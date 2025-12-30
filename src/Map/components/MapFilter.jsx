
import React, { useContext, useEffect, useMemo, useState } from "react";
import { mapDataManager } from "../services/mapDataManager";
import { useLandmark, useMapFilter } from "../hooks";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { SquareCheckBig, Square } from "lucide-react";
import { AppContext } from "../../Contexts/AppContext";
const isMobile = window.innerWidth <= 767;


const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #000;
  width: 145px;
  height: 24px;
  cursor: pointer;

  input[type="checkbox"] {
    display: none;
  }

  .checkbox-icon {
    width: 16px;
    height: 16px;
    margin-right: 12px;
    color: #000;
  }

  input[type="checkbox"]:checked + .checkbox-icon {
    display: none;
  }

  input[type="checkbox"]:not(:checked) + .checkbox-icon {
    display: block;
  }

  input[type="checkbox"]:checked ~ .checkbox-checked-icon {
    display: block;
  }

  .checkbox-checked-icon {
    display: none;
    width: 16px;
    height: 16px;
    margin-right: 12px;
    color: #000;
  }

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100%;
    position: relative;
    z-index: 0;
    .icon {
      display: flex;
      margin-left: auto;
      align-items: center;
    }
  }

  &:hover {
    label {
      color: #333;
    }
  }

  &.sub-filter {
    margin-left: 10px;
  }

  &.sub-drop-filter {
    margin-left: 30px;
  }

  &.hotel { input:checked ~ label .icon svg { path:first-child { fill: #E84AE1 !important; opacity: 60%; } path:nth-child(2), path:nth-child(3) { fill: white !important; } } }
  &.retail { input:checked ~ label .icon svg { path:first-child { fill: #2062A8 !important; opacity: 60%; } path:last-child { fill: white !important; } } }
  &.education { input:checked ~ label .icon svg { path:first-child { fill: #078C88 !important; opacity: 60%; } path:last-child { fill: white !important; stroke: white !important; } } }
  &.hospital { input:checked ~ label .icon svg { path:first-child { fill: red !important; opacity: 60%; } path { fill: white !important; } } }
  &.restaurants { input:checked ~ label .icon svg { circle { fill: #E94800 !important; opacity: 60%; } path { fill: white !important; } } }
  &.metro { input:checked ~ label .icon svg g { path:first-child { fill: red !important; opacity: 60%; } path { stroke: white !important; } } }
  &.office { input:checked ~ label .icon svg g { path:first-child { fill: #00B2DD !important; opacity: 60%; } path { fill: white !important; } } }
  &.landmark { input:checked ~ label .icon svg { path:first-child { fill: red !important; opacity: 60%; } path { fill: #F4F4F4 !important; } } }
  &.malls { input:checked ~ label .icon svg { path:first-child { fill: blue !important; } path { fill: #F4F4F4 !important; } } }


  /* Medium screens: 768px to 1023px */
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 100px;
    height: 18px;

    .checkbox-icon, .checkbox-checked-icon {
      width: 11px;
      height: 11px;
      margin-right: 5px;
    }

    label {
      font-size: 0.8rem; /* Equivalent to Tailwind's text-sm */
    }
  }
  /* small screens: 481 to 768 */
  @media screen and (min-width: 481px) and (max-width: 768px) {
    width: 95px;
    height: 17px;

    .checkbox-icon, .checkbox-checked-icon {
      width: 11px;
      height: 11px;
      margin-right: 5px;
    }

    label {
      font-size: 0.8rem; /* Equivalent to Tailwind's text-sm */
    }
  }
`;


// Existing styled-component for IconWrapper (used for desktop, unchanged)
const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-left: auto;

  ${(props) => props.isChecked && props.className === 'hotel' && `
    svg {
      path:first-child { fill: rgb(141, 37, 124) !important; opacity: 60%; }
      path:nth-child(2), path:nth-child(3) { fill: white !important; }
    }
  `}
  ${(props) => props.isChecked && props.className === 'retail' && `
    svg {
      path:first-child { fill: #2062A8 !important; opacity: 60%; }
      path:not(:first-child) { fill: white !important; }
    }
  `}
  ${(props) => props.isChecked && props.className === 'education' && `
    svg {
      path:first-child { fill: #078C88 !important; opacity: 60%; }
      path:last-child { fill: white !important; stroke: white !important; }
    }
  `}
  ${(props) => props.isChecked && props.className === 'hospital' && `
    svg {
      path:first-child { fill: red !important; opacity: 60%; }
      path { fill: white !important; }
    }
  `}
  ${(props) => props.isChecked && props.className === 'restaurants' && `
    svg {
      circle { fill: #E94800 !important; opacity: 60%; }
      path { fill: white !important; }
    }
  `}
  ${(props) => props.isChecked && props.className === 'metro' && `
    svg g {
      path:first-child { fill: red !important; opacity: 60%; }
      path { stroke: white !important; }
    }
  `}
  ${(props) => props.isChecked && props.className === 'office' && `
    svg g {
      path:first-child { fill: #00B2DD !important; opacity: 60%; }
      path { fill: white !important; }
    }
  `}
  ${(props) => props.isChecked && props.className === 'landmark' && `
    svg {
          path:first-child { 
      fill: black !important; }
          }
        }
  `}
  ${(props) => props.isChecked && props.className === 'malls' && `
    svg {
      path:first-child { fill: blue !important; }
      path { fill: #F4F4F4 !important; }
    }
  `}


  
  /* Medium screens: 768px to 1023px */
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 14px;
    height: 14px;

    
  }
  /* small screens: 481 to 768 */
  @media screen and (min-width: 481px) and (max-width: 768px) {
    width: 14px;
    height: 14px;
  }


`;


function MapFilters({ label, setLabel }) {
   const { selectedLandmarkId, setSelectedLandmarkId } = useLandmark();
  const { setActiveMapFilterIds, isFilterActive, activeMapFilterIds } = useMapFilter();
  const location = useLocation();
  const { isSingleSelect, setIsSingleSelect,showAll,setShowAll } = useContext(AppContext);

  const currentRoute = location.pathname;
  const [mapFilters, setMapFilters] = useState([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // Fetch filters data on mount and route change
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setIsLoadingFilters(true);
        const result = await mapDataManager.getFilters(currentRoute, showAll);
        setMapFilters(result.data || []);
      } catch (error) {
        console.error('Failed to fetch map filters:', error);
        // Fallback to static data if API fails
        try {
          const { getMapFilters } = await import("../data/filters");
          const staticFilters = getMapFilters(currentRoute, showAll);
          setMapFilters(staticFilters);
        } catch (fallbackError) {
          console.error('Static filters fallback failed:', fallbackError);
          setMapFilters([]);
        }
      } finally {
        setIsLoadingFilters(false);
      }
    };

    fetchFilters();
  }, [currentRoute, showAll]);

  const mapFiltersLength = mapFilters.length;
  const isAllFiltersActive = () =>
  activeMapFilterIds.length === mapFiltersLength;
const visibleFilters = mapFilters.filter((filter) => filter.id !== "");


  const onShowAllClicked = () => {
    const allFiltersSelected = activeMapFilterIds.length === visibleFilters.length;

    if (allFiltersSelected) {
      setShowAll(false);
      setActiveMapFilterIds([]);
    } else {
      setShowAll(true);
      setActiveMapFilterIds(visibleFilters.map((filter) => filter.id));
    }

    setIsSingleSelect(false);
    setLabel(null);
  };

useEffect(() => {
    // Set showAll based on activeMapFilterIds.length
    setShowAll(activeMapFilterIds.length > 1);
  }, [activeMapFilterIds, setShowAll]);

useEffect(() => {
  if (activeMapFilterIds.length === 0) {
    setActiveMapFilterIds(["map-filter-landmarks"]);
    // Don't set label automatically - only set when user enables "Show Label"
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentRoute]); // Only run when route changes, not when dependencies change

const handleFilterClick = (id) => {
  if (isSingleSelect) {
    setActiveMapFilterIds([id]);

    if (id === "map-filter-landmarks") {
      setLabel("Landmarks");
    } else {
      const selectedFilter = mapFilters.find((filter) => filter.id === id);
      if (selectedFilter) {
        setLabel(selectedFilter.title);
      }
    }
  } else {
    if (isFilterActive(id)) {
      if (id === "map-filter-landmarks" && selectedLandmarkId) {
        setSelectedLandmarkId(false);
      }
      if (isAllFiltersActive()) {
        setActiveMapFilterIds(
          mapFilters.map((filter) => filter.id).filter((_id) => _id !== id)
        );
      } else {
        setActiveMapFilterIds((old) => old.filter((_id) => _id !== id));
      }
    } else {
      setActiveMapFilterIds((old) => [...old, id]);
    }
    setLabel(null);
  }
};

if (label) setIsSingleSelect(true);
const toggleSingleSelect = () => {
  if (label) setIsSingleSelect(!isSingleSelect);
  if (!isSingleSelect) {
    if (isAllFiltersActive() || activeMapFilterIds.length === 0) {
      setActiveMapFilterIds(["map-filter-landmarks"]);
      setLabel("Landmarks");
    } else {
      let result = visibleFilters.find(
        (item) => item.id === activeMapFilterIds[activeMapFilterIds.length - 1]
      );
      if (result) {
        setActiveMapFilterIds([result.id]);
        setLabel(result.title);
      }
    }
  } else {
    setLabel(null);
  }
  return null; // placeholder, assuming JSX is added elsewhere
};

  // Show loading state while filters are being fetched
  if (isLoadingFilters) {
    return (
      <div className="filter-loading">
        <div>Loading filters...</div>
      </div>
    );
  }

  return (
    <>
            <div>
          <CheckboxWrapper className="show-all">
            <label htmlFor="show-all">
              <input
                type="checkbox"
                id="show-all"
                checked={isAllFiltersActive()}
                onChange={onShowAllClicked}
              />
              <Square className="checkbox-icon" />
              <SquareCheckBig className="checkbox-checked-icon" /> Show All
            </label>
          </CheckboxWrapper>
          <div className="button-group">
            {visibleFilters.map((filter) => (
              <CheckboxWrapper
                key={filter.id}
                className={`sub-filter ${filter.className}`}
              >
                <label htmlFor={`filter-${filter.id}`}>
                  <input
                    type="checkbox"
                    id={`filter-${filter.id}`}
                    checked={isFilterActive(filter.id)}
                    onChange={() => handleFilterClick(filter.id)}
                  />
                  <Square className="checkbox-icon" />
                  <SquareCheckBig className="checkbox-checked-icon" />
                  {filter.title}
                  <IconWrapper className={filter.className} isChecked={isFilterActive(filter.id)}>{filter.icon}</IconWrapper>
                </label>
              </CheckboxWrapper>
            ))}
          </div>
          <CheckboxWrapper style={{ marginTop: '5px' }}>
            <label htmlFor="single-select">
              <input
                type="checkbox"
                id="single-select"
                checked={isSingleSelect}
                onChange={toggleSingleSelect}
              />
              <Square className="checkbox-icon" />
              <SquareCheckBig className="checkbox-checked-icon" />
              Show Label
            </label>
          </CheckboxWrapper>
        </div>
      {/* )} */}
    </>
  );
}

export default MapFilters;