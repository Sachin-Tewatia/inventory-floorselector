import { Alert, Spin, message, Input } from "antd";
import React from "react";
import styled from "styled-components";
import { LoadingOutlined } from "@ant-design/icons";
import { adminLogin } from "../APIs";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Contexts/AppContext";
// import Footer from "../Footer/Footer";

function Login({ setIsLogin, title }) {
  const [_username, setUsername] = React.useState("");
  const [_password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  const handleLogin = async (_username, _password, onLogin) => {
    message.config({
      top: 100,
      duration: 2,
      transitionName: "move-up",
    });
    setLoading(true);
    const loginData = await adminLogin(_username, _password);
    if (!loginData) message.error("Invalid Login");
    else if (loginData?.is_active === false)
      message.error("User is not active");
    else {
      const hide = message.success("Login success");
      setTimeout(hide, 2000);
      setTimeout(() => {
        onLogin(loginData);
        navigate("/dashboard");
      }, 500);
    }
    setLoading(false);
  };

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "white",
      }}
      spin
    />
  );

  return (
    <Style>
      <div className="logo-container">
        <img src="/inspire.png" alt="Logo" className="logo" />
      </div>
      <div className="login-page">
        <div className="form">
          <div className="title">Admin / Rm Login</div>
          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(_username, _password, (loginData) =>
                setUser(loginData)
              );
            }}
          >
            <Input
              value={_username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={{ marginBottom: "15px" }}
            />

            {/* ✅ Password field with built-in eye icon */}
            <Input.Password
              value={_password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              visibilityToggle     // shows the eye icon to toggle visibility
              style={{ marginBottom: "15px" }}
            />

            <button>{loading ? <Spin indicator={antIcon} /> : "Login"}</button>
          </form>
        </div>
      </div>
      {/* <Footer /> */}
    </Style>
  );
}

export default Login;

const Style = styled.div`
  @import url(https://fonts.googleapis.com/css?family=Roboto:300);

  background: #5296b8; /* fallback for old browsers */
  background: linear-gradient(to left, #71aad0, #2172af);
  background-image: url("/homepage/0.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-blend-mode: multiply;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    z-index: 1;
  }

  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .logo-container {
    position: absolute;
    top: 0.1rem;
    left: 1rem;
    z-index: 2;
    background-color: rgb(247, 247, 247);
    margin: 0.7rem 0.5rem !important;
    border-radius: 5px;
    box-shadow: whitesmoke;
    max-width: 100px;
    .logo {
      width: 150px;
      height: auto;
    }
  }

  .login-page {
    max-width: 360px;
    padding: 4% 0 0;
    margin: auto;
    position: relative;
    z-index: 2;

    .title {
      color: #2172af;
      text-align: center;
      font-size: 1.3rem;
      margin-bottom: 3rem;
      width: 100%;
    }
  }
  .form {
    position: relative;
    z-index: 1;
    background: #ffffff;
    max-width: 360px;
    margin: 0 auto 100px;
    padding: 45px;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    border-radius: 8px;
  }
  .form input {
    font-family: "Roboto", sans-serif;
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
    border-radius: 4px;
  }
  .ant-input-password {
    font-family: "Roboto", sans-serif;
    background: #f2f2f2;
    height: 50px;
  }
  .ant-input-password input {
    margin-top: 5px;
  }
  .form button {
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #2172af;
    width: 100%;
    border: 0;
    padding: 15px;
    color: #ffffff;
    font-size: 14px;
    transition: all 0.3 ease;
    cursor: pointer;
    border-radius: 4px;
  }
  .form button:hover,
  .form button:active,
  .form button:focus {
    background: #1c5b8c;
  }
  .form .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 12px;
  }
  .form .message a {
    color: #4caf50;
    text-decoration: none;
  }
  .form .register-form {
    display: none;
  }
`;
