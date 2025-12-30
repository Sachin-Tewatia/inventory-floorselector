import React from "react";
import { useState } from "react";
import styled from "styled-components";
import PopupVideoPlayer from "./PopupVideoPlayer";

function ProjectVideoBtn(props) {
  const [videoOpened, setVideoOpened] = useState(false);

  return (
    <>
      <PopupVideoPlayer
        open={videoOpened}
        setOpen={setVideoOpened}
        src="https://kuula.co/share/collection/7XfCK?logo=-1&info=0&fs=1&vr=1&sd=1&initload=1&autorotate=0.12&thumbs=1&iosfs=1"
      />
      <Style onClick={() => setVideoOpened(true)}>VR Tour</Style>
    </>
  );
}

const Style = styled.button`
  top: 2.3rem;
  color: var(--color_text);
  width: fit-content;
  margin: auto;
  position: absolute;
  box-shadow: 0 0 1px #07070756;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 5px;
  right: 6rem;
  background: rgba(15, 15, 15, 0.829);
  opacity: 1;
  transition: all 100ms ease-in-out;
  border: none;
  z-index: 100;
  cursor: pointer;
  :hover {
    opacity: 0.9;
  }
`;

export default ProjectVideoBtn;
