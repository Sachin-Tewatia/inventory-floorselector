import { useState } from "react";
import Navigator from "./components/Navigator";
import styled from "styled-components";
import { TOUR_NAMES } from "./Constants";
import EnquiryBtn from "./components/EnquiryBtn";
import Logo from "./Logo";

function VRTours() {
  const tours = {
    // [TOUR_NAMES.Exterior]:
    //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World_Exterior_Tour/index.htm",
    // [TOUR_NAMES["2BHK"]]:
    //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dreamworld+2BHK_Tour/index.htm",
    // [TOUR_NAMES["2BHKM"]]:
    //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World+Mirror+2BHK_Tour/index.htm",
    [TOUR_NAMES["3BHK1665"]]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/M3M+Crown+3BHK+With+Deck_Tour/index.htm",
    [TOUR_NAMES["3BHK1895"]]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/M3M+Crown+3BHK_Tour/index.htm",
    [TOUR_NAMES["3BHK2170"]]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/M3M+Crown+3bhk+%2Bstudy%2Butility%2Bdeck_Tour/index.htm",
    [TOUR_NAMES["4BHK2400"]]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/M3M+Crown+4BHK_Tour/index.htm",
    [TOUR_NAMES["4BHK2670"]]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/M3M+Crown+4BHK_Tour/index.htm",
    // [TOUR_NAMES["5BHK"]]:
    //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World+5BHK_Tour/index.htm",
    // [TOUR_NAMES["5BHKA4"]]:
    //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World+5BHK_A4_Tour/index.htm",
    [TOUR_NAMES.CLOUB_HOUSE]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dreamworld_Clubhouse_Tour/index.htm",
    // [TOUR_NAMES.RECEPTION]:
    //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/Siliguri_Lobby_Tour/index.htm",
    [TOUR_NAMES.YOGA_ROOM]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World_Yoga_Tour/index.htm",
    [TOUR_NAMES.INDOOR_GAMES]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World_Indoor+Game_Tour/index.htm",
    // [TOUR_NAMES.PARTY_HALL]:
    //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/Siliguri_Clubhouse_Tour/index.htm",
    [TOUR_NAMES.GYM]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World_Gym_Tour/index.htm",
    [TOUR_NAMES.SPA]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World_Spa_Tour/index.htm",
    [TOUR_NAMES.CAFE]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World_Book+Cafe/index.htm",
    [TOUR_NAMES.DANCE_ROOM]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World_Dance+Room_Tour/index.htm",
    [TOUR_NAMES.BUSINESS_HUB]:
      "https://btvrprojects.s3.ap-south-1.amazonaws.com/Dream+World_Business+Hub_Tour/index.htm",

    // [TOUR_NAMES.SPORTS_AREA]:
    //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/Siliguri_Skydale+Exterior+Sports+Area_Tour/index.htm",
    // [TOUR_NAMES.PARKING]:
    //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/Siliguri_Skydale+Exterior+Parking_Tour/index.htm",
  };

  const [selectedTour, setSelectedTour] = useState(TOUR_NAMES["3BHK1665"]);

  return (
    <Style>
      {/* <Logo /> */}
      <Navigator setSelectedTour={setSelectedTour} />
      <iframe
        frameBorder="0"
        alt="tour"
        width="100%"
        height="100%"
        src={tours[selectedTour]}
        title="tour"
      />
      {/* <EnquiryBtn /> */}
    </Style>
  );
}

const Style = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: "Montserrat", sans-serif;
  color: white;
`;

export default VRTours;
