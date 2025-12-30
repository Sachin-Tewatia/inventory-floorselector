import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import IndiaMapVideo from "../Components/Atoms/IndiaMapVideo";
import Navigator from "../Components/Molecules/Navigator";
import IntroVideo from "../Components/Atoms/IntroVideo";

function IntroVideoPage(props) {
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isVideoFinished) {
      navigate("/salarpuria");
    }
  }, [isVideoFinished]);

  return (
    <Style>
      <Navigator
        className="navigator"
        nextPages={[
          {
            title: "Signature",
            path: "/salarpuria",
          },
        ]}
      />
      <IntroVideo onFinish={() => setIsVideoFinished(true)} />;
    </Style>
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

export default IntroVideoPage;
