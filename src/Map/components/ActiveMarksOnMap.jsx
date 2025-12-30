import React, { useContext, useEffect, useState } from "react";
import { useMapFilter } from "../hooks";
import { getMapFilters } from "../data/filters";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../Contexts/AppContext";

export default function ActiveMarksOnMap({ filterIdsToShow = [] }) {
  const { isFilterActive } = useMapFilter();
  const { showAll } = useContext(AppContext);
  const location = useLocation();
  const [filters, setFilters] = useState([]);
  
  // Get the current route
  const currentRoute = location.pathname;

  // Update filters when route changes or showAll changes
  useEffect(() => {
    // Get filters for the current route with showAll parameter
    const currentFilters = getMapFilters(currentRoute, showAll).filter((filter) =>
      filterIdsToShow.includes(filter.id)
    );
    setFilters(currentFilters);
  }, [currentRoute, filterIdsToShow, showAll]);

  return filters.map(
    (filter) =>
      filter.landmarks &&
      isFilterActive(filter.id) && (
        <g key={filter.id} className="overlay-can-hide">
          {filter.landmarks}
        </g>
      )
  );
}
