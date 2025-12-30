import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../Contexts/AppContext";
import { PAGES, UNIT_STATUS, USER_TYPES } from "../Data";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { getAllFloorsInTower } from "../Utility/inventories";
import { fetchAndGetInventories } from "../APIs";
import { COMBINED_TOWERS_MAP } from "../Utility/Constants";

// Custom sorting function for unit types
const parseUnitType = (unitType) => {
  // Extract bedroom count (B or BHK)
  const bedroomMatch = unitType.match(/(\d+)\s*(?:BHK|B(?!\w))/i);
  const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : 0;
  
  // Extract service room count (S) - handle both "1S" and "S" (which means 1)
  const serviceMatch = unitType.match(/(?:(\d+)\s*S|(?:\+|^|\s)S(?!\w))/i);
  const serviceRooms = serviceMatch ? (serviceMatch[1] ? parseInt(serviceMatch[1]) : 1) : 0;
  
  // Extract toilet count (T)
  const toiletMatch = unitType.match(/(\d+)\s*T/i);
  const toilets = toiletMatch ? parseInt(toiletMatch[1]) : 0;
  
  // Check if it's a duplex
  const isDuplex = /duplex/i.test(unitType);
  
  return {
    bedrooms,
    serviceRooms,
    toilets,
    isDuplex,
    original: unitType
  };
};

const sortUnitTypes = (unitTypes) => {
  return unitTypes.sort((a, b) => {
    const parsedA = parseUnitType(a);
    const parsedB = parseUnitType(b);
    
    // First sort by bedroom count
    if (parsedA.bedrooms !== parsedB.bedrooms) {
      return parsedA.bedrooms - parsedB.bedrooms;
    }
    
    // Then by service rooms
    if (parsedA.serviceRooms !== parsedB.serviceRooms) {
      return parsedA.serviceRooms - parsedB.serviceRooms;
    }
    
    // Then by toilets
    if (parsedA.toilets !== parsedB.toilets) {
      return parsedA.toilets - parsedB.toilets;
    }
    
    // Finally, duplex comes after regular units
    if (parsedA.isDuplex !== parsedB.isDuplex) {
      return parsedA.isDuplex ? 1 : -1;
    }
    
    // If all else is equal, sort alphabetically
    return parsedA.original.localeCompare(parsedB.original);
  });
};
export const useMapFilter = () => {
  const { activeMapFilterIds, setActiveMapFilterIds } = useContext(AppContext);

  const isFilterActive = (id) => activeMapFilterIds.includes(id);

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
  const { blackout, setBlackout } = useContext(AppContext);

  return {
    blackout,
    setBlackout,
  };
};

export const useInventories = () => {
  const { inventories, setInventories, inventoriesList, setInventoriesList } =
    useContext(AppContext);

  const getShopById = (id) => {
    return inventories.find((shop) => shop.id == id);
  };

  const updateInventory = (id, property, property_value) => {
    const db = getDatabase();
    set(ref(db, `inventories-list/${id}/${property}`), property_value);
  };

  const fetchInventories = async (setLoading = () => {}) => {
    const fetched = await fetchAndGetInventories(setInventories);

    if (fetched) setLoading(false);

    // setInventories([{ id: 1, name: "test" }])
    // setLoading(true);
    // const dbRef = ref(getDatabase());
    // get(child(dbRef, `inventories-list`))
    //   .then((snapshot) => {
    //     if (snapshot.exists()) setInventories(snapshot.val());
    //     else
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //
    //     setLoading(false);
    //   });
  };

  useEffect(() => {
    if (inventories && inventories.length > 0) setInventoriesList(inventories);
  }, [inventories]);

  const getAllUnitsInFloor = (towerName, floor) => {
    if (!inventories) {
      return;
    }

    return inventories.filter((unit)=>unit["tower"]===towerName).filter((unit) => (unit["floor"]) ==(floor))
      .sort((a, b) => a["unit_number"] - b["unit_number"]);
  };

  const getMinMaxTotalCostInTower = (towerName) => {
    const units = getAllUnitsInTower(towerName);
    const totalCosts = units.map((unit) => unit["TotalCost"]);
    const minTotalCost = Math.min(...totalCosts);
    const maxTotalCost = Math.max(...totalCosts);
    return [minTotalCost, maxTotalCost];
  };

  const getMinMaxTotalCostInFloor = (towerName, unit_number) => {
    const units = getAllUnitsInFloor(towerName, unit_number);
    const totalCosts = units.map((unit) => unit["TotalCost"]);
    const minTotalCost = Math.min(...totalCosts);
    const maxTotalCost = Math.max(...totalCosts);
    return [minTotalCost, maxTotalCost];
  };

  const getMinMaxSBUInTower = (towerName) => {
    const units = getAllUnitsInTower(towerName);
    const sbus = units.map((unit) => unit["area"]);
    const minSBU = Math.min(...sbus);
    const maxSBU = Math.max(...sbus);
    return [minSBU - 10, maxSBU + 10];
  };

  const getMinMaxSBUInCombinedTowers = (combinedTower) => {
    const units = [];
    const towers = COMBINED_TOWERS_MAP[combinedTower];
    towers.forEach((tower) => {
      units.push(...getAllUnitsInTower(tower));
    });

    const sbus = units.map((unit) => unit["area"]);
    const minSBU = Math.min(...sbus);
    const maxSBU = Math.max(...sbus);
    return [minSBU - 10, maxSBU + 10];
  };

  const getMinMaxSBUInFloor = (towerName, floor) => {
    const units = getAllFlatsInFloor(towerName, floor);
    const sbus = units.map((unit) => unit["area"]);
    const minSBU = Math.min(...sbus);
    const maxSBU = Math.max(...sbus);
    return [minSBU, maxSBU];
  };

  const getAllAvailableUnitsInFloor = (towerName, unit_number) => {
    return getAllUnitsInFloor(towerName, unit_number).filter(
      (flat) => flat["status"] === UNIT_STATUS.AVAILABLE
    );
  };

  const getAllUnitStatusInFloor = (towerName, unit_number) =>
    getAllUnitsInFloor(towerName, unit_number).map((flat) => flat["status"]);

  const getAllAvailableUnitsInTower = (towerName) =>
    getAllUnitsInTower(towerName).filter(
      (flat) => flat["status"] === UNIT_STATUS.AVAILABLE
    );

  const getAllAvailableUnitsInCombinedTowers = (combinedTower) => {
    const units = [];
    const towers = COMBINED_TOWERS_MAP[combinedTower];
    towers.forEach((tower) =>
      units.push(...getAllAvailableUnitsInTower(tower))
    );
    return units;
  };

  const getAllBookedUnitsInTower = (towerName) =>
    getAllUnitsInTower(towerName).filter(
      (flat) => flat["status"] === UNIT_STATUS.BOOKED
    );

  const getAllBookedUnitsInCombinedTowers = (combinedTower) => {
    const units = [];
    const towers = COMBINED_TOWERS_MAP[combinedTower];
    towers.forEach((tower) => units.push(...getAllBookedUnitsInTower(tower)));
    return units;
  };

  // returns list of all flats in tower
  const getAllUnitsInTower = (towerName) =>
    inventoriesList.filter((inventory) => inventory["tower"] === towerName);

  const getAllUnitsInCombinedTowers = (combinedTower) => {
    const units = [];
    const towers = COMBINED_TOWERS_MAP[combinedTower];
    towers.forEach((tower) => units.push(...getAllUnitsInTower(tower)));
    return units;
  };

  const getAllFloorsInTower = (towerName) => [
    ...new Set(getAllUnitsInTower(towerName).map((flat) => flat["floor"])),
  ];

  const getAllUnitTypesInTower = (towerName) => {
    const uniqueUnitTypes = [
      ...new Set(getAllUnitsInTower(towerName).map((unit) => unit["unit_type"]))
    ];
    return sortUnitTypes(uniqueUnitTypes);
  };

  const getAllUnitTypesInFloor = (towerName, floor) => {
    const uniqueUnitTypes = [
      ...new Set(getAllUnitsInFloor(towerName, floor).map((unit) => unit["unit_type"]))
    ];
    return sortUnitTypes(uniqueUnitTypes);
  };

  const getUnitTypeBYId = (id) => {
    const unit = getUnitById(id);
    if (!unit) {
      return;
    }
    return unit["unit_type"];
  };
  const getAllUnitTypesInCombinedTowers = (combinedTower) => {
    const units = [];
    const towers = COMBINED_TOWERS_MAP[combinedTower];
    towers.forEach((tower) => units.push(...getAllUnitTypesInTower(tower)));
    const uniqueUnitTypes = [...new Set(units)];
    return sortUnitTypes(uniqueUnitTypes);
  };

  // const getAllFlatsInFloor = (towerName, floor) =>
    // inventories
    //   .filter((inventory) => parseInt(inventory["floor"]) === parseInt(floor))
    //   .sort((a, b) => a["unit_number"] - b["unit_number"]);
  const getAllFlatsInFloor = (towerName, floor) =>
    getAllUnitsInTower(towerName)
      .filter((inventory) => inventory["tower"] === towerName)
      .filter((inventory) => (inventory["floor"]) ==(floor))
      .sort((a, b) => a["unit_number"] - b["unit_number"]);

  const getUnitById = (id) => {
    return inventoriesList.find((unit) => unit.id === id);
  };

  return {
    inventories,
    setInventories,
    inventoriesList,
    getShopById,
    fetchInventories,
    updateInventory,
    getAllFloorsInTower,
    getAllUnitsInTower,
    getAllUnitsInCombinedTowers,
    getAllAvailableUnitsInCombinedTowers,
    getAllBookedUnitsInCombinedTowers,
    getAllUnitTypesInCombinedTowers,
    getMinMaxSBUInCombinedTowers,
    getAllUnitsInFloor,
    getAllAvailableUnitsInFloor,
    getAllAvailableUnitsInTower,
    getAllBookedUnitsInTower,
    getAllFlatsInFloor,
    getMinMaxTotalCostInFloor,
    getMinMaxSBUInFloor,
    getAllUnitTypesInTower,
    getAllUnitStatusInFloor,
    getMinMaxSBUInTower,
    getMinMaxTotalCostInTower,
    getAllUnitTypesInFloor,
    getUnitTypeBYId,
    getUnitById,
    sortUnitTypes, // Export the sorting function for use elsewhere
  };
};

export const useAuth = () => {
  const { user, setUser } = useContext(AppContext);

  return { user, setUser };
};
