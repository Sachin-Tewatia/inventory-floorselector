import { createContext, useContext, useEffect, useRef, useState } from "react";
import { screen1PageMapFilters, PAGES } from "../Data";
import { fetchAndGetInventories, fetchUserFromToken } from "../APIs";
import { setInventoriesChangeCallback } from "../Data/inventories";
import { socketConnect, socketDisconnect } from "../socket";

export const AppContext = createContext();
let intervalId = null;
export const AppContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [activeMapFilterIds, setActiveMapFilterIds] = useState(["map-filter-landmarks"]);
  const [flatFilterPriceValues, setFlatFilterPriceValues] = useState([]); // price range
  const [flatFilterSizeValues, setFlatFilterSizeValues] = useState([]); // size range
  const [isSingleSelect, setIsSingleSelect] = useState(false);
  const [label , setLabel] = useState(null);
  const [showAll,setShowAll] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState(null);
  const [showRadius, setShowRadius] = useState(false);
  const [satelliteView, setSatelliteView] = useState(true);
  const [isFullScreen,setFullScreen] = useState(false);

  // Listen for fullscreen changes (e.g., when user presses Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullscreenElement ||
        document.msFullscreenElement
      );
      setFullScreen(isCurrentlyFullscreen);
    };

    // Listen to all fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  const [blackout, setBlackout] = useState(false);
  const [user, setUser] = useState(null);
  const [inventories, setInventories] = useState(null);
  const [inventoriesList, setInventoriesList] = useState([]);
  const [bookings, setBookings] = useState(null);
  const [users, setUsers] = useState(null);
  const [booknowVisible, setIsBookNowVisible] = useState(false);
  const [otpStatus, setOtpStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("exterior");
  const [inventoryRefreshTrigger, setInventoryRefreshTrigger] = useState(0);
  const socketConnectedRef = useRef(false);
  const refreshTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const [fetchedData, setFetchedData] = useState(false);


  const INVENTORY_UPDATE_INTERVAL = 1 * 60 * 1000; // 1 minute

 useEffect(() => {
   
    setInventoriesChangeCallback((newInventories) => {
    
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateRef.current;
      
      // Debounce rapid updates (less than 200ms apart for slow internet)
      if (timeSinceLastUpdate < 200) {
        console.log("🔄 AppContext: Skipping rapid inventory update");
        return;
      }
      
      lastUpdateRef.current = now;
      
      console.log("🔄 AppContext: Received inventory update from inventories.js");
      console.log("📊 AppContext: New inventories count:", newInventories.length);
      
      // Update inventories state
      setInventories([...newInventories]); // Create new array reference
      
      // Update trigger with timestamp for unique value
      setInventoryRefreshTrigger(now);
      
      console.log("✅ AppContext: React state updated with timestamp trigger");
     
    });
    console.log("✅ AppContext: Inventory change callback registered");
  }, []);
  
  // Function to refresh inventory data and update state
  const refreshInventories = async () => {
    console.log("🔄 AppContext: Refreshing inventory data");
    
    // Add retry mechanism for slow connections
    let retries = 3;
    let success = false;
    
    while (retries > 0 && !success) {
      try {
        success = await fetchAndGetInventories();
        if (success) {
          console.log("✅ AppContext: Inventory data refreshed successfully");
          break;
        } else {
          retries--;
          if (retries > 0) {
            console.log(`🔄 AppContext: Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
          }
        }
      } catch (error) {
        retries--;
        console.error("❌ AppContext: Error in refresh attempt:", error);
        if (retries > 0) {
          console.log(`🔄 AppContext: Retrying after error... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    if (!success) {
      console.log("❌ AppContext: Failed to refresh inventory data after all retries");
    }
    
    return success;
  };
  
  // Function to manually trigger socket callback (for testing)
  const triggerSocketCallback = async () => {
    console.log("🧪 AppContext: Manually triggering socket callback");
    try {
      await refreshInventories();
      console.log("✅ AppContext: Manual socket callback completed");
    } catch (error) {
      console.error("❌ AppContext: Manual socket callback failed:", error);
    }
  };
  
  // Socket connection management
  // useEffect(() => {
  
    
  //   if (!user) {
     
  //     // Disconnect socket when user logs out
  //     if (socketConnectedRef.current) {
  //       socketDisconnect();
  //       socketConnectedRef.current = false;
  //     }
  //     // Clear any pending refresh
  //     if (refreshTimeoutRef.current) {
  //       clearTimeout(refreshTimeoutRef.current);
  //       refreshTimeoutRef.current = null;
  //     }
  //     return;
  //   }
    
  //   // Connect socket when user logs in (only once)
  //   if (!socketConnectedRef.current) {
      
  //     socketConnectedRef.current = true;
  //     socketConnect(async () => {
        
  //       await refreshInventories();
        
  //     });
  //   } else {
  //     console.log("🔌 AppContext: Socket already connected or connecting");
  //   }
  // }, [user]);
  useEffect(() => {
  // Always connect (without roomId initially)
  // Room joining will be handled by SocketRoomManager component
  if (!socketConnectedRef.current) {
    socketConnectedRef.current = true;
    socketConnect(async () => {
      await refreshInventories();
    });
  }

  // optional: clean up on unmount
  return () => {
    if (socketConnectedRef.current) {
      socketDisconnect();
      socketConnectedRef.current = false;
    }
  };
}, []); // ✅ Only run once

  
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      // Only fetch data if we haven't fetched it yet
      if (!fetchedData) {
        const fetchedSuccess = await refreshInventories();
        if (fetchedSuccess) setFetchedData(true);
        else setUser(null);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    })();
  }, [user, fetchedData]);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      setLoading(true);
      const user = await fetchUserFromToken();
      console.log(user);
      setLoading(false);
      if (user) {
        console.log(user);
        setUser(user);
        return;
      }
      setUser(null);
    };
    
    fetchAndSetUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const notLoggedIn = !loading && !user;
  //===============================================

  return (
    <AppContext.Provider
      value={{
        inventoriesList,
        setInventoriesList,
        flatFilterPriceValues,
        flatFilterSizeValues,
        setFlatFilterPriceValues,
        setFlatFilterSizeValues,
        activeMapFilterIds,
        setActiveMapFilterIds,
        selectedLandmarkId,
        setSelectedLandmarkId,
        blackout,
        setBlackout,
        inventories,
        setInventories,
        bookings,
        setBookings,
        users,
        setUsers,
        notLoggedIn,
        fetchedData,
        user,
        setUser,
        booknowVisible,
        setIsBookNowVisible,
        otpStatus,
        setOtpStatus,
        selectedCategory,
        setSelectedCategory,
        showRadius,
        setShowRadius,
        isSingleSelect,
        setIsSingleSelect,
        label,
        setLabel,
        isDropdownOpen, 
        setIsDropdownOpen,
        satelliteView,
        setSatelliteView,
        showAll,
        setShowAll,
        inventoryRefreshTrigger,
        setInventoryRefreshTrigger,
        inventories,
        refreshInventories,
        triggerSocketCallback,
        isFullScreen,
        setFullScreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useLoading = () => {
  const { loading, setLoading } = useContext(AppContext);
  return { loading, setLoading };
};
