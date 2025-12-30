import React, { useState } from "react";
import styled from "styled-components";
import Navigator from "./Navigator";
import { useNavigate } from "react-router-dom";

const VrTourBtn = () => {
  const navigate = useNavigate();

  return <Style onClick={() => navigate(`/salarpuria/vr-tour`)}>VR Tour</Style>;
};

export default VrTourBtn;

const Style = styled.div`
  top: 5.3rem;
  color: var(--color_text);
  width: fit-content;
  margin: auto;
  position: absolute;
  box-shadow: 0 0 1px #07070756;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 5px;
  right: 6rem;
  background: rgba(76, 106, 148, 0.829);
  opacity: 0.8;
  transition: all 100ms ease-in-out;
  border: none;
  z-index: 100;
  cursor: pointer;
  :hover {
    opacity: 0.9;
  }
`;
