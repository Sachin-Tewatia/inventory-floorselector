
import { useNavigate } from "react-router-dom";
import { Layers } from 'lucide-react';

const InventoryBtns = () => {
  const navigate = useNavigate();
  const navigateToInventory = () => {
    navigate("/salarpuria");
  };

  // Base button style with greyish appearance
  const baseButtonStyle = `
    relative flex items-center justify-center 
    rounded-md select-none
    w-[min(22vw,90px)] h-[min(10vw,36px)] text-[clamp(11px,2.8vw,12px)] font-light
    md:w-[min(20vw,100px)] md:h-[min(9vw,40px)] md:text-[clamp(12px,3vw,13px)] md:font-medium
    lg:w-[min(18vw,120px)] lg:h-[min(8vw,44px)] lg:text-[clamp(13px,3.2vw,14px)] lg:font-medium
    transition-all duration-300 
    bg-[black]/70 backdrop-blur-sm
    text-white
    border border-slate-400 
    hover:bg-[black]/50       
    active:bg-[black]/80  
    shadow-md hover:shadow-lg
  `;

  return (
    <div className={`
      absolute z-10
      md:top-2 md:right-2
      lg:top-2 lg:right-2
      top-2 right-[clamp(8px,2vw,12px)] lg:bottom-auto
      overlay-can-hide
    `}>
      {/* Inventory Button */}
      <div
        className={`${baseButtonStyle} cursor-not-allowed p-[min(2vw,8px)] flex gap-[min(1.5vw,6px)] items-center`}
        onClick={navigateToInventory}
      >
        <Layers size={clamp(16, 4.5 * window.innerWidth / 100, 18)} />
        <span className="text-white">Inventory</span>
      </div>
    </div>
  );
};

// Utility function to mimic CSS clamp in JavaScript
const clamp = (min, val, max) => Math.min(Math.max(val, min), max);

export default InventoryBtns;