import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import {
  DEFAULT_TOURS,
  categoryToToursMap,
  imagesData,
} from "../Data/vrData.js";
import Sidebarr from "../Components/Molecules/Sidebarr.jsx";
import ToursDropdown from "../Components/Molecules/ToursDropdown.jsx";
import { AppContext } from "../Contexts/AppContext.js";
import { useLocation, useNavigate } from "react-router-dom";

const VrHome = () => {
  const { selectedCategory, setSelectedCategory } = useContext(AppContext);
  const [selectedTour, setSelectedTour] = useState(DEFAULT_TOURS.exterior);
  const [isContentVisible, setContentVisibility] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Effect for updating selected tour based on category change
  useEffect(() => {
    setSelectedTour(DEFAULT_TOURS[selectedCategory] || DEFAULT_TOURS.exterior);
  }, [selectedCategory]);
  useEffect(() => {
    if (location.pathname === "/vr-home") {
      setSelectedCategory(
        selectedCategory === "interior" ? "exterior" : selectedCategory
      );
    }
  }, []);

  // Timeout logic for closing dropdown after 10 seconds of inactivity
  let timeoutId;
  const handleCloseDropdown = () => {
    setContentVisibility(false);
  };

  const startDropdownTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      handleCloseDropdown();
    }, 100 * 1000); // 10 seconds
  };

  useEffect(() => {
    // Initial timeout seflotup and event listeners for user activity
    startDropdownTimeout();
    document.addEventListener("mousemove", startDropdownTimeout);
    document.addEventListener("keydown", startDropdownTimeout);
    document.addEventListener("click", startDropdownTimeout);

    // Cleanup: remove event listeners and clear timeout
    return () => {
      document.removeEventListener("mousemove", startDropdownTimeout);
      document.removeEventListener("keydown", startDropdownTimeout);
      document.removeEventListener("click", startDropdownTimeout);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Handle sidebar link click
  const handleSidebarLinkClick = (category) => {
    setSelectedCategory(category || selectedCategory);
    // if (location.pathname !== "/vr-home" && category !== "interior") {
    //   navigate("/vr-home");
    // }
    // if (category === "drone" || category === "dynamicVr") {
    //   setContentVisibility(false);
    //   return;
    // }
    if (selectedCategory === category) {
      setContentVisibility(!isContentVisible);
    } else {
      setContentVisibility(true);
    }
  };

  // Render logic based on selected category and tour
  const tours = categoryToToursMap[selectedCategory] || {};

  return (
    <Wrapper>
      {/* <Logo text={shownName[selectedTour]} /> */}
      <div className="SidebarWrapper">
        <Sidebarr
          selectedCategory={selectedCategory}
          handleSidebarLinkClick={handleSidebarLinkClick}
        />
      </div>
      {/* {isModalOpen && <Contact closeModal={closeModal} />} */}

      {selectedCategory && (
        <ToursDropdown
          selectedCategory={selectedCategory}
          imagesData={imagesData}
          tours={tours}
          selectedTour={selectedTour}
          setSelectedTour={setSelectedTour}
          handleCloseDropdown={handleCloseDropdown}
          isContentVisible={isContentVisible}
        />
      )}

      {selectedCategory === "exterior" && (
        <div className="vrtour">
          <iframe
            frameBorder="0"
            alt="tour"
            width="100%"
            height="100%"
            src={tours[selectedTour]}
            // src={
            //   selectedTour === "AERIAL"
            //     ? tours[selectedTour][view]
            //     : tours[selectedTour]
            // }
            title="Exterior Tour"
          />
        </div>
      )}
      {/* {selectedCategory === "interior" && <HomePage />} */}
      {/* 
      {selectedCategory === "dynamicVr" && (
        // <div className="location" style={interiorStyles}>
        <DynamicVr
          selectedTour={selectedTour}
          setSelectedTour={setSelectedTour}
        />
        // </div>
      )} */}
      {/* {selectedCategory === "interior" && (
        <div className="location" style={interiorStyles}>
          <Interior />
        </div>
      )} */}

      {/* {selectedCategory === "location" && (
        <div className="location" style={locationStyles}>
          <Location />
        </div>
      )} */}

      {selectedCategory === "amenities" && (
        <div className="vrtour">
          <iframe
            frameBorder="0"
            alt="tour"
            width="100%"
            height="100%"
            src={tours[selectedTour]}
            title="Amenities Tour"
          />
        </div>
      )}

      {!selectedCategory && (
        <div className="vrtour">
          <h2>{selectedTour} </h2>

          <iframe
            frameBorder="0"
            alt="tour"
            width="100%"
            height="100%"
            src={categoryToToursMap["exterior"][DEFAULT_TOURS.exterior]}
            title="Default Tour"
          />
        </div>
      )}
      {/* <CurrentTourName text={shownName[selectedTour]} /> */}
      {/* {["AERIAL"].includes(selectedTour) && (
        <ViewButtons handleView={setView} view={view} />
      )} */}
    </Wrapper>
  );
};

// Styled components
const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  /* overflow: hidden; */
 
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;

  .SidebarWrapper {
    /* width: 6%; */
    /* background-color: #111; */

    position: absolute;
    overflow-y: hidden;
    padding-top: 0px;
    top: 50%;
    transform: translateX(10%) translateY(-50%);
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
    overflow: hidden;
    z-index: 9999;
    /* @media only screen and (max-width: 1068px) {
      width: 8%;
    }
    @media only screen and (max-width: 768px) {
      width: 10%;
    }
    @media only screen and (max-width: 568px) {
      width: 16%;
    } */
  }
  .vrtour {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: black;
    h2 {
      color: white;
      border-radius: 6px;
      width: auto;
      padding: 10px 15px;
      font-weight: 390;
      font-size: 1rem;
      opacity: 0.8;
      background-color: rgba(0, 0, 0, 0.6);
      position: absolute;
      transition: all 0.6s linear;
    }
    @media only screen and (max-width: 768px) {
      h2 {
        display: none;
      }
    }
  }
`;

export default VrHome;
