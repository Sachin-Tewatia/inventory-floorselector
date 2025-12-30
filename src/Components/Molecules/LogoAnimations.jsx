import React, { useEffect, useRef } from "react";
import Lottie from "react-lottie";
import { useState } from "react";
import animationData from "../../Data/animation.json"; // Import the animation data
export default function LogoAnimations() {
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData, // Use the imported animation data
  };
  return (
    <div
      style={{
        backgroundColor: "black",
        width: "100%",
        height: "100vh", // Adjusted to full viewport height
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Lottie
        options={defaultOptions}
        height={250} // Adjust the size as needed
        width={250} // Adjust the size as needed
      />
    </div>
  );
}
