import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Plus, Pencil, X, Maximize2 } from "lucide-react";
import { useInventories } from "../Hooks";
import { COMMBINED_TOWERS_LIST } from "../Data";
import { COMBINED_TOWERS_MAP } from "../Utility/Constants";
import { getFloorTypeUnit, getFloorName } from "../Data";
import Navigator from "../Components/Molecules/Navigator";
import Zoomable from "../Components/Molecules/Zoomable";

const MAX_UNITS = 3;
const FLOOR_PAGE_BG =
  "linear-gradient(68deg, rgba(48, 41, 32, 1) 0%, rgba(124, 111, 91, 1) 15%, rgba(138, 124, 102, 1) 25%, rgba(134, 121, 99, 1) 32%, rgba(121, 109, 90, 1) 45%, rgba(92, 86, 74, 1) 100%)";
const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect fill='%23e5e7eb' width='200' height='150'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";

function ImageLightbox({ src, alt, onClose }) {
  return (
    <LightboxOverlay onClick={onClose}>
      <LightboxContent onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>
        <img
          src={src}
          alt={alt}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMG;
          }}
        />
      </LightboxContent>
    </LightboxOverlay>
  );
}

function UnitImage({ src, alt }) {
  return (
    <UnitImageWrap>
      <Zoomable>
      <img
        src={src}
        alt={alt}
        draggable={false}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK_IMG;
        }}
      />
      </Zoomable>
    </UnitImageWrap>
  );
}

function getTowerDisplayName(tower) {
  if (!tower) return "";
  const num = tower.replace(/^T/i, "");
  return isNaN(parseInt(num, 10)) ? tower : `Tower ${num}`;
}

function UnitCard({ unit, onEdit, onRemove, onViewDetails, onImageClick, isFirst }) {
  const { unit_number, unit_type, status, bua, area, tower, floor } = unit;
  const floorType = (getFloorTypeUnit(tower, floor) || [])[0];
  const floorName = getFloorName(tower, floor, floor);
  const imgSrc = `/flats/${floorType}/${floorName}/${String(unit_number).toLowerCase()}.webp`;
  const towerName = getTowerDisplayName(tower);
  const floorLabel = floor === "G" || floor === "g" ? "Ground" : `Floor ${floor}`;

  return (
    <UnitCardStyle>
      <div className="unit-card-label">{isFirst ? "CURRENTLY SELECTED" : "COMPARE WITH"}</div>
      <div className="unit-name-row">{towerName} · {floorLabel} · Unit {unit_number}</div>
      <div className="unit-image-wrap">
        <UnitImage src={imgSrc} alt={`Unit ${unit_number}`} />
        <button
          type="button"
          className="icon-btn expand-btn"
          onClick={() => onImageClick?.({ src: imgSrc, alt: `Unit ${unit_number}` })}
          aria-label="Open image in full size"
        >
          <Maximize2 size={16} />
        </button>
        <div className="image-actions">
          <button type="button" className="icon-btn" onClick={onEdit} aria-label="Change unit">
            <Pencil size={14} />
          </button>
          <button type="button" className="icon-btn" onClick={onRemove} aria-label="Remove">
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="unit-config">
        <span className="config-label">CONFIGURATION</span>
        <span className="config-value">{unit_type}</span>
      </div>
      <div className="unit-area">
        <span className="area-label">TOTAL AREA</span>
        <span className="area-value">
          {unit?.area != null
            ? `${Math.ceil(parseFloat(unit.area))} Sq. Ft.`
            : "—"}
        </span>
      </div>
      <button type="button" className="view-btn" onClick={onViewDetails}>
        VIEW UNIT DETAILS
      </button>
    </UnitCardStyle>
  );
}

function AddUnitSlot({
  selectedTower,
  selectedFloor,
  selectedUnitId,
  onTowerChange,
  onFloorChange,
  onUnitChange,
  availableTowers,
  floors,
  units,
  excludedUnitIds,
  onAdd,
}) {
  const filteredUnits = units.filter((u) => !excludedUnitIds.includes(u.id));
  const canAdd = selectedUnitId && filteredUnits.some((u) => u.id === selectedUnitId);

  return (
    <AddSlotStyle>
      <div className="add-image-placeholder">
        <div
          className={`add-icon-wrap ${canAdd ? "clickable" : ""}`}
          onClick={canAdd ? onAdd : undefined}
          role={canAdd ? "button" : undefined}
        >
          <Plus size={36} strokeWidth={2} />
        </div>
      </div>
      <div className="add-content">
        <h3 className="add-title">Compare With</h3>
        <p className="add-subtitle">Select another unit to see a side-by-side comparison of features.</p>
        <div className="add-fields">
          <div className="field-group">
            <label>SELECT TOWER</label>
            <select
              value={selectedTower}
              onChange={(e) => onTowerChange(e.target.value)}
            >
              <option value="">Select tower</option>
              {availableTowers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="field-row">
            <div className="field-group">
              <label>FLOOR</label>
              <select
                value={selectedFloor}
                onChange={(e) => onFloorChange(e.target.value)}
                disabled={!selectedTower}
              >
                <option value="">Select floor</option>
                {floors.map((f) => (
                  <option key={f} value={f}>
                    {f === "G" || f === "g" ? "Ground" : `Floor ${f}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>UNIT</label>
              <select
                value={selectedUnitId}
                onChange={(e) => onUnitChange(e.target.value)}
                disabled={!selectedFloor}
              >
                <option value="">Select unit</option>
                {filteredUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.unit_number} ({u.unit_type})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {canAdd && (
          <button type="button" className="add-btn" onClick={onAdd}>
            Add to compare
          </button>
        )}
      </div>
    </AddSlotStyle>
  );
}

function UnitCompare() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getAllFloorsInTower, getAllUnitsInFloor, getUnitById } = useInventories();

  const initialUnit = location.state?.currentUnit ?? null;
  const [units, setUnits] = useState(() =>
    initialUnit ? [initialUnit] : []
  );

  const [addTower, setAddTower] = useState("");
  const [addFloor, setAddFloor] = useState("");
  const [addUnitId, setAddUnitId] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [editTower, setEditTower] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editUnitId, setEditUnitId] = useState("");

  const availableTowers = COMMBINED_TOWERS_LIST.flatMap(
    (group) => COMBINED_TOWERS_MAP[group] || []
  );
  const addFloors = addTower ? (getAllFloorsInTower(addTower) || []) : [];
  const addUnits =
    addTower && addFloor
      ? (getAllUnitsInFloor(addTower, addFloor) || [])
      : [];
  const editFloors = editTower ? (getAllFloorsInTower(editTower) || []) : [];
  const editUnits =
    editTower && editFloor
      ? (getAllUnitsInFloor(editTower, editFloor) || [])
      : [];

  const excludedIds = units.filter(Boolean).map((u) => u.id);
  const addExcludedIds = excludedIds;
  const editExcludedIds =
    editingIndex != null
      ? excludedIds.filter((_, i) => i !== editingIndex)
      : [];

  useEffect(() => {
    setAddFloor("");
    setAddUnitId("");
  }, [addTower]);

  useEffect(() => {
    setAddUnitId("");
  }, [addFloor]);

  useEffect(() => {
    if (editingIndex == null) return;
    const u = units[editingIndex];
    if (u) {
      setEditTower(u.tower);
      setEditFloor(u.floor);
      setEditUnitId(u.id);
    }
  }, [editingIndex]);

  useEffect(() => {
    setEditFloor("");
    setEditUnitId("");
  }, [editTower]);

  useEffect(() => {
    setEditUnitId("");
  }, [editFloor]);

  const handleAddUnit = () => {
    if (!addUnitId) return;
    const unit = getUnitById(addUnitId);
    if (!unit || units.some((u) => u && u.id === unit.id)) return;
    if (units.length >= MAX_UNITS) return;
    setUnits((prev) => [...prev, unit]);
    setAddTower("");
    setAddFloor("");
    setAddUnitId("");
  };

  const handleRemoveUnit = (index) => {
    setUnits((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
    else if (editingIndex != null && editingIndex > index)
      setEditingIndex((i) => i - 1);
  };

  const handleEditUnit = (index) => {
    setEditingIndex(index);
  };

  const handleApplyEdit = () => {
    if (editingIndex == null || !editUnitId) return;
    const unit = getUnitById(editUnitId);
    if (!unit) return;
    const alreadySelected = units.some(
      (u, i) => u && u.id === unit.id && i !== editingIndex
    );
    if (alreadySelected) return;
    setUnits((prev) =>
      prev.map((u, i) => (i === editingIndex ? unit : u))
    );
    setEditingIndex(null);
  };

  const handleViewDetails = (unit) => {
    navigate(`/inspire/unit/${unit.id}`);
  };

  const showAddSlot = units.length < MAX_UNITS;

  return (
    <PageWrap>
      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
      <Navigator
        prevPages={[{ title: "Inspire", path: "/inspire" }]}
        currentPage={{ title: "Compare units", path: "/inspire/compare" }}
      />
      <ContentWrap>
        <div className="content-frame">
          <h1 className="page-title">Compare <span className="accent">Premium</span> Units</h1>
          <p className="page-subtitle">
            Analyze layout configurations, dimensions, and spatial flow across different floor plans to find your perfect fit.
          </p>
        <div className="compare-grid">
          {units.map((unit, index) => (
            <div key={unit?.id ?? index} className="grid-col">
              {editingIndex === index ? (
                <EditSlotStyle>
                  <div className="edit-fields">
                    <select
                      value={editTower}
                      onChange={(e) => setEditTower(e.target.value)}
                    >
                      <option value="">Select Tower</option>
                      {availableTowers.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editFloor}
                      onChange={(e) => setEditFloor(e.target.value)}
                      disabled={!editTower}
                    >
                      <option value="">Select Floor</option>
                      {editFloors.map((f) => (
                        <option key={f} value={f}>
                          {f === "G" || f === "g" ? "Ground" : `Floor ${f}`}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editUnitId}
                      onChange={(e) => setEditUnitId(e.target.value)}
                      disabled={!editFloor}
                    >
                      <option value="">Select Unit</option>
                      {editUnits
                        .filter((u) => !editExcludedIds.includes(u.id))
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            Unit {u.unit_number} ({u.unit_type})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="edit-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setEditingIndex(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleApplyEdit}
                      disabled={!editUnitId}
                    >
                      Apply
                    </button>
                  </div>
                </EditSlotStyle>
              ) : (
                unit && (
                  <UnitCard
                    unit={unit}
                    isFirst={index === 0}
                    onEdit={() => handleEditUnit(index)}
                    onRemove={() => handleRemoveUnit(index)}
                    onViewDetails={() => handleViewDetails(unit)}
                    onImageClick={setLightboxImage}
                  />
                )
              )}
            </div>
          ))}
          {showAddSlot && (
            <div className="grid-col add-col">
              <AddUnitSlot
                selectedTower={addTower}
                selectedFloor={addFloor}
                selectedUnitId={addUnitId}
                onTowerChange={setAddTower}
                onFloorChange={setAddFloor}
                onUnitChange={setAddUnitId}
                availableTowers={availableTowers}
                floors={addFloors}
                units={addUnits}
                excludedUnitIds={addExcludedIds}
                onAdd={handleAddUnit}
              />
            </div>
          )}
        </div>
        </div>
      </ContentWrap>
    </PageWrap>
  );
}

export default UnitCompare;

const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
`;

const LightboxContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;

  img {
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
  }

  .lightbox-close {
    position: absolute;
    top: -40px;
    right: 0;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: var(--background_panel);
    color: var(--color_text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .lightbox-close:hover {
    background: var(--blue-theme);
  }
`;

const UnitImageWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    object-position: center;
    user-select: none;
  }
`;

const UnitCardStyle = styled.div`
  background: rgba(30, 55, 65, 0.85);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--blue-theme) 40%, transparent);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;

  .unit-card-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--blue-theme);
    padding: 16px 24px 4px;
  }

  .unit-name-row {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    padding: 0 24px 12px;
  }

  .unit-image-wrap {
    aspect-ratio: 4/3;
    min-height: 280px;
    position: relative;
    overflow: hidden;
    transition: opacity 0.2s;
    background: rgba(0, 0, 0, 0.2);
  }

  .unit-image-wrap > div:first-of-type {
    position: absolute;
    inset: 0;
  }

  .expand-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
  }

  .image-actions {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    gap: 8px;
  }

  .icon-btn {
    width: 34px;
    height: 34px;
    border: none;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .icon-btn:hover {
    background: var(--blue-theme);
  }

  .unit-config,
  .unit-area {
    margin: 12px 24px;
    padding: 12px 16px;
    background: color-mix(in srgb, var(--blue-theme) 8%, rgba(0, 0, 0, 0.2));
    border-radius: 10px;
    border-left: 3px solid var(--blue-theme);
  }

  .config-label,
  .area-label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: color-mix(in srgb, var(--blue-theme) 80%, rgba(255,255,255,0.6));
    margin-bottom: 4px;
  }

  .config-value {
    font-size: 15px;
    font-weight: 500;
    color: #fff;
  }

  .area-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--blue-theme);
  }

  .view-btn {
    margin: 16px 24px 24px;
    padding: 14px 20px;
    background: transparent;
    color: var(--blue-theme);
    border: 2px solid var(--blue-theme);
    border-radius: 10px;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .view-btn:hover {
    background: var(--blue-theme);
    color: #1a1a1a;
  }
`;

const AddSlotStyle = styled.div`
  background: rgba(45, 45, 50, 0.9);
  border: 2px dashed color-mix(in srgb, var(--blue-theme) 50%, transparent);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .add-image-placeholder {
    aspect-ratio: 4/3;
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
  }

  .add-icon-wrap {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 2px dashed var(--blue-theme);
    background: color-mix(in srgb, var(--blue-theme) 12%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--blue-theme);
    transition: border-color 0.2s, background 0.2s;
  }

  .add-icon-wrap.clickable {
    cursor: pointer;
  }

  .add-icon-wrap.clickable:hover {
    border-color: var(--blue-theme);
    background: color-mix(in srgb, var(--blue-theme) 20%, transparent);
  }

  .add-content {
    padding: 20px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .add-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--blue-theme);
    margin: 0;
  }

  .add-subtitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    line-height: 1.4;
  }

  .add-fields {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .field-row {
    display: flex;
    gap: 12px;
  }

  .field-group {
    flex: 1;
    min-width: 0;
  }

  .field-group label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: color-mix(in srgb, var(--blue-theme) 70%, rgba(255,255,255,0.6));
    margin-bottom: 6px;
  }

  .add-fields select {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    font-size: 14px;
    color: var(--color_text, #e5e7eb);
    background: rgba(0, 0, 0, 0.3);
  }

  .add-fields select:focus {
    outline: none;
    border-color: var(--blue-theme);
  }

  .add-fields select:disabled {
    background: rgba(0, 0, 0, 0.2);
    color: rgba(255, 255, 255, 0.4);
  }

  .add-fields select option {
    background: #2a2a2a;
    color: var(--color_text, #e5e7eb);
  }

  .add-btn {
    padding: 12px 20px;
    background: var(--blue-theme);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .add-btn:hover {
    opacity: 0.9;
  }
`;

const EditSlotStyle = styled.div`
  background: rgba(45, 45, 50, 0.95);
  backdrop-filter: blur(4px);
  border: 1px solid color-mix(in srgb, var(--blue-theme) 50%, transparent);
  border-radius: 16px;
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  .edit-fields select {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid rgba(67, 145, 165, 0.4);
    border-radius: 8px;
    font-size: 15px;
    color: var(--color_text, #e5e7eb);
    background: rgba(0, 0, 0, 0.2);
  }

  .edit-fields select option {
    background: #2a2a2a;
    color: var(--color_text, #e5e7eb);
  }

  .edit-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .btn-primary,
  .btn-secondary {
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    border: none;
  }

  .btn-primary {
    background: var(--blue-theme);
    color: #fff;
  }

  .btn-primary:hover:not(:disabled) {
    opacity: 0.9;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.15);
    color: var(--color_text, #e5e7eb);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const PageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1a1e;
  color: var(--color_text, #e5e7eb);
`;

const ContentWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;

  .content-frame {
    width: 100%;
    max-width: 1200px;
    padding: 32px 40px 40px;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 12px;
    text-align: center;
  }

  .page-title .accent {
    color: var(--blue-theme);
  }

  .page-subtitle {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.65);
    text-align: center;
    margin: 0 0 32px;
    line-height: 1.5;
  }

  .compare-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    align-items: start;
    width: 100%;
    max-width: 1200px;
  }

  .grid-col {
    min-width: 0;
    display: flex;
    justify-content: center;
  }

  .grid-col.add-col {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 900px) {
    .compare-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;

    .content-frame {
      padding: 24px 20px;
    }

    .page-title {
      font-size: 22px;
    }

    .page-subtitle {
      font-size: 14px;
      margin-bottom: 24px;
    }

    .compare-grid {
      gap: 24px;
    }
  }
`;
