import React, { useState, useEffect, useReducer, useRef } from "react";
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
import { FullScreenIcon } from "../Icons";
import { getCombinedTowerName, toggleFullScreen } from "../Utility/function";
import Navigator from "../Components/Molecules/Navigator";
import { BOOKING_MODES, TOWERS, VR_TOUR_LINKS, getFloorType } from "../Data";
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
import CollapsibleAppartmentDetails from "../Components/Molecules/CollapsibleAppartmentDetails";

function VRTour() {
  const { unit: unitId } = useParams();

  const { getUnitById } = useInventories();

  const [unit, setUnit] = useState(null);

  const { tower, floor, unit_number } = unit || {};

  console.log(unitId);

  useEffect(() => {
    if (!unitId) return;
    setUnit(getUnitById(unitId));
  }, [unitId]);

  const navigate = useNavigate();

  const { fetchInventories } = useInventories();

  const [loading, setLoading] = useState(false);
  const paymentWrapperref = useRef();
  const { saveUserToDB } = useBookings();

  const [showPaymentsPopup, setShowPaymentsPopup] = useState(false);

  const handleBooking = async (flatId, userDetails) => {
    // const paymentId = "885594491";
    // const orderId = "order_2244182Eo24wxkRsyeBzKENw2uWSkM1lR";
    // try {
    //   userDetails.mode = BOOKING_MODES.ONLINE;
    //   setLoading(true);
    //   const { mobile: phone, firstName, lastName, email } = userDetails;
    //   const user_id = await saveUserToDB(userDetails);
    //   const order_response = await createOrder(flatId, {
    //     name: firstName + " " + lastName,
    //     email,
    //     customer_id: user_id,
    //     phone,
    //   });
    //   if (!order_response) {
    //     setLoading(false);
    //     return;
    //   }
    //   setShowPaymentsPopup(true);
    //   // window.location.replace(order_response.payment_link);
    //   const { orderToken } = order_response;
    //   let cashfree = new cashfreeProd.Cashfree();
    //   const dropConfig = {
    //     components: [
    //       "order-details",
    //       "card",
    //       "netbanking",
    //       "app",
    //       "upi",
    //       "paylater",
    //       "credicardemi",
    //       "cardlessemi",
    //     ],
    //     orderToken,
    //     onSuccess: function (data) {
    //       message.success("Payment Successful");
    //       setShowPaymentsPopup(false);
    //       const paymentId = data.transaction.transactionId;
    //       const orderId = data.order.orderId;
    //       fetchInventories();
    //       navigate(
    //         `/salarpuria/tower/${tower}/floor/${floor}/unit/${flatId}/payment-success/${orderId}/${paymentId}`
    //       );
    //       //on payment flow complete
    //     },
    //     onFailure: function (data) {
    //       if (data?.order?.errorText) message.error(data.order.errorText);
    //       //on failure during payment initiation
    //     },
    //     style: {
    //       //to be replaced by the desired values
    //       backgroundColor: "#ffffff",
    //       color: "#11385b",
    //       fontFamily: "Lato",
    //       fontSize: "14px",
    //       errorColor: "#ff0000",
    //       theme: "light", //(or dark)
    //     },
    //   };
    //   setTimeout(() => {
    //     cashfree.initialiseDropin(
    //       document.getElementById("payment-body"),
    //       dropConfig
    //     );
    //     setLoading(false);
    //   }, 1000);
    // } catch (error) {
    //   message.error(error);
    // }
  };

  if (!unit) return <Loading />;

  return (
    <CarouselPageStyle>
      {loading && <Loading />}
      {/* <PaymentsWindow
        flat={flats[currentFlatIndex]}
        setShowPaymentsPopup={setShowPaymentsPopup}
        showPaymentsPopup={showPaymentsPopup}
      /> */}
      {/* <ProjectVideoBtn /> */}

      <Navigator
        className="navigator"
        prevPages={[
          // { title: "Delhi", path: "" },
          // {
          //   title: "Dwarka Expressway",
          //   path: "",
          // },
          {
            title: "M3m Crown",
            path: "/salarpuria",
          },
          {
            title: `${tower}`,
            path: `/salarpuria/tower/${getCombinedTowerFromTower(tower)}`,
          },
          {
            title: `Floor ${floor}`,
            path: `/salarpuria/tower/${tower}/floor/${floor}`,
          },
          {
            title: `Apartment ${unit_number}`,
            path: `/salarpuria/unit/${unitId}`,
          },
        ]}
        currentPage={{
          title: `VR Tour`,
          path: `/salarpuria/unit/${unitId}/vr-tour`,
        }}
      />
      <ReturnToPrev
        text="Return To Floor Plan"
        to={`/salarpuria/tower/${tower}/floor/${floor}`}
      />
      {/* <div className="floor-selector"> */}
      {/* <FloorSelector currentFloor={floor} currentTower={tower} /> */}
      {/* </div> */}
      <div className="compass-fullscreen-wrapper absolute bottom right flex row">
        {/* <div className="col flex j-end">
          <Compass
            angle={COMPASS_ANGLES.TOWERS[getCombinedTowerName(tower)] - 25}
          />
        </div> */}
        <div className="col w-space flex j-end">
          <IconButton
            icon={FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            onClick={() => toggleFullScreen()}
          />
        </div>
      </div>
      <CollapsibleAppartmentDetails title={"Apartment Details"}>
        <ApartmentsDetails
          showVRBtn={false}
          onVRClick={() => {
            // setShowVRTour(true)
            navigate("VR-tour");
          }}
          selectedUnit={unit}
          handleBooking={handleBooking}
        />
      </CollapsibleAppartmentDetails>
      <div className="vr-tour">
        <iframe
          src={getFlatVrTours(getUnitById(unitId)?.unit_type)}
          allowFullScreen
          frameBorder="0"
          width={"100%"}
        />
      </div>
    </CarouselPageStyle>
  );
}

export default VRTour;

const CarouselPageStyle = styled.section`
  #appartmnet-details-panel {
    position: absolute;
    left: -12rem;
  }

  background: rgb(48, 41, 32);
  background: linear-gradient(
    68deg,
    rgba(48, 41, 32, 1) 0%,
    rgba(124, 111, 91, 1) 15%,
    rgba(138, 124, 102, 1) 25%,
    rgba(134, 121, 99, 1) 32%,
    rgba(121, 109, 90, 1) 45%,
    rgba(92, 86, 74, 1) 100%
  );
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;

  .vr-tour {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    iframe {
      height: 100vh;
      width: 100%;
    }
  }

  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
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
`;
