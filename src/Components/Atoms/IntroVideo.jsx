import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import Loading from "./Loading";

function IntroVideo({ onFinish, src = "", isPopup }) {
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref || !ref.current) return;

    setTimeout(() => {
      ref.current.play();
    }, [100]);
  }, [ref]);

  return (
    <>
      {loading && !isPopup && <Loading />}
      {/* <Style
        className={isPopup ? "popup" : ""}
        ref={ref}
        muted
        preload="auto"
        onCanPlayThrough={() => setLoading(false)}
        onEnded={onFinish}
      > */}
      {/* <source src={src} type="video/mp4" /> */}
      <div className=" w-full h-full">
        <iframe
          frameBorder="0"
          alt="tour"
          width="100%"
          height="100%"
          src={src}
          title="tour"
        />
      </div>
      {/* </Style> */}
    </>
  );
}

const Style = styled.video`
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;

  &.popup {
    height: 98vh;
    width: 98vw;
    top: 1vh;
    left: 1vw;
    border-radius: 10px;
    overflow: hidden;
  }
`;

export default IntroVideo;
