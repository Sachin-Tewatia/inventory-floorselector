import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ToursDropdown = ({
  selectedCategory,
  imagesData,
  tours,
  setSelectedTour,
  handleCloseDropdown,
  isContentVisible,
  selectedTour,
}) => {
  // if (!selectedCategory || !isContentVisible) return null;
  if (!selectedCategory || !imagesData[selectedCategory]) return null;

  return (
    <ContentWrapper isVisible={isContentVisible}>
      <div className="image">
        {imagesData[selectedCategory] &&
          imagesData[selectedCategory].map((data, index) => (
            <div
              key={index}
              onClick={() => {
                handleCloseDropdown();
                setSelectedTour(Object.keys(tours)[index]);
              }}
              className={`tour-button
                 ${selectedTour == Object.keys(tours)[index] ? "selected" : ""}
                `}
            >
              <div
                className={`circle ${
                  selectedTour == Object.keys(tours)[index] ? "selected" : ""
                }
`}
              ></div>
              <button className="dataname">{data.name}</button>
            </div>
          ))}
      </div>
    </ContentWrapper>
  );
};
export default ToursDropdown;

const ContentWrapper = styled.div`
  position: absolute;
  top: 50%;
  z-index: 9999;
  /* background-color: #292a2e(0, 0, 0, 0.9); */
  transition: all 0.6s linear;
  /* transform: ${({ isVisible }) =>
    isVisible
      ? "translateX(60%) translateY(-50%)"
      : "translateX(-150%) translateY(-50%)"}; */

  animation: ${({ isVisible }) => (isVisible ? "animate " : "danimate ")};
  animation-duration: 0.8s;
  animation-fill-mode: forwards;
  @keyframes animate {
    0% {
      opacity: 0;
      display: none;
      transform: translateX(60%) translateY(-50%);
    }
    50% {
    }
    100% {
      opacity: 1;
      transform: translateX(60%) translateY(-55%);
    }
  }
  @keyframes danimate {
    0% {
      opacity: 1;
      transform: translateX(60%) translateY(-50%);
    }
    50% {
    }
    100% {
      opacity: 0;
      display: none;
      transform: translateX(60%) translateY(-45%);
    }
  }

  /* z-index: 2; */
  transform: translateX(60%) translateY(-50%);

  .image {
    max-height: 80vh;
    /* display: flex; */
    /* flex-direction: column; */
    /* align-items: center; */
    /* overflow-y: auto; */
    border-left: 2px dotted white;
    /* padding-top: -100px;  */

    .tour-button {
      /* border-left: 2px dotted white; */
      display: flex;
      padding: 8px 0;
      align-items: center;
      .circle {
        height: 20px;
        width: 25px;
        border-radius: 50%;
        background-color: white;
        margin-left: -11.5px;
      }

      .selected {
        background-color: var(--brand-color) !important;
      }
    }
    div {
      width: 80%;
    }
    button {
      /* width: 100%; */
      padding: 10px;
      border-radius: 7px;
      text-align: start;
      color: white;
      background: transparent;
      border: none;
      transition: all 0.2s linear;
      width: 200px;
      text-transform: uppercase;
      font-weight: 600;
    }
    :hover {
      cursor: pointer;
    }
  }

  /* @media only screen and (max-width: 1068px) {
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 7.7%;
    width: 88%;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 20px;
    height: 93.5vh;
    overflow-y: auto;
    .main {
      width: 98%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .head {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .logo {
          display: flex;
          gap: 8rem;

          .CloseButton {
            background-color: rgba(0, 0, 0, 0.3);
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
          }

          img {
            width: 20%;
          }
        }
        .headingname {
          margin-top: 1.5rem;
          font-size: 24px;
          width: 97%;
          text-align: start;
          color: white;
        }
      }

      .images {
        width: 97%;
        background-color: rgba(0, 0, 0, 0.7);
        border: 1px solid black;
        border-radius: 5px;
        margin-top: 2rem;

        .heading {
          color: white;
          height: 5vh;
          background-color: black;
        }

        .image {
          max-height: 89vh;
          display: flex;
          flex-direction: row;
          align-items: center;
          overflow-y: auto;

          .imgbox {
            width: 95%;
            margin-right: 2rem;
            border-right: none;
            border-bottom: none;

            .dataname {
              color: white;
              margin-bottom: 2px;
            }
          }
        }
      }
    }
  }
  @media only screen and (max-width: 769px) {
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 9.4%;
    width: 85%;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 20px;
    height: 93.5vh;
    overflow-y: auto;
    .main {
      width: 98%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .head {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .logo {
          display: flex;
          gap: 8rem;

          .CloseButton {
            background-color: rgba(0, 0, 0, 0.3);
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
          }

          img {
            width: 20%;
          }
        }
        .headingname {
          margin-top: 1.5rem;
          font-size: 24px;
          width: 97%;
          text-align: start;
          color: white;
        }
      }

      .images {
        width: 97%;
        background-color: rgba(0, 0, 0, 0.7);
        border: 1px solid black;
        border-radius: 5px;
        margin-top: 2rem;

        .heading {
          color: white;
          height: 5vh;
          background-color: black;
        }

        .image {
          max-height: 89vh;
          display: flex;
          flex-direction: row;
          align-items: center;
          overflow-y: auto;

          .imgbox {
            width: 95%;
            margin-right: 2rem;
            border-right: none;
            border-bottom: none;
            .imgg {
              width: 30vw;
            }
            .dataname {
              color: white;
              margin-bottom: 2px;
            }
          }
        }
      }
    }
  }
  @media only screen and (max-width: 573px) {
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 14.5%;
    width: 76%;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 20px;
    height: 93.5vh;
    overflow-y: auto;
    .main {
      width: 98%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .head {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .logo {
          display: flex;
          gap: 8rem;

          .CloseButton {
            background-color: rgba(0, 0, 0, 0.3);
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
          }

          img {
            width: 20%;
          }
        }
        .headingname {
          margin-top: 1.5rem;
          font-size: 24px;
          width: 97%;
          text-align: start;
          color: white;
        }
      }

      .images {
        width: 97%;
        background-color: rgba(0, 0, 0, 0.7);
        border: 1px solid black;
        border-radius: 5px;
        margin-top: 2rem;

        .heading {
          color: white;
          height: 5vh;
          background-color: black;
        }

        .image {
          max-height: 89vh;
          display: flex;
          flex-direction: row;
          align-items: center;
          overflow-y: auto;

          .imgbox {
            width: 95%;
            margin-right: 2rem;
            border-right: none;
            border-bottom: none;
            .imgg {
              width: 50vw;
            }
            .dataname {
              color: white;
              margin-bottom: 2px;
            }
          }
        }
      }
    }
  } */
`;
