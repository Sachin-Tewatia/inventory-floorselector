import React, { useEffect, useState } from "react";
import styled from "styled-components";

const BGImage = ({ Bgsrc, onLoad, show }) => (
  <image
    height="100%"
    style={{ objectFit: "contain" }}
    xlinkHref={`${process.env.PUBLIC_URL}/images/${Bgsrc}`}
    onLoad={onLoad}
    opacity={show ? 1 : 0}
  />
);

function Svg({ Bgsrc, children, svgWidth = "100%", style, onClick }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
  }, []);
  return (
    <SvgStyle onClick={onClick}>
      <svg
        style={{ width: svgWidth, ...style }}
        id="svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox={"0 0 1920 1080"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <BGImage
          Bgsrc={Bgsrc}
          onLoad={() => setLoading(false)}
          show={!loading}
        />
        {children}
      </svg>
    </SvgStyle>
  );
}

export default Svg;

export const SvgStyle = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin: auto;
  svg {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  .Block {
    :hover {
      fill: var(--clr-blocked);
      fill-opacity: 0.4;
      stroke: black;
    }
  }

  .Sold {
    :hover {
      fill: var(--clr-sold);
      fill-opacity: 0.3;
      stroke: black;
    }
  }

  .Available {
    :hover {
      fill: var(--clr-available);
      fill-opacity: 0.2;
      stroke: black;
    }
  }
`;
