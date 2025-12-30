/**
 * Enhanced Data Lookup for Map Elements
 * 
 * Backend provides map_element_id matching map click IDs:
 * - Map click: "eco_park"
 * - Backend: { map_element_id: "eco_park", title: "Eco Park", ... }
 * - Lookup: data["eco_park"] → Direct match!
 */

/**
 * Lookup data by map element ID with fallback strategies
 * @param {Object} dataObject - The data object to search in
 * @param {string} mapElementId - The map element ID (e.g., "eco_park")
 * @returns {any} - The found data or null
 */
export const enhancedDataLookup = (dataObject, mapElementId) => {
  if (!dataObject || !mapElementId) return null;

  // Direct lookup by map_element_id (primary method)
  if (dataObject[mapElementId]) {
    return dataObject[mapElementId];
  }

  // Fallback: Case-insensitive lookup
  const lowerMapId = mapElementId.toLowerCase();
  for (const [key, value] of Object.entries(dataObject)) {
    if (key.toLowerCase() === lowerMapId) {
      return value;
    }
  }

  console.warn(`❌ No data found for: ${mapElementId}`);
  return null;
};
