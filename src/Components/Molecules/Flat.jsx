// import React, { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import { FullScreenIcon } from "../../Icons";
// import Compass from "../Atoms/Compass";
// import IconButton from "../Atoms/IconButton";
// import { toggleFullScreen, toogleHideOverlays } from "../../Utility/function";
// import { FLOORS_IMGS } from "../../Data/flatSvgs";
// import { Carousel } from "react-responsive-carousel";
// import Loading from "../Atoms/Loading";
// import ImageLoader from "../Atoms/ImageLoader";

// function Flat({ src, imageNumber, buttonClicked, imageAnimation }) {
//   const [loading, setloading] = useState(true);
//   const numberOfImages = [1, 2, 3];
  

//   const ref = useRef(null);
//   const onImageLoad = () => {
//     const element = ref.current;
//     if (buttonClicked == "prev") {
//       setTimeout(() => {
//         element.classList.remove("animate__fadeOutLeft");
//         element.classList.add("animate__fadeInRight");
//       }, 100);
//     }
//     if (buttonClicked == "next") {
//       setTimeout(() => {
//         element.classList.remove("animate__fadeOutRight");
//         element.classList.add("animate__fadeInLeft");
//       }, 100);
//     }
//     setloading(false);
//   };
//   // useEffect(() => {
//   //   // setImageShown("");
//   //   setloading(true);
//   //   const element = ref.current;
//   //   element.classList.remove("animate__fadeOutLeft");
//   //   element.classList.remove("animate__fadeOutRight");
//   //   element.classList.remove("animate__fadeInLeft");
//   //   element.classList.remove("animate__fadeInRight");
//   //   if (buttonClicked.length > 0) {
//   //     if (buttonClicked == "prev") {
//   //       element.classList.add("animate__fadeOutLeft");
//   //       // setTimeout(() => {
//   //       //   element.classList.add("animate__fadeInRight");
//   //       //   element.classList.remove("animate__fadeOutLeft");
//   //       // }, 1000);
//   //     }

//   //     if (buttonClicked == "next")
//   //       element.classList.add("animate__fadeOutRight");
//   //     // setTimeout(() => {
//   //     //   element.classList.add("animate__fadeInLeft");
//   //     //   element.classList.remove("animate__fadeOutRight");
//   //     // }, 1000);
//   //   }
//   // }, [src]);
//   return (
//     <>
//       {loading && <ImageLoader />}
//       <FlatStyle ref={ref} className={`no-select animate__animated`}>
//         {/* {buttonClicked && <div className="loader "> Loading...</div>} */}
//         <div
//           style={{
//             width: "100vw",
//             // opacity: imageLoading ? "0.1" : "1",
//           }}
//           className={`img-wrapper ${imageAnimation ? "zoom-fade-animation" : ""}`}
//         >
//           {/* <div className="flat-number">{flatNumber}</div> */}
//           {/* {numberOfImages.map((val, index) => ( */}
//           <img
//             // hidden={val !== imageNumber}
//             // src={`https://d1zhaax9dcu4d9.cloudfront.net/salarpuria/images/flats/${src}.webp`}
//             src={`${src}`}
//             onLoad={() => setloading(false)}
//           />
//           {/* ))} */}
//         </div>
//       </FlatStyle>
//     </>
//   );
// }

// export default Flat;

// const FlatStyle = styled.section`
//   transition: all 500ms ease-in-out;
//   height: 100vh;
//   width: 100%;
//   cursor: default;
//   /* margin-left: 8rem;
//   margin-top: 2rem;
//   */
//   .flat-number {
//     font-family: "Roboto", sans-serif;
//     background-color: var(--panel_background);
//     color: var(--color_text);
//     width: fit-content;
//     margin: auto;
//     padding: 0.3rem 1rem;
//     font-weight: 600;
//     border-radius: 10px;
//     font-size: 1.2rem;
//     position: absolute;
//     top: 0;
//   }
//   .img-wrapper {
//     /* padding-top: 2rem; */
//     transition: all 500ms ease-in-out;
//     height: 100vh;
//     display: flex;
//     flex-direction: row;
//     justify-content: center;
//     align-items: flex-end;
//     padding-bottom: 4rem;
//     padding-left: 18%;

//     img {
//       transition: all 500ms ease-in-out;
//       border-radius: 10px;
//       width: auto;
//       height: 85%;
//       object-fit: contain;
//     }
//   }

//   .img-wrapper.zoom-fade-animation {
//     animation: zoomFadeInOut 1.5s ease-in-out;
//   }

//   @keyframes zoomFadeInOut {
//     0% {
//       opacity: 0;
//       transform: scale(1.1);
//     }
//     30% {
//       opacity: 1;
//       transform: scale(1.05);
//     }
//     60% {
//       opacity: 1;
//       transform: scale(0.98);
//     }
//     100% {
//       opacity: 1;
//       transform: scale(1);
//     }
//   }
//   @media screen and (max-height: 480px) {
//     .flat-number {
//       font-size: 1rem;
//     }
//   }
// `;





import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { FullScreenIcon } from "../../Icons";
import Compass from "../Atoms/Compass";
import IconButton from "../Atoms/IconButton";
import { toggleFullScreen, toogleHideOverlays } from "../../Utility/function";
import { FLOORS_IMGS } from "../../Data/flatSvgs";
import { Carousel } from "react-responsive-carousel";
import Loading from "../Atoms/Loading";
import ImageLoader from "../Atoms/ImageLoader";
import { useRoomId } from "../../Hooks/useRoomId";
import { emitSyncDebounced, SYNC_EVENTS, getReceivingSync, setReceivingSync } from "../../services/socketSync";
import { useUnitFrameSync } from "../../Hooks/useUnitFrameSync";
import { useZoomSync } from "../../Hooks/useZoomSync";
// Frame configuration per unit type
const FRAME_CONFIG = {
    c: 101,
    d: 101,
    e: 101,
    b: 101,
    g: 70, // Add more units as needed
};
const DRAG_SENSITIVITY = 1.2; // How much drag distance needed to cycle through all frames
function Flat({ src, unitType = "c", imageAnimation = false }) {
    const TOTAL_FRAMES = FRAME_CONFIG[unitType.toLowerCase()] || 101;
    const { roomId } = useRoomId();
    const currentFrameRef = useRef(0);
    
    // State
    const [isLoading, setIsLoading] = useState(true);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [isZoomedIn, setIsZoomedIn] = useState(false);
    
    // Keep ref updated
    useEffect(() => {
        currentFrameRef.current = currentFrame;
    }, [currentFrame]);

    // Check if zoomed by inspecting parent transform
    const checkZoomState = useCallback(() => {
        if (!containerRef.current) return false;
        let element = containerRef.current.parentElement;
        for (let i = 0; i < 5 && element; i++) {
            const transform = window.getComputedStyle(element).transform;
            if (transform && transform !== 'none') {
                const match = transform.match(/matrix\(([^)]+)\)/);
                if (match) {
                    const [, scaleX, , , scaleY] = match[1].split(',').map(v => Math.abs(parseFloat(v.trim())));
                    if ((scaleX || 1) > 1.01 || (scaleY || 1) > 1.01) return true;
                }
            }
            element = element.parentElement;
        }
        return false;
    }, []);

    // Zoom detection
    useZoomSync((data) => {
        if (data?.scale !== undefined) setIsZoomedIn(data.scale > 1.01);
    });

    useEffect(() => {
        if (isLoading) return;
        const checkZoom = () => setIsZoomedIn(checkZoomState());
        const interval = setInterval(checkZoom, 200);
        checkZoom();
        return () => clearInterval(interval);
    }, [isLoading, checkZoomState]);
    // Refs
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const framesRef = useRef([]); // Store preloaded Image objects
    const dragStartPos = useRef({ x: 0, frame: 0 });
    const rafId = useRef(null);
    const isDraggingRef = useRef(false);
    const lastRenderedFrame = useRef(-1);
    // ====================================================================
    // 1. PRELOAD ALL FRAMES
    // ====================================================================
    useEffect(() => {
        const frames = [];
        let loadedCount = 0;
        const framePromises = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = `/frames/a/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
                img.onload = () => {
                    frames[i] = img;
                    setLoadProgress(Math.round((++loadedCount / TOTAL_FRAMES) * 100));
                    resolve();
                };
                img.onerror = reject;
            });
        });
        Promise.all(framePromises)
            .then(() => {
                framesRef.current = frames;
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
        return () => { framesRef.current = []; };
    }, [unitType]);
    // ====================================================================
    // 2. CANVAS RENDERING
    // ====================================================================
    const renderFrame = useCallback((frameIndex) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const frame = framesRef.current[frameIndex];
        if (!canvas || !ctx || !frame) return;
        // Avoid unnecessary redraws
        if (lastRenderedFrame.current === frameIndex) return;
        lastRenderedFrame.current = frameIndex;
        // Set canvas size to match image (only once or when needed)
        if (canvas.width !== frame.width || canvas.height !== frame.height) {
            canvas.width = frame.width;
            canvas.height = frame.height;
        }
        // Clear and draw the frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frame, 0, 0);
    }, []);
    // Update canvas when currentFrame changes
    useEffect(() => {
        if (!isLoading && framesRef.current.length > 0) {
            renderFrame(currentFrame);
        }
    }, [currentFrame, isLoading, renderFrame]);

    // Frame sync
    useUnitFrameSync({
        unitType: unitType.toLowerCase(),
        onSync: useCallback((frameIndex) => {
            if (frameIndex !== undefined && frameIndex !== currentFrameRef.current) {
                setReceivingSync(true);
                setCurrentFrame(Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1)));
                requestAnimationFrame(() => setReceivingSync(false));
            }
        }, [])
    });

    useEffect(() => {
        if (!getReceivingSync() && roomId && !isLoading) {
            emitSyncDebounced(SYNC_EVENTS.UNIT_FRAME, {
                unitType: unitType.toLowerCase(),
                frameIndex: currentFrame
            }, roomId, 100);
        }
    }, [currentFrame, roomId, unitType, isLoading]);
    // ====================================================================
    // 3. DRAG/SCRUB LOGIC
    // ====================================================================
    const updateFrameFromDrag = useCallback((clientX) => {
        if (!isDraggingRef.current || !containerRef.current) return;
        const containerWidth = containerRef.current.clientWidth;
        const deltaX = clientX - dragStartPos.current.x;
        // Calculate frame change based on drag distance
        const pixelsPerFrame = (containerWidth * DRAG_SENSITIVITY) / TOTAL_FRAMES;
        const frameDelta = Math.round(deltaX / pixelsPerFrame);
        const newFrame = dragStartPos.current.frame + frameDelta;
        // Clamp to valid frame range
        const clampedFrame = Math.max(0, Math.min(newFrame, TOTAL_FRAMES - 1));
        setCurrentFrame(clampedFrame);
    }, []);
    const handleMouseMove = useCallback((e) => {
        if (!isDraggingRef.current) return;
        const clientX = e.clientX || (e.touches?.[0]?.clientX);
        if (clientX === null) return;
        // Use RAF for smooth updates
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            updateFrameFromDrag(clientX);
        });
        e.preventDefault();
    }, [updateFrameFromDrag]);
    const handleDragStart = useCallback((e) => {
        if (isLoading || isZoomedIn || checkZoomState()) return;
        const clientX = e.clientX || (e.touches?.[0]?.clientX);
        if (clientX === null) return;
        isDraggingRef.current = true;
        setIsDragging(true);
        dragStartPos.current = { x: clientX, frame: currentFrame };
        e.preventDefault();
    }, [isLoading, currentFrame, isZoomedIn, checkZoomState]);
    const handleMouseUp = useCallback(() => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDragging(false);
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }
        }
    }, []);
    // ====================================================================
    // 4. GLOBAL EVENT LISTENERS
    // ====================================================================
    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleMouseMove, { passive: false });
            window.addEventListener("touchend", handleMouseUp);
            window.addEventListener("touchcancel", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleMouseMove);
            window.removeEventListener("touchend", handleMouseUp);
            window.removeEventListener("touchcancel", handleMouseUp);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);
    return (
        <>
            {/* {isLoading && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    zIndex: 1000
                }}>
                    <ImageLoader />
                    <div style={{
                        color: "white",
                        marginTop: "1rem",
                        fontSize: "1.2rem",
                        fontWeight: "600"
                    }}>
                        Loading frames... {loadProgress}%
                    </div>
                </div>
            )} */}
            <FlatStyle ref={containerRef} className="no-select animate__animated">
                <div className={`img-wrapper ${imageAnimation ? "zoom-fade-animation" : ""}`}>
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                        style={{
                            cursor: isZoomedIn ? "default" : (isDragging ? "grabbing" : "grab"),
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            touchAction: isZoomedIn ? "auto" : "none",
                            WebkitTouchCallout: "none",
                            maxHeight: "85%",
                            maxWidth: "100%",
                            objectFit: "contain",
                            borderRadius: "10px",
                            width: "auto",
                            height: "85%",
                        }}
                        draggable={false}
                    />
                    {/* {!isLoading && (
                        <div style={{
                            position: "absolute",
                            bottom: "1rem",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "rgba(0, 0, 0, 0.6)",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "500",
                            pointerEvents: "none",
                        }}>
                            Frame {currentFrame + 1} / {TOTAL_FRAMES}
                        </div>
                    )} */}
                </div>
            </FlatStyle>
        </>
    );
}
export default Flat;
const FlatStyle = styled.section`
  transition: all 500ms ease-in-out;
  height: 100vh;
  width: 100%;
  cursor: default;
  .flat-number {
    font-family: "Roboto", sans-serif;
    background-color: var(--panel_background);
    color: var(--color_text);
    width: fit-content;
    margin: auto;
    padding: 0.3rem 1rem;
    font-weight: 600;
    border-radius: 10px;
    font-size: 1.2rem;
    position: absolute;
    top: 0;
  }
  .img-wrapper {
    transition: all 500ms ease-in-out;
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 4rem;
    padding-left: 18%;
    canvas {
      transition: all 500ms ease-in-out;
      border-radius: 10px;
      width: auto;
      height: 85%;
      object-fit: contain;
      margin: 0 auto;
      margin-left: 14rem;
    }
  }

  .img-wrapper.zoom-fade-animation {
    animation: zoomFadeInOut 1.5s ease-in-out;
  }

  @keyframes zoomFadeInOut {
    0% {
      opacity: 0;
      transform: scale(1.1);
    }
    30% {
      opacity: 1;
      transform: scale(0.95);
    }
    60% {
      opacity: 1;
      transform: scale(0.98);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media screen and (max-height: 480px) {
    .flat-number {
      font-size: 1rem;
    }
  }

  @media screen and (max-width: 860px) {
    .img-wrapper {
      padding-left: 0 !important;
      canvas {
        margin-left: 12rem !important;
      }
    }
  }
`;