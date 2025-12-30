import React from "react";
import { useAuth } from "../../Hooks";
import Login from "../../Pages/Login";

function RestrictedPage({
  children,
  isLoggedIn,
  setIsLoggedIn,
  credentials,
  loginTitle,
}) {
  return isLoggedIn ? (
    children
  ) : (
    <Login
      title={loginTitle}
      setIsLogin={setIsLoggedIn}
      credentials={credentials}
    />
  );
}

export default RestrictedPage;
