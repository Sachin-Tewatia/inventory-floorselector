import React from "react";


function IconButton({ icon, className = "", onClick, isActive, tooltip, activeTooltip }) {
  return (
    <button
      onClick={onClick}
      className={`
        ${className}
        z-10
        font-sans
        transition duration-200 ease-in-out
        hover:opacity-90
        backdrop-blur-sm
      `}
      title={isActive ? activeTooltip : tooltip}
    >
      <div
        className={`
          flex justify-center items-center
          w-8 h-8 md:w-7 md:h-7 lg:w-10 lg:h-10
          rounded-md shadow-md
          border border-black
          bg-white bg-opacity-40
          backdrop-blur-[2px]
          ${isActive ? "bg-slate-800 text-white" : ""} 
        `}
      >
        {icon}
      </div>
    </button>
  );
}


export default IconButton;
