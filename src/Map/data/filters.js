import MarkWithTippy from "../components/MarkWithTippy";
import Hotspots from "../components/Hotspots";

import {
  hospital_icon,
  hotel_icon,
  landmark_icon,
  malls_icon,
  school_icon,
} from "../components/Icons";
import {

  mark_twentykm_hospital,
  mark_twentykm_hotel,
  mark_twentykm_mall,
  mark_twentykm_school,
  mark_twentykm_landmark,
} from "./mark";

let show = null;
export const getMapFilters = (route, showAll) => {
  const isTenKm = route === "/tenkm";
  const isFiveKm = route === "/fivekm";
  const isTenkmSatellite = route === "/tenkmSatellite";
  const isFivekmSatellite = route === "/fivekmSatellite";
  const isTwentyKm = route === "/twentykm";
  const isTwentykmSatellite = route === "/twentykmSatellite";
  if(showAll!=undefined){
    show = showAll;
  }

  const getTitle = (twentyKmTitle, twentyKmSatelliteTitle) => {
    if (isTwentyKm) return twentyKmTitle;
    if (isTwentykmSatellite) return twentyKmSatelliteTitle;
    return "";
  };

  return [
    {
      id: "map-filter-landmarks",
      title: getTitle("Landmarks", "Landmarks"),
      className: "landmark",
      icon: getTitle("Landmarks", "Landmarks") ? landmark_icon : null,
      landmarks: (
        <g className="overlay-can-hide">
          {show ? (
            <MarkWithTippy>
              {isTwentyKm
                ? mark_twentykm_landmark
                : isTwentykmSatellite
                ? mark_twentykm_landmark
                : []}
            </MarkWithTippy>
          ) : (
            <Hotspots>
              {isTwentyKm
                ? mark_twentykm_landmark
                : isTwentykmSatellite
                ? mark_twentykm_landmark
                : []}
            </Hotspots>
          )}
        </g>
      ),
    },
    {
      id: "map-filter-hospitals",
      title: getTitle("Healthcare", "Healthcare"),
      className: "hospital",
      icon: getTitle(
        "Hospitals",
        "Hospitals",
      )
        ? hospital_icon
        : null,
      landmarks: (
        <g className="overlay-can-hide marks hospitals">
          <MarkWithTippy isTenKm={isTenKm} isTenkmSatellite={isTenkmSatellite}>
            {isTwentyKm
              ? mark_twentykm_hospital
              : isTwentykmSatellite
              ? mark_twentykm_hospital
              : []}
          </MarkWithTippy>
        </g>
      ),
    },
    {
      id: "map-filter-schools",
      title: getTitle("Education", "Education"),
      className: "education",
      icon: getTitle(
        "Education",
        "Education",
      )
        ? school_icon
        : null,
      landmarks: (
        <g className="overlay-can-hide marks schools">
          <MarkWithTippy>
            {isTwentyKm
              ? mark_twentykm_school
              : isTwentykmSatellite
              ? mark_twentykm_school
              : []}
          </MarkWithTippy>
        </g>
      ),
    },

    {
      id: "map-filter-malls",
      title: getTitle("Shopping", "Shopping"),
      className: "retail",
      icon: getTitle("Malls", "Malls")
        ? malls_icon
        : null,
      landmarks: (
        <g className="overlay-can-hide marks malls">
          <MarkWithTippy isTenKm={isTenKm} isTenkmSatellite={isTenkmSatellite}>
            {isTwentyKm
              ? mark_twentykm_mall
              : isTwentykmSatellite
              ? mark_twentykm_mall
              : []}
          </MarkWithTippy>
        </g>
      ),
    },

    {
      id: "map-filter-hotels",
      title: getTitle("Hotels", "Hotels"),
      className: "hotel",
      icon: getTitle("Hotels", "Hotels") ? hotel_icon : null,
      landmarks: (
        <g className="overlay-can-hide marks hotels">
          <MarkWithTippy isTenKm={isTenKm} isTenkmSatellite={isTenkmSatellite}>
            {isTwentyKm
              ? mark_twentykm_hotel
              : isTwentykmSatellite
              ? mark_twentykm_hotel
              : []}
          </MarkWithTippy>
        </g>
      ),
    },
  ];
};

export const getMapFilterIds = (route) =>
  getMapFilters(route).map((filter) => filter.id);
