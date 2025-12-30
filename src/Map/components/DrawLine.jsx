import React from "react";
import { useRef } from "react";
import { useEffect } from "react";

function DrawLine({ children, className }) {
  const ref = useRef(null);

  console.log()
  useEffect(() => {
    // acceesing path
    var path = ref.current.children[0];

    var length = path.getTotalLength();
    // Clear any previous transition
    path.style.transition = path.style.WebkitTransition = "none";
    // Set up the starting positions
    path.style.strokeDasharray = length + " " + length;
    path.style.strokeDashoffset = length;
    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    path.getBoundingClientRect();
    // Define our transition
    path.style.transition =
      path.style.WebkitTransition = `stroke-dashoffset ${Math.max(
        parseInt(length),
        2000
      )}ms linear`;
    path.style.strokeDashoffset = 0;
  }, [children?.props?.id]);
  return <g ref={ref} className={className}>{children}</g>;
}

export default DrawLine;


// import React, { useRef, useEffect } from "react";

// function DrawLine({ children, className }) {
//   const ref = useRef(null);

//   useEffect(() => {
//     // Ensure the ref and children are valid
//     if (ref.current && React.isValidElement(children)) {
//       // Access the path element
//       const path = ref.current.querySelector("path");

//       if (path) {
//         console.log("Path element found:", path);

//         const length = path.getTotalLength();
//         console.log("Path length:", length);

//         // Clear any previous transition
//         path.style.transition = path.style.WebkitTransition = "none";

//         // Set up the starting positions
//         path.style.strokeDasharray = `${length} ${length}`;
//         path.style.strokeDashoffset = length;

//         // Trigger a layout so styles are calculated
//         path.getBoundingClientRect();

//         // Define our transition
//         path.style.transition = path.style.WebkitTransition = `stroke-dashoffset ${Math.max(
//           length,
//           2000
//         )}ms linear`;

//         // Animate the stroke
//         path.style.strokeDashoffset = "0";
//       } else {
//         console.error("No path element found in children");
//       }
//     } else {
//       console.error("Invalid children or ref");
//     }
//   }, [children?.props?.id]); // Re-run effect if the ID changes

//   return (
//     <g ref={ref} className={className}>
//       {children}
//     </g>
//   );
// }

// export default DrawLine;
