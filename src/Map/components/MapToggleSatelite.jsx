import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../Contexts/AppContext';
const MapToggleSatelite = ({onClick}) => {
    const navigate = useNavigate();
    const {satelliteView} = useContext(AppContext);
  return (
    <div className="absolute z-10 right-0 bottom-0 md:bottom-0 lg:bottom-0 rounded-[5px] flex p-2 md:p-3 lg:p-2 gap-2 w-auto overlay-can-hide">
        <div
          className={`
            iconbutton-button
            flex justify-center items-center
            rounded-[5px]
            shadow-md
            border-2
            border-black
            cursor-pointer
            transition-transform duration-300 ease-in-out
            // Mobile (default): No hover animations, only the base state
            h-[60px] w-[110px] md:h-[60px] md:w-[100px] lg:h-[80px] lg:w-[140px]
  
            
            // Desktop screens (lg:): Apply larger hover animations
            lg:hover:scale-150 lg:hover:-translate-x-6 lg:hover:-translate-y-5
          `}
          onClick={() => onClick() }
        >
          <img
            src={`${satelliteView?'/images/twentykm.png':'/images/twentykmSatellite.webp'}`}
            alt="icon"
            className="w-full h-full rounded-[3px]"
          />
        </div>
      </div>
  )
}
export default MapToggleSatelite