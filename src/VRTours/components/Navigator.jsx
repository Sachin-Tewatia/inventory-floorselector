import React from "react";
import styled from "styled-components";
import { TOUR_NAMES } from "../Constants";
import DropDown from "./Dropdown";
import { useNavigate } from "react-router-dom";

function Navigator({ setSelectedTour }) {
  const navigate = useNavigate();
  // const tabs = ["Exterior", "Interior", "Amenities"];
  const tabs = ["Interior"];

  const tours = {
    Exterior: [
      { key: TOUR_NAMES.Exterior, label: "Exterior" },
      // { key: TOUR_NAMES.SPORTS_AREA, label: "Sports Area" },
      // { key: TOUR_NAMES.PARKING, label: "Parking" },
    ],

    Interior: [
      // { key: TOUR_NAMES["2BHK"], label: "2 BHK" },
      // { key: TOUR_NAMES["2BHKM"], label: "2 BHK(M)" },
      { key: TOUR_NAMES["3BHK1665"], label: " 3 BHK WITH DECK 1665 SQFT" },
      {
        key: TOUR_NAMES["3BHK1895"],
        label: " 3 BHK STUDY WITH DECK 1895 SQFT",
      },
      {
        key: TOUR_NAMES["3BHK2170"],
        label: "3 BHK STUDY + UTILITY WITH DECK 2170",
      },
      {
        key: TOUR_NAMES["4BHK2400"],
        label: "4 BHK UTILITY WITH DECK 2400 SQFT",
      },
      {
        key: TOUR_NAMES["4BHK2670"],
        label: "4 BHK STUDY + UTILITY WITH DECK 2670 SQFT",
      },
      // { key: TOUR_NAMES["3BHKA"], label: "3 BHKA" },
      // { key: TOUR_NAMES["3BHKA"], label: "3 BHKA" },
    ],

    Amenities: [
      { key: TOUR_NAMES.CLOUB_HOUSE, label: "Clubhouse" },
      // { key: TOUR_NAMES.RECEPTION, label: "Reception" },
      { key: TOUR_NAMES.INDOOR_GAMES, label: "Indoor Games" },
      // { key: TOUR_NAMES.PARTY_HALL, label: "Party Hall" },
      { key: TOUR_NAMES.YOGA_ROOM, label: "Yoga Room" },
      { key: TOUR_NAMES.DANCE_ROOM, label: "Dance Room" },
      { key: TOUR_NAMES.CAFE, label: "World Book Cafe" },
      { key: TOUR_NAMES.BUSINESS_HUB, label: "World Business Hub" },
      { key: TOUR_NAMES.GYM, label: "Gym" },
      { key: TOUR_NAMES.SPA, label: "Spa" },
    ],
  };
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [showList, setShowList] = React.useState(true);
  return (
    <Style>
      <div className="logo">
        <img
          alt="logo"
          onClick={() => navigate("/")}
          src={`${process.env.PUBLIC_URL}/logo.webp`}
        />
        <div className="show-btn" onClick={() => setShowList((prev) => !prev)}>
          {showList ? "Hide" : "Select"} Tours
        </div>
      </div>
      {showList && (
        <div className="menus">
          {tabs.map((tab, index) => (
            <div className="menu">
              <div className="title">{tab}</div>
              <DropDown
                isSelected={selectedTab === index}
                onSelect={(tour) => {
                  setSelectedTour(tour);
                  setSelectedTab(index);
                }}
                items={tours[tab]}
              />
            </div>
          ))}
        </div>
      )}
    </Style>
  );
}

const Style = styled.div`
  display: flex;
  gap: 1.2rem;
  position: absolute;
  z-index: 10;
  top: 1.35rem;
  left: 2rem;
  background: var(--clr-background);
  padding: 0.7rem 2rem;
  border-radius: 0.5rem;
  align-items: center;
  .logo {
    img {
      background: white;
      border-radius: 0.5rem;
      width: 100px;
      height: auto;
      cursor: pointer;
    }
    .show-btn {
      color: #313131;
      padding: 0.2rem 0.4rem;
      background: #ffffffef;
      border-radius: 0.5rem;
      font-weight: 600;
      display: none;
    }
  }
  .menus {
    display: flex;
    gap: 1rem;
    align-items: center;
    .menu {
      display: flex;
      gap: 0.5rem;
      flex-direction: column;
      align-items: center;
      color: #b8b1b1e2;
      font-size: 0.8rem;
      font-weight: 500;
    }
  }
  @media only screen and (max-width: 768px) {
    top: 0rem;
    left: 0rem;
    width: 100%;
    flex-direction: column;
    border-radius: 0rem;
    padding: 0.5rem;
    .menus {
      justify-content: space-evenly;
      flex-wrap: wrap;
    }
    .logo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      img {
        width: 80px;
      }
      .show-btn {
        display: block;
        cursor: pointer;
        margin-left: 2rem;
      }
    }
  }
`;

export default Navigator;
