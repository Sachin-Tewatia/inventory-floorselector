import { io } from "socket.io-client";

const SocketBaseUrl= "https://api.floorselector.convrse.ai"
// const SocketBaseUrl= "http://localhost:8000"
export const PROJECT_ID = "salarpuria";

// Don't create socket immediately - wait for authentication
let socket = null;
let isConnecting = false;
let currentOnInventoryUpdated = null;
let currentRoomId = null; // Track current room ID
let keepAliveInterval = null; // Keepalive interval ID

export const socketConnect = (onInventoryUpdated, roomId = null) => {
  console.log("🔌 socketConnect: Function called", { roomId });
  
  try {
    // Prevent multiple connections
    if (isConnecting) {
      console.log("🔌 Socket connection already in progress, skipping...");
      return;
    }
    
    if (socket && socket.connected) {
      console.log("🔌 Socket already connected");
      
      // If roomId is provided, ensure we're in that room
      if (roomId) {
        // If roomId changed, leave old room and join new one
        if (roomId !== currentRoomId) {
          console.log(`🔄 Room changed: ${currentRoomId} -> ${roomId}`);
          if (currentRoomId) {
            socket.emit("leaveRoom", currentRoomId);
          }
          socket.emit("joinRoom", roomId);
          currentRoomId = roomId;
          console.log("🏠 Joined new room:", roomId);
        } else {
          // RoomId matches, but ensure we're still in the room (rejoin to be safe)
          console.log("🏠 Ensuring room membership:", roomId);
          socket.emit("joinRoom", roomId);
        }
      } else if (currentRoomId === null) {
        // No roomId provided and we're not in any room, join default room
        socket.emit("joinRoom", PROJECT_ID);
        currentRoomId = PROJECT_ID;
        console.log("🏠 Joined default room:", PROJECT_ID);
      }
      
      currentOnInventoryUpdated = onInventoryUpdated;
      return;
    }
    
    // Prevent multiple socket instances
    if (socket && !socket.connected) {
      console.log("🔌 Cleaning up existing disconnected socket...");
      socket.disconnect();
      socket = null;
    }
    
    // Get token from localStorage
    const token = localStorage.getItem("token");
    

    
    // if (!token) {
    //   console.log("🔑 No authentication token found, skipping socket connection");
    //   return;
    // }

    isConnecting = true;
    currentOnInventoryUpdated = onInventoryUpdated;
    currentRoomId = roomId;

    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect();
      socket = null;
    }

    // Create socket with current token
    socket = io(SocketBaseUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000, // Increased for slow connections
      reconnectionDelayMax: 10000, // Increased max delay
      transports: ["websocket", "polling"], // Fallback to polling
      auth: {
        token: token,
      },
      timeout: 30000, // Increased timeout for slow connections
      forceNew: true, // Force new connection
      upgrade: true, // Allow transport upgrade
    });

    if (socket) {
      console.log("🔌 Socket instance created, attempting connection...");
      
      socket.connect();

      socket.on("connect", () => {
        console.log("🔌 Socket connected successfully");
        
        isConnecting = false;
        
        // Try to get roomId from URL or sessionStorage if not provided
        let roomToJoin = roomId || currentRoomId;
        
        // Check URL and sessionStorage for roomId (for new tabs)
        if (!roomToJoin && typeof window !== 'undefined') {
          try {
            // Check URL params
            const urlParams = new URLSearchParams(window.location.search);
            const roomIdFromUrl = urlParams.get('roomId');
            
            if (roomIdFromUrl) {
              roomToJoin = roomIdFromUrl;
              console.log("🏠 Found roomId from URL:", roomIdFromUrl);
            } else {
              // Check sessionStorage as fallback
              const roomIdFromStorage = sessionStorage.getItem('roomId');
              if (roomIdFromStorage) {
                roomToJoin = roomIdFromStorage;
                console.log("🏠 Found roomId from sessionStorage:", roomIdFromStorage);
              }
            }
          } catch (e) {
            console.warn("⚠️ Error reading roomId from URL/storage:", e);
          }
        }
        
        // Join room if we have a roomId
        if (roomToJoin) {
          socket.emit("joinRoom", roomToJoin);
          currentRoomId = roomToJoin;
          console.log("🏠 Joined room on connect:", roomToJoin);
        } else {
          // Fallback to PROJECT_ID if no roomId
          socket.emit("joinRoom", PROJECT_ID);
          currentRoomId = PROJECT_ID;
          console.log("🏠 Joined default room:", PROJECT_ID);
        }
        
        // Start keepalive mechanism
        startKeepAlive();
        
        // Emit a custom event to notify that socket is ready
        // This helps components that are waiting for socket connection
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('socketConnected', { 
            detail: { roomId: currentRoomId } 
          }));
        }
      });
     
      socket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected, reason:", reason);
        isConnecting = false;
        currentRoomId = null;
        // Stop keepalive when disconnected
        stopKeepAlive();
      });

      socket.on("connect_error", (error) => {
        console.error("🔌 Socket connection error:", error);
        console.error("🔌 Error details:", {
          message: error.message,
          description: error.description,
          context: error.context,
          type: error.type
        });
        isConnecting = false;
      });

      socket.on("inventoryUpdate", async (data) => {
        console.log("Received inventory update:", data);
     
        
        if(data ){
          console.log("🔄 Updating inventory for units:", data);
       
          if(currentOnInventoryUpdated){
            try {
              console.log("Received inventory update:" , data);
              // Add debouncing to prevent rapid updates
              if (socket.inventoryUpdateTimeout) {
                clearTimeout(socket.inventoryUpdateTimeout);
              }
              
              socket.inventoryUpdateTimeout = setTimeout(async () => {
                await currentOnInventoryUpdated();
                console.log("✅ Inventory update callback executed successfully");
              }, 100); // 100ms debounce
              
            } catch (error) {
              console.error("❌ Error in inventory update callback:", error);
            }
          } else {
            console.warn("⚠️ No inventory update callback registered");
          }
        } else {
          console.warn("⚠️ Invalid inventory update data:", data);
        }
      });

      // Add more event listeners for debugging
      socket.on("error", (error) => {
        console.error("🔌 Socket error event:", error);
      });

      socket.on("reconnect", (attemptNumber) => {
        console.log("🔌 Socket reconnected after", attemptNumber, "attempts");
        // Rejoin room on reconnect
        const roomToRejoin = currentRoomId || roomId;
        if (roomToRejoin) {
          socket.emit("joinRoom", roomToRejoin);
          currentRoomId = roomToRejoin;
          console.log("🏠 Rejoined room on reconnect:", roomToRejoin);
        } else {
          // Fallback to default room
          socket.emit("joinRoom", PROJECT_ID);
          currentRoomId = PROJECT_ID;
          console.log("🏠 Rejoined default room on reconnect");
        }
        // Restart keepalive on reconnect
        startKeepAlive();
        
        // Emit a custom event to notify that socket reconnected
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('socketReconnected', { 
            detail: { roomId: currentRoomId } 
          }));
        }
      });

      socket.on("reconnect_attempt", (attemptNumber) => {
        console.log("🔌 Socket reconnection attempt:", attemptNumber);
      });

      socket.on("reconnect_error", (error) => {
        console.error("🔌 Socket reconnection error:", error);
      });

      socket.on("reconnect_failed", () => {
        console.error("🔌 Socket reconnection failed");
      });

      // Handle sync events (will be used by useSocketSync hook)
      socket.on("sync_event", (socketEvent) => {
        console.log("📨 Received sync_event:", socketEvent);
        // This will be handled by useSocketSync hook
      });

      // TODO : handle disconnect event
    }
  } catch(e) {
    console.error("❌ Failed to setup socket:", e);
    isConnecting = false;
  }
};

// Function to change room
export const socketChangeRoom = (newRoomId) => {
  if (!socket || !socket.connected) {
    console.warn("⚠️ Socket not connected, cannot change room");
    // If socket is not connected but we have a newRoomId, store it for when connection is established
    if (newRoomId) {
      currentRoomId = newRoomId;
      console.log("💾 Stored roomId for when socket connects:", newRoomId);
    }
    return false; // Return false to indicate failure
  }

  if (newRoomId === currentRoomId) {
    // Even if same room, rejoin to ensure membership (fixes sync issues)
    if (newRoomId) {
      socket.emit("joinRoom", newRoomId);
      console.log("🏠 Re-ensuring room membership:", newRoomId);
    }
    return true; // Return true to indicate success
  }

  // Leave current room
  if (currentRoomId) {
    socket.emit("leaveRoom", currentRoomId);
    console.log("👋 Left room:", currentRoomId);
  }

  // Join new room
  if (newRoomId) {
    socket.emit("joinRoom", newRoomId);
    currentRoomId = newRoomId;
    console.log("🏠 Joined room:", newRoomId);
  } else {
    currentRoomId = null;
  }
  
  return true; // Return true to indicate success
};

// Keepalive mechanism to prevent connection timeout
const startKeepAlive = () => {
  // Clear existing interval if any
  stopKeepAlive();
  
  // Send keepalive ping every 30 seconds (before typical 60s timeout)
  keepAliveInterval = setInterval(() => {
    if (socket && socket.connected) {
      // Socket.io has built-in ping/pong, but we can also emit a custom keepalive event
      // This ensures the connection stays active
      try {
        // Emit a lightweight keepalive event (server should handle this)
        // Note: Socket.io's built-in ping/pong also keeps connection alive
        socket.emit("keepalive", {
          timestamp: Date.now(),
          roomId: currentRoomId
        });
        // Only log occasionally to reduce console noise
        if (Math.random() < 0.1) { // Log ~10% of the time
          console.log("💓 Keepalive active");
        }
      } catch (error) {
        console.warn("⚠️ Keepalive error:", error);
      }
    } else {
      // Socket not connected, stop keepalive
      stopKeepAlive();
    }
  }, 30000); // Every 30 seconds
};

const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
};

// Function to disconnect socket
export const socketDisconnect = () => {
  if (socket) {
    console.log("🔌 Disconnecting socket...");
    
    // Stop keepalive
    stopKeepAlive();
    
    // Leave room before disconnecting
    if (currentRoomId) {
      socket.emit("leaveRoom", currentRoomId);
    }
    
    // Clear any pending inventory update timeout
    if (socket.inventoryUpdateTimeout) {
      clearTimeout(socket.inventoryUpdateTimeout);
      socket.inventoryUpdateTimeout = null;
    }
    socket.disconnect();
    socket = null;
    isConnecting = false;
    currentRoomId = null;
    currentOnInventoryUpdated = null;
    console.log("🔌 Socket disconnected and cleaned up");
  }
};

// Function to ensure room membership (useful for fixing sync issues)
export const ensureRoomMembership = (roomId) => {
  if (!socket || !socket.connected) {
    console.warn("⚠️ Socket not connected, cannot ensure room membership");
    return false;
  }
  
  if (roomId && roomId === currentRoomId) {
    // Rejoin to ensure we're still in the room
    socket.emit("joinRoom", roomId);
    console.log("🏠 Ensured room membership:", roomId);
    return true;
  }
  
  return false;
};

// Function to get current socket instance
export const getSocket = () => socket;

// Function to get current room ID
export const getCurrentRoomId = () => currentRoomId;

// Function to check socket connection status
export const isSocketConnected = () => {
  return socket && socket.connected;
};
