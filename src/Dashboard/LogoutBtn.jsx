import { Button, Descriptions } from "antd";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "../Contexts/AppContext";
import styled from "styled-components";
import ChangePassword from "./ChangePassword";

function LogoutBtn(props) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const { user } = useContext(AppContext);

  return (
    <Style>
      <div>
        {" "}
        {user?.lastName
          ? `${user?.firstName} ${user?.lastName}`
          : `${user?.firstName}`}
      </div>
      <div>
        <Button onClick={handleLogout}>Logout</Button>
        <Button onClick={() => setIsOpen(true)}>Change Password</Button>

        {user.role == "admin" && (
          <>
            <Button onClick={() => navigate("/dashboard/users")}>
              Manage Users
            </Button>
           
          </>
        )}
      </div>
      <ChangePassword isOpen={isOpen} setIsOpen={(val) => setIsOpen(val)} />
    </Style>
  );
}

const Style = styled.div`
  justify-content: flex-end; /* Align children to the right */
  align-items: flex-start;
  // padding: 4px;
  color: black;
  display: flex;
  align-items: flex-end;
  margin: auto;
  background: #ffff;
  gap: 1rem;
  z-index: 999;
  div {
    button {
      margin: 0 1rem;
    }
  }
`;

export default LogoutBtn;
