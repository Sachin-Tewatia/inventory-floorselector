import { io } from "socket.io-client";

const SocketBaseUrl= "https://api.floorselector.convrse.ai"
// const SocketBaseUrl= "http://localhost:8000"
export const PROJECT_ID = "salarpuria";

// Don't create socket immediately - wait for authentication
let socket = null;
let isConnecting = false;
let currentOnInventoryUpdated = null;
let currentRoomId = null; // Track current room ID

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
      
      // If roomId changed, leave old room and join new one
      if (roomId && roomId !== currentRoomId) {
        console.log(`🔄 Room changed: ${currentRoomId} -> ${roomId}`);
        if (currentRoomId) {
          socket.emit("leaveRoom", currentRoomId);
        }
        socket.emit("joinRoom", roomId);
        currentRoomId = roomId;
        console.log("🏠 Joined new room:", roomId);
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
        
        // Join room if roomId is provided
        if (roomId) {
          socket.emit("joinRoom", roomId);
          currentRoomId = roomId;
          console.log("🏠 Joined room:", roomId);
        } else {
          // Fallback to PROJECT_ID if no roomId
          socket.emit("joinRoom", PROJECT_ID);
          currentRoomId = PROJECT_ID;
          console.log("🏠 Joined default room:", PROJECT_ID);
        }
      });
     
      socket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected, reason:", reason);
        isConnecting = false;
        currentRoomId = null;
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
        if (currentRoomId) {
          socket.emit("joinRoom", currentRoomId);
          console.log("🏠 Rejoined room on reconnect:", currentRoomId);
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
    return;
  }

  if (newRoomId === currentRoomId) {
    console.log("🏠 Already in room:", newRoomId);
    return;
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
};

// Function to disconnect socket
export const socketDisconnect = () => {
  if (socket) {
    console.log("🔌 Disconnecting socket...");
    
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

// Function to get current socket instance
export const getSocket = () => socket;

// Function to get current room ID
export const getCurrentRoomId = () => currentRoomId;

// Function to check socket connection status
export const isSocketConnected = () => {
  return socket && socket.connected;
};
