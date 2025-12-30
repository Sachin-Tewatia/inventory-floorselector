# WebSocket Room-Based Synchronization Implementation

## Overview

This document describes the implementation of real-time synchronization across multiple browsers using WebSockets with room-based isolation. Each browser session is identified by a unique `roomId` from the URL, allowing multiple screens to sync their state when they share the same `roomId`.

## Architecture

### 1. Room ID Management (`src/Hooks/useRoomId.js`)

- Extracts `roomId` from URL query parameters (`?roomId=abc123`)
- Auto-generates a unique `roomId` if none exists
- Provides functions to update or regenerate room IDs

**Usage:**
```javascript
const { roomId, updateRoomId, generateRoomId } = useRoomId();
```

### 2. Socket Connection (`src/socket.js`)

Enhanced socket connection to support dynamic room joining/leaving:

**Key Changes:**
- `socketConnect(onInventoryUpdated, roomId)` - Now accepts roomId parameter
- `socketChangeRoom(newRoomId)` - Switch to a different room
- `getCurrentRoomId()` - Get the current room ID
- Automatically rejoins room on reconnection

**Room Flow:**
1. Connect to WebSocket server
2. Join room using `socket.emit("joinRoom", roomId)`
3. All sync events are scoped to the room
4. Leave room on disconnect

### 3. Sync Event Service (`src/services/socketSync.js`)

Centralized service for managing sync events:

**Event Types:**
- `SYNC_EVENTS.NAVIGATION` - Page navigation
- `SYNC_EVENTS.FILTERS` - Filter changes
- `SYNC_EVENTS.UNIT_SELECTION` - Unit selection
- `SYNC_EVENTS.FLOOR_SELECTION` - Floor selection
- `SYNC_EVENTS.TOWER_SELECTION` - Tower selection
- `SYNC_EVENTS.FULLSCREEN` - Fullscreen state
- `SYNC_EVENTS.IMAGE_NAVIGATION` - Image carousel navigation
- `SYNC_EVENTS.OVERLAY_VISIBILITY` - Overlay visibility
- `SYNC_EVENTS.NAVIGATOR_STATE` - Navigator state

**Key Functions:**
- `emitSync(eventType, data, roomId)` - Emit sync event to room
- `emitSyncDebounced(eventType, data, roomId, delay)` - Emit with debouncing for rapid changes
- `setReceivingSync(value)` - Prevent circular updates
- `getReceivingSync()` - Check if currently receiving sync

### 4. Sync Listener Hook (`src/Hooks/useSocketSync.js`)

React hook that listens for sync events and updates local state:

**Features:**
- Listens for all sync event types
- Only processes events from the same room
- Prevents circular updates using receiving flag
- Automatically handles navigation, filters, and state changes

**Usage:**
```javascript
// Add to any page component
useSocketSync();
```

### 5. AppContext Integration (`src/Contexts/AppContext.js`)

**Changes:**
- Uses `useRoomId()` hook to get room ID from URL
- Passes `roomId` to `socketConnect()`
- Changes room when `roomId` changes in URL
- Waits for `roomId` before connecting socket

### 6. Component Updates

All major pages now emit sync events:

#### HomePage (`src/Pages/HomePage.jsx`)
- Image navigation sync
- Fullscreen state sync

#### Tower (`src/Pages/Tower.jsx`)
- Fullscreen state sync
- Tower navigation sync (via video completion)

#### Floor (`src/Pages/Floor.jsx`)
- Floor selection sync
- Fullscreen state sync
- Unit selection sync (via navigation)

#### Unit (`src/Pages/Unit.jsx`)
- Unit selection sync
- Fullscreen state sync
- Image carousel sync

#### UnitTypeFilter (`src/Components/Molecules/UnitTypeFilter.jsx`)
- Filter selection sync (BHK types)
- Size slider sync (debounced)
- "Show All" button sync

## How It Works

### Setting Up a Synced Session

1. **Browser 1** opens: `http://yoursite.com/inspire?roomId=meeting123`
   - The app extracts `roomId=meeting123`
   - Socket connects and joins room "meeting123"

2. **Browser 2** opens: `http://yoursite.com/inspire?roomId=meeting123`
   - The app extracts the same `roomId=meeting123`
   - Socket connects and joins room "meeting123"

3. Both browsers are now in the same room and will sync all actions

### Sync Flow

**When User Acts in Browser 1:**
```
User clicks navigation
  ↓
Component calls setters (e.g., navigate())
  ↓
Component emits sync event: emitSync(SYNC_EVENTS.NAVIGATION, { path: "/inspire/tower/T1" }, roomId)
  ↓
Socket sends to server: socket.emit("sync_event", { event: "navigation", rmId: "meeting123", data: {...} })
  ↓
Server broadcasts to room: socket.to("meeting123").emit("sync_event", {...})
  ↓
Browser 2 receives event
  ↓
useSocketSync hook processes event
  ↓
Checks if roomId matches
  ↓
Sets receiving flag (prevents circular updates)
  ↓
Updates local state (navigate to new path)
  ↓
Clears receiving flag
```

### Preventing Circular Updates

The system uses a `isReceivingSync` flag to prevent infinite loops:

1. Before emitting: Check `if (!getReceivingSync() && roomId)`
2. Before applying received changes: Call `setReceivingSync(true)`
3. After applying changes: Call `setReceivingSync(false)` after delay

This ensures that:
- Changes made locally are emitted to others
- Changes received from others are applied locally
- Applied changes are NOT re-emitted back to the room

## Server-Side Requirements

Your WebSocket server should handle:

```javascript
io.on('connection', (socket) => {
  // Handle room joining
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    socket.currentRoom = roomId;
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Handle room leaving
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  // Handle sync events
  socket.on('sync_event', (socketEvent) => {
    const roomId = socketEvent.rmId || socket.currentRoom;
    
    if (!roomId) {
      console.warn('No room ID found for sync_event');
      return;
    }

    // Verify socket is in the room
    if (!socket.rooms.has(roomId)) {
      console.warn(`Socket ${socket.id} not in room ${roomId}`);
      return;
    }

    // Broadcast to all other devices in the room (excluding sender)
    socket.to(roomId).emit('sync_event', {
      ...socketEvent,
      forwardedBy: socket.id,
      forwardedAt: new Date().toISOString(),
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});
```

## Usage Examples

### Basic Usage - Sharing a Session

1. Open app in Browser 1: Gets `?roomId=room_1735302153123_abc123def`
2. Copy the full URL
3. Open the same URL in Browser 2
4. Both browsers are now synced!

### Manual Room ID

Create a custom room:
```
http://yoursite.com/inspire?roomId=conference-room-1
```

Share this URL with multiple users, and they'll all sync together.

### Generate New Room

To start a new isolated session, simply remove the `?roomId` parameter or generate a new one:
```javascript
const { generateRoomId } = useRoomId();
generateRoomId(); // Creates new unique room ID
```

## Benefits

1. **Real-time Synchronization**: Actions in one browser instantly reflect in all other browsers in the same room
2. **Room Isolation**: Different rooms don't interfere with each other
3. **Easy Sharing**: Just share the URL with the roomId parameter
4. **Scalable**: Supports unlimited rooms and devices
5. **Debounced Updates**: Rapid changes (like sliders) are debounced to reduce network traffic
6. **Circular Update Prevention**: Smart flag system prevents infinite loops
7. **Reconnection Handling**: Automatically rejoins room on reconnection
8. **Existing Functionality Preserved**: All inventory updates and existing socket logic remains intact

## Testing

1. Open app in two browser windows side by side
2. Note the `roomId` in the URL - ensure both have the same value
3. Test navigation: Click to navigate in one browser, see it happen in the other
4. Test filters: Change unit type filter in one browser, see it update in the other
5. Test fullscreen: Toggle fullscreen in one browser, see it sync to the other
6. Test images: Navigate carousel in one browser, see it sync to the other

## Debugging

Enable console logging to see sync events:
- 📤 = Emitting sync event
- 📨 = Receiving sync event
- 🏠 = Room operations (join/leave)
- 🔄 = Sync state changes
- ⚠️ = Warnings

Look for these console messages to track sync flow.

