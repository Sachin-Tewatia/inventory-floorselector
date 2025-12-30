
import React, { useEffect, useState, useCallback } from "react";
import { useLandmark } from "../hooks";
import { mapDataManager } from "../services/mapDataManager";
import { enhancedDataLookup } from "../data/landmark-mapping";

const LocationInfo = React.memo(() => {
  const [imageUrls, setImageUrls] = useState({});
  const [mapData, setMapData] = useState({
    distances: {},
    descriptions: {},
    titles: {},
    fromAPI: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedLandmarkId } = useLandmark();

  // Fetch map data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch distances, descriptions, and titles data
        const [distancesResult, descriptionsResult, titlesResult] = await Promise.all([
          mapDataManager.getDistances(),
          mapDataManager.getDescriptions(),
          mapDataManager.getTitles()
        ]);

        setMapData({
          distances: distancesResult.data || {},
          descriptions: descriptionsResult.data || {},
          titles: titlesResult.data || {},
          fromAPI: (distancesResult.fromAPI || descriptionsResult.fromAPI || titlesResult.fromAPI) || false
        });

      } catch (err) {
        console.error('Failed to fetch map data:', err);
        setError('Failed to load map data');

        // Fallback to static data if data manager fails
        try {
          const distancesResult = await mapDataManager.getDistances();
          const descriptionsResult = await mapDataManager.getDescriptions();
          const titlesResult = await mapDataManager.getTitles();

          setMapData({
            distances: distancesResult.data || {},
            descriptions: descriptionsResult.data || {},
            titles: titlesResult.data || {},
            fromAPI: (distancesResult.fromAPI || descriptionsResult.fromAPI || titlesResult.fromAPI) || false
          });
        } catch (fallbackErr) {
          console.error('Static data fallback also failed:', fallbackErr);
          setError('Unable to load map data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Move landmarkIds outside component or use useMemo to prevent recreation
  const fetchImages = useCallback(async () => {
    const landmarkIds = [
      "eco_park",
      "silveroak_estate",
      "city_center_ii",
      "salt_lake_stadium",
      "nscb_international_airport",
      "biswa_bangla_gate",
    ];
    
    let urls = {};
    for (const landmarkId of landmarkIds) {
      try {
        const imageUrl = `/landmarks/${landmarkId}.webp`;
        const res = await fetch(imageUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const blob = await res.blob();
        urls[landmarkId] = URL.createObjectURL(blob);
      } catch (error) {
        console.error(`Failed to fetch image for ${landmarkId}:`, error);
      }
    }
    setImageUrls(urls);
  }, []); // Empty dependency array since landmarkIds is now inside

  useEffect(() => {
    fetchImages();
    // Cleanup URLs on unmount only
    return () => {
      Object.values(imageUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fetchImages]); // Removed imageUrls from dependencies to prevent loop

  if (!selectedLandmarkId || isLoading) return null;

  if (error) {
    console.warn('LocationInfo error:', error);
    // Still render with static fallback if available
  }

  // Lookup data by map_element_id
  const distanceForSelected = enhancedDataLookup(mapData.distances, selectedLandmarkId);
  const descriptionForSelected = enhancedDataLookup(mapData.descriptions, selectedLandmarkId);
  const titleForSelected = enhancedDataLookup(mapData.titles, selectedLandmarkId) || selectedLandmarkId;


  const selectedLandmarkImageName = selectedLandmarkId
    .toLowerCase()
    .replace(/\s+/g, "_");
  
    return (
    <div
      className="overlay-can-hide absolute z-30 flex flex-row bg-[rgba(0,0,0,0.5)] backdrop-blur-sm text-slate-200 rounded-md
                 top-8 right-4 md:top-8 md:right-2 lg:top-8 lg:right-2
                 w-[38vw] md:w-80 lg:w-[35vw]"
    >
      {imageUrls[selectedLandmarkImageName] && (
        <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 lg:w-[12vw] lg:h-auto">
          <img
            className="w-full h-full object-cover rounded-l-md" 
            src={imageUrls[selectedLandmarkImageName]}
            alt={selectedLandmarkId}
            onError={(e) => {
              e.target.onerror = null; 
              // e.target.src = `https://placehold.co/100x100/CCCCCC/000000?text=No+Image`;
            }}
          />
        </div>
      )}
      <div className="p-2 md:p-3 flex-grow min-w-0">
        <div className="flex justify-between">
          <div className="text-xs font-semibold mb-1
                          md:text-sm md:mb-2
                          lg:text-lg lg:mb-2
                          whitespace-nowrap overflow-hidden text-ellipsis">
             <u>{titleForSelected} - {distanceForSelected || 'N/A'} km </u>
          </div>
        </div>
        <div className="text-[10px] md:text-[10px] lg:text-sm text-ellipsis sm:line-clamp-5 md:line-clamp-5">
          {descriptionForSelected || 'No description available'}
        </div>
      </div>
    </div>
  );
});

export default LocationInfo;
