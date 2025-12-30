import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ApartmentsDetails from "../Components/Molecules/ApartmentsDetails";

function Apartment(props) {
  const params = useParams();
  const { floor, tower, unit } = params;
  const location = useLocation();
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    if (params.unit) {
      setSelectedUnit(parseInt(unit.slice(2)));
      // setMapValue(mapValuesOfUnits[parseInt(unit.slice(2))]);
    } else {
      setSelectedUnit(null);
    }
  }, [location]);

  return (
    <div>
      `${floor} ${tower} ${unit}`
      <ApartmentsDetails selectedUnit={selectedUnit} />
    </div>
  );
}

export default Apartment;
