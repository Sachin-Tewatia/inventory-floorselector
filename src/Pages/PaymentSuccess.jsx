import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchPaymentDetails } from "../APIs/cashfree";
import Loading from "../Components/Atoms/Loading";
import Navigator from "../Components/Molecules/Navigator";
import { TOWERS } from "../Data";
import { useInventories } from "../Hooks";

const Check = () => (
  <CheckStyle>
    <div className="success-checkmark">
      <div className="check-icon">
        <span className="icon-line line-tip"></span>
        <span className="icon-line line-long"></span>
        <div className="icon-circle"></div>
        <div className="icon-fix"></div>
      </div>
    </div>
  </CheckStyle>
);

function PaymentSuccess() {
  const navigate = useNavigate();
  const params = useParams();
  const { getAllFlatsInFloor } = useInventories();
  const { orderId, paymentId } = params;
  const { floor, tower, unit: unit_str } = useParams();
  const flats = getAllFlatsInFloor(tower, floor);
  const currentFlatIndex = flats.findIndex(
    (flat) => flat["FlatNumber"] == unit_str
  );
  const [paymentDetails, setPaymentDetails] = React.useState(null);
  const [loading, setLoading] = useState(false);

  function printData() {
    var printContent = document.getElementById("printTable");
    var windowUrl = "about:blank";
    var uniqueName = new Date();
    var windowName = "Print" + uniqueName.getTime();

    var printWindow = window.open();
    printWindow.document.body.innerHTML = printContent.innerHTML;
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    setTimeout(() => {
      printWindow.close();
    }, 200);

    return false;
  }

  useEffect(() => {
    setLoading(true);
    if (!orderId || !paymentId) navigate("");
    else {
      (async () => {
        const response = await fetchPaymentDetails(orderId, paymentId);
        if (response && response.data) setPaymentDetails(response.data);
        setLoading(false);
      })();
    }
  }, []);

  return (
    <Style>
      {loading && <Loading />}
      <Navigator
        className="navigator"
        prevPages={[
          {
            title: "Signature",
            path: "/salarpuria",
          },
          {
            title: `Apartment ${flats[currentFlatIndex].FlatNumber}`,
            path: `/salarpuria/tower/${tower}/floor/${floor}/unit/${flats[currentFlatIndex].id}`,
          },
        ]}
        currentPage={{
          title: `Booking Success`,
          path: `/salarpuria/tower/${tower}/floor/${floor}/unit/${flats[currentFlatIndex].id}`,
        }}
      />
      {paymentDetails && (
        <div className="wrapper">
          <div className="top">
            <Check />
          </div>
          <div className="body" id="printTable">
            <h1>Unit Blocked Successfully !</h1>

            <table cellSpacing="0" cellPadding="2" border="1" width="100%">
              <tr>
                <td width="60%" align="left" bgcolor="#2A2A2A">
                  Payment Reference Id #
                </td>
                <td width="40%" align="left" bgcolor="#2A2A2A">
                  {paymentDetails.cfPaymentId}
                </td>
              </tr>
              <tr>
                <td width="60%" align="left" bgcolor="#2A2A2A">
                  Payment Order ID
                </td>
                <td width="40%" align="left" bgcolor="#2A2A2A">
                  {orderId}
                </td>
              </tr>
              <tr>
                <td width="60%" align="left" bgcolor="#2A2A2A">
                  Payment Id
                </td>
                <td width="40%" align="left" bgcolor="#2A2A2A">
                  {paymentId}
                </td>
              </tr>
              <tr>
                <td width="60%" align="left">
                  Payment Amount ({paymentDetails.paymentCurrency})
                </td>
                <td width="40%" align="left">
                  {paymentDetails.paymentAmount}
                </td>
              </tr>
              <tr>
                <td width="60%" align="left">
                  Payment Time
                </td>
                <td width="40%" align="left">
                  {paymentDetails.paymentTime.replace("T", " ")}
                </td>
              </tr>
              <tr>
                <td width="60%" align="left">
                  Payer Name
                </td>
                <td width="40%" align="left">
                  {paymentDetails?.customerName?.toUpperCase()}
                </td>
              </tr>
              <tr>
                <td width="60%" align="left">
                  Unit Id
                </td>
                <td width="40%" align="left">
                  {paymentDetails.orderNote.replace("Flat ID: ", "")}
                </td>
              </tr>

              {paymentDetails.bankReference && (
                <tr>
                  <td width="60%" align="left">
                    Bank Reference
                  </td>
                  <td width="40%" align="left">
                    {paymentDetails.bankReference}
                  </td>
                </tr>
              )}
              <tr>
                <td width="60%" align="left">
                  Payment Status
                </td>
                <td
                  width="40%"
                  align="left"
                  className={`payment-status ${paymentDetails.paymentStatus}`}
                >
                  {paymentDetails.paymentStatus}
                </td>
              </tr>
            </table>

            <p>
              Please note that the Unit will be blocked for 48 hours. To confirm
              your booking, please contact our Sales Team now - 1234567890.
            </p>

            {/* <Link to={"/"} className="no-dec"> */}
            <div className="thanks-msg">Thank You !</div>
            <div className="print-btn" onClick={printData}>
              Print
            </div>
            {/* </Link> */}
          </div>
        </div>
      )}
    </Style>
  );
}

export default PaymentSuccess;

const Style = styled.div`
  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
  }

  display: flex;
  align-items: center;
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  background: rgb(48, 41, 32);
  background: linear-gradient(
    68deg,
    rgba(48, 41, 32, 1) 0%,
    rgba(124, 111, 91, 1) 15%,
    rgba(138, 124, 102, 1) 25%,
    rgba(134, 121, 99, 1) 32%,
    rgba(121, 109, 90, 1) 45%,
    rgba(92, 86, 74, 1) 100%
  );
  min-height: 100vh;
  padding-top: 6rem;
  .wrapper {
    max-width: 700px;
    margin: 3rem auto;
    margin-bottom: 0;
    /* background-color: #ffffffea; */
    background: #1f1f1fca;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-top: 2rem;
    overflow: hidden;
    .top {
      background: var(--green-theme); /* fallback for old browsers */
      background: -webkit-linear-gradient(
        to right,
        var(--blue-theme),
        var(--green-theme)
      ); /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(to right, #1fe461c8, #11b31eea);
    }

    .body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
      h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--green-theme);
      }
      p {
        margin-top: 1rem;
        color: #e4e2e2eb;
        font-size: 0.9rem;
        font-weight: 400;
        padding: 0 1rem;
        /* text-align: center; */
      }

      .thanks-msg {
        margin-top: 2rem;
        color: #e4e2e2eb;
        font-size: 1.2rem;
      }

      table {
        margin-top: 2rem;
        width: 100%;
        border-collapse: collapse;
        tr {
          border-bottom: 1px solid #76e3763d;
        }
        td {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          font-weight: 300;
          color: #dad6d6;
          :first-child {
            font-weight: 400;
          }
        }
        td.payment-status.SUCCESS {
          color: var(--green-theme);
          font-weight: 500;
        }
      }
    }
  }
  .print-btn {
    transition: all linear 0.2s;
    background: var(--green-theme); /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      var(--blue-theme),
      var(--green-theme)
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #1fe461c8, #11b31eea);
    padding: 0.4rem 1rem;
    border-radius: 5px;
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: 2rem;
    opacity: 0.8;
    :hover {
      opacity: 1;
    }
  }
`;

const CheckStyle = styled.div`
  background: white;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.7);
  .success-checkmark {
    transform: translate(0px, 20px);
    width: 80px;
    height: 115px;
    margin: 0 auto;

    .check-icon {
      width: 80px;
      height: 80px;
      position: relative;
      border-radius: 50%;
      box-sizing: content-box;
      /* border: 4px solid #4caf50; */

      &::before {
        top: 3px;
        left: -2px;
        width: 30px;
        transform-origin: 100% 50%;
        border-radius: 100px 0 0 100px;
      }

      &::after {
        top: 0;
        left: 30px;
        width: 60px;
        transform-origin: 0 50%;
        border-radius: 0 100px 100px 0;
        animation: rotate-circle 6.25s ease-in;
      }

      &::before,
      &::after {
        content: "";
        height: 100px;
        position: absolute;
        background: transparent;
        transform: rotate(-45deg);
      }

      .icon-line {
        height: 7px;
        background-color: #4caf50;
        display: block;
        border-radius: 2px;
        position: absolute;
        z-index: 10;

        &.line-tip {
          top: 46px;
          left: 14px;
          width: 25px;
          transform: rotate(45deg);
          animation: icon-line-tip 0.75s;
        }

        &.line-long {
          top: 38px;
          right: 8px;
          width: 47px;
          transform: rotate(-45deg);
          animation: icon-line-long 0.75s;
        }
      }

      .icon-circle {
        top: -4px;
        left: -4px;
        z-index: 10;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        position: absolute;
        box-sizing: content-box;
        /* border: 4px solid rgba(76, 175, 80, 0.5); */
      }

      .icon-fix {
        top: 8px;
        width: 5px;
        left: 26px;
        z-index: 1;
        height: 85px;
        position: absolute;
        transform: rotate(-45deg);
        background-color: transparent;
      }
    }
  }

  @keyframes rotate-circle {
    0% {
      transform: rotate(-45deg);
    }
    5% {
      transform: rotate(-45deg);
    }
    12% {
      transform: rotate(-405deg);
    }
    100% {
      transform: rotate(-405deg);
    }
  }

  @keyframes icon-line-tip {
    0% {
      width: 0;
      left: 1px;
      top: 19px;
    }
    54% {
      width: 0;
      left: 1px;
      top: 19px;
    }
    70% {
      width: 50px;
      left: -8px;
      top: 37px;
    }
    84% {
      width: 17px;
      left: 21px;
      top: 48px;
    }
    100% {
      width: 25px;
      left: 14px;
      top: 45px;
    }
  }

  @keyframes icon-line-long {
    0% {
      width: 0;
      right: 46px;
      top: 54px;
    }
    65% {
      width: 0;
      right: 46px;
      top: 54px;
    }
    84% {
      width: 55px;
      right: 0px;
      top: 35px;
    }
    100% {
      width: 47px;
      right: 8px;
      top: 38px;
    }
  }
`;
