// import React, { useEffect, useState } from "react";
// import IconButton from "./IconButton";
// import { toggleFullScreen, toogleHideOverlays } from "../utilities/function";
// import { FullScreenIcon, HideIconBlack , HideIconWhite } from "./Icons";

// export default function ActionBtns() {
//   const [showOverlays, setShowOverlays] = useState(true);
//   const [fullScreenMode, setFullScreenMode] = useState(false);

//   const handleFullScreenChange = () => {
//     console.log("handleFullScreenChange");
//     setFullScreenMode(document.fullscreenElement !== null);
//   };

//   useEffect(() => {
//     document.addEventListener("fullscreenchange", handleFullScreenChange);
//     return () =>
//       document.removeEventListener("fullscreenchange", handleFullScreenChange);
//   }, []);

//   useEffect(() => {
//     toogleHideOverlays(showOverlays);
//   }, [showOverlays]);

//   const [isActive, setIsActive] = useState(false);


//   return (
//      <div className="absolute z-10 left-0 bottom-0 md:bottom-[-12px] md:left-[-12px] lg:bottom-0 rounded-md flex p-2 md:p-4 gap-2 w-auto">
//       <div className="flex p-2 gap-2 rounded-md">
//         <IconButton
//           className="icon-btn"
//           icon={HideIconBlack}
//           tooltip="Hide Overlays"
//           activeTooltip="Show Overlay"
//           onClick={() => {
//             setShowOverlays((old) => !old);
//             setIsActive((old) => !old);
//           }}
//           isActive={isActive}
//         />

//         {/* Fullscreen Button */}
//         <IconButton
//           icon={FullScreenIcon}
//           tooltip="Fullscreen"
//           activeTooltip="Close Fullscreen"
//           onClick={() => toggleFullScreen()}
//           isActive={false} // Fullscreen button typically doesn't have an active state tied to itself
//         />
//       </div>
//     </div>
//   );
// }









import React, { useEffect, useState } from "react";
import IconButton from "./IconButton";
import { toggleFullScreen, toogleHideOverlays } from "../utilities/function";
import { FullScreenIcon, HideIconBlack, HideIconWhite } from "./Icons";

export default function ActionBtns() {
  const [showOverlays, setShowOverlays] = useState(true);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Detect if the device is iOS
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  const handleFullScreenChange = () => {
    if (!isIOS) {
      setFullScreenMode(document.fullscreenElement !== null);
    }
  };

  useEffect(() => {
    if (!isIOS) {
      document.addEventListener("fullscreenchange", handleFullScreenChange);
      return () => {
        document.removeEventListener("fullscreenchange", handleFullScreenChange);
      };
    }
  }, [isIOS]);

  useEffect(() => {
    toogleHideOverlays(showOverlays);
  }, [showOverlays]);

  return (
    <div className="absolute z-10 left-0 bottom-0 md:bottom-[-12px] md:left-[-12px] lg:bottom-0 rounded-md flex p-2 md:p-4 gap-2 w-auto">
      <div className="flex p-2 gap-2 rounded-md">
        <IconButton
          className="icon-btn"
          icon={HideIconBlack}
          tooltip="Hide Overlays"
          activeTooltip="Show Overlay"
          onClick={() => {
            setShowOverlays((old) => !old);
            setIsActive((old) => !old);
          }}
          isActive={isActive}
        />

        {/* Fullscreen Button - only show if not iOS */}
        {!isIOS && (
          <IconButton
            icon={FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            onClick={() => toggleFullScreen()}
            isActive={fullScreenMode}
          />
        )}
      </div>
    </div>
  );
}