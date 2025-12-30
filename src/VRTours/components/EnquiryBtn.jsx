import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BookNow from "./BookNow";

function EnquiryBtn(props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Style onClick={() => navigate("/")}>Book Now</Style>
      {/* <BookNow isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </>
  );
}

const Style = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: #163a5e;
  /* color: #b8b1b1e2; */
  color: white;
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    /* background: var(--clr-background); */
    opacity: 0.9;
    color: white;
  }
  @media only screen and (max-width: 768px) {
    top: unset;
    bottom: 0rem;
    left: 0rem;
    right: 0rem;
  }
`;

export default EnquiryBtn;
