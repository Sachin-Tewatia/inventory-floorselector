// Confirm.js
import React, { useContext } from "react";
import { AppContext } from "../../Contexts/AppContext";
import styled from "styled-components";

const Confirm = ({ message, setBookNowOpen }) => {
  const { setIsConfirmVisible } = useContext(AppContext);

  const handleContinueBooking = () => {
    setIsConfirmVisible(false);
  };

  const handleCancelBooking = () => {
    setIsConfirmVisible(false);
    setBookNowOpen(false);
  };

  return (
    <ConfirmStyled>
      <p>{message}</p>
      <button onClick={handleContinueBooking}>Continue Booking</button>
      <button onClick={handleCancelBooking}>Cancel Booking</button>
    </ConfirmStyled>
  );
};

export default Confirm;
const ConfirmStyled = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(7, 74, 168, 1);
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  z-index: 99999;
  p {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: white;
  }
  button {
    padding: 10px 20px;
    border-radius: 5px;
    width: 200px;
    margin: 10px 10px;
    background-color: #379573;
    cursor: pointer;
    &:hover {
      background: #09c781;
    }
  }
`;
