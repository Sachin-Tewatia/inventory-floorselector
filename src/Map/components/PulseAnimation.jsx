// import React from 'react';

// const PulseAnimation = ({ x, y }) => {
//   const pulseStyle = {
//     position: 'absolute',
//     top: `${y}px`,
//     left: `${x}px`,
//     width: '10px',
//     height: '10px',
//     borderRadius: '50%',
//     border: '1px solid #12b9ff',
//   };

//   const spanStyle = (i) => ({
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     background: 'transparent',
//     border: '1px solid #12b9ff',
//     animation: 'animate 6s linear infinite',
//     animationDelay: `${i * 2}s`,
//     borderRadius: '50%',
//   });

//   const keyframes = `
//     @keyframes animate {
//       0% {
//         width: 10px;
//         height: 10px;
//         opacity: 1;
//       }
//       50% {
//         width: 10px;
//         height: 10px;
//         opacity: 1;
//       }
//       100% {
//         width: 40px;
//         height: 40px;
//         opacity: 0;
//       }
//     }
//   `;

//   return (
//     <>
//       <style>{keyframes}</style>
//       <div style={pulseStyle}>
//         <span style={spanStyle(1)}></span>
//         <span style={spanStyle(2)}></span>
//         <span style={spanStyle(3)}></span>
//         {/* <span style={spanStyle(4)}></span> */}
//       </div>
//     </>
//   );
// };

// export default PulseAnimation;



import React from 'react';

const PulseAnimation = ({ x, y }) => {
  const pulseStyle = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '1px solid #12b9ff',
   
  };

  const spanStyle = (i) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    border: '1px solid #12b9ff',
    animation: 'animate 6s linear infinite',
    animationDelay: `${i * 2}s`,
    borderRadius: '50%',
  });

  const keyframes = `
    @keyframes animate {
      0% {
        width: 10px;
        height: 10px;
        opacity: 1;
      }
      50% {
        width: 10px;
        height: 10px;
        opacity: 1;
      }
      100% {
        width: 40px;
        height: 40px;
        opacity: 0;
      }
    }
  `;
  console.log('PulseAnimation rendered with x:', x, 'y:', y);
  return (
    
    <>
      <style>{keyframes}</style>
      <div style={pulseStyle}>
        <span style={spanStyle(1)}></span>
        <span style={spanStyle(2)}></span>
        <span style={spanStyle(3)}></span>
      </div>
    </>
  );
};

export default PulseAnimation;