import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LogoutBtn from "./LogoutBtn";

function DashboardWrapper(props) {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.getItem("token") || navigate("/admin/login");
  }, []);

  return (
    <Style>
      <LogoutBtn />
      {props.children}
    </Style>
  );
}

const Style = styled.div`
  background-color: white;
  color: var(--input_label_text_color);
  font-weight: normal;
  padding: 1rem;
  height: 100vh;
  overflow: scroll !important;
  .row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .title1 {
    font-size: 3rem;
    margin: 2.2rem 0 1.4rem 0;
    text-align: center;
    color: #463c859a;
    font-weight: 800;
  }

  .head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    .datafield {
      display: flex;
      gap: 1rem;
    }
    .actualdata {
      font-size: 1.2rem;
      padding: 0 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #0e02589a;
      box-shadow: 1px 1px 0px 0px #160b5e6a;
      color: #1b10609a;
      font-weight: 600;
      border-radius: 0.4rem;
    }
    .filterbutton {
      background-color: #3f608fea !important;
      margin: 0 10px;
    }

    .buttonHover {
      color: white;
      &:hover {
        opacity: 0.9;
        color:#fff;
      }
    }
  }
  .center {
    align-items: center;
  }

  table {
    border-collapse: collapse;
  }

  .ant-table-row {
    &.available,
    &.confirmed {
      border-left: 4px solid #069329b0;
    }
    &.sold,
    &.cancelled {
      border-left: 4px solid #f0a1a1f7;
    }
    &.hold,
    &.pending {
      border-left: 4px solid #669df2d6;
    }
    &.hold_by_management {
      border-left: 4px solid orange;
    }
  }
`;

export default DashboardWrapper;
