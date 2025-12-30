import React from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Controls = () => {
  const { zoomIn, zoomOut } = useControls();

  
  return (
    <div className="absolute z-20 bottom-6 left-[7%] px-10 rounded-md flex gap-2 zoom-controls overlay-can-hide ">
      <button
        className="w-10 h-10 rounded-md text-black text-2xl backdrop-blur-sm flex items-center justify-center border-2 border-black"
        onClick={() => zoomIn()}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
        }
      >
    <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
  </button>
      <button
        className="w-10 h-10 rounded-md text-black text-2xl backdrop-blur-sm flex items-center justify-center border-2 border-black"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
        }
        onClick={() => zoomOut()}
      >
        <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
      </button>
    </div>
  );
};

function Zoomable({ children }) {
  const [backImage, setBackImage] = useState(3); // Used as maxScale
  const initialScale = 1; // Define initial scale

  const panningThresholdScale = 1.15; 

  const [isPanningDisabled, setIsPanningDisabled] = useState(initialScale <= panningThresholdScale);

  const handleTransformed = (api) => {
    if (api.state.scale <= panningThresholdScale) {
      setIsPanningDisabled(true); 
    } else {
      setIsPanningDisabled(false); // Enable panning otherwise
    }
  };

  return (
    <TransformWrapper
      initialScale={initialScale}
      maxScale={backImage} 
      minScale={initialScale} 
      panning={{
        disabled: isPanningDisabled, 
      }}
      onTransformed={handleTransformed}
      // doubleClick={{ disabled: true }}
    >
      {({ zoomIn, zoomOut, resetTransform, scale }) => (
        <>
          <TransformComponent
            wrapperStyle={{
              width: "100vw",
              height: "100vh",
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            contentStyle={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            {children}
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}


export default React.memo(Zoomable); // use React memo cannot work because zoomin zoom out have dynamic path
