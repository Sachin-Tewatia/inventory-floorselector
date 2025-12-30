// import React from "react";
// import styled from "styled-components";

// function RotateInstruction(props) {
//   return (
//     <Style id="rotate-instructions">
//       <div className="img-wrapper">
//         <img src={`${process.env.PUBLIC_URL}/gifs/rotate.gif`} />
//       </div>
//       <div className="instruction">Rotate Your Device</div>
//     </Style>
//   );
// }

// export default RotateInstruction;

// const Style = styled.div`
//   @media screen and (max-height: 480px) {
//     display: none;
//   }

//   @media screen and (min-width: 540px) {
//     display: none;
//   }
//   z-index: 300;
//   position: absolute;
//   width: 100vw;
//   height: 100vh;
//   background-color: white;
//   .img-wrapper {
//     display: grid;
//     place-items: center;
//     width: 100%;
//     height: 100%;
//     img {
//       width: 70%;
//       height: auto;
//     }
//   }

//   .instruction {
//     position: absolute;
//     top: 0;
//     width: 100%;
//     text-align: center;
//     font-size: 1.5rem;
//     padding: 1rem 0;
//     font-weight: 500;
//   }
// `;

import React from "react";
import styled from "styled-components";

function RotateInstruction(props) {
  return (
    <Style id="rotate-instructions">
      <div className="img-wrapper">
        <img src={`${process.env.PUBLIC_URL}/gifs/rotate.gif`} alt="Rotate device animation" />
      </div>
      <div className="instruction">Rotate Your Device</div>
    </Style>
  );
}

export default RotateInstruction;

const Style = styled.div`
  display: none;

  // @media screen and (orientation: portrait) {
  @media screen and (orientation: portrait) and (min-height: 480px) {
    display: block;
    z-index: 300;
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: white;

    .img-wrapper {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      img {
        width: 70%;
        height: auto;
      }
    }

    .instruction {
      position: absolute;
      top: 0;
      width: 100%;
      text-align: center;
      font-size: 1.5rem;
      padding: 1rem 0;
      font-weight: 500;
    }
  }

  @media screen and (orientation: landscape) {
    display: none;
  }
`;

