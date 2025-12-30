const PROJECT_NORTH = 0;

export const COMPASS_ANGLES = {
  PROJECT_PAGE: {
    0: -45,
    1: -315,
    2: -240,
    3: -120,
  },
  TOWERS: {
    cluster1: 0,
    cluster2: 25,
    cluster3: 50,
    cluster4: 75,
    cluster5: 220,
    cluster6: 220,
    cluster7: 45,
    cluster8: 45,
    cluster9: 45,
    cluster10: 45,
    cluster11: 45,
    cluster12: 275,
    cluster13: 300,
    cluster14: 325,
    T1: 0,
    T2: 25,
    T3: 50,
    T4: 75,
    T5: 100,
    T6: 125,
    T7: 150,
    T8: 175,
    T9: 200,
    T10: 225,
    T11: 250,
    T12: 275,
    T13: 300,
    T14: 325
  },
  floors: {
    "Tower-01": {
      refuge: 150,
      typical: 150,
      extended: 150,
      ground: 190,
    },
    "Tower-02": {
      refuge: 200,
      typical: 200,
      extended: 200,
      ground: 200,
    },
    "Tower-06": {
      refuge: -30,
      typical: -30,
      extended: -30,
      ground: 10,
    },
    "Tower-07": {
      refuge: -30,
      typical: -30,
      extended: -30,
      ground: -80,
    },
    "Tower-08": {
      refuge: -30,
      typical: -30,
      extended: -30,
      ground: 10,
    },
    "Tower-09": {
      refuge: -30,
      typical: -30,
      extended: -30,
      ground: -75,
    },
    "Tower-10": {
      refuge: 20,
      typical: 20,
      extended: 20,
      ground: -80,
    },
    "Tower-11": {
      refuge: 20,
      typical: 20,
      extended: 20,
      ground: -75,
    },
    "Tower-12": {
      refuge: 110,
      typical: 110,
      extended: 110,
      ground: 105,
    },
    "Tower-13": {
      refuge: 110,
      typical: 110,
      extended: 110,
      ground: 110,
    },
    "Tower-14": {
      refuge: 110,
      typical: 110,
      extended: 110,
      ground: 110,
    },
  },
};

export const COMBINED_TOWERS_MAP = {
  cluster1: ["T1"],
  cluster2: ["T2"],
  cluster3: ["T3"],
  cluster4: ["T4"],
  cluster5: ["T5"],
  cluster6: ["T6"],
  cluster7: ["T7"],
  cluster8: ["T8"],
  cluster9: ["T9"],
  cluster10: ["T10"],
  cluster11: ["T11"],
  cluster12: ["T12"],
  cluster13: ["T13"],
  cluster14: ["T14"]
};

export const FLAT_SVG_NO_MAP = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
};

export const getTowerFromCombinedTowersAndIndex = (combinedTower, index) => {
  // console.log("combinedTower", combinedTower, index);
  const towers = COMBINED_TOWERS_MAP[combinedTower];
  // console.log("tower", towers);
  return towers[index];
};

export const getCombinedTowerFromTower = (tower) => {
  for (const combinedTower in COMBINED_TOWERS_MAP) {
    const towers = COMBINED_TOWERS_MAP[combinedTower];
    if (towers.includes(tower)) {
      return combinedTower;
    }
  }
};

export const getFlatVrTours = (type) => {
  return null;
  switch (type) {
    case "4.5BHK":
      return "https://propvizvr.s3.ap-south-1.amazonaws.com/Signature_Global_Interior_Tour/index.htm";
    case "3.5BHK":
      return "https://propvizvr.s3.ap-south-1.amazonaws.com/DXP_Signature_Global_3.5BHK_Interior_Tour/index.htm";
    default:
      return null;
  }
};
