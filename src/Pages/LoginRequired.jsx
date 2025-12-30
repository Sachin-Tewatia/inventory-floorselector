import React, { useContext } from "react";
import Login from "../Dashboard/Login";
import Loading from "../Components/Atoms/Loading";
import { AppContext } from "../Contexts/AppContext";

function LoginRequired(props) {
  const { fetchedData, notLoggedIn } = useContext(AppContext);
  console.log(notLoggedIn);
  if (notLoggedIn) return <Login />;
  return fetchedData ? props.children : <Loading />;
}

export default LoginRequired;
