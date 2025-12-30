import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { message, Select } from "antd";
import { baseURL, PROJECT_ID } from "../APIs";
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

function Price({ price }) {
  // let formatedPrice = parseInt(price.replace(/,/g, "")).toLocaleString("en-IN");

  return <>{`₹ ${price} CR`}</>;
}

const RadioInput = ({ label, value, checked, setter }) => {
  return (
    <div class="input-group">
      <label class="fake-radio-label">
        <input
          class="input-radio"
          type="radio"
          checked={checked == value}
          onChange={() => setter(value)}
        />{" "}
        <div class="fake-radio"></div>
        <span>{label}</span>
      </label>
    </div>
  );
};

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
const validateName = (name) => {
  return name.match(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/);
};
const validatePassowrd = (password) => {
  return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/);
};

function ChangePassword({
  isOpen,
  setIsOpen,
  unitDetails = [],
  handleDetailsFilledSuccess,
  additionalDetails,
  isBooking,
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const ref = React.useRef();

  //Create new user
  const handleFormSubmit = async ({ oldPassword, newPassword }) => {
    try {
      const res = await axios.post(
        `${baseURL}/admin/changePassword`,
        {
          oldPassword,
          newPassword,
          project_id: PROJECT_ID,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
            contentType: "application/json",
          },
        }
      );
      if (res.status == 201) {
        message.success("Password Updated successfully");
        localStorage.removeItem("token");
        window.location.reload();
        // if (handleDetailsFilledSuccess) handleDetailsFilledSuccess();
      }
      if (res.status == 400) {
        message.error("Old Password is wrong");
      }
    } catch (err) {
      message.error("Error while updating password");
    }
  };

  useEffect(() => {
    return () => {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <Style onClick={(e) => setIsOpen(false)}>
      <div class={`${"form-wrapper svelte-tipeeb"}`} ref={ref}>
        <div class="background svelte-tipeeb"></div>{" "}
        <div class="content svelte-tipeeb" dir="">
          <div
            class="enquiry-form  svelte-tipeeb"
            onClick={(e) => e.stopPropagation()}
          >
            {" "}
            <h2 class="form-title svelte-tipeeb">Change Password</h2>{" "}
            <div
              onClick={(e) => {
                // e.preventDefault();
                // e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              class="close-popup svelte-tipeeb"
            >
              <CloseButton />
            </div>{" "}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsOpen(false);
                handleFormSubmit({
                  oldPassword: oldPassword,
                  newPassword: newPassword,
                });
              }}
            >
              <div class="description svelte-tipeeb">
                {/* <div class="description-main svelte-tipeeb">
                  <span class="svelte-tipeeb">ONE DXP</span>{" "}
                  <span class="svelte-tipeeb">Apartments</span>{" "}
                  <span class="svelte-tipeeb">{unitDetails?.UnitType}</span>
                </div>{" "} */}
                <div
                  class="description-secondary-wrapper"
                  // style={{
                  //   display: "grid",
                  //   gridTemplateColumns: "1fr 1fr",
                  //   margin: "auto",
                  // }}
                >
                  {/* <span class="svelte-tipeeb">
                    <span class="title svelte-tipeeb">Unit Number:</span>{" "}
                    <span className="desc-value">
                      {unitDetails?.unit_number}
                    </span>
                  </span>{" "}
                  <span class="svelte-tipeeb">
                    <span class="title svelte-tipeeb">Unit Type:</span>{" "}
                    <span className="desc-value">{unitDetails?.unit_type}</span>
                  </span>{" "}
                  <span class="svelte-tipeeb">
                    <span class="title svelte-tipeeb">Total Area:</span>{" "}
                    <span class="area svelte-wv78a7">
                      <span className="desc-value">{unitDetails?.area}</span>
                    </span>{" "}
                    <span class="area-change svelte-wv78a7">Sq. Mt.</span>
                  </span>{" "} */}
                  {/* <span class="svelte-tipeeb">
                    <span class="title svelte-tipeeb">Total Cost:</span>{" "}
                    <span className="desc-value">
                      <Price price={(unitDetails?.total_cost).toFixed(2)} />
                    </span>
                  </span> */}
                </div>
              </div>{" "}
              <div class="gender-group svelte-tipeeb">
                {/* <RadioInput
                  label="Mr."
                  value="Mr."
                  checked={gender}
                  setter={setGender}
                />
                <RadioInput
                  label="Ms."
                  value="Ms."
                  checked={gender}
                  setter={setGender}
                /> */}
              </div>{" "}
              <div class="form-row">
                <div class="input-group">
                  <label class="input-group-label">
                    <span className="title-form">Old Password*</span>{" "}
                    <input
                      type="password"
                      name="oldPassword"
                      placeholder=""
                      onChange={(e) => setOldPassword(e.target.value)}
                      value={oldPassword}
                      required={true}
                    />
                  </label>
                </div>{" "}
              </div>
              <div class="form-row">
                <div class="input-group">
                  <label class="input-group-label">
                    <span className="title-form">New Password*</span>{" "}
                    <input
                      type="password"
                      name="NewPassword"
                      placeholder=""
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      required={true}
                    />
                  </label>
                  {!validatePassowrd(newPassword) && newPassword.length > 2 && (
                    <span style={{ color: "#f51616", position: "relative" }}>
                      Enter a valid password : Contains 8 letters <br />
                      'A-Z','a-z','1-9' and '$#&@'
                    </span>
                  )}
                </div>
              </div>{" "}
              <div class="form-row">
                <div class="input-group">
                  <label class="input-group-label">
                    <span className="title-form">Confirm Password*</span>{" "}
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      required={true}
                    />
                  </label>
                  {confirmPassword.length > 3 &&
                    newPassword !== confirmPassword && (
                      <span style={{ color: "#f51616" }}>
                        Password doesn't match
                      </span>
                    )}
                </div>
              </div>
              {/* <div class="form-row">
                <div class="input-group payment-info">
                  Please pay the Blocking amount to Block your Unit. Please note
                  that the Unit will be blocked for 48 hours. To confirm your
                  booking, please contact our Sales Team now - 9599867299.
                </div>
              </div>{" "} */}
              <div class="submit-btn svelte-tipeeb">
                <button
                  class={`button submit svelte-ynf51n enable ${
                    newPassword == confirmPassword &&
                    validatePassowrd(newPassword)
                      ? ""
                      : "disabled"
                  }`}
                  value=""
                  style={{ paddings: "5px 8px" }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Style>
  );
}

export default ChangePassword;

const Style = styled.div`
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

  .form-wrapper.svelte-tipeeb.svelte-tipeeb {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1001;
    display: flex;
    justify-content: center;
    padding: 20px;
    overflow: auto;
  }
  .background.svelte-tipeeb.svelte-tipeeb {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(47, 47, 47, 0.7);
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
  .enquiry-form .code-input select {
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
  }
  .phone-input {
    width: 100%;
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
  .enquiry-form.svelte-tipeeb.svelte-tipeeb {
    position: relative;
    max-width: 691px;
    min-width: 391px;
    min-height: 283px;
    width: 100%;
    padding: 35px;
    background-color: var(--background_panel);
    backdrop-filter: blur(7px);
    border-radius: 10px;
    font-size: 13px;
    pointer-events: all;
  }
  .content.svelte-tipeeb.svelte-tipeeb {
    position: relative;
    z-index: 200;
    margin: auto;
  }
  .form-title.svelte-tipeeb.svelte-tipeeb {
    margin-bottom: 5px;
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 15px;
    color: var(--form_text_color);
  }
  .close-popup.svelte-tipeeb.svelte-tipeeb {
    position: absolute;
    top: 35px;
    right: 35px;
    cursor: pointer;
    z-index: 2;
    pointer-events: all;
  }
  .enquiry-form .close-popup svg {
    width: 14px;
    height: 14px;
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
    transform: scale(1.3);
  }
  .enquiry-form .close-popup svg path {
    font-size: 14px;
  }

  //1st part of form
  .description.svelte-tipeeb.svelte-tipeeb {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    padding: 15px 20px;
    margin-bottom: 25px;
    color: var(--color_text);
    font-size: 13px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin-top: 2rem;
  }
  .description-main.svelte-tipeeb.svelte-tipeeb {
    display: flex;
    align-items: flex-start;
    /* flex-direction: column; */
  }
  .description-main.svelte-tipeeb span.svelte-tipeeb:first-child {
    margin-top: 0;
  }
  .description-main.svelte-tipeeb span.svelte-tipeeb {
    margin-top: 7px;
  }
  .description-main.svelte-tipeeb span.svelte-tipeeb {
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
    .title-form {
      color: rgb(208, 204, 204) !important;
      font-size: 1rem !important;
    }
    /* align-items: flex-end; */
    /* flex-direction: column; */
  }
  .description-secondary-wrapper.svelte-tipeeb span.svelte-tipeeb:first-child {
    margin-top: 0;
  }

  .description-secondary-wrapper.svelte-tipeeb span.svelte-tipeeb:first-child {
    margin-top: 0;
  }

  .description-secondary-wrapper.svelte-tipeeb span.title.svelte-tipeeb {
    color: white;
  }

  .area-change.svelte-wv78a7 {
    cursor: pointer;
  }
  .description-secondary-wrapper.svelte-tipeeb span.svelte-tipeeb:first-child {
    margin-top: 0;
  }

  .description-secondary-wrapper.svelte-tipeeb span.title.svelte-tipeeb {
    color: white;
  }

  //2nd part of form
  .gender-group.svelte-tipeeb.svelte-tipeeb {
    display: flex;
  }
  .gender-group.svelte-tipeeb .input-group {
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
  .gender-group.svelte-tipeeb .input-group {
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
  .submit-btn.svelte-tipeeb.svelte-tipeeb {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .submit-btn.svelte-tipeeb button {
    max-width: 180px;
    padding: 14px;
  }
  .button.submit.disabled {
    box-shadow: var(--button_shadow_disabled);
    color: #cacaca !important;
    cursor: default;
    pointer-events: none;
    background: #32755d6b !important;
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
    border: 1px solid #92a3b9 !important;
    border-radius: 8px !important;
    font-size: 16px !important;
  }
  .title {
    color: white !important;
    font-size: 1rem;
    font-weight: 500;
  }
  .desc-value {
    font-size: 1rem !important;
  }
`;
