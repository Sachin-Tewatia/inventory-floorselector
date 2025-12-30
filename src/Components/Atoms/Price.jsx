import React from "react";
import { getFormalCurrencyFromNum } from "../../Utility/function";

function Price({ price }) {
  // let formatedPrice = parseInt(price.replace(/,/g, "")).toLocaleString("en-IN");
  let formatedPrice = getFormalCurrencyFromNum(price).replace(" ", "+ ");

  return <>{`₹ ${formatedPrice}`}</>;
}

export default Price;
