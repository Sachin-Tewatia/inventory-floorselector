
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MapTogglebtnSatellite = () => {  // Removed `togo` prop since we're using current route
  const navigate = useNavigate();
  const location = useLocation(); // Gets current route path (e.g., "/twentykm")

  const buttonStyle = "backdrop-blur-sm flex items-center justify-center p-2 rounded-lg border-[1px] border-white  cursor-default select-none w-20 h-10";

  return (
    <div className="fixed z-10 bottom-4 left-1/2 transform -translate-x-1/2 flex p-2 gap-2 text-white">
      {/* 20 KM Button */}


      <div 
        className={`${buttonStyle} ${
          location.pathname === '/twentykm' || location.pathname === '/twentykmSatellite' 
            ? '' 
            : 'bg-black/70 '
        }`}
        onClick={() => navigate("/twentykmSatellite")}
      >
        20 KM
      </div>

      {/* 10 KM Button */}
      <div 
        className={`${buttonStyle} ${
          location.pathname === '/tenkm' || location.pathname === '/tenkmSatellite' 
            ? '' 
            : 'bg-black/70 '
        }`}
        onClick={() => navigate("/tenkmSatellite")}
      >
        10 KM
      </div>

      {/* 5 KM Button */}
      <div 
        className={`${buttonStyle} ${
          location.pathname === '/fivekm' || location.pathname === '/fivekmSatellite' 
            ? '' 
            : 'bg-black/70 '
        }`}
        onClick={() => navigate("/fivekmSatellite")}
      >
        5 KM
      </div>

      <div 
        className={`${buttonStyle}  bg-black/70 text-white`}
        onClick={() => navigate("/salarpuria")}
      >
        Inventory
      </div>
      
    </div>
  );
};

export default MapTogglebtnSatellite;