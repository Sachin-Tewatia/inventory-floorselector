import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useContext,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Carousel from "../Components/Molecules/Carousel";

import { useInventories } from "../Hooks";
import Flat from "../Components/Molecules/Flat";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FloorSelector from "../Components/Molecules/FloorSelector";
import ApartmentsDetails from "../Components/Molecules/ApartmentsDetails";
import Compass from "../Components/Atoms/Compass";
import IconButton from "../Components/Atoms/IconButton";
import { CloseFullScreenIcon, FullScreenIcon } from "../Icons";
import { getCombinedTowerName, toggleFullScreen } from "../Utility/function";
import Navigator from "../Components/Molecules/Navigator";
import { BOOKING_MODES, TOWERS, getFloorName, getFloorType, getFloorTypeUnit, getImageSource, getTowerNumberForFlat, towerNumberMappingForFlat } from "../Data";
import Zoomable from "../Components/Molecules/Zoomable";
import { useBookings } from "../Hooks/booking";
import { createOrder } from "../APIs/cashfree";
import { cashfreeProd } from "cashfree-dropjs";
import { message, Modal } from "antd";
import Loading from "../Components/Atoms/Loading";
import ReturnToPrev from "../Components/Atoms/ReturnToPrev";
import PaymentsWindow from "../Components/Molecules/PaymentsWindow";
import ProjectVideoBtn from "../Components/Molecules/ProjectVideoBtn";
import {
  COMPASS_ANGLES,
  getCombinedTowerFromTower,
  getFlatVrTours,
} from "../Utility/Constants";
import { AppContext } from "../Contexts/AppContext";
import Disclaimer from "../Components/Molecules/Disclaimer";
import CollapsiblePanel from "../Components/Molecules/CollapsiblePanel";
import CollapsibleAppartmentDetails from "../Components/Molecules/CollapsibleAppartmentDetails";
import ReraNumber from "../Components/Molecules/ReraNumber";
import VrHome from "./VrHome";
import { useRoomId } from "../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync } from "../services/socketSync";

const isDuplex = (tower, floor, unit_number) => {
  const duplexTowers = [ "T3", "T4", "T5", "T6","T9", "T8", "T11", "T12", "T13", "T14"];
  return duplexTowers.includes(tower) && floor ==11 && unit_number =="B";
}


function Unit() {
  const { inventories,isFullScreen,setFullScreen } = useContext(AppContext);
  const [imageNumber, setImageNumber] = useState(1);
  const [buttonClicked, setButtonClicked] = React.useState("");
  const [showVR, setShowVR] = useState(false);
  const [imageAnimation, setImageAnimation] = useState(false);
  const location = useLocation();
  const { roomId } = useRoomId();

  const { unit: unitId } = useParams();

  const { getUnitById } = useInventories();

  const [unit, setUnit] = useState(null);

  const { tower, floor, unit_number } = unit || {};

  
  const [upperUnit, setUpperUnit] = useState(floor);
  useEffect(() => {
    if (!unitId) return;
    setUnit(getUnitById(unitId));
  }, [unitId, inventories]);
  useEffect(() => {
    setUpperUnit(floor);
  }, [floor]);

  useEffect(() => {
    // Check if navigating from Floor page and trigger image animation
    const isFromFloor = location.state?.fromFloor === true;
    if (isFromFloor) {
      // Trigger image animation after a short delay
      setTimeout(() => {
        setImageAnimation(true);
      }, 100);
    } else {
      setImageAnimation(false);
    }
  }, [location]);
  
  console.log('upperUnit', upperUnit);
  
  const [loading, setLoading] = useState(false);

  const handlePrevImage = () => {
    setButtonClicked("prev");
    setImageNumber((prev) => (prev < 2 ? 3 : prev - 1));
  };
  const handleNextImage = () => {
    setButtonClicked("next");
    setImageNumber((prev) => (prev > 2 ? 1 : prev + 1));
  };

  const flatMap = {
    29: 30,
    30: 29,
    31: 32,
    32: 31,
  };

  const getUpperUnit = () => {
    const updatedFloor = flatMap[floor] || floor;
    const upperUnitImage = getImageSource(
      updatedFloor,
      unit_number?.toString().slice(-1)
    );
    return upperUnitImage;
  };
  const handleUpperClick = () => {
    setUpperUnit(upperUnit==11 ? 12 : 11);
  };

  if (!unit || !upperUnit) return <Loading />;
  return (
    <CarouselPageStyle>
      {loading && <Loading />}
      {/* <PaymentsWindow
        flat={flats[currentFlatIndex]}
        setShowPaymentsPopup={setShowPaymentsPopup}
        showPaymentsPopup={showPaymentsPopup}
      /> */}
      {/* <ProjectVideoBtn /> */}
      <Disclaimer />
      <Navigator
        className="navigator"
        prevPages={[
          // { title: "Delhi", path: "" },
          // {
          //   title: "Dwarka Expressway",
          //   path: "",
          // },
          {
            title: "Inspire",
            path: "/inspire",
          },
          {
            title: `Tower ${tower.slice(1)}`,
            path: `/inspire/tower/${getCombinedTowerFromTower(tower)}`,
          },
          {
            title: `${floor == 0 ? `Ground Floor` : `Floor ${floor}`}`,
            path: `/inspire/tower/${getCombinedTowerFromTower(tower)}/floor/${floor}`,
          },
        ]}
        currentPage={{
          title: `Apartment ${unit_number}`,
          path: `/inspire/unit/${unitId}`,
        }}
      />
      {/* <VrHome /> */}
      <ReturnToPrev
        text="Return To Floor Plan"
        to={`/inspire/tower/${getCombinedTowerFromTower(tower)}/floor/${floor}`}
      />
      {/* <div className="floor-selector">
        <FloorSelector currentFloor={floor} currentTower={tower} />
      </div> */}
      <div className="compass-fullscreen-wrapper absolute flex gap-2  z-10 right-0 top-0">
        {/* <div className="col flex j-end">
          <Compass
            angle={COMPASS_ANGLES.TOWERS[getCombinedTowerName(tower)] - 25}
          />
        </div> */}
        <div className="icon-btn">
          <IconButton
            icon={isFullScreen ? CloseFullScreenIcon : FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            isFullScreen={isFullScreen} // Pass isFullScreen from context
            onClick={() => {
              const newFullScreenState = !isFullScreen;
              setFullScreen(newFullScreenState);
              toggleFullScreen();
              
              // Sync fullscreen state if not receiving sync
              if (!getReceivingSync() && roomId) {
                emitSync(SYNC_EVENTS.FULLSCREEN, {
                  isFullScreen: newFullScreenState
                }, roomId);
              }
            }}
          />
        </div>
      </div>
      <div className="left-panels">
        <CollapsibleAppartmentDetails title={"Apartment Details"}>
          <ApartmentsDetails
            onVRClick={() => {
              setShowVR(true);
            }}
            selectedUnit={unit}
            showVRBtn
          />
        </CollapsibleAppartmentDetails>
      </div>
      {/* <button
        className={`absolute bottom-[30%] rounded-md right-[100px] cursor-pointer z-10 bg-[#363636] `}
        onClick={handleNextImage}
      >
        {" "}
        <img
          className="hover:scale-110 rotate-90"
          alt="next-arrow"
          src={`/up_arrow.svg`}
        />
      </button>
      <button
        className={`absolute bottom-[30%] rounded-md right-[68vw] cursor-pointer z-10  bg-[#363636] `}
        onClick={handlePrevImage}
      >
        {" "}
        <img
          className="hover:scale-110 -rotate-90"
          alt="next-arrow"
          src={`/up_arrow.svg`}
        />
      </button> */}
      {isDuplex(tower, floor, unit_number) &&
       (
          <button
            className="absolute bottom-[1rem] rounded-md right-[100px] cursor-pointer z-10  bg-[#363636] text-white px-4 py-2 "
            onClick={handleUpperClick}
          >
            {upperUnit==11 ? "Upper" : "Lower"}
          </button>
        )}
      <Zoomable>
        <Flat
          // src={`${getTowerNumberForFlat(tower,floor).toLowerCase()}/${getFloorType(tower, upperUnit)}/${unit_number.toLowerCase()}`}
          src={`/flats/${getFloorTypeUnit(tower,floor)}/${getFloorName(tower,floor,upperUnit)}/${unit_number.toLowerCase()}.webp`}
          imageNumber={imageNumber}
          setButtonClicked={setButtonClicked}
          buttonClicked={buttonClicked}
          imageAnimation={imageAnimation}
        />
        {/* /1/type2a/1.webp
        [2,3,4,5,6,7,8,9,10].includes(upperUnit) && (
          return 2

          towerMao={
            "T":"tyoe2"
          } */}
      </Zoomable>
      {showVR && (
        <>
          <button
            className="absolute top-0 right-0 z-[101] bg-white text-black p-2  m-2 rounded-full w-10 h-10"
            onClick={() => setShowVR(false)}
          >
            X
          </button>
          <div className="vr-tour">
            <iframe
              src={getFlatVrTours(unit?.unit_type)}
              allowFullScreen
            />
          </div>
        </>
      )}
      <ReraNumber />
    </CarouselPageStyle>
  );
}

export default Unit;

const CarouselPageStyle = styled.section`
  background: #857A66;
  // background: linear-gradient(
  //   68deg,
  //   rgba(48, 41, 32, 1) 0%,
  //   rgba(124, 111, 91, 1) 15%,
  //   rgba(138, 124, 102, 1) 25%,
  //   rgba(134, 121, 99, 1) 32%,
  //   rgba(121, 109, 90, 1) 45%,
  //   rgba(92, 86, 74, 1) 100%
  // );
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;

  .left-panels {
    position: absolute;
    top: 1vh;
    left: 2rem;
    display: flex;
    flex-direction: column;
    z-index: 90;
    justify-content: space-between;
    height: 75vh;
    gap: 2rem;

    .filters {
      position: relative !important;
      left: 0;
      top: 0;
    }

    /* Mobile responsive styles */
    @media screen and (max-width: 860px) {
      top: 0.5vh;
      left: 0.5rem;
      height: auto;
      gap: 1rem;
    }

    /* Medium screen responsive styles (860px - 1080px) */
    @media screen and (min-width: 861px) and (max-width: 1080px) {
      top: 1vh;
      left: 1rem;
      height: auto;
      gap: 1.5rem;
    }
  }
    
  .compass-fullscreen-wrapper {
    padding: 1rem;
    padding-right: 2rem;
  }

  .floor-selector {
    position: absolute;
    top: 7rem;
    left: 2rem;
    /* right: 100%; */
  }

  .zoom-control {
    position: absolute;
    right: 0px;
    bottom: 45%;
    z-index: 10;
    margin-top: 0px !important;
    display: flex;
    flex-direction: column;
    margin: 2rem;

    /* Mobile responsive styles */
    @media screen and (max-width: 860px) {
      margin: 0.8rem;
      bottom: 40%;
      .icon-btn {
        position: absolute;
        right: 0.6rem;
        top: 1rem;
      }
    }

    /* Medium screen responsive styles (860px - 1080px) */
    @media screen and (min-width: 861px) and (max-width: 1080px) {
      margin: 1.2rem;
      bottom: 42%;
      .icon-btn {
        position: absolute;
        right: 1rem;
        top: 1.5rem;
      }
    }
  }

      @media screen and (max-width: 860px) {
      .icon-btn {
        position: absolute;
        right: 0.6rem;
        top: 0.5rem;
        z-index: 10;
      }
    }

    /* Medium screen responsive styles (860px - 1080px) */
    @media screen and (min-width: 861px) and (max-width: 1080px) {
      .icon-btn {
        position: absolute;
        right: 1rem;
        top: 1rem;
        z-index: 10;
      }
    }

  .zoom-btn {
    width: 36px;
    height: 36px;
    background: var(--button_background_zoom);
    border-radius: 8px;
    display: inline-block;
    border: none;
    box-shadow: var(--button_shadow);
    border-radius: var(--radius);
    font-size: 22px;
    display: grid;
    place-items: center;
    text-align: center;
    pointer-events: auto;
    line-height: 19px;
    cursor: pointer;
    color: #a09c9c;
    transition: var(--transition);

    :hover {
      background: var(--button_background_zoom_hover);
    }

    /* Mobile responsive styles */
    @media screen and (max-width: 860px) {
      width: 28px;
      height: 28px;
      font-size: 18px;
      border-radius: 6px;
      line-height: 15px;
    }

    /* Medium screen responsive styles (860px - 1080px) */
    @media screen and (min-width: 861px) and (max-width: 1080px) {
      width: 32px;
      height: 32px;
      font-size: 20px;
      border-radius: 7px;
      line-height: 17px;
    }
  }

  .zoom-btn-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .plus-btn {
    margin-bottom: 10px;
  }
  .vr-tour {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    iframe {
      height: 100vh;
      width: 100%;
    }
  }

  @keyframes zoomFadeInOut {
    0% {
      opacity: 0;
      transform: scale(1.1);
    }
    30% {
      opacity: 1;
      transform: scale(0.95);
    }
    60% {
      opacity: 1;
      transform: scale(0.98);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
