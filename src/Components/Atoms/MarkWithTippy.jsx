import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import tippy from "tippy.js";
import "tippy.js/animations/shift-toward.css";
import { car_icon } from "../../Data/icons";

function MarkWithTippy({ children, bgColor = "#ffffffdd" }) {
  const ref = useRef(null);

  useEffect(() => {
    // First, destroy any existing tippy instances on the children.
    for (let i = 0; i < ref.current.children.length; i++) {
      if (ref.current.children[i]._tippy) {
        ref.current.children[i]._tippy.destroy();
      }
    }

    // Iterate over all children of the ref element.
    for (let i = 0; i < ref.current.children.length; i++) {
      const ele = ref.current.children[i];

      // Determine a className from the element's id.
      // For example, if id starts with "__mall " then we extract the type.
      let className = ele.id.substr(2, ele.id.indexOf(" ") - 1);
      let isHighway = className === "highway ";
      if (isHighway) {
        className = ele.id.substr(2);
      }

      // Remove known prefixes to get the raw text.
      // This will yield a string like "StoreName_d_200_5".
      let tippyText =
        ele.id
          .replace("__mall ", "")
          .replace("__hotel ", "")
          .replace("__highway ", "")
          .replace("__hospital ", "")
          .replace("__school ", "") || null;
      if (!tippyText) continue;

      // ----- Extraction Logic for Distance and Time -----
      // Split by the delimiter "_d_"
      const parts = tippyText.split("_d_");
      // The main label is the first part.
      const mainText = parts[0];
      let distance = null;
      let time = null;

      // If there is a second part, we assume it's formatted as "distance_time".
      if (parts.length > 1) {
        const dtPart = parts[parts.length - 1];
        const dtSplit = dtPart.split("_");
        if (dtSplit.length >= 2) {
          distance = dtSplit[0];
          time = dtSplit[1];
        }
      }
      // ----------------------------------------------------

      // Create the primary tippy tooltip with the main text.
      const instance = tippy(ele, {
        content: isHighway
          ? `<div className="${className} tippy-mark">
          ${mainText}
         </div>`
          : `
          <div className="${className} tippy-mark">
            ${mainText}
            <div style="display: flex; align-items: center; gap: 4px;">
              <svg
                width="21"
                height="12"
                viewBox="0 0 41 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M39.8418 10.3434H35.4019C34.3195 6.32161 32.688 1.23314 28.6282 0.534665C24.4963 -0.178222 15.9705 -0.178222 11.8374 0.534665C7.77495 1.23314 6.14602 6.32161 5.06489 10.3434H0.625073C0.459956 10.3447 0.301393 10.4089 0.184763 10.5216C0.0668216 10.6356 0.00131045 10.7889 0 10.9488V12.6576C0.00131045 12.8175 0.0668216 12.9708 0.184763 13.0848C0.301393 13.1975 0.459956 13.2618 0.625073 13.2631C1.5935 13.2068 2.61701 13.2067 3.58543 13.2067C2.95904 13.8148 2.44662 14.8619 2.44662 15.5774V25.2223V30.6214C2.44531 30.8035 2.48072 30.983 2.55148 31.1508C2.62225 31.3185 2.72578 31.4705 2.85814 31.5989C2.9905 31.7273 3.14768 31.8296 3.32197 31.8977C3.49495 31.9672 3.67974 32.0013 3.86714 32H9.44576C9.63316 32.0013 9.81923 31.9672 9.99221 31.899C10.1665 31.8296 10.3238 31.7287 10.4561 31.6003C10.5885 31.4719 10.6933 31.3198 10.7641 31.1508C10.8348 30.983 10.8702 30.8035 10.8689 30.6214V27.5916C17.0923 26.9298 23.3706 26.9298 29.594 27.5916V30.6214C29.5927 30.8035 29.6281 30.9831 29.6989 31.1521C29.7696 31.3199 29.8744 31.4719 30.0068 31.6003C30.1405 31.7287 30.2977 31.8309 30.472 31.899C30.645 31.9672 30.831 32.0013 31.0184 32H36.5983C36.7857 32.0013 36.9719 31.9672 37.1461 31.899C37.3191 31.8296 37.4763 31.7287 37.6087 31.6003C37.741 31.4719 37.8459 31.3198 37.9167 31.1508C37.9888 30.983 38.0241 30.8035 38.0215 30.6214V15.5774C38.0215 14.8619 37.5091 13.8148 36.884 13.208C37.8512 13.208 38.8183 13.2081 39.843 13.2644C40.0095 13.2631 40.1681 13.1988 40.2847 13.0848C40.4013 12.9721 40.4682 12.8189 40.4695 12.659V10.9502C40.4682 10.789 40.4013 10.6356 40.2847 10.5216C40.1668 10.4076 40.0069 10.3434 39.8418 10.3434ZM12.2933 21.1992C10.2451 21.4744 7.95966 22.0549 6.08964 21.1992C5.18019 20.7825 4.59971 19.434 4.78055 18.0581C4.95877 16.7096 6.22204 15.6101 7.56918 15.8539C9.74585 16.247 14.7348 17.1355 15.179 19.3331C15.3834 20.3448 13.0901 20.9777 12.2933 21.1992ZM8.53627 11.7757C7.17077 10.0682 7.90338 3.44781 11.7247 2.73886C17.3282 1.70491 23.0824 1.70491 28.6859 2.73886C32.5058 3.44781 33.296 10.0682 31.8729 11.7757C24.1399 12.9329 16.2693 12.9329 8.53627 11.7757ZM33.3222 21.3158C31.1088 21.2477 26.04 21.1036 25.2564 18.9964C24.896 18.0266 27.0622 17.0634 27.8157 16.7279C29.7971 16.154 31.9633 15.2432 33.946 15.8172C34.9118 16.0989 35.6968 17.3425 35.7335 18.729C35.7702 20.0879 34.6929 21.3591 33.3222 21.3158Z"
                  fill="white"
                />
              </svg>
             ${distance} km | ${time} min
            </div>
          </div>`,
        animation: "shift-toward",
        placement: "left",
        allowHTML: true,
        arrow: false,
        followCursor: true,
        offset: [isHighway ? 0 : 0, isHighway ? -100 : 0],
        role: "tooltip",
        trigger: isHighway ? "click mouseenter" : "mouseenter",
      });

      // If distance and time exist, create a secondary tooltip on the main tooltip's popper.
      if (distance && time) {
        tippy(instance.popper, {
          content: `<div className="tippy-distance-info">Distance: ${distance}, Time: ${time}</div>`,
          animation: "shift-toward",
          placement: "bottom",
          allowHTML: true,
          arrow: false,
          followCursor: false,
          offset: [0, 0],
          role: "tooltip",
          trigger: "mouseenter",
        });
      }
    }

    // Cleanup function: destroy all tippy instances when the component unmounts.
    return () => {
      if (!ref.current) return;
      for (let i = 0; i < ref.current.children.length; i++) {
        if (ref.current.children[i]._tippy) {
          ref.current.children[i]._tippy.destroy();
        }
      }
    };
  }, []);

  return <Style ref={ref}>{children}</Style>;
}

export default MarkWithTippy;

const Style = styled.g`
  cursor: pointer;
`;
