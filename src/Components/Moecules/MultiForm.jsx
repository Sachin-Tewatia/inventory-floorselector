import React, { useState } from "react";
import { Carousel as AntDCarousel, message } from "antd";
import styled from "styled-components";
import ReviewBooking from "./ReviewBooking";
import { useEffect } from "react";
import axios from "axios";
import { baseURL, fetchAndGetInventories, PROJECT_ID } from "../../APIs";
import { useNavigate } from "react-router-dom";
import { async } from "q";
import { useContext } from "react";
import { AppContext } from "../../Contexts/AppContext";
import { RMForm } from "./Forms";
import { Button } from "antd/es/radio";
import Loading from "../Atoms/Loading";
import { validateAadhaar, validateCheque, validateEmail, validateMobileNumber, validatePan, validateText } from "./formValidator";

const contentStyle = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const MultiForm = ({
  forms,
  // RMForm,
  sliderRef,
  currentStep,
  values,
  setValues,
  steps,
  goToStep,
  markStepAsCompleted,
  markStepAsInCompleted,
  onBookingSuccess,
}) => {
  useEffect(() => {
    if (steps[currentStep].validator(values)) markStepAsCompleted(currentStep);
    else markStepAsInCompleted(currentStep);
  }, [values]);

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { setInventories } = useContext(AppContext);

const isFormValid = (values, currentStep) => {
  
  switch (currentStep) {
    case 0:
      return (
        validateText(values?.firstName) &&
        validateText(values?.lastName) &&
        validateMobileNumber(values?.phone) &&
        validateEmail(values?.email)
      );
    case 1:
      return (
        validateAadhaar(values?.kyc?.aadhar_number1) &&
        validatePan(values?.kyc?.pan_number1)
      );
    case 2:
      return validateCheque(values?.ref_or_cheque) && values?.cheque_amount?.length > 2;
    default:
      return false;
  }
};

  // const checkAadharPan = async (aadhar1, pan1) => {
  //   const res = await axios.get(
  //     `${baseURL}/bookings/pastBookings/${PROJECT_ID}/${aadhar1}/${pan1}`,
  //     {
  //       headers: {
  //         authorization: localStorage.getItem("token"),
  //       },
  //     }
  //   );

  //   if (res.data.msg == "No past booking") {
  //     message.success(res.data.msg);
  //   } else {
  //     setIsConfirmVisible(true);
  //   }
  // };

  // useEffect(() => {
  //   if (currentStep == 2) {
  //     const data = checkAadharPan(
  //       values?.kyc?.aadhar_number1,
  //       values?.kyc?.pan_number1
  //     );
  //   }
  // }, [currentStep]);
  const handleFormSubmit = async () => {
    setSubmitting(true);

    let res = null;

    // if (bookingIds) {
    //   res = Promise.all(
    //     bookingIds.map(
    //       async (id) =>
    //         await axios.post(
    //           `${baseURL}/bookings/withCustomer/${PROJECT_ID}`,
    //           {
    //             ...bookingDetails,
    //             unit_id: id,
    //             project_id: PROJECT_ID,
    //           },
    //           {
    //             headers: {
    //               authorization: localStorage.getItem("token"),
    //             },
    //           }
    //         )
    //     )
    //   );

    // await fetchAndGetInventories();
    // setSubmitting(false);
    // message.success("Details submitted successfully");
    // onBookingSuccess();
    // } else {
    try {
      res = await axios.post(
        `${baseURL}/bookings/withCustomer/${PROJECT_ID}`,
        {
          ...values,
          project_id: PROJECT_ID,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      error.data?.msg && message.error(error.data?.msg + " Please try again");
    }

    await fetchAndGetInventories(setInventories);
    setSubmitting(false);

    if (res.status == 201) {
      message.success("Details submitted successfully");
      navigate(`/booking-success/${res.data.id}`);
      onBookingSuccess();
    }
  };

  return (
    <Styled>
      <AntDCarousel
        className="antd-carousel"
        ref={sliderRef}
        dotPosition="right"
      >
        {forms.map((Form, index) =>
          index == currentStep ? (
            <Form values={values} setValues={setValues} />
          ) : (
            <Form values={{}} setValues={() => {}} />
          )
        )}
        {/* <RMForm values={values} setValues={setValues} /> */}
        {/* <div className="inactive-form"></div> */}
        {/* <ReviewBooking
          bookingDetails={values}
          onEdit={() => goToStep(0)}
          onBookingSuccess={() => goToStep(4)}
        /> */}
      </AntDCarousel>
      <div className="nav-btns flex gap-x-4 w-full justify-center m-2">
        {currentStep !== 0 && currentStep < 4 && (
          <div class="submit-btn w-[100px]">
            <button
              class={`button submit`}
              // disabled={!validatePhone(phoneNumber)}
              onClick={() => goToStep(currentStep - 1)}
            >
              Previous
            </button>
          </div>
        )}

        {currentStep < steps.length - 1 ? (
          <div class="submit-btn w-[100px]">
            <button
              class={`button submit`}
              disabled={!isFormValid(values,currentStep)}
              onClick={() => {
                goToStep(currentStep + 1);
              }}
            >
              Next
            </button>
          </div>
        ) : (
          // : (
          // <>
          // {currentStep == 2 ? (
          // <>
          // <div class="submit-btn w-[100px]">
          // {/* {values?.cheque_pic?.length > 0 ? ( */}
          // <button
          // class={`button submit`}
          // disabled={!steps[currentStep].isCompleted}
          // onClick={() => goToStep(currentStep + 1)}
          // onClick={handleFormSubmit}
          // loading={submitting}
          // >
          // Pay Online
          // </button>
          // </div>
          // <div class="submit-btn w-[100px]">
          // <button
          // class={`button submit`}
          // disabled={!steps[currentStep].isCompleted}
          // onClick={() => goToStep(currentStep + 1)}
          // onClick={() => {
          // goToStep(currentStep + 1);
          // }}
          // loading={submitting}
          // >
          // Pay Cheque
          // </button>
          // </div>
          // </>
          // )
          <div class="submit-btn w-[100px]">
            <button
              class={`button submit`}
              // disabled={!steps[currentStep].isCompleted}
              disabled={submitting}
              // onClick={() => goToStep(currentStep + 1)}
              onClick={handleFormSubmit}
            >
              Submit{" "}
            </button>
          </div>
        )}
        {/* )} */}
      </div>
    </Styled>
  );
};

const Styled = styled.main`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  .antd-carousel {
    height: 100%;
    .content {
      width: fit-content;
      padding: 0 2rem;
    }
    .slick-dots {
      pointer-events: none !important;
    }
  }

  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    .otp-buttons {
      justify-self: center;
      margin-top: 0.4rem;
      padding: 0.6rem;
      border-radius: 0.4rem;
      width: 10vw;
      align-self: center;
    }
  }

  form {
    overflow-y: auto;
    height: 50vh;
    padding: 2rem;
    input.valid {
      border-color: #0ad476dd !important;
    }

    .ant-radio-wrapper {
      display: flex;
      align-items: center;
      span {
        font-size: 1rem;
      }
    }
  }

  @media (max-width: 860px) {
    .antd-carousel {
      .content {
        padding: 0 0.8rem !important;
      }
    }

    .input-group {
      margin-bottom: 12px !important;
      .otp-buttons {
        margin-top: 0.3rem !important;
        padding: 0.4rem 0.6rem !important;
        border-radius: 0.3rem !important;
        width: auto !important;
        min-width: 80px !important;
        font-size: 10px !important;
      }
    }

    form {
      overflow-y: auto;
      height: 45vh !important;
      padding: 1rem 0.8rem !important;
      
      input.valid {
        border-color: #0ad476dd !important;
      }

      .ant-radio-wrapper {
        font-size: 10px !important;
        span {
          font-size: 10px !important;
        }
      }
    }

    .nav-btns {
      margin: 0.5rem !important;
      gap: 0.5rem !important;
    }

    .submit-btn {
      width: 80px !important;
      
      button {
        font-size: 10px !important;
        padding: 6px 10px !important;
      }
    }
  }
`;

export default MultiForm;
