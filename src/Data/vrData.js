export const TOUR_NAMES = {
  AERIAL: "AERIAL",
  ENTRY_GATE: "ENTRY_GATE",
  LOBBY: "LOBBY",
  BASKETBALL: "BASKETBALL",
  RESTAURANT: "RESTAURANT",
  JEWEL: "JEWEL",
  AMPHITHEATER: "AMPHITHEATER",
  OFFICE_SPACE: "OFFICE_SPACE",
  OFFICE_35: "OFFICE_35",
  OFFICE_30: "OFFICE_30",
  OFFICE_25: "OFFICE_25",
  OFFICE_20: "OFFICE_20",
  EXTERIOR_OFFICE_SPACE: "EXTERIOR_OFFICE_SPACE",
  EXTERIOR_OFFICE_35: "EXTERIOR_OFFICE_35",
  EXTERIOR_OFFICE_30: "EXTERIOR_OFFICE_30",
  EXTERIOR_OFFICE_25: "EXTERIOR_OFFICE_25",
  EXTERIOR_OFFICE_20: "EXTERIOR_OFFICE_20",
  DYNAMIC_ENTRY: "DYNAMIC_ENTRY",
  DYNAMIC_LOBBY: "DYNAMIC_LOBBY",
  DYNAMIC_BASKETBALL: "DYNAMIC_BASKETBALL",
  DYNAMIC_RESTAURANT: "DYNAMIC_RESTAURANT",
  DYNAMIC_JEWEL: "DYNAMIC_JEWEL",
  DYNAMIC_AMPHITHEATER: "DYNAMIC_AMPHITHEATER",
  DYNAMIC_SEATING: "DYNAMIC_SEATING",
  INDOOR_GAMES: "INDOOR_GAMES",
  RESTAURANT_2: "RESTAURANT_2",
  CARD_ROOM: "CARD_ROOM",
  LOUNGE: "LOUNGE",
  GYM: "GYM",
  SWIMMING: "SWIMMING",
  PLAY_AREA: "PLAY_AREA",
  PARKING_LOBBY: "PARKING_LOBBY",
  ENTRANCE_LOBBY: "ENTRANCE_LOBBY",
  PODIUM: "PODIUM",
  ENTRANCE: "ENTRANCE",
};

export const tourCoordinates = {
  ENTRY_GATE: { cx: 50, cy: 50 },
  MINI_THEATRE: { cx: 100, cy: 100 },
  RECEPTION: { cx: 150, cy: 150 },
  YOGA_ROOM: { cx: 200, cy: 200 },
  INDOOR_GAMES: { cx: 250, cy: 250 },
  PARTY_HALL: { cx: 300, cy: 300 },
  GYM: { cx: 350, cy: 350 },
  SPORTS_AREA: { cx: 400, cy: 400 },
  PARKING: { cx: 450, cy: 450 },
};

export const DEFAULT_TOURS = {
  exterior: TOUR_NAMES.AERIAL,
  amenities: TOUR_NAMES.JEWEL,
  drone: TOUR_NAMES.DRONE,
  interior: TOUR_NAMES.OFFICE_SPACE,
  dynamicVr: TOUR_NAMES.DYNAMIC_ENTRY,
};

export const exteriorTours = {
  // [TOUR_NAMES.AERIAL]: [
  //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/My+Home+Exterior+Grava+Areal+view_Tour/index.htm",
  //   "https://btvrprojects.s3.ap-south-1.amazonaws.com/My+Home+Exterior+Areal+Night+View_Tour/index.htm",
  // ],
  [TOUR_NAMES.AERIAL]: [
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Complete_Tour/index.htm",
  ],
  [TOUR_NAMES.ENTRANCE]: [
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Entry_Gate/index.htm",
  ],
  [TOUR_NAMES.DECK]: [
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Deck/index.htm",
  ],
  // [TOUR_NAMES.PLAY_AREA]: [
  //   "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Exterior_Tour/index.htm",
  // ],
};

export const amenitiesTours = {
  [TOUR_NAMES.JEWEL]:
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Restraunt_Area_1/index.htm",
  [TOUR_NAMES.RESTAURANT_2]:
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Restraunt_Area_2/index.htm",
  [TOUR_NAMES.CARD_ROOM]:
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Card_Room/index.htm",
  // [TOUR_NAMES.LOBBY]:
  //   "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Amenties_Entrance_Lobby/index.htm",
  [TOUR_NAMES.GYM]:
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Gym_Area/index.htm",
  [TOUR_NAMES.INDOOR_GAMES]:
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Indoor_Games/index.htm",
  [TOUR_NAMES.LOUNGE]:
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Arrival_Lounge/index.htm",
  // [TOUR_NAMES.PARKING_LOBBY]:
  //   "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Arrival_Lounge/index.htm",
  [TOUR_NAMES.ENTRANCE_LOBBY]:
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_Entrance_Lobby/index.htm",
  // [TOUR_NAMES.ENTRANCE_LOBBY]:
  //   "https://propvizvr.s3.ap-south-1.amazonaws.com/Signature_Global_DXP_Ground_Entrance_Lobby/index.htm",
};
export const interiorTours = {
  [TOUR_NAMES.OFFICE_SPACE]:
    "https://propvizvr.s3.ap-south-1.amazonaws.com/Signature_Global_Interior_Tour/index.htm",
  [TOUR_NAMES.OFFICE_20]:
    "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_3.5BHK_Interior_Tour/index.htm",
};
export const droneTours = {
  [TOUR_NAMES.DRONE]:
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/Adani+Shantigram_Tour/index.htm",
};
export const dynamicVr = {
  [TOUR_NAMES.DYNAMIC_ENTRY]:
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/My+home+video+entry_Tour/index.htm",
  [TOUR_NAMES.DYNAMIC_JEWEL]:
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/My+home+video+Jewel_Tour/index.htm",
  [TOUR_NAMES.DYNAMIC_LOBBY]:
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/My+home+video+Lobby_Tour/index.htm",
  [TOUR_NAMES.DYNAMIC_RESTAURANT]:
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/My+home+video+Restaurant_Tour/index.htm",
  [TOUR_NAMES.DYNAMIC_AMPHITHEATER]:
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/My+home+video+Amphitheater_Tour/index.htm",
  [TOUR_NAMES.DYNAMIC_BASKETBALL]:
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/My+home+video+Basketball_Tour/index.htm",
  [TOUR_NAMES.DYNAMIC_SEATING]:
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/My+home+video+seating_Tour/index.htm",
};

export const categoryToToursMap = {
  exterior: exteriorTours,
  amenities: amenitiesTours,
  interior: interiorTours,
  dynamicVr: dynamicVr,
};

export const imagesData = {
  exterior: [
    { id: "", imagePath: "asset11.jpg", name: "Aerial" },
    { id: "", imagePath: "asset11.jpg", name: "Entrance" },
    { id: "", imagePath: "asset11.jpg", name: "Global Deck" },
  ],
  amenities: [
    { imagePath: "asset11.jpg", name: "Restaurant" },
    { imagePath: "asset12.jpg", name: "Restaurant 2" },
    { imagePath: "asset12.jpg", name: "Card Room" },
    // { imagePath: "asset10.jpg", name: "Lobby" },
    { imagePath: "asset9.jpg", name: "Gym" },
    { imagePath: "asset9.jpg", name: "Indoor Games" },
    { imagePath: "asset9.jpg", name: "Lounge" },
    // { imagePath: "asset9.jpg", name: "Parking Lobby" },
    { imagePath: "asset9.jpg", name: "Entrance Lobby" },
  ],
  //   interior: [{ name: "4.5 BHk" }, { name: "3.5 BHk" }],
};

export const categories = ["All", "2BHK", "3BHK", "4BHK"];
