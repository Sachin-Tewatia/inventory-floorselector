import { Button } from "antd";
import React from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  ImportInventoryAPI,
  baseURL,
  exportInventoryAPI,
  PROJECT_ID,
} from "../APIs";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { Spin } from "antd";

function ImportExport({
  exportOnly,
  exportAPI = exportInventoryAPI,
  isBooking,
}) {
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const navigate = useNavigate();

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const { status, data } = await exportAPI();
      if (status == 401) {
        localStorage.removeItem("token");
        navigate("/admin/login");
      } else if (status !== 200) message.error("Failed to export inventory");

      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        isBooking ? `${PROJECT_ID}-bookings.csv` : `${PROJECT_ID}-inventory.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
      message.error("Failed to export inventory");
    } finally {
      setExportLoading(false);
    }
  };

  const handleImport = async (e) => {
    try {
      setImportLoading(true);
      const file = e.target.files[0];
      const { status } = await ImportInventoryAPI(file);
      if (status == 401) {
        localStorage.removeItem("token");
        navigate("/admin/login");
      } else if (status !== 200) message.error("Failed to import inventory");
      else {
        message.success("Inventory imported successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to import inventory");
    } finally {
      setImportLoading(false);
    }
  };
  return (
    <Style>
      <Button
        className="import-export-btn"
        onClick={handleExport}
        loading={exportLoading}
      >
        Export
      </Button>
      {!exportOnly && (
        <>
          <label
            className="flex import-export-btn"
            htmlFor="inventory-upload-btn"
            style={{ gap: "1rem" }}
          >
            {importLoading && (
              <Spin style={{ width: "8px", height: "8px" }} size="5px" />
            )}
            <div
              className="label"
              style={{
                userSelect: importLoading ? "none" : "auto",
                margin:"auto"
              }}
            >
              Import
            </div>
          </label>
          <input
            onChange={handleImport}
            style={{ display: "none" }}
            type="file"
            id="inventory-upload-btn"
            accept=".csv"
          />
        </>
      )}
    </Style>
  );
}

const Style = styled.div`
  width: fit-content;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  label {
  }

  .import-export-btn {
    background-color: #fff;
    color: #000 !important;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 0.9rem;
    padding: 0.2rem 1rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

export default ImportExport;
