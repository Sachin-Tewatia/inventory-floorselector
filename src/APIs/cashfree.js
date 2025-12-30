import { message } from "antd";

// heroku
const BASE_URL = "https://smartworld.api.convrse.ai";

// local
// const BASE_URL = "http://localhost:5000";

export const createOrder = async (property_id, customer_details) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    property_id: property_id,
    customer_details: customer_details,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(`${BASE_URL}/create-order`, requestOptions);

  const data = await response.json();

  if (response.status !== 200) {
    if (data?.data.message) message.error(data?.data.message);
    else message.error(response.statusText);
    return false;
  }

  return data;
};

export const fetchPaymentDetails = async (orderId, paymentId) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    order_id: orderId,
    payment_id: paymentId,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    `${BASE_URL}/get-payment-details`,
    requestOptions
  );

  const data = await response.json();

  if (response.status !== 200) {
    if (data?.data.message) message.error(data?.data.message);
    else message.error(response.statusText);
    return false;
  }

  return data;
};

// export const validatePayment = async (orderId, paymentId, signature) => {
//   const response = await fetch("http://localhost:5000/validatePayment", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       razorpay_signature: signature,
//       razorpay_order_id: orderId,
//       razorpay_payment_id: paymentId,
//     }),
//   });
//   const result = await response.json();
//   return result;
// };
