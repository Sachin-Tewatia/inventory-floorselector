import React from "react";
import styled from "styled-components";
import { } from "../../Data/images/ApartmentsDetailsSvgs";
// import BookNow from "./BookNow";
import BookNow from "../Moecules/BookNow";
import { useInventories } from "../../Hooks";
import { useParams } from "react-router-dom";
import { UNIT_STATUS } from "../../Data";
import Price from "../Atoms/Price";
import { getFlatVrTours } from "../../Utility/Constants";

function ApartmentsDetails({ selectedUnit, onVRClick, showVRBtn = false }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const unitDetails = selectedUnit;

  return (
    <Style id="appartmnet-details-panel">
      <div className="interface--col svelte-9mhvmf">
        <div
          className="panel panel__unit-card svelte-1m6i2pp"
          style={{ maxHeight: "none" }}
        >
          <div
            className="panel unitCard svelte-1e3fizx"
            style={{
              maxWidth: "240px",
              minWidth: "200px",
              padding: 0,
              maxHeight: "none",
            }}
          >
            <div className="body svelte-1e3fizx">
              <div slot="body_not_hidden" className="svelte-1m6i2pp">
                <div
                  className="unit-properties svelte-1m6i2pp"
                  style={{ maxHeight: "172px" }}
                >
                  {/* <div className="unit-row svelte-1m6i2pp">
                    <div className="type svelte-1m6i2pp ">Apartment Details</div>
                  </div> */}
                  <div className="features">
                    <div className="feature">
                      <div className="left">Unit {unitDetails.unit_number}</div>
                    </div>
                    <div className="feature">
                      <div className="left">{unitDetails.unit_type}</div>
                      {/* <div className="rigth">
                        {" "}
                        {[1, 4].includes(flatNumber)
                          ? "Park Facing"
                          : "Road Facing"}
                      </div> */}
                    </div>

                    <div className="feature">
                      <div className="right"> Unit Status</div>
                      <div
                        className={`left unit-status ${unitDetails?.status}`}
                      >
                        {unitDetails?.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="feature">
                      <div className={`left `}>Total BUA</div>
                      <div className="right">
                        {Math.ceil(parseFloat(unitDetails?.bua))} Sq. Ft.
                      </div>
                    </div>

                    {/* <div className="feature">
                      <div className={`left `}>Total Cost</div>
                      <div className="right">
                        <Price price={unitDetails?.area} />
                      </div>
                    </div> */}
                  </div>
                  {/* <div
                    className="unit-row svelte-1m6i2pp"
                    style={{ marginTop: "0.5rem", marginBottom: "0" }}
                  >
                    <div className="area svelte-1m6i2pp">Unit Status</div>
                    <div className="area-count svelte-1m6i2pp">
                      <span
                        className={`area svelte-wv78a7 unit-status ${unitDetails?.Status}`}
                      >
                        {unitDetails?.Status}
                      </span>
                    </div>
                  </div> */}
                  {/* <div className="secondary-area svelte-1m6i2pp">
                    <div className="unit-row svelte-1m6i2pp">
                      <div className="area svelte-1m6i2pp">Suite Area</div>
                      <div className="area-count svelte-1m6i2pp">
                        <span className="area svelte-wv78a7">10,763.9</span>
                        <span className="area-change svelte-wv78a7">Sq. Ft.</span>
                      </div>
                    </div>{" "}
                    <div className="unit-row svelte-1m6i2pp">
                      <div className="area svelte-1m6i2pp">Balcony Area</div>
                      <div className="area-count svelte-1m6i2pp">
                        <span className="area svelte-wv78a7">11,840.29</span>
                        <span className="area-change svelte-wv78a7">Sq. Ft.</span>
                      </div>
                    </div>
                  </div>{" "} */}

                  {/* <div className="unit-row svelte-1m6i2pp">
                    <div className="area svelte-1m6i2pp">
                      {" "}
                      Unit {unitDetails.FlatNumber}
                    </div>
                    <div className="area-count svelte-1m6i2pp">
                      <span className={`area svelte-wv78a7`}>
                        {unitDetails?.UnitType}
                      </span>
                    </div>
                  </div>
                  <div className="unit-row svelte-1m6i2pp">
                    <div className="area svelte-1m6i2pp">Total Area</div>
                    <div className="area-count svelte-1m6i2pp">
                      <span className="area svelte-wv78a7">{unitDetails?.SBU}</span>
                      <span className="area-change svelte-wv78a7"> Sq. Ft.</span>
                    </div>
                  </div>{" "}
                  <div className="unit-row svelte-1m6i2pp">
                    <div className="price svelte-1m6i2pp">Total Cost</div>
                    <div className="price-count svelte-1m6i2pp">
                      <Price price={unitDetails?.TotalCost} />
                    </div>
                  </div>{" "} */}
                  <div className="buttons svelte-1m6i2pp">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // opens the book now modal
                        setIsOpen(!isOpen);
                      }}
                      className={
                        unitDetails?.status == UNIT_STATUS.AVAILABLE
                          ? "button green active svelte-ynf51n"
                          : "button green svelte-ynf51n"
                      }
                      value=""
                      style={{ padding: "8px 0px", margin: "0 0.3rem" }}
                      disabled={unitDetails?.status != UNIT_STATUS.AVAILABLE}
                    >
                      Book Now
                    </button>
                    {/* {showVRBtn && (
                      <button
                        className={
                          !getFlatVrTours(unitDetails?.unit_type)
                            ? "button green  svelte-ynf51n"
                            : "button green active svelte-ynf51n"
                        }
                        value=""
                        style={{ padding: "8px 0px", margin: "0 0.3rem" }}
                        onClick={onVRClick}
                        disabled={!getFlatVrTours(unitDetails?.unit_type)}
                      >
                        VR Tour
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
            {isOpen && (
              <BookNow
                isOpen={isOpen}
                setIsOpen={(val) => setIsOpen(val)}
                // unitDetails={selectedUnit}
                // handleBooking={handleBooking}
                // isOpen={unitIdForBooking}
                // setIsOpen={setUnitIdForBooking}
                // thankYouPage={setThankYouPage}
                unitDetails={unitDetails}
              />
            )}
            {/* {!foldedCard && (
              <div className="body svelte-1e3fizx">
                <div slot="body" className="svelte-1m6i2pp">
                  <div
                    className="fake-margin svelte-1m6i2pp"
                    style={{ maxHeight: "25px" }}
                  ></div>{" "}
                  <div className="scrollable svelte-1m6i2pp">
                    <div className="svelte-1m6i2pp" style={{ marginTop: "-25px" }}>
                      <div
                        className="rooms-properties svelte-1m6i2pp"
                        style={{ maxHeight: "391px" }}
                      >
                        <div className="description svelte-1m6i2pp">
                          <div className="description-title svelte-1m6i2pp">
                            Rooms and sizes
                          </div>{" "}
                          <div className="description-subtitle svelte-1m6i2pp">
                            Click on the room name to go to VR
                          </div>
                        </div>{" "}
                        <div className="vr-list svelte-1m6i2pp">
                          {roomDimensions.map((roomDimension, id) => {
                            return (
                              <>
                                <div
                                  key={id}
                                  className={`vr-list__item svelte-1m6i2pp `}
                                >
                                  <div
                                    className={`info svelte-1m6i2pp ${
                                      roomDimension.type === "Balcony"
                                        ? ""
                                        : "clickable"
                                    }`}
                                  >
                                    <span className="link svelte-1m6i2pp">
                                      {roomDimension.type}
                                    </span>{" "}
                                    <span className="area svelte-1m6i2pp">
                                      <span className="area svelte-wv78a7">
                                        {roomDimension.dimention.length}
                                      </span>{" "}
                                      <span className="area-change svelte-wv78a7">
                                        {roomDimension.unit}
                                      </span>
                                      x
                                      <span className="area svelte-wv78a7">
                                        {roomDimension.dimention.width}
                                      </span>{" "}
                                      <span className="area-change svelte-wv78a7">
                                        {roomDimension.unit}
                                      </span>
                                    </span>{" "}
                                    <div className="arrow svelte-1m6i2pp">
                                      <Arrow />
                                    </div>
                                  </div>
                                </div>
                                <div className="separator svelte-1m6i2pp"></div>
                              </>
                            );
                          })}
                          <div className="vr-list__item total-area svelte-1m6i2pp">
                            <span className="title svelte-1m6i2pp">Total Area</span>{" "}
                            <span className="area svelte-1m6i2pp">
                              <span className="area svelte-wv78a7">12,916.68</span>{" "}
                              <span className="area-change svelte-wv78a7">
                                Sq. Ft.
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
        {/* <div
          onClick={() => setFoldedCard(!foldedCard)}
          className={`hidden svelte-5ldss7 `}
        >
          <button
            className={`hidden__button svelte-5ldss7 ${
              foldedCard ? "folded" : "unfolded"
            }  `}
          >
            <ToggleButtonArrow />
          </button>
        </div> */}
      </div>
    </Style>
  );
}

export default ApartmentsDetails;

const Style = styled.div`
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;

  .features {
    color: rgb(224, 219, 219) !important;
    .feature {
      /* background-color: #59595952 !important; */
      /* background-color: rgb(6, 63, 101) !important; */
      border: 1px solid rgb(159, 183, 198) !important;
      box-shadow: 2px 2px 2px rgb(0 0 0 / 25%) !important;
      margin: 0.3rem 0 !important;
      padding: 0.5rem 1rem !important;
      border-radius: 5px !important;
      width: 100% !important;
      font-size: 14px !important;
      display: flex !important;
      justify-content: space-between !important;
      .sold {
        font-weight: 700;
        color: #a91414e7;
      }
      .available {
        color: #40e440;
      }
    }
  }

  .interface--col.svelte-9mhvmf.svelte-9mhvmf {
    position: relative;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    //toggle button
    .interface--body.info.svelte-9mhvmf.svelte-9mhvmf {
      z-index: 100;
      position: absolute;
      top: 250px;
      left: 390px;
      margin-left: 20px;
      display: flex;
    }

    //first half
    .panel__unit-card.svelte-1m6i2pp.svelte-1m6i2pp.svelte-1m6i2pp {
      border-radius: var(--radius);
      pointer-events: all;
      transition: max-height var(--transition);
      /* background-color: var(--panel_background); //test bg color */
      background-color: transparent;
      padding: 15px 14px; // initial value --> 15px 10px
      .folded {
        overflow: hidden;
      }
    }

    .panel__unit-card.svelte-1m6i2pp .panel.unitCard {
      height: 230px;
      /* height: auto; */
      background-color: transparent;
      padding: 0px 10px 20px 15px;
      pointer-events: all;
      overflow: hidden;
    }
    .panel.svelte-1e3fizx.svelte-1e3fizx {
      display: flex;
      flex-direction: column;
      background: var(--panel_background);
      border-radius: var(--radius);
      padding: var(--panel_paddings);
      width: 100%;
      max-width: var(--panel_max_width);
      min-width: 240px;
      transition: opacity var(--transition);
      pointer-events: all;
      z-index: 300;
      position: relative;
    }
    .panel.svelte-1e3fizx .body.svelte-1e3fizx {
      flex-shrink: 0;
    }
  }
  .unit-properties.svelte-1m6i2pp.svelte-1m6i2pp.svelte-1m6i2pp,
  .views-container.svelte-1m6i2pp.svelte-1m6i2pp.svelte-1m6i2pp,
  .rooms-properties.svelte-1m6i2pp.svelte-1m6i2pp.svelte-1m6i2pp {
    /* overflow: hidden; */
    transition: max-height var(--transition);
  }
  .panel.svelte-1m6i2pp .unit-row.svelte-1m6i2pp.svelte-1m6i2pp {
    display: flex;
    justify-content: space-between;
    padding: 0 0.5rem;
  }
  .panel.svelte-1m6i2pp .type.svelte-1m6i2pp.svelte-1m6i2pp {
    margin-bottom: 12px;
    font-weight: 300;
    font-size: 15px; // initial value --> 13px
    line-height: 15px;
    color: var(--color_text);
  }
  .panel.svelte-1m6i2pp .unit-row .title.svelte-1m6i2pp.svelte-1m6i2pp {
    color: var(--color_text);
    text-transform: capitalize;
  }

  .panel.svelte-1m6i2pp .title.svelte-1m6i2pp.svelte-1m6i2pp {
    /* font-weight: 300; */
    font-size: 16px;
    line-height: 16px; // initial value --> 19px
    margin-bottom: 8px;
    color: var(--color_text);
    /* color: #949494; */
  }

  .panel.svelte-1m6i2pp .bedrooms.svelte-1m6i2pp.svelte-1m6i2pp {
    font-weight: 300;
    font-size: 15px;
    line-height: 16px;
    /* color: #eeeeee; */
    color: var(--color_text);
    text-transform: capitalize;
  }
  //suite area & balcony are
  .secondary-area.svelte-1m6i2pp.svelte-1m6i2pp.svelte-1m6i2pp {
    border-left: 1px solid #8b8b8b;
    padding-left: 10px;
    margin-bottom: 8px;
    overflow: hidden;
    transition: max-height var(--transition);
    font-weight: 300;
    font-size: 13px;
    line-height: 15px;
  }
  .secondary-area.svelte-1m6i2pp .area.svelte-1m6i2pp.svelte-1m6i2pp {
    /* font-size: 13px; */
    color: #8b8b8b;
    font-weight: 300;
  }

  .secondary-area.svelte-1m6i2pp .area-count.svelte-1m6i2pp.svelte-1m6i2pp {
    color: var(--color_text);
  }
  .area-count {
    font-weight: 300;
  }
  //total area value
  .panel.svelte-1m6i2pp .area-count.svelte-1m6i2pp.svelte-1m6i2pp {
    font-size: 15px;
    line-height: 23px;
    margin-bottom: 5px;
    color: var(--color_text);
  }
  .panel.svelte-1m6i2pp .area-count.svelte-1m6i2pp .area-change {
    pointer-events: all;
  }

  .area-change.svelte-wv78a7 {
    cursor: pointer;
  }
  .secondary-area.svelte-1m6i2pp
    .unit-row.svelte-1m6i2pp:last-child
    > .svelte-1m6i2pp {
    margin: 0;
  }
  // price value
  .panel.svelte-1m6i2pp .price-count.svelte-1m6i2pp.svelte-1m6i2pp {
    font-weight: 300;
    font-size: 15px;
    line-height: 23px;
    color: var(--color_text);
  }

  // Enquire now button
  .panel.svelte-1m6i2pp .buttons.svelte-1m6i2pp.svelte-1m6i2pp {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    z-index: 400;
  }
  .panel.svelte-1m6i2pp .buttons.svelte-1m6i2pp .button {
    margin: 0;
    flex: 1;
    margin-top: 0.5rem !important;
  }

  .button.active.green {
    color: var(--button_color_green);
    background: var(--button_background_blue);
  }
  .button.active {
    background: var(--button_background_active);
    box-shadow: var(--button_shadow_active);
    color: var(--color_text);
  }
  .button:last-child {
    margin-bottom: 0;
  }
  .button {
    display: inline-block;
    border: none;
    width: 100%;
    padding: var(--paddings);
    background: var(--button_background);
    box-shadow: var(--button_shadow);
    border-radius: 5px;
    margin-bottom: 5px;
    font-size: 14px;
    line-height: 1.2;
    color: var(--button_color);
    text-align: center;
    pointer-events: auto;
    cursor: pointer;
    color: #bdbdbd;
    transition: var(--transition);
  }
  button {
    border: 0;
    border-radius: 0;
    padding: 5px 10px;
    background-color: #006fff;
    color: #fff;
    flex-shrink: 0;
    cursor: pointer;
    margin: 0;
  }
  button {
    color: #333;
    background-color: #f4f4f4;
    outline: none;
    :hover {
      opacity: 0.9;
    }
  }

  button:disabled,
  button[disabled] {
    cursor: not-allowed !important;
  }

  // second half
  .panel.svelte-1e3fizx .body.svelte-1e3fizx {
    flex-shrink: 0;
  }
  .panel__unit-card.svelte-1m6i2pp .fake-margin {
    height: 25px;
    /* background-color: #006fff; */
    transition: max-height var(--transition);
  }
  .scrollable.svelte-1m6i2pp.svelte-1m6i2pp.svelte-1m6i2pp {
    overflow-y: scroll;
  }
  .scrollable::-webkit-scrollbar {
    display: none;
  }
  .scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .panel.svelte-1m6i2pp .description.svelte-1m6i2pp.svelte-1m6i2pp {
    margin-bottom: 25px;
    padding: 0 13px;
  }
  // rooms and sizes
  .panel.svelte-1m6i2pp .description-title.svelte-1m6i2pp.svelte-1m6i2pp {
    margin-top: 30px;
    margin-bottom: 5px;
    font-size: 14px;
    line-height: 16px;
    color: var(--color_text);
  }
  .panel.svelte-1m6i2pp .description-subtitle.svelte-1m6i2pp.svelte-1m6i2pp {
    font-size: 13px;
    line-height: 15px;
    color: var(--color_text);
  }
  // lowest part
  .panel.svelte-1m6i2pp .vr-list.svelte-1m6i2pp.svelte-1m6i2pp {
    background-color: #313131;
    padding: 5px 8px 0;
    border-radius: var(--radius);
    list-style: none;
  }
  .panel.svelte-1m6i2pp .vr-list__item.svelte-1m6i2pp.svelte-1m6i2pp {
    padding: 5px 0;
  }
  .panel.svelte-1m6i2pp .vr-list.svelte-1m6i2pp.svelte-1m6i2pp .clickable {
    font-size: 13px;
    line-height: normal;
    background-color: #313131;
    padding: 5px 8px 0;
    border-radius: var(--radius);
    padding: 3px 0px;
    list-style: none;
    cursor: pointer;
  }
  .panel.svelte-1m6i2pp
    .vr-list__item
    .info
    .arrow.svelte-1m6i2pp.svelte-1m6i2pp {
    width: 4px;
    height: 7px;
    margin-right: 5px;
    display: none;
  }
  .panel.svelte-1m6i2pp .vr-list__item.svelte-1m6i2pp.clickable {
    padding: 5px 0;
  }

  .panel.svelte-1m6i2pp .vr-list__item .info.svelte-1m6i2pp.svelte-1m6i2pp {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: var(--transition);
    padding: 7px 5px;
  }
  // onhover
  .panel.svelte-1m6i2pp .vr-list__item .info.svelte-1m6i2pp.clickable:hover {
    border-radius: 5px;
    /* height: 29px; */
    display: flex;
    align-items: center;
    background-color: #636363;
    .arrow.svelte-1m6i2pp.svelte-1m6i2pp {
      display: flex;
    }
    .link.svelte-1m6i2pp.svelte-1m6i2pp {
      color: var(--color_text); // test text color
    }
    .area.svelte-1m6i2pp.svelte-1m6i2pp {
      display: none;
      color: var(--color_text);
    }
  }
  .panel.svelte-1m6i2pp .vr-list__item .link.svelte-1m6i2pp.svelte-1m6i2pp {
    font-size: 13px;
    line-height: 15px;
    text-transform: capitalize;
    color: #92d1ff;
    cursor: pointer;
  }
  .panel.svelte-1m6i2pp
    .vr-list__item
    .info
    .area.svelte-1m6i2pp.svelte-1m6i2pp {
    display: block;
  }

  .panel.svelte-1m6i2pp .vr-list__item .area.svelte-1m6i2pp.svelte-1m6i2pp {
    margin: 0;
    font-weight: 300;
    font-size: 11px;
    line-height: 13px;
    color: #e1e1e1;
  }
  .panel.svelte-1m6i2pp .area.svelte-1m6i2pp.svelte-1m6i2pp,
  .panel.svelte-1m6i2pp .price.svelte-1m6i2pp.svelte-1m6i2pp {
    font-size: 16px;
    line-height: 23px;
    margin-bottom: 5px;
    color: #bdbdbd;
  }

  .total-area {
    font-size: 10px;
    line-height: 10px;
    margin-bottom: 5px;
    padding: 12px 0px;
    color: var(--color_text);
    margin-right: 8px;
  }
  .area-change.svelte-wv78a7 {
    cursor: pointer;
  }

  .panel.svelte-1m6i2pp .vr-list .separator.svelte-1m6i2pp.svelte-1m6i2pp {
    height: 1px;
    border-bottom: 1px solid #4e4e4e;
    width: 100%;
  }
  .panel + .hidden {
    margin-top: 10px;
  }
  // toggle button
  .hidden.svelte-5ldss7 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 1;
  }
  .hidden__button.svelte-5ldss7 {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 60px;
    padding: 8px 22px;
    margin: 0;
    border: 0;
    border-radius: var(--radius);
    background: var(--hidden_background);
    transition: var(--transition);
    pointer-events: all;
    cursor: pointer;
    overflow: hidden;
  }
  svg {
    width: 100%;
    height: 100%;
  }
  .hidden__button.svelte-5ldss7 svg {
    width: 16px;
    height: 8px;
    transition: var(--transition);
  }
  .hidden__button.folded svg {
    transform: rotate(180deg);
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    .interface--col.svelte-9mhvmf.svelte-9mhvmf {
      top: 0 !important;
      left: 0 !important;
      position: relative !important;
    }

    .panel__unit-card.svelte-1m6i2pp.svelte-1m6i2pp.svelte-1m6i2pp {
      padding: 6px 8px !important;
    }

    .panel__unit-card.svelte-1m6i2pp .panel.unitCard {
      height: auto !important;
      padding: 0px 4px 8px 6px !important;
    }

    .panel.unitCard.svelte-1e3fizx {
      max-width: 115px !important;
      min-width: 110px !important;
    }

    div[style*="maxWidth"] {
      max-width: 115px !important;
      min-width: 110px !important;
    }

    div[style*="minWidth"] {
      min-width: 110px !important;
    }

    .panel.svelte-1e3fizx.svelte-1e3fizx {
      min-width: 110px !important;
      max-width: 115px !important;
      padding: 0.4rem 0.5rem !important;
    }

    .unit-properties.svelte-1m6i2pp {
      max-height: 140px !important;
    }

    div[style*="maxHeight"] {
      max-height: 140px !important;
    }

    .features {
      .feature {
        margin: 0.15rem 0 !important;
        padding: 0.25rem 0.5rem !important;
        font-size: 8px !important;
        border-radius: 3px !important;
        line-height: 1.2 !important;
      }
    }

    .panel.svelte-1m6i2pp .buttons.svelte-1m6i2pp {
      margin-top: 5px !important;
      flex-direction: column !important;
      gap: 0.2rem !important;
    }

    .panel.svelte-1m6i2pp .buttons.svelte-1m6i2pp .button {
      padding: 4px 0px !important;
      margin-top: 0.2rem !important;
      font-size: 9px !important;
      border-radius: 3px !important;
      line-height: 1.1 !important;
    }

    button {
      padding: 3px 6px !important;
      font-size: 9px !important;
    }

    .button {
      font-size: 9px !important;
      padding: 3px 6px !important;
      border-radius: 3px !important;
      line-height: 1.1 !important;
    }

    .panel.svelte-1m6i2pp .area-count.svelte-1m6i2pp.svelte-1m6i2pp {
      font-size: 8px !important;
      line-height: 1.2 !important;
    }

    .panel.svelte-1m6i2pp .area.svelte-1m6i2pp.svelte-1m6i2pp,
    .panel.svelte-1m6i2pp .price.svelte-1m6i2pp.svelte-1m6i2pp {
      font-size: 8px !important;
      line-height: 1.2 !important;
      margin-bottom: 3px !important;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    .interface--col.svelte-9mhvmf.svelte-9mhvmf {
      top: 0.5rem !important;
      left: 0 !important;
      position: relative !important;
    }

    .panel__unit-card.svelte-1m6i2pp.svelte-1m6i2pp.svelte-1m6i2pp {
      padding: 10px 12px !important;
    }

    .panel__unit-card.svelte-1m6i2pp .panel.unitCard {
      height: auto !important;
      padding: 0px 6px 12px 10px !important;
    }

    .panel.unitCard.svelte-1e3fizx {
      max-width: 180px !important;
      min-width: 170px !important;
    }

    div[style*="maxWidth"] {
      max-width: 180px !important;
      min-width: 170px !important;
    }

    .panel.svelte-1e3fizx.svelte-1e3fizx {
      min-width: 170px !important;
      max-width: 180px !important;
      padding: 0.7rem 0.9rem !important;
    }

    .unit-properties.svelte-1m6i2pp {
      max-height: 200px !important;
    }

    div[style*="maxHeight"] {
      max-height: 200px !important;
    }

    .features {
      .feature {
        margin: 0.3rem 0 !important;
        padding: 0.4rem 0.8rem !important;
        font-size: 10px !important;
        border-radius: 5px !important;
      }
    }

    .panel.svelte-1m6i2pp .buttons.svelte-1m6i2pp {
      margin-top: 8px !important;
    }

    .panel.svelte-1m6i2pp .buttons.svelte-1m6i2pp .button {
      padding: 6px 0px !important;
      margin-top: 0.4rem !important;
      font-size: 11px !important;
      border-radius: 5px !important;
    }

    button {
      padding: 5px 10px !important;
      font-size: 11px !important;
    }

    .button {
      font-size: 11px !important;
      padding: 5px 10px !important;
      border-radius: 5px !important;
    }
  }
`;
