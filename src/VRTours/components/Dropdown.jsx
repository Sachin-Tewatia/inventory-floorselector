import React from "react";
import styled from "styled-components";

function DropDown({ items = [], isSelected, onSelect }) {
  const [selected, setSelected] = React.useState(0);
  const [showList, setShowList] = React.useState(false);

  if (!items.length) return null;

  return (
    <Style
      onMouseEnter={() => setShowList(true)}
      onMouseLeave={() => setShowList(false)}
      className={isSelected ? "selected" : ""}
    >
      <div
        className="placeholder"
        onClick={() => onSelect(items[selected].key)}
      >
        {items[selected].label}
      </div>
      {showList && (
        <div className="list">
          <div className="separator"></div>
          {items.map((item, index) => (
            <div
              className={`item ${index === selected ? "selected" : ""}`}
              key={item.key}
              onClick={() => {
                setSelected(index);
                setShowList(false);
                onSelect(item.key);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </Style>
  );
}

const Style = styled.div`
  background: var(--clr-btn-background);
  color: #e6e3e3;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
  /* display: flex; */
  align-items: center;
  position: relative;
  font-weight: 400;
  border-radius: 0.5rem;
  min-width: 28rem;
  .placeholder {
    border-radius: 0.5rem;
    transition: all 0.3s ease;
    padding: 0.3rem 1.5rem;
  }
  &.selected {
    .placeholder {
      background: white;
      color: #333131;
    }
  }
  .list {
    position: absolute;
    z-index: 20;
    top: 100%;
    left: 0;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
    dipplay: flex;
    align-items: center;
    overflow: hidden;
    min-width: 16rem;
    box-shadow: 1px 1px 2px 1px rgba(49, 46, 46, 0.8);
    .separator {
      height: 1rem;
      background: transparent;
      width: 100%;
    }
    .item {
      transition: all 0.3s ease;
      background: var(--clr-btn-background);
      padding: 0.3rem 1.5rem;
      border-bottom: 1px solid #ae9b9b7f;
      /* min-width: 7rem; */
      &:hover {
        background: var(--clr-btn-hover);
      }
    }
    .selected {
      background: var(--clr-btn-selected);
    }
  }

  @media only screen and (max-width: 768px) {
    .placeholder {
      padding: 0.2rem 1.2rem;
    }
    .list {
      .item {
        padding: 0.3rem 1.1rem;
      }
    }
  }
`;

export default DropDown;
