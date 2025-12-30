import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
function Logo(props) {
  return (
    <NavLink
      to="/"
      style={{ color: "white", textDecoration: "none", cursor: "pointer" }}
    >
      <Style>
        <img src={`${process.env.PUBLIC_URL}/logo.webp`} />
      </Style>
    </NavLink>
  );
}

const Style = styled.div`
  position: absolute;
  top: 1.35rem;
  left: 1rem;
  z-index: 101;
  img {
    width: 8rem;
    height: 4rem;
    background-color: white;
    padding: 0.5rem;
    border-radius: 10px;
  }
`;

export default Logo;
