import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "antd";
import styled, { createGlobalStyle } from "styled-components";
import { MapInteractionCSS } from "react-map-interaction";
import { ArrowLeftRight, Plus, Maximize2, BarChart2 } from "lucide-react";
import { useInventories } from "../../Hooks";
import { COMMBINED_TOWERS_LIST } from "../../Data";
import { COMBINED_TOWERS_MAP } from "../../Utility/Constants";
import { getFloorTypeUnit, getFloorName } from "../../Data";
import Zoomable from "./Zoomable";

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect fill='%23363636' width='200' height='150'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

function ZoomableImage({ src, alt }) {
  const [value, setValue] = useState({ scale: 1, translation: { x: 0, y: 0 } });

  const handleChange = useCallback((next) => {
    if (next.scale <= 1) {
      setValue({ scale: 1, translation: { x: 0, y: 0 } });
    } else {
      setValue(next);
    }
  }, []);

  useEffect(() => {
    setValue({ scale: 1, translation: { x: 0, y: 0 } });
  }, [src]);

  return (
    <ZoomableImageWrap>
      <MapInteractionCSS
        value={value}
        onChange={handleChange}
        minScale={1}
        maxScale={5}
        style={{ cursor: "grab", width: "100%", height: "100%" }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMG;
          }}
        />
      </MapInteractionCSS>
    </ZoomableImageWrap>
  );
}

function UnitSummary({ unit, label, upperUnitForImage }) {
  if (!unit) return null;
  const { unit_number, unit_type, status, area, tower, floor } = unit;
  const floorType = (getFloorTypeUnit(tower, floor) || [])[0];
  const upper = upperUnitForImage != null ? upperUnitForImage : floor;
  const floorName = getFloorName(tower, floor, upper);
  const imgSrc = `/flats/${floorType}/${floorName}/${String(unit_number).toLowerCase()}.webp`;

  return (
    <UnitSummaryStyle>
      <div className="unit-label">{label}</div>
      <div className="unit-image-card">
        <div className="unit-image-wrap">
          <Zoomable>
            <img
            src={imgSrc}
            alt={`Unit ${unit_number}`}
            draggable={false}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMG;
            }}
          />
          </Zoomable>
        </div>
      </div>
      <div className="unit-details">
        <div className="detail-row">
          <span className="label">Unit</span>
          <span className="value">{unit_number}</span>
        </div>
        <div className="detail-row">
          <span className="label">Type</span>
          <span className="value">{unit_type}</span>
        </div>
        <div className="detail-row">
          <span className="label">Status</span>
          <span className={`value unit-status ${status}`}>{String(status || "").toUpperCase()}</span>
        </div>
        <div className="detail-row">
          <span className="label">Area</span>
          <span className="value">{unit?.area != null ? `${Math.ceil(parseFloat(unit.area))} Sq. Ft.` : "—"}</span>
        </div>
      </div>
    </UnitSummaryStyle>
  );
}

function UnitCompareModal({ open, onClose, currentUnit, upperUnit }) {
  const { getAllFloorsInTower, getAllUnitsInFloor, getUnitById } = useInventories();
  const [selectedTower, setSelectedTower] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [otherUnit, setOtherUnit] = useState(null);

  const availableTowers = COMMBINED_TOWERS_LIST.flatMap(
    (group) => COMBINED_TOWERS_MAP[group] || []
  );
  const floors = selectedTower ? (getAllFloorsInTower(selectedTower) || []) : [];
  const units = selectedTower && selectedFloor
    ? (getAllUnitsInFloor(selectedTower, selectedFloor) || []).filter(
        (u) => currentUnit && u.id !== currentUnit.id
      )
    : [];

  useEffect(() => {
    if (!open) return;
    setSelectedTower("");
    setSelectedFloor("");
    setSelectedUnitId("");
    setOtherUnit(null);
  }, [open]);

  useEffect(() => {
    setSelectedFloor("");
    setSelectedUnitId("");
    setOtherUnit(null);
  }, [selectedTower]);

  useEffect(() => {
    setSelectedUnitId("");
    setOtherUnit(null);
  }, [selectedFloor]);

  useEffect(() => {
    if (!selectedUnitId) {
      setOtherUnit(null);
      return;
    }
    setOtherUnit(getUnitById(selectedUnitId) || null);
  }, [selectedUnitId, getUnitById]);

  return (
    <>
      <UnitCompareModalStyles />
      <Modal
        title={
          <span className="unit-compare-modal-title">
            <ArrowLeftRight size={18} className="compare-icon" />
            Compare units
          </span>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width="70%"
        centered
        destroyOnClose
        className="unit-compare-modal"
        closeIcon={<span style={{ color: "var(--color_text)" }}>×</span>}
        styles={{
          content: { background: "rgba(0, 0, 0, 0.8)", borderRadius: "var(--radius)", maxWidth: "95vw" },
          header: { background: "rgba(0, 0, 0, 0.8)", borderBottom: "1px solid rgba(255,255,255,0.12)", color: "var(--color_text)" },
          body: { background: "rgba(0, 0, 0, 0.8)", color: "var(--color_text)", maxHeight: "75vh", overflowY: "auto" },
        }}
      >
      <CompareModalStyle>
        <div className="selectors-row">
          <div className="field">
            <label>TOWER</label>
            <select
              value={selectedTower}
              onChange={(e) => setSelectedTower(e.target.value)}
            >
              <option value="">Select tower</option>
              {availableTowers.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>FLOOR</label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              disabled={!selectedTower}
            >
              <option value="">Select floor</option>
              {floors.map((f) => (
                <option key={f} value={f}>{f === "G" || f === "g" ? "Ground" : `Floor ${f}`}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>UNIT</label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              disabled={!selectedFloor}
            >
              <option value="">Select unit</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>Unit {u.unit_number} ({u.unit_type})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="compare-grid">
          <div className="compare-col current">
            <UnitSummary
              unit={currentUnit}
              label="CURRENT UNIT"
              upperUnitForImage={upperUnit ?? currentUnit?.floor}
            />
          </div>
          <div className="compare-col other">
            {otherUnit ? (
              <UnitSummary unit={otherUnit} label="COMPARE WITH" />
            ) : (
              <div className="placeholder">
                <div className="placeholder-icon">
                  <Plus size={28} strokeWidth={2} />
                </div>
                <p className="placeholder-text">Select tower, floor, and unit to start comparison.</p>
              </div>
            )}
            <div className="compare-extras">
              <BarChart2 size={18} className="chart-icon" />
            </div>
          </div>
        </div>
      </CompareModalStyle>
      </Modal>
    </>
  );
}

export default UnitCompareModal;

const UnitCompareModalStyles = createGlobalStyle`
  .unit-compare-modal .ant-modal-title,
  .unit-compare-modal .ant-modal-title .unit-compare-modal-title {
    color: var(--color_text) !important;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .unit-compare-modal .unit-compare-modal-title .compare-icon {
    color: var(--blue-theme);
    flex-shrink: 0;
  }
  .unit-compare-modal .ant-modal-close {
    color: var(--color_text) !important;
  }
  .unit-compare-modal .unit-compare-modal-title {
    color: var(--color_text) !important;
  }
`;

const ZoomableImageWrap = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius);
  position: relative;
  & > div {
    width: 100%;
    height: 100%;
  }
  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    object-position: center;
    user-select: none;
    vertical-align: middle;
  }
`;

const UnitSummaryStyle = styled.div`
  .unit-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--blue-theme);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .unit-image-card {
    background: rgba(60, 60, 60, 0.5);
    border-radius: var(--radius);
    margin-bottom: 14px;
    overflow: hidden;
  }
  .unit-image-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    min-height: 200px;
    background: rgba(50, 50, 50, 0.4);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .zoom-expand-btn {
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.5);
    color: var(--color_text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    transition: background 0.2s;
  }
  .zoom-expand-btn:hover {
    background: var(--blue-theme);
  }
  .unit-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    font-size: 13px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .detail-row .label {
    color: var(--panel_title_color);
  }
  .detail-row .value {
    font-weight: 500;
    color: var(--color_text);
  }
  .detail-row .unit-status.available {
    color: #22c55e;
  }
  .detail-row .unit-status.sold {
    color: #ef4444;
  }
  .detail-row .unit-status.booked {
    color: #f59e0b;
  }
`;

const CompareModalStyle = styled.div`
  color-scheme: dark;
  padding: 4px 0;

  .selectors-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;
    gap: 14px;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
  .compare-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
  @media (max-width: 640px) {
    .compare-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .selectors-row {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 16px;
    }
  }
  .compare-col {
    min-width: 0;
  }
  .field {
    min-width: 140px;
  }
  .field label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: var(--blue-theme);
    margin-bottom: 6px;
    letter-spacing: 0.05em;
  }
  .field select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius);
    font-size: 14px;
    background: rgba(0, 0, 0, 0.25);
    color: var(--color_text);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .field select:hover:not(:disabled) {
    border-color: rgba(255, 255, 255, 0.3);
  }
  .field select:focus {
    outline: none;
    border-color: var(--blue-theme);
    box-shadow: 0 0 0 2px rgba(67, 145, 165, 0.25);
  }
  .field select:disabled {
    background: rgba(0, 0, 0, 0.15);
    color: rgba(189, 189, 189, 0.5);
    cursor: not-allowed;
  }
  .field select option {
    background: #2a2a2a;
    color: var(--color_text);
  }
  .placeholder {
    padding: 40px 24px;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--radius);
    color: var(--panel_title_color);
    font-size: 14px;
    border: 1px dashed rgba(255, 255, 255, 0.2);
    min-height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 14px;
  }
  .placeholder-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    color: var(--panel_title_color);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .placeholder-text {
    margin: 0;
    font-size: 14px;
    color: var(--panel_title_color);
    max-width: 260px;
    line-height: 1.4;
  }
  .compare-extras {
    position: relative;
    min-height: 100px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--radius);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .compare-extras .chart-icon {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: rgba(255, 255, 255, 0.35);
  }
`;
