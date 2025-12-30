import React, { useState } from "react";
import styled from "styled-components";
import { Button, Image, Modal, Upload, message } from "antd";
// import { fileUpload } from "../../../src/api/upload.utils";
import { fileUpload } from "../../APIs/upload.utils";
import { Navigate, useNavigate, useParams } from "react-router";

import { AppContext } from "../../Contexts/AppContext";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import ReviewBooking from "./ReviewBooking";
import MultiForm from "./MultiForm";
import { AddOnForm, CustomerForm, KYCForm, RMForm } from "./Forms";
import FormSteps from "./FormSteps";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useRef } from "react";
import { validateCustomerForm } from "./formValidator";
import { useEffect } from "react";
import axios from "axios";
import { baseURL, PROJECT_ID } from "../../APIs/index";
import { useContext } from "react";
import Confirm from "./Confirm";

const formSteps = [
  {
    title: "Customer Details",
    icon: <UserOutlined />,
    isCompleted: true,
    validator: () => true,
  },
  {
    title: "KYC Details",
    icon: <SolutionOutlined />,
    isCompleted: true,
    validator: () => true,
  },
  // {
  //   title: "Add Ons",
  //   icon: <SolutionOutlined />,
  //   isCompleted: true,
  //   validator: () => true,
  // },
  {
    title: "Cheque Details",
    icon: <BookOutlined />,
    isCompleted: true,
    validator: () => true,
  },
  {
    title: "Review Booking",
    icon: <SmileOutlined />,
    isCompleted: true,
    validator: () => true,
  },
];

export const CloseButton = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.06892 7.41592L13.1309 12.4781C13.4603 12.8074 13.4603 13.3398 13.1309 13.6691C12.8016 13.9983 12.2692 13.9983 11.9399 13.6691L6.87785 8.60686L1.81591 13.6691C1.48649 13.9983 0.954265 13.9983 0.624996 13.6691C0.295574 13.3398 0.295574 12.8074 0.624996 12.4781L5.68694 7.41592L0.624996 2.35372C0.295574 2.02445 0.295574 1.49205 0.624996 1.16278C0.789091 0.998527 1.00485 0.916016 1.22046 0.916016C1.43606 0.916016 1.65167 0.998527 1.81591 1.16278L6.87785 6.22498L11.9399 1.16278C12.1042 0.998527 12.3198 0.916016 12.5354 0.916016C12.751 0.916016 12.9666 0.998527 13.1309 1.16278C13.4603 1.49205 13.4603 2.02445 13.1309 2.35372L8.06892 7.41592Z"
      fill="#8B8A8A"
    ></path>
  </svg>
);

function BookNow({
  isOpen,
  setIsOpen,
  unitDetails,
  handleDetailsFilledSuccess,
  bookingIds,
}) {
  const sliderRef = useRef(null);

  const { user } = useContext(AppContext);
  const [values, setValues] = useState({
    firstName: "",
    unit_id: unitDetails?.id,
    rm_name: "",
    partner_details: "",
    area: unitDetails?.bua,
    totalOwners: 1,
    tcb: "",
    kyc: {
      aadhar_number1: "",
      pan_number1: "",
      adhaar1: [],
      adhaar2: [],
      aadhar_number2: "",
      pan_number2: "",
      pan1: [],
      pan2: [],
    },
  });

  //function for working unit with socket
  // const chequeUpdateUnit = async () => {
  //   const data = { unit_id: unitDetails.id, project_id: PROJECT_ID };
  //   const details = await axios.put(
  //     `${baseURL}/bookings/workingUnit/${PROJECT_ID}`,
  //     data,
  //     {
  //       headers: {
  //         authorization: localStorage.getItem("token"),
  //       },
  //     }
  //   );
  // };
  // useEffect(() => {
  //   if (values?.cheque_pic?.length > 0) {
  //     chequeUpdateUnit();
  //   }
  // }, [values]);

  const [steps, setSteps] = useState(formSteps);

  const ref = React.useRef();
  const [reviewDetails, setReviewDetails] = useState(null);

  const navigate = useNavigate();

  const markStepAsCompleted = (stepIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].isCompleted = true;
    setSteps(newSteps);
  };

  const markStepAsInCompleted = (stepIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].isCompleted = false;
    setSteps(newSteps);
  };

  const [currentStep, setCurrentStep] = useState(0);
  const { isConfirmVisible, setIsConfirmVisible } = useContext(AppContext);

  const handleStepChange = (newStep) => {
    //check if all the prev steps are completed

    for (let i = 0; i < newStep; i++)
      if (!steps[i].isCompleted) {
        message.info(`Please Complete ${formSteps[i].title}`);
        return;
      }

    if (!isConfirmVisible) {
      setCurrentStep(newStep);
      sliderRef.current.goTo(newStep);
    }
  };

  const Review = () => (
    <ReviewBooking
      bookingDetails={values}
      onEdit={() => console.log(0)}
      onBookingSuccess={() => console.log(4)}
    />
  );

  return (
    <>
      {isConfirmVisible && (
        <Confirm
          message="Are you sure you want to continue?"
          setBookNowOpen={unitDetails?.id ? setIsOpen : null}
        />
      )}
      <Style onClick={(e) => setIsOpen(false)}>
        <div class="background "></div>

        <div
          className="form-wrapper animate__animated animate__fadeInDown animate__fast"
          ref={ref}
        >
          <div
            onClick={(e) => {
              setIsOpen(!isOpen);
              // setIsConfirmVisible(false);
            }}
            class="close-popup"
          >
            <CloseButton />
          </div>{" "}
          <div class="description ">
            <div class="description-secondary-wrapper">
              <span class="">
                <span class="title ">Unit Number:</span>{" "}
                <span className="desc-value">{unitDetails?.unit_number}</span>
              </span>{" "}
              {unitDetails?.unit_type && (
                <span class="">
                  <span class="title ">Unit Type:</span>{" "}
                  <span className="desc-value">{unitDetails?.unit_type}</span>
                </span>
              )}
              {
                <span class="">
                  <span class="title ">Total BUA:</span>{" "}
                  <span class="area svelte-wv78a7">
                    <span className="desc-value">
                      {Number(unitDetails?.bua).toFixed(2)}
                    </span>
                  </span>{" "}
                  <span class="area-change svelte-wv78a7">Sq. Ft.</span>
                </span>
              }
            </div>
          </div>
          <div class="content  " dir="" onClick={(e) => e.stopPropagation()}>
            {reviewDetails && (
              <ReviewBooking
                onEdit={() => setValues(null)}
                bookingDetails={values}
                onBookingSuccess={() => {
                  setIsOpen(false);
                  setValues(null);
                }}
                bookingIds={bookingIds}
              />
            )}
            {!reviewDetails && (
              <FormSteps
                steps={formSteps}
                current={currentStep}
                // onChange={(current) => {
                //   handleStepChange(current);
                // }}
              />
            )}
            <MultiForm
              className="enquiry-form"
              sliderRef={sliderRef}
              // forms={[CustomerForm, KYCForm, Review, RMForm]}
              // forms={[CustomerForm, KYCForm, AddOnForm, RMForm]}
              forms={[CustomerForm, KYCForm, RMForm]}
              RMForm={RMForm}
              values={values}
              setValues={setValues}
              steps={steps}
              currentStep={currentStep}
              goToStep={handleStepChange}
              markStepAsCompleted={markStepAsCompleted}
              markStepAsInCompleted={markStepAsInCompleted}
              onBookingSuccess={() => {
                setIsOpen(false);
                setReviewDetails(null);
              }}
            >
              {/* {!reviewDetails && <h2 class="form-title ">Block Now</h2>} */}
            </MultiForm>
          </div>
        </div>
      </Style>
    </>
  );
}

export default BookNow;

const Style = styled.main`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  z-index: 1001;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .channel_partner_select {
    color: white;
    margin-top: 0.5rem;
    .ant-select-selector {
      background: var(--input_background);
      color: var(--color_back);
      border: var(--input_border);
      outline: none;
    }
    .anticon.anticon-down.ant-select-suffix {
      color: var(--color_back);
    }
  }

  .payment-info {
    font-size: 14px;
    color: #c4bfbf;
    line-height: 1.6;
  }

  .button.submit {
    &:disabled {
      background: #0cb9c82c !important;
      cursor: not-allowed !important;
    }
  }

  .form-wrapper {
    position: relative;
    max-width: 900px;
    min-width: 391px;
    min-height: 283px;
    width: 100%;
    /* background-color: rgba(7, 74, 168, 0.5); */
    background-color: var(--background_panel);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    font-size: 13px;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    z-index: 200;
  }

  .background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    background: rgba(26, 26, 26, 0.356);
    z-index: 1;
  }
  // popup
  input[type="text"]:-webkit-autofill,
  input[type="text"]:-webkit-autofill:hover,
  input[type="text"]:-webkit-autofill:focus,
  input[type="text"]:-webkit-autofill:active,
  input[type="number"]:-webkit-autofill,
  input[type="number"]:-webkit-autofill:hover,
  input[type="number"]:-webkit-autofill:focus,
  input[type="number"]:-webkit-autofill:active,
  input[type="email"]:-webkit-autofill,
  input[type="email"]:-webkit-autofill:hover,
  input[type="email"]:-webkit-autofill:focus,
  input[type="email"]:-webkit-autofill:active,
  input[type="password"]:-webkit-autofill,
  input[type="password"]:-webkit-autofill:hover,
  input[type="password"]:-webkit-autofill:focus,
  input[type="password"]:-webkit-autofill:active,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus,
  select:-webkit-autofill:active,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  textarea:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #2a2a2a inset !important;
    -webkit-text-fill-color: #bdbdbd !important;
    border: 1px solid #5f5f5f;
  }
  input[type="radio"]:checked + .fake-radio + span {
    color: var(--input_radio_checked_color);
  }
  input[type="radio"]:checked + .fake-radio {
    background-color: var(--input_radio_checked_bg);
  }

  input[type="radio"] + .fake-radio {
    width: 11px;
    height: 11px;
    background-color: transparent;
    border-radius: 50%;
    border: var(--input_radio_border);
    transition: var(--transition);
    margin-right: 5px;
  }
  .fake-radio,
  .fake-radio-image {
    display: inline-block;
    cursor: pointer;
  }
  .input-group input {
    margin-top: 5px;
  }

  input[type="radio"] {
    display: none;
  }
  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  .input-group label {
    color: var(--input_label_text_color);
    position: relative;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  label {
    display: block;
  }
  .clearfix:after,
  .container:after,
  .container-fluid:after,
  .row:after {
    clear: both;
  }

  .clearfix:before,
  .clearfix:after,
  .container:before,
  .container:after,
  .container-fluid:before,
  .container-fluid:after,
  .row:before,
  .row:after {
    display: table;
    content: " ";
  }
  .code-input::after {
    content: "";
    position: absolute;
    right: 6px;
    bottom: 14px;
    width: 0px;
    height: 0px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: var(--input_select_arrow_bg);
  }
  .code-input select {
    padding: 8px 11px;
  }
  .code-input select {
    border-radius: 4px 0 0 4px;
  }
  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  select,
  textarea {
    background: var(--input_background);
    color: var(--color_back);
    padding: 8px 14px;
    border-radius: 4px;
    border: var(--input_border);
    margin-top: 5px;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-user-select: text;
    transition: border var(--transition);
    max-width: 400px;
  }
  .phone-input {
    width: 100%;
    max-width: 400px;
    input {
      width: 100%;
    }
  }

  .code-input {
    position: relative;
    min-width: 62px;
    border-radius: 4px;
    border: var(--input_border);
  }
  .clearfix:before,
  .clearfix:after,
  .container:before,
  .container:after,
  .container-fluid:before,
  .container-fluid:after,
  .row:before,
  .row:after {
    display: table;
    content: " ";
  }
  .row {
    display: flex;
    align-items: center;
  }
  .button.btn-success {
    background: var(--button_background_form);
    box-shadow: var(--button_shadow_form);
    color: var(--button_color_form);
  }

  .enquiry-form {
    height: 100%;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    padding: 1rem 3rem;
    padding-right: 3rem;
    padding-top: 0;
  }
  .content {
    position: relative;
    z-index: 200;
    width: fit-content;
    height: fit-content;
    display: grid;
    grid-template-columns: auto 1fr;
  }
  .form-title {
    top: 0;
    margin-bottom: 5px;
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 15px;
    color: var(--form_text_color);
    border-bottom: 1px solid white;
    padding-bottom: 0.5rem;
  }
  .close-popup {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 2;
    pointer-events: all;
    transition: all 0.3s ease-in-out;
  }
  .close-popup svg {
    width: 14px;
    height: 14px;
  }
  .close-popup:hover {
    scale: 1.2;

    opacity: 0.8;
  }
  .close-popup svg {
    width: 13px;
    height: 13px;
  }

  svg {
    width: 100%;
    height: 100%;
    transition: all 0.3s ease-in-out;
  }
  svg:hover {
    scale: 1.2;

    opacity: 0.8;
  }
  .close-popup svg path {
    font-size: 14px;
  }

  //1st part of form
  .description {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 15px 20px;
    margin: 0 2rem;
    margin-bottom: 25px;
    margin-top: 2rem;
    color: var(--color_text);
    font-size: 13px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  .description-main {
    display: flex;
    align-items: flex-start;
    /* flex-direction: column; */
  }
  .description-main span:first-child {
    margin-top: 0;
  }
  .description-main span {
    margin-top: 7px;
  }
  .description-main span {
    margin-top: 7px;
  }
  .description-secondary-wrapper {
    width: fit-content;
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    margin: auto;
    column-gap: 2rem;
    row-gap: 10px;
    color: white;
    .title {
      color: rgba(208, 204, 204, 0.9) !important;
      font-weigth: 600;
    }

    /* align-items: flex-end; */
    /* flex-direction: column; */
  }
  .description-secondary-wrapper span:first-child {
    margin-top: 0;
  }

  .description-secondary-wrapper span:first-child {
    margin-top: 0;
  }

  .description-secondary-wrapper span.title {
    color: white;
  }

  .area-change.svelte-wv78a7 {
    cursor: pointer;
  }
  .description-secondary-wrapper span:first-child {
    margin-top: 0;
  }

  .description-secondary-wrapper span.title {
    color: white;
  }

  //2nd part of form
  .gender-group {
    display: flex;
  }
  .gender-group .input-group {
    width: auto;
  }

  .input-group:not(:last-child) {
    margin-right: 25px;
  }
  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  .input-group label {
    color: var(--input_label_text_color);
    position: relative;
  }

  .fake-radio-label,
  .fake-radio-image-label {
    cursor: pointer;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  label {
    display: block;
  }
  .input-group input {
    margin-top: 5px;
  }

  input[type="radio"] {
    display: none;
  }
  input {
    border: 0;
    border-radius: 0;
    width: 100%;
    outline: 0;
    margin: 0;
  }
  input {
    border: 0;
    border-radius: 0;
    width: 100%;
    outline: 0;
    margin: 0;
  }
  input,
  button,
  select,
  textarea {
    font-family: "Roboto", sans-serif;
    font-size: inherit;
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  input[type="radio"]:checked + .fake-radio {
    background-color: var(--input_radio_checked_bg);
  }

  input[type="radio"] + .fake-radio {
    width: 11px;
    height: 11px;
    background-color: transparent;
    border-radius: 50%;
    border: var(--input_radio_border);
    transition: var(--transition);
    margin-right: 5px;
  }
  .fake-radio,
  .fake-radio-image {
    display: inline-block;
    cursor: pointer;
  }
  input[type="radio"]:checked + .fake-radio + span {
    color: var(--input_radio_checked_color);
  }
  .gender-group .input-group {
    width: auto;
  }

  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  .input-group label {
    color: var(--input_label_text_color);
    position: relative;
  }

  .fake-radio-label,
  .fake-radio-image-label {
    cursor: pointer;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  label {
    color: var(--input_label_text_color);
    width: 100%;
  }
  label {
    display: block;
  }
  .input-group input {
    margin-top: 5px;
  }

  input[type="radio"] {
    display: none;
  }
  input[type="radio"] + .fake-radio {
    width: 11px;
    height: 11px;
    background-color: transparent;
    border-radius: 50%;
    border: var(--input_radio_border);
    transition: var(--transition);
    margin-right: 5px;
  }

  .fake-radio,
  .fake-radio-image {
    display: inline-block;
    cursor: pointer;
  }

  .form-row {
    display: flex;
    flex-direction: row;
  }
  .input-group:not(:last-child) {
    margin-right: 25px;
  }

  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    justify-content: center;
    margin-bottom: 20px;
  }
  .form-otp {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .input-group input {
    margin-top: 5px;
  }

  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  select,
  textarea {
    background: var(--input_background);
    color: var(--color_back);
    padding: 8px 14px;
    border-radius: 4px;
    border: var(--input_border);
    margin-top: 5px;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-user-select: text;
    transition: border var(--transition);
  }
  .select-input {
    position: relative;
  }
  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"],
  select,
  textarea {
    background: var(--input_background);
    color: var(--color_back);
    padding: 8px 14px;
    border-radius: 4px;
    border: var(--input_border);
    margin-top: 5px;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-user-select: text;
    transition: border var(--transition);
  }

  select {
    border: 0;
    border-radius: 0;
    width: 100%;
    outline: 0;
    margin: 0;
  }
  select {
    border-radius: 4px;
    border: 1px solid #5f5f5f;
  }
  select {
    border: 0;
    border-radius: 0;
    width: 100%;
    outline: 0;
    margin: 0;
  }
  .select-input::after {
    content: "";
    position: absolute;
    right: 14px;
    bottom: 14px;
    width: 0px;
    height: 0px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: var(--input_select_arrow_bg);
  }
  .submit-btn {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    &[disabled] {
      opacity: 0.5;
    }
  }

  .submit-btn button {
    max-width: 180px;
    padding: 14px;
  }
  .button.submit.disabled {
    box-shadow: var(--button_shadow_disabled);
    color: #cacaca !important;
    cursor: default;
    pointer-events: none;
    background: #12d08e6b !important;
  }
  .button.submit {
    color: white !important;
    background: #379573 !important;
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
    border-radius: var(--radius);
    margin-bottom: 5px;
    font-size: 13px;
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
    /* font-size: 1.2rem; */
  }
  /* element.style {
    --paddings: 5px 8px;
} */
  input {
    border: 2px solid #92a3b9 !important;
    border-radius: 8px !important;
    font-size: 16px !important;
  }
  .title {
    font-size: 1rem;
    font-weight: 500;
  }
  .desc-value {
    font-size: 1rem !important;
  }

  @media (max-width: 860px) {
    .form-wrapper {
      max-width: 85% !important;
      min-width: 85% !important;
      min-height: auto !important;
      font-size: 10px !important;
      border-radius: 6px !important;
      padding: 0.6rem !important;
    }

    .description {
      padding: 6px 8px !important;
      margin: 0 0.5rem !important;
      margin-bottom: 10px !important;
      margin-top: 1rem !important;
      font-size: 10px !important;
      border-radius: 3px !important;
    }

    .description-secondary-wrapper {
      column-gap: 0.8rem !important;
      row-gap: 6px !important;
      grid-template-columns: 1fr !important;
    }

    .description-secondary-wrapper .title {
      font-size: 9px !important;
      font-weight: 500 !important;
    }

    .desc-value {
      font-size: 0.75rem !important;
    }

    .enquiry-form {
      padding: 0.4rem 0.6rem !important;
      padding-right: 0.6rem !important;
      max-height: 70vh !important;
    }

    .content {
      width: 100% !important;
      grid-template-columns: auto 1fr !important;
      gap: 0.4rem !important;
    }

    .close-popup {
      top: 6px !important;
      right: 6px !important;
    }

    .close-popup svg {
      width: 11px !important;
      height: 11px !important;
    }

    .input-group {
      margin-bottom: 12px !important;
    }

    .input-group label {
      font-size: 9px !important;
      margin-bottom: 2px !important;
    }

    input[type="text"],
    input[type="number"],
    input[type="email"],
    input[type="password"],
    select,
    textarea {
      padding: 5px 8px !important;
      font-size: 10px !important;
      margin-top: 3px !important;
      border-radius: 3px !important;
      max-width: 100% !important;
    }

    .input-group input {
      margin-top: 3px !important;
    }

    .form-title {
      font-size: 11px !important;
      padding-bottom: 0.3rem !important;
      margin-bottom: 3px !important;
    }

    .button {
      font-size: 10px !important;
      padding: 6px 10px !important;
      margin-bottom: 3px !important;
      border-radius: 4px !important;
      line-height: 1.1 !important;
    }

    .submit-btn {
      margin-top: 8px !important;
    }

    .submit-btn button {
      max-width: 120px !important;
      padding: 8px !important;
      font-size: 10px !important;
    }

    .payment-info {
      font-size: 10px !important;
      line-height: 1.4 !important;
    }

    .title {
      font-size: 0.75rem !important;
    }

    input[type="radio"] + .fake-radio {
      width: 8px !important;
      height: 8px !important;
      margin-right: 3px !important;
    }

    .code-input {
      min-width: 50px !important;
    }

    .code-input select {
      padding: 5px 7px !important;
      font-size: 10px !important;
    }

    .code-input::after {
      right: 4px !important;
      bottom: 10px !important;
      border-left-width: 4px !important;
      border-right-width: 4px !important;
      border-top-width: 4px !important;
    }

    .phone-input {
      max-width: 100% !important;
    }

    .input-group:not(:last-child) {
      margin-right: 12px !important;
    }

    .form-row {
      flex-wrap: wrap !important;
      gap: 0.5rem !important;
    }

    .gender-group {
      flex-wrap: wrap !important;
      gap: 0.5rem !important;
    }

    .gender-group .input-group {
      margin-right: 12px !important;
      margin-bottom: 12px !important;
    }

    .channel_partner_select {
      margin-top: 0.3rem !important;
      font-size: 10px !important;
    }

    .channel_partner_select .ant-select-selector {
      padding: 5px 8px !important;
      font-size: 10px !important;
    }

    .select-input::after {
      right: 10px !important;
      bottom: 10px !important;
      border-left-width: 4px !important;
      border-right-width: 4px !important;
      border-top-width: 4px !important;
    }

    .fake-radio-label,
    .fake-radio-image-label {
      font-size: 10px !important;
    }

    .ant-radio-wrapper {
      font-size: 10px !important;
    }

    .ant-radio-wrapper span {
      font-size: 10px !important;
    }

    .otp-buttons {
      padding: 0.4rem !important;
      font-size: 10px !important;
      width: auto !important;
      min-width: 80px !important;
    }

    .form-otp {
      margin-bottom: 15px !important;
    }

    .area-change.svelte-wv78a7 {
      font-size: 9px !important;
    }

    .area.svelte-wv78a7 {
      font-size: 0.75rem !important;
    }
  }
`;
