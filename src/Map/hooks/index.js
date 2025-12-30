import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Contexts/AppContext";
import { useLocation } from "react-router-dom";
import { getMapFilters } from "../data/filters";

export const useMapFilter = () => {
  const { activeMapFilterIds, setActiveMapFilterIds } = useContext(AppContext);
  
  const location = useLocation();
  const currentRoute = location.pathname;

  const isFilterActive = (id) => activeMapFilterIds.includes(id);

  // Ensure filter options remain consistent when routes change
  useEffect(() => {
    // Get available filters for the current route
    const availableFilters = getMapFilters(currentRoute).map(filter => filter.id);
    
    // Filter out any active filters that aren't available in the current route
    const validFilters = activeMapFilterIds.filter(id => availableFilters.includes(id));
    
    // If we have filters that aren't valid for this route, update the state
    if (validFilters.length !== activeMapFilterIds.length) {
      setActiveMapFilterIds(validFilters);
    }
  }, [currentRoute]);

  return {
    activeMapFilterIds,
    setActiveMapFilterIds,
    isFilterActive,
  };
};

export const useLandmark = () => {
  // used to select a landmark from landing page
  const { selectedLandmarkId, setSelectedLandmarkId } = useContext(AppContext);
  const { activeMapFilterIds } = useMapFilter();
  useEffect(() => {
    if (!activeMapFilterIds.includes("map-filter-landmarks")) {
      setSelectedLandmarkId(null);
    }
  }, [activeMapFilterIds]);

  return {
    selectedLandmarkId,
    setSelectedLandmarkId,
  };
};

export const useBlackout = () => {

  // show blackout if either landmark  or radius is active

  const { selectedLandmarkId, showRadius } = useContext(AppContext);

  const blackout = selectedLandmarkId || showRadius;

  return {
    blackout,
  };
};


