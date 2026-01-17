import React from "react";
import styled from "styled-components";

const ImageLoader = () => {
  return (
    <Style>
      <span className="loader"></span>
    </Style>
  );
};

export default ImageLoader;
const Style = styled.div`
  height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  /* background: #1b2227d8; */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #fff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
