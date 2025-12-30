import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mapDataManager } from '../services/mapDataManager';

const TenSVG = {
  "Education": [
    "Derozio Memorial College",
    "Narayana School",
    "DPS Megacity",
    "DPS Newtown",
    "Institute of Engineering and Management",
    "Techno India University"
  ],
  "Hospitals": [
    "Charnock Hospital",
    "Tata Medical Centre"
  ],
  "Public Transit": [
    "Ultadanga Railway Station",
    "Ultadanga",
    "City Centre 2 Metro Station",
    "Mangal Deep Metro Station",
    "Biswa Bangla Sarani"
  ],
  "Landmarks": [
    "NSCB International Airport",
    "City Center II",
    "Ozen Mansion",
    "Eco Tourism Park",
    "Biswa Bangla Convention Centre"
  ],
  "Malls": [
    "Spencers Chinar Park",
    "Westside",
    "Big Basket Supermarket",
    "Rajarhat Chowmatha Market",
    "Axis Mall"
  ],
  "Foods": [
    "Halidrams Food Court",
    "Biswa Bangla Restaurant",
   
  ],
  "Hotel & Park": [
    "Central Park",
    "Nicco Park",
    "Novotel",
    "The Westin"
  ],
  "Entertainment": [
    // "School",
    // "College",
    // "University"
  ]
};

const FiveSVG = {
  "Education": [
    "Derozio Memorial College",
  ],
  "Hospitals": [
    "Charnock Hospital",
  ],
  "Public Transit": [
    "City Centre 2 Metro Station",
    "Mangal Deep Metro Station",
  ],
  "Landmarks": [
    "NSCB International Airport",
    "City Center II",
    "Ozen Mansion",
    "Eco Tourism Park",
  ],
  "Malls": [
    "Spencers Chinar Park",
    "Westside",
  ],
  "Foods": [
    "Halidrams Food Court",   
  ],
  "Hotel & Park": [
    "The Westin"
  ],
  "Entertainment": [
    // "School",
    // "College",
    // "University"
  ]
};

const TwentySVG = {
  "Education": [
    "Derozio Memorial College - 1.2 km",
    "BP Poddar Institute of Management & Technology - 3 km",
    "DPS New Town - 6.7 km",
    "Narayana School - 7.1 km",
    "DPS Megacity - 8.1 km",
    "The Newtown School - 8.1 km",
    "St. Xavier's University - 9.5 km",
    "University of Engineering & Management - 10.4 km",
  ],
  "Healthcare": [
    "Charnock Hospital - 3.4 km",
    "Bhagirathi Neotia Woman & Child Care Centre - 7.1 km",
    "OHIO Hospital & Medical Centre - 7.4 km",
    "Tata Medical Centre - 7.8 km",
  ],
  "Public Transit": [
    "Ultadanga Railway Station",
    "Kestopur Flyover",
    "Rajarhar Chinar Park Crossing",
    "City Centre 2 Metro Station",
    "Aakankha Crossing",
    "Mangal Deep Metro Station",
    "Newtown Flyover",
    "Technopolis Flyover",
    "Wipro Flyover",

  ],
  "Landmarks": [
    "Silver Oak Estate - 1 km",
    "City Center II - 1.2 km",
    "Eco Park - 4.2 km",
    "NSCB International Airport - 5.5 km",
    "Biswa Bangla Gate - 8.3 km",
    "Salt Lake Stadium - 13.8 km",
  ],
  "Shopping": [
    "City Center II - 1.2 km",
    "West Side Mall - 1.4 km",
    "Spencer's Chinar Park - 2.2 km",
    "Central Mall - 8.3 km",
    "Axis Mall - 9.3 km",
    "Downtown Mall - 10.4 km",
  ],
  "Foods": [
    "Halidrams Food Court", 
    "Biswa Bangla Restaurant",  
  ],
  "Hotels": [
    "Ozen Mansion Kolkata - 2.3 km",
    "The Westin Kolkata - 5.4 km",
    "Taj Taal Kutir - 6 km",
    "Novotel Kolkata - 9.1 km",
  ],
  "Entertainment": [
    
  ]
};

const LegendFilter = ({ label }) => {
  const location = useLocation();
  const [apiData, setApiData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const isFiveKmRoute = location.pathname === '/fivekm' || location.pathname === '/fivekmSatellite';
  const isTwentyKmRoute = location.pathname === '/twentykm' || location.pathname === '/twentykmSatellite';
  
  // Fetch API data using the all map data endpoint to get priority-sorted data
  useEffect(() => {
    const fetchLegendData = async () => {
      try {
        setIsLoading(true);
        
        // Get all data from the API with priority information
        const { getAllPublicMapData } = await import('../../APIs/mapAdmin');
        const allData = await getAllPublicMapData();

        if (allData) {
          const legendData = {};
          
          // Map backend categories to display categories
          const categoryDisplayMapping = {
            'landmarks': 'Landmarks',
            'hotels': 'Hotels',
            'schools': 'Education',
            'hospitals': 'Healthcare',
            'malls': 'Shopping'
            // Metros excluded from legend filter
          };

          // Process each category
          Object.entries(categoryDisplayMapping).forEach(([backendCategory, displayCategory]) => {
            const items = allData[backendCategory];
            
            if (Array.isArray(items) && items.length > 0) {
              // Backend already sorts by priority, but ensure it's sorted
              const sortedItems = [...items].sort((a, b) => {
                const priorityA = a.priority || 999;
                const priorityB = b.priority || 999;
                return priorityA - priorityB;
              });
              
              // Format items for display
              legendData[displayCategory] = sortedItems.map(item => {
                const distanceText = item.distance ? ` - ${item.distance} km` : '';
                return `${item.title}${distanceText}`;
              });
            }
          });

          setApiData(legendData);
        }
      } catch (error) {
        console.error('Failed to fetch legend data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLegendData();
  }, []);

  // Use API data if available, otherwise fallback to static data
  const data = Object.keys(apiData).length > 0 ? apiData : (isFiveKmRoute ? FiveSVG : isTwentyKmRoute ? TwentySVG : TenSVG);
    
  return (
    <div className="overlay-can-hide absolute top-[3%] right-2 lg:top-[30%] md:top-[3%] md:right-2">
        <div className="space-y-1 backdrop-blur-md bg-black/50 rounded-lg p-2 shadow-lg w-max max-w-[60vw] md:p-4 md:max-w-none">
    <div className="text-white text-center text-sm md:text-base">
      <span className="font-medium">{label}</span>
    </div>
    {isLoading ? (
      <div className="text-white text-center text-xs">Loading...</div>
    ) : (
      <ul className="text-white">
        {data[label]?.map((item, index) => (
          <li
            key={index}
            className="flex flex-wrap gap-1 items-center py-1 hover:bg-white/10 rounded-md transition-colors duration-200 text-[11px] md:text-[11px] lg:text-[15px] md:whitespace-nowrap md:flex-nowrap"
          >
            <span className="font-normal">{index + 1}.</span>
            {item}
          </li>
        ))}
      </ul>
    )}
  </div>
    </div>
  );
};

export default LegendFilter;

