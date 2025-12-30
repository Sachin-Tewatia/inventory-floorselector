import React from "react";
import styled from "styled-components";

function Compass({ angle = 0 }) {
  return (
    <Style
      angle={angle}
      className="overlay-can-hide compasss"
    >
      <div class="compass__wrapper svelte-aa5lhs">
        <div
          class="compass__circle svelte-aa5lhs"
          style={{ transform: "rotate(0deg)" }}
        >
          <div
            class="compass__north svelte-aa5lhs"
            style={{ transform: "rotate(0deg)" }}
          >
            N
          </div>
          <div class="compass__arrow svelte-aa5lhs"></div>
        </div>
      </div>
    </Style>
  );
}

export default Compass;

const Style = styled.div`
  /* Base styles that apply to all screen sizes (or are overridden by media queries) */
  z-index: 10;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: all linear 200ms;
  transform-origin: center;
  transform: rotate(${(props) => props.angle}deg);
  border-radius: 50%;
  background: rgba(132, 131, 131, 0.4);
  backdrop-filter: blur(2px);

  /* Mobile styles (up to 480px, as the default/base) */
  width: 3.2rem;
  height: 3.2rem;
  right: 0.5rem;
  bottom: 16%;

  .compass__wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .compass__circle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .compass__north {
    font-size: 8px;
    line-height: 100%;
    font-weight: 400;
    color: #fff;
    text-align: center;
    top: -10px; /* Mobile top position */
    position: absolute;
    transition: var(--transition);
  }

  .compass__arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 1.8rem;
    height: 1.8rem; 
    border-radius: 100%;
    background-color: rgba(35, 35, 35, 0.5);
    transition: var(--transition);

    /* Mobile arrow triangle sizes */
    &::before {
      content: "";
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 2px 14px 2px;
      border-color: transparent transparent #fe191a transparent;
    }

    &::after {
      content: "";
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 14px 2px 0 2px;
      border-color: #fefefe transparent transparent transparent;
    }
  }

  /* Medium screen styles (min-width: 481px and max-width: 768px) */
  @media screen and (min-width: 481px) and (max-width: 768px) {
    width: 3rem;
    height: 3rem;
    right: 0.8rem;
    bottom: 21%;

    .compass__north {
      font-size: 8px;
      top: -10px;
    }

    .compass__arrow {
      width: 2rem;
      height: 2rem;

      &::before {
        border-width: 0 2px 15px 2px;
      }

      &::after {
        border-width: 15px 2px 0 2px;
      }
    }
  }

  /* Desktop screen styles (min-width: 769px) */
  @media screen and (min-width: 769px) {
    width: 4.5rem;
    height: 4.5rem;
    right: 1rem;
    bottom: 20%;

    .compass__north {
      font-size: 10px;
      top: -13px;
    }

    .compass__arrow {
      width: 2.5rem;
      height: 2.5rem;

      &::before {
        border-width: 0 3px 20px 3px;
      }

      &::after {
        border-width: 20px 3px 0 3px;
      }
    }
  }
    /* Medium screen styles (min-width: 768px and max-width: 1023px) */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  width: 3.5rem;
  height: 3.5rem;
  right: 1rem;
  bottom: 20%;

  .compass__north {
    font-size: 8px;
    top: -11px;
  }

  .compass__arrow {
    width: 2rem;
    height: 2rem;

    &::before {
      border-width: 0 2.5px 15px 2.5px;
    }

    &::after {
      border-width: 15px 2.5px 0 2.5px;
    }
  }
}

/* Large screen styles (min-width: 1024px) */
@media screen and (min-width: 1024px) {
  width: 4.5rem;
  height: 4.5rem;
  right: 1rem;
  bottom: 20%;

  .compass__north {
    font-size: 10px;
    top: -13px;
  }

  .compass__arrow {
    width: 2.5rem;
    height: 2.5rem;

    &::before {
      border-width: 0 3px 20px 3px;
    }

    &::after {
      border-width: 20px 3px 0 3px;
    }
  }
}
`;