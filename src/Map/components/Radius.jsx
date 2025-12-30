import React, { useContext } from "react";
import { mark_radius } from "../data/marks";
import { AppContext } from "../../Contexts/AppContext";

const Radius = React.memo(() => {
  const { showRadius } = useContext(AppContext);

  return (
    <g className={`transition-all ${showRadius ? "opacity-2" : "opacity-0"}`}>
      <g className={`overlay-can-hide`}>{mark_radius}</g>
    </g>
  );
});

export default Radius;
