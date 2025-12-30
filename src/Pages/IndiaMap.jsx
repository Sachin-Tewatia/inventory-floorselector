import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import IndiaMapVideo from "../Components/Atoms/IndiaMapVideo";
import Navigator from "../Components/Molecules/Navigator";
import LogoAnimations from "../Components/Molecules/LogoAnimations";

function IndiaMap(props) {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [animationTime, setAnimationTime] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (isVideoFinished) {
      navigate("india/delhi");
    }
  }, [isVideoFinished]);
  // useEffect(() => {
  //   const timeout = setTimeout(() => setAnimationTime(false), [3000]);
  //   return () => clearTimeout(timeout);
  // });
  return (
    <>
      {animationTime ? (
        <Logoanimate>
          <LogoAnimations />{" "}
        </Logoanimate>
      ) : (
        <Style>
          <Navigator
            className="navigator"
            // currentPage={{ title: "India", path: "/india" }}
            nextPages={[
              { title: "Kolkata", path: "" },
              {
                title: "Salarpuria",
                path: "",
              },
            ]}
          />
          <IndiaMapVideo onFinish={() => setIsVideoFinished(true)} />;
        </Style>
      )}
    </>
  );
}

const Style = styled.div`
  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
  }
`;
const Logoanimate = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

export default IndiaMap;
