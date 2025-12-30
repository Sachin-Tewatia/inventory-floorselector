import {
  fetchMapLandmarks,
  fetchMapDistances,
  fetchMapDescriptions,
  fetchMapTitles,
  fetchMapFilters
} from "../../APIs";

// Static data fallbacks
import { landmark_description } from "../data/landmark-description";
import { distaces } from "../data/distance";
import { getMapFilters } from "../data/filters";

/**
 * Map Data Manager - Handles API calls with fallback to static data
 * Uses caching to avoid repeated API calls
 */
class MapDataManager {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.forceAPI = false; // Set to true to bypass static fallback
  }

  /**
   * Get cached data or fetch from API with fallback
   * @param {string} dataType - Type of data ('landmarks', 'distances', 'descriptions', 'filters')
   * @param {Function} staticFallback - Function to get static data as fallback
   * @returns {Promise<Object>} Data object with success status and data
   */
  async getData(dataType, staticFallback) {
    // Return cached data if available
    if (this.cache.has(dataType)) {
      return { success: true, data: this.cache.get(dataType), fromCache: true };
    }

    // Prevent multiple simultaneous requests for same data type
    if (this.loadingPromises.has(dataType)) {
      return this.loadingPromises.get(dataType);
    }

    const loadingPromise = this._fetchDataWithFallback(dataType, staticFallback);
    this.loadingPromises.set(dataType, loadingPromise);

    try {
      const result = await loadingPromise;
      return result;
    } finally {
      this.loadingPromises.delete(dataType);
    }
  }

  /**
   * Internal method to fetch data from API or fallback to static
   */
  async _fetchDataWithFallback(dataType, staticFallback) {
    try {
      let apiResult;

      // Call appropriate API function based on data type
      switch (dataType) {
        case 'landmarks':
          apiResult = await fetchMapLandmarks();
          break;
        case 'distances':
          apiResult = await fetchMapDistances();
          break;
        case 'descriptions':
          apiResult = await fetchMapDescriptions();
          break;
        case 'titles':
          apiResult = await fetchMapTitles();
          break;
        case 'filters':
          apiResult = await fetchMapFilters();
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }

      // If API call successful, cache and return the data
      if (apiResult.success && apiResult.data) {
        this.cache.set(dataType, apiResult.data);
        return {
          success: true,
          data: apiResult.data,
          fromAPI: true,
          fromCache: false
        };
      }

    } catch (error) {
      console.error(`Error fetching ${dataType} data:`, error);

      // Fallback to static data on error (unless force API mode is enabled)
      if (this.forceAPI) {
        throw new Error(`API call failed and force API mode is enabled. API Error: ${error.message}`);
      }

      const fallbackData = staticFallback();
      this.cache.set(dataType, fallbackData);
      return {
        success: true,
        data: fallbackData,
        fromAPI: false,
        fromCache: false,
        usedFallback: true,
        error: error.message
      };
    }
  }

  /**
   * Get landmarks data
   */
  async getLandmarks() {
    return this.getData('landmarks', () => landmark_description);
  }

  /**
   * Get distances data
   */
  async getDistances() {
    return this.getData('distances', () => distaces);
  }

  /**
   * Get descriptions data
   */
  async getDescriptions() {
    return this.getData('descriptions', () => landmark_description);
  }

  /**
   * Get titles data (map_element_id -> title mapping)
   */
  async getTitles() {
    return this.getData('titles', () => {
      // Static fallback: create a simple mapping from landmark_description keys
      const staticTitles = {};
      Object.keys(landmark_description).forEach(key => {
        // Convert snake_case to Title Case
        const title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        staticTitles[key] = title;
      });
      return staticTitles;
    });
  }

  /**
   * Get filters data
   */
  async getFilters(route, showAll) {
    return this.getData('filters', () => getMapFilters(route, showAll));
  }

  /**
   * Clear cache for specific data type or all data
   * @param {string} dataType - Optional, if provided clears only this data type
   */
  clearCache(dataType = null) {
    if (dataType) {
      this.cache.delete(dataType);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Force refresh data from API (bypass cache)
   */
  async refreshData(dataType = null) {
    if (dataType) {
      this.cache.delete(dataType);
      this.loadingPromises.delete(dataType);
    } else {
      this.cache.clear();
      this.loadingPromises.clear();
    }
  }

  /**
   * Enable/disable force API mode (bypass static fallback for debugging)
   */
  setForceAPI(enabled) {
    this.forceAPI = enabled;
    console.log(`🔧 Force API mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Test API connectivity for all endpoints
   */
  async testAPIConnectivity() {
    const { testMapAPIConnectivity } = await import("../../APIs");
    return await testMapAPIConnectivity();
  }
}

// Export singleton instance
export const mapDataManager = new MapDataManager();

// Make debugging functions available globally for console access
if (typeof window !== 'undefined') {
  window.mapDataManager = mapDataManager;
  window.testMapAPI = () => mapDataManager.testAPIConnectivity();
  window.forceAPI = (enabled = true) => mapDataManager.setForceAPI(enabled);
  window.refreshMapData = () => mapDataManager.refreshData();

  console.log(`
🔧 Map Data Manager Debug Functions Available:
• window.testMapAPI() - Test all API endpoints
• window.forceAPI(true/false) - Enable/disable force API mode
• window.refreshMapData() - Clear cache and refetch data
• window.mapDataManager - Access the data manager instance
  `);
}

export default mapDataManager;
