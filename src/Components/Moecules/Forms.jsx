import { Image, Radio, Select } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import DocUploader from "./DocUploader";
import { useEffect } from "react";
import {
  validateAadhaar,
  validateCheque,
  validateEmail,
  validateMobileNumber,
  validatePan,
  validateText,
} from "./formValidator";
import { generateOtp, getOtpStatus, resendOtp, verifyOtp } from "../../APIs";
import { useContext } from "react";
import { AppContext } from "../../Contexts/AppContext";

export const CustomerForm = ({ values, setValues }) => {
  const [otp, setOtp] = useState("");
  const [disableSendButton, setDisableSendButton] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [disableResendButton, setDisableResendButton] = useState(true);
  const [resendTimeout, setResendTimeout] = useState(null);
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const [disablePhoneField, setDisablePhoneField] = useState(false);
  let [resendOtpTime, setResendOtpTime] = useState(0);
  const { setOtpStatus } = useContext(AppContext);

  const handleSendOTP = () => {
    // Call your API to send OTP here
    setDisablePhoneField(true);
    generateOtp(phoneNumber);
    setDisableSendButton(true);
    setDisableResendButton(true);
    setResendOtpTime(45);
    setResendTimeout(
      setTimeout(() => {
        setDisableResendButton(false);
      }, 45000)
    );
  };

  const handleResendOTP = () => {
    // Call your API to resend OTP here
    resendOtp(phoneNumber);
    setDisableResendButton(true);
    setResendTimeout(
      setTimeout(() => {
        setDisableResendButton(false);
      }, 45000)
    );
  };
  const handleVerifyOTP = () => {
    // Call your API to verify OTP here
    verifyOtp(otp);

    getOtpStatus();
    setOtpStatus("verified");
    console.log("OTP Verified");
  };
  useEffect(() => {
    return () => {
      clearTimeout(resendTimeout);
    };
  }, [resendTimeout]);
  const partnerOptions = [
    {
      value: "jack",
      label: "Jack",
    },
    {
      value: "lucy",
      label: "Lucy",
    },
    {
      value: "Yiminghe",
      label: "yiminghe",
    },
    {
      value: "chaitanya",
      label: "Chaitanya",
    },
  ];
  return (
    <form>
      <div class="form-row">
        <div class="input-group">
          <label class="input-group-label">
            <span className="title">First Name*</span>{" "}
            <input
              className={`${validateText(values?.firstName) ? "valid" : ""}`}
              type="text"
              regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
              name="first_name"
              placeholder=""
              onChange={(e) =>
                setValues((prev) => ({ ...prev, firstName: e.target.value }))
              }
              value={values.firstName}
              required={true}
            />
          </label>
        </div>{" "}
        <div class="input-group">
          <label class="input-group-label">
            <span className="title">Last Name*</span>{" "}
            <input
              className={`${values.lastName && validateText(values?.lastName) ? "valid" : ""}`}
              type="text"
              regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
              name="last_name"
              placeholder=""
              onChange={(e) =>
                setValues((prev) => ({ ...prev, lastName: e.target.value }))
              }
              value={values.lastName}
              required={true}
            />
          </label>
        </div>
      </div>{" "}
      <div className="form-row">
        <div class="input-group">
          <label class="combo-input">
            <span className="title">Email*</span>
            <div class="row">
              <input
                className={`${validateEmail(values.email) ? "valid" : ""}`}
                type="text"
                name="email"
                placeholder=""
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, email: e.target.value }))
                }
                value={values.email}
                style={{ marginTop: "7px" }}
                required={true}
              />
            </div>
          </label>
        </div>

        <div class="input-group">
          <label class="combo-input">
            <span className="title">Phone Number*</span>
            <div class="row phone-input">
              <div class="code-input" style={{ marginRight: "5px" }}>
                <select
                  name="phone_code"
                  id="booking_form_phone_code"
                  className={`${
                    validateMobileNumber(values.phone) ? "valid" : ""
                  }`}
                >
                  <option value="+91">+91</option>
                  <option value="+971">+971</option>
                  <option value="+973">+973</option>
                  <option value="+944">+944</option>
                </select>
              </div>{" "}
              <input
                className={`${
                  validateMobileNumber(values.phone) ? "valid" : ""
                }`}
                type="text"
                name="phone_number"
                placeholder=""
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, phone: e.target.value }));
                  return validateMobileNumber(e.target.value)
                    ? setPhoneNumber(e.target.value)
                    : null;
                }}
                value={values.phone}
                style={{ marginTop: "7px" }}
                required={true}
              />
            </div>
          </label>
        </div>
      </div>
      {/* <div className="form-row "> */}
      {/* <div class="input-group"> */}
      {/* <label class="input-group-label"></label> */}
      {/* <span className="title">OTP*</span>{" "} */}
      {/* <input
            type="number"
            regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
            name="otp"
            placeholder="OTP"
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            required={true}
            maxLength={4}
            disabled={!disableSendButton}
          />
        </div> */}
      {/* <div class="input-group"> */}
      {/* <label class="input-group-label">
                    <span className="title">Cheque or Ref No.*</span>{" "}
                    <input
                      type="text"
                      regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
                      name="last_name"
                      placeholder=""
                      onChange={(e) => setCheckDetails(e.target.value)}
                      value={checkDetails}
                      required={true}
                    />
                  </label> */}
      {/* <button
            onClick={handleSendOTP}
            disabled={phoneNumber.length != 10 || disableSendButton}
            className="otp-buttons"
          > */}
      {/* {disableSendButton ? "OTP Sent" : "Send OTP"}
          </button>
        </div>
        <div class="input-group">
          <button
            className="otp-buttons"
            onClick={(e) => {
              e.preventDefault();
              handleVerifyOTP();
            }}
            disabled={otp.length != 6}
          >
            Verify OTP
          </button>
        </div>{" "} */}
      {/* <div class="input-group">
        {disableSendButton && (
          <button
            onClick={handleResendOTP}
            disabled={disableResendButton}
            className="otp-buttons"
          >
            {/* {!disableResendButton ? "Resend OTP" : "Resending OTP"} */}
      {/* Resend OTP {resendOtpTime > 0 && ` in ${resendOtpTime}S`} */}
      {/* </button>  */}
      {/* // )} */}
      {/* </div> */}
      {/* </div> */}
      {/* </div> */}
      {/* <div className="form-row"> */}
      <div class="form-row">
        <div class="input-group">
          <label class="input-group-label">
            <Radio.Group
              className="w-[300px]"
              buttonStyle="solid"
              defaultValue={values.totalOwners}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  totalOwners: e.target.value,
                }))
              }
            >
              <Radio className="my-2" value={1}>
                Single Owner
              </Radio>
              {/* <Radio value={2}>2 Owners</Radio> */}
            </Radio.Group>
          </label>
        </div>{" "}
      </div>{" "}
      {/* <div class="description ">
      You Will Be Charged ₹ {`5 Lakh`} For This Booking
    </div> */}
      <div class="form-row">
        <div class="input-group">
          <label class="input-group-label">
            <span className="title">Channel Partner*</span>{" "}
            <input
              type="text"
              regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
              name="partner_details"
              placeholder=""
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  partner_details: e.target.value,
                }))
              }
              value={values.partner_details}
              required={true}
            />
            {/* <Select
              defaultValue="Select Partner"
              onChange={(val) =>
                setValues((prev) => ({
                  ...prev,
                  partner_details: val,
                }))
              }
              options={partnerOptions}
              required={true}
            /> */}
          </label>
        </div>{" "}
        <div class="input-group">
          <label class="input-group-label">
            <span className="title">RM (Saleperson)*</span>{" "}
            <input
              type="text"
              regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
              name="rm_name"
              placeholder={values.rm_name}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, rm_name: e.target.value }))
              }
              value={values.rm_name}
              required={true}
              // disabled={true}
            />
          </label>
        </div>
      </div>{" "}
    </form>
  );
};

export const RMForm = ({ values, setValues, onValid }) => {
  const validateForm = () => {
    return true;
  };

  return (
    <form>
      {/* <div class="form-row">
      <div class="input-group">
        <label class="input-group-label">
          <span className="title">Channel Partner*</span>{" "}
          <input
            type="text"
            regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
            name="first_name"
            placeholder=""
            onChange={(e) => setValues(prev=>({...prev, partnerDetails: e.target.value}))}
            value={values.partnerDetails}
            required={true}
          />
        </label>
      </div>{" "}
      <div class="input-group">
        <label class="input-group-label">
          <span className="title">RM (Saleperson)*</span>{" "}
          <input
            type="text"
            regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
            name="last_name"
            placeholder=""
            onChange={(e) => setValues(prev=>({...prev, rmDetails: e.target.value}))}
            value={values.rmDetails}
            required={true}
            disabled={true}
          />
        </label>
      </div>
    </div>{" "} */}
      <div className="form-row">
        {/* {additionalDetails?.check && ( */}
        <div class="input-group">
          <label class="input-group-label">
            <span className="title">Cheque or Ref No.</span> <br />
            <input
              type="text"
              regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
              name="ref_or_cheque"
              placeholder=""
              className={`${validateCheque(values?.ref_or_cheque) ? "valid" : ""}`}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  ref_or_cheque: e.target.value,
                }))
              }
              value={values.checkDetails}
            />
          </label>
        </div>
        <div class="input-group">
          <label class="input-group-label">
            <span className="title">Cheque Amount*</span> <br />
            <input
              type="number"
              regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
              name="cheque_amount"
              placeholder=""
              className={`${values?.cheque_amount?.length > 2 ? "valid" : ""}`}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  cheque_amount: e.target.value,
                }))
              }
              value={values.cheque_amount}
              required={true}
            />
          </label>
        </div>
        {/* {cheque_pic && <img src={cheque_pic} />} */}

        {/* )} */}
      </div>
      <div className="form-row">
        {/* <div className="input-group">
          <label className="input-group-label">
            <span className="title">TCV*</span> <br />
            <input
              type="text"
              regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
              name="tcv"
              placeholder="cr"
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  tcb: e.target.value,
                }))
              }
              value={values.tcb}
            />
          </label>
        </div> */}
        <div className="input-group">
          <DocUploader
            title={"Upload Cheque (if available)"}
            // onChange={(e) => console.log(e)}
            onChange={(e) => setValues((prev) => ({ ...prev, cheque_pic: e }))}
          />
        </div>
      </div>
    </form>
  );
};

export const AddOnForm = ({ values, setValues, onValid }) => {
  const validateForm = () => {
    return true;
  };

  return (
    <form>
      {/* <div class="form-row">
      <div class="input-group">
        <label class="input-group-label">
          <span className="title">Channel Partner*</span>{" "}
          <input
            type="text"
            regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
            name="first_name"
            placeholder=""
            onChange={(e) => setValues(prev=>({...prev, partnerDetails: e.target.value}))}
            value={values.partnerDetails}
            required={true}
          />
        </label>
      </div>{" "}
      <div class="input-group">
        <label class="input-group-label">
          <span className="title">RM (Saleperson)*</span>{" "}
          <input
            type="text"
            regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
            name="last_name"
            placeholder=""
            onChange={(e) => setValues(prev=>({...prev, rmDetails: e.target.value}))}
            value={values.rmDetails}
            required={true}
            disabled={true}
          />
        </label>
      </div>
    </div>{" "} */}
      <div className="form-row">
        {/* {additionalDetails?.check && ( */}
        <div class="input-group">
          <label class="input-group-label">
            <span className="title">No of Parkings</span> <br />
            <input
              type="text"
              regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
              name="last_name"
              placeholder=""
              onChange={(e) =>
                setValues((prev) => ({ ...prev, checkDetails: e.target.value }))
              }
              value={values.checkDetails}
              required={true}
            />
          </label>
        </div>
        {/* {cheque_pic && <img src={cheque_pic} />} */}

        {/* )} */}
      </div>
      {/* <DocUploader
        title={"Upload Cheque (if available)"}
        onChange={(e) => console.log(e)}
      /> */}
    </form>
  );
};

export const KYCForm = ({ values, setValues, onValid }) => {
  const isDoubleOwner = parseInt(values.totalOwners) === 2;

  const validateForm = () => {
    return (
      values.kyc.adhaar1.length > 0 &&
      values.kyc.pan1.length > 0 &&
      (!isDoubleOwner ||
        (values.kyc.adhaar2.length > 0 && values.kyc.pan2.length > 0))
    );
  };

  // useEffect(()=>{
  //         if(validateForm())
  //             setValues({
  //                 ...values,
  //                 completedSteps: {
  //                     ...values.completedSteps,
  //                     1: true
  //                 }
  //           })
  //           else
  //             setValues({
  //                 ...values,
  //                 completedSteps: {
  //                     ...values.completedSteps,
  //                     1: false
  //                 }
  //             })
  // },[values])

  return (
    <form>
      {isDoubleOwner && (
        <div className="title text-white mb-3">Documents of owner 1</div>
      )}
      <div class="form-row">
        <div class="input-group">
          <label class="input-group-label">
            <span className="title">Aadhar Number</span>{" "}
            <input
              type="number"
              regex="/^[0-9]{0,12}$/"
              name="aadhar_number1"
              placeholder=""
              maxLength="12"
              className={`${validateAadhaar(values?.kyc?.aadhar_number1) ? "valid" : ""}`}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  kyc: { ...prev.kyc, aadhar_number1: e.target.value },
                }))
              }
              value={values.kyc?.aadhar_number1}
              // required={true}
            />
          </label>
        </div>
      </div>
      <DocUploader
        title={"Upload Aadhar Card"}
        onChange={(e) =>
          setValues((prev) => ({ ...prev, kyc: { ...prev.kyc, adhaar1: e } }))
        }
      />
      <div class="form-row">
        <div class="input-group">
          <label class="input-group-label">
            <span className="title">Pan Number</span>{" "}
            <input
              type="text"
              regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
              name="pan_number1"
              placeholder=""
              className={`${validatePan(values?.kyc?.pan_number1) ? "valid" : ""}`}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  kyc: { ...prev.kyc, pan_number1: e.target.value },
                }))
              }
              value={values.kyc?.pan_number1}
            />
          </label>
        </div>
      </div>
      <DocUploader
        title={"Upload Pan Card"}
        onChange={(e) =>
          setValues((prev) => ({ ...prev, kyc: { ...prev.kyc, pan1: e } }))
        }
      />
      {isDoubleOwner && (
        <>
          <div className="title text-white my-2 mt-4">Documents of owner 2</div>
          <div class="form-row">
            <div class="input-group">
              <label class="input-group-label">
                <span className="title">Aadhar Number</span>{" "}
                <input
                  type="number"
                  regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
                  name="aadhar_number2"
                  placeholder=""
                  maxLength="12"
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      kyc: { ...prev.kyc, aadhar_number2: e.target.value },
                    }))
                  }
                  value={values.kyc?.aadhar_number2}
                />
              </label>
            </div>
          </div>
          <DocUploader
            title={"Upload Adhaar Card"}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                kyc: { ...prev.kyc, adhaar2: e },
              }))
            }
          />
          <div class="form-row">
            <div class="input-group">
              <label class="input-group-label">
                <span className="title">Pan Number</span>{" "}
                <input
                  type="text"
                  regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
                  name="pan_number2"
                  placeholder=""
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      kyc: { ...prev.kyc, pan_number2: e.target.value },
                    }))
                  }
                  value={values.kyc?.pan_number2}
                />
              </label>
            </div>
          </div>
          <DocUploader
            title={"Upload Pan Card"}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, kyc: { ...prev.kyc, pan2: e } }))
            }
          />
        </>
      )}
    </form>
  );
};