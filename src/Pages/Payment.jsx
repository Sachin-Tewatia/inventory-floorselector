import { Alert, message } from "antd";
import React, { useState } from "react";
import { createOrder, validatePayment } from "../APIs/cashfree";
import { BOOKING_MODES, dummyUser } from "../Data";
import { useBookings } from "../Hooks/booking";
import { loadScript } from "../Utility/function";
import { cashfreeSandbox } from "cashfree-dropjs";

function Payment(props) {
  const [loading, setLoading] = useState(false);
  const { saveUserToDB } = useBookings();
  const ref = React.useRef();

  const handleBooking = async (flatId, userDetails) => {
    userDetails.mode = BOOKING_MODES.ONLINE;
    setLoading(true);

    const { mobile: phone, firstName, lastName, email } = userDetails;

    const user_id = await saveUserToDB(userDetails);

    const order_response = await createOrder(flatId, {
      name: firstName + " " + lastName,
      email,
      id: user_id,
      phone,
    });

    // window.location.replace(order_response.payment_link);

    await saveUserToDB(userDetails);

    const { orderToken } = order_response;

    let testCashfree = new cashfreeSandbox.Cashfree();

    const dropConfig = {
      components: [
        "order-details",
        "card",
        "netbanking",
        "app",
        "upi",
        "paylater",
        "credicardemi",
        "cardlessemi",
      ],
      orderToken,
      onSuccess: function (data) {

        //on payment flow complete
      },
      onFailure: function (data) {
        //on failure during payment initiation
      },
      style: {
        //to be replaced by the desired values
        backgroundColor: "#ffffff",
        color: "#11385b",
        fontFamily: "Lato",
        fontSize: "14px",
        errorColor: "#ff0000",
        theme: "light", //(or dark)
      },
    };

    testCashfree.initialiseDropin(ref.current, dropConfig);
  };

  return (
    <div>
      <button onClick={() => handleBooking("A-101", dummyUser)}>
        book now
      </button>
      <div ref={ref}></div>
    </div>
  );
}

export default Payment;
