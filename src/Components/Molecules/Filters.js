
import React, { useState, useEffect, useRef } from "react";
import UnitTypeFilter from "./UnitTypeFilter"; // Import the existing filter component
import styled from "styled-components";
import FloorSelector from "./FloorSelector";
import { useRoomId } from "../../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync } from "../../services/socketSync";
import { useSyncContext } from "../../Contexts/SyncContext";
import { track } from "../../analytics/track";

function Filters({
  currentFloor,
  selectedFloor,
  towerName,
  setSelectedFloor,
  currentTower,
  selectedTower,
  setSelectedTower,
  floor = null,
}) {
  const [isFilterVisible, setIsFilterVisible] = useState(null);
  const { roomId } = useRoomId();
  const { registerHandler } = useSyncContext();
  const isFilterVisibleRef = useRef(isFilterVisible);

  // Keep ref updated
  useEffect(() => {
    isFilterVisibleRef.current = isFilterVisible;
  }, [isFilterVisible]);

  // Listen for panel visibility sync events
  useEffect(() => {
    const unsubscribe = registerHandler(SYNC_EVENTS.PANEL_VISIBILITY, (data) => {
      if (!data || typeof data !== 'object') {
        return;
      }

      // Check if this event is for the floor panel (Filters)
      if (data.panelType === 'floorPanel' && data.isOpen !== undefined) {
        const newVisibility = data.isOpen ? "floors" : null;
        if (newVisibility !== isFilterVisibleRef.current) {
          console.log('🔍 [Filters] Syncing panel visibility:', newVisibility);
          setIsFilterVisible(newVisibility);
        }
      }
    });

    return unsubscribe;
  }, [registerHandler]);

  const toggleFilterVisibility = (id) => {
    const newVisibility = isFilterVisible == id ? null : id;
    setIsFilterVisible(newVisibility);
    track("filter_change", {
      filterType: id,
      action: newVisibility ? "open" : "close"
    });
    // Sync panel visibility if not receiving sync
    if (!getReceivingSync() && roomId) {
      emitSync(SYNC_EVENTS.PANEL_VISIBILITY, {
        panelType: 'floorPanel',
        isOpen: newVisibility === "floors",
      }, roomId);
    }
  };

  return (
    <Container>
      {/* Side slide floor panel with edge toggle */}
      {floor && (
        <SideSlide className={isFilterVisible === "floors" ? "open" : "closed"}>
          <FloorPanelInner>
            <FloorSelector
              currentFloor={currentFloor}
              selectedFloor={selectedFloor}
              towerName={towerName}
              setSelectedFloor={setSelectedFloor}
              currentTower={currentTower}
              selectedTower={selectedTower}
              setSelectedTower={setSelectedTower}
            />
          </FloorPanelInner>
          <EdgeToggle onClick={() => toggleFilterVisibility("floors")}
            aria-label={isFilterVisible === "floors" ? "Close floors panel" : "Open floors panel"}
          >
            <span>Floors</span>
            <ChevronUp isOpen={isFilterVisible === "floors"} />
          </EdgeToggle>
        </SideSlide>
      )}
    </Container>
  );
}

export default Filters;

const Container = styled.div`
  /* position: relative; */
`;

const SideSlide = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 220px;
  min-height: 470px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  background: transparent;

  /* When closed, don't block clicks on underlying UI */
  &.closed {
    pointer-events: none;
  }

  /* Mobile: make the panel come up less high */
  @media screen and (max-width: 860px) {
    min-height: 285px;
  }

  /* Tablet: make the panel come up less high */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    min-height: 400px;
  }
`;

const FloorPanelInner = styled.div`
  width: 100%;
  flex: 1;
  background: none;
  margin-bottom: 3rem;
  border-radius: var(--radius) var(--radius) 0 0; /* rounded top corners only */
  overflow-y: auto;
  transition: transform 0.5s ease, opacity 0.3s ease;
  transform: translateY(0);
  opacity: 1;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  ${SideSlide}.closed & {
    transform: translateY(100%); /* hide panel by moving it down */
    opacity: 0;
    pointer-events: none;
  }
`;

const EdgeToggle = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 110px;
  height: 40px;
  border-radius: 5px 5px 0 0;
  border: 0;
  background: var(--background_panel);
  backdrop-filter: var(--background_panel_blur);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  z-index: 100;
  flex-shrink: 0;
  /* Always clickable even when parent is pointer-events: none */
  pointer-events: auto;

  span {
    flex-shrink: 0;
  }

  svg {
    flex-shrink: 0;
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    width: 80px;
    height: 25px;
    font-size: 10px;
    gap: 4px;
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    width: 110px;
    height: 40px;
    font-size: 14px;
    gap: 6px;
  }
`;

const ChevronUp = ({ isOpen }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 12 12"
    style={{ 
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
      transition: 'transform 0.3s ease'
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 8.5L6 5.5L9 8.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
