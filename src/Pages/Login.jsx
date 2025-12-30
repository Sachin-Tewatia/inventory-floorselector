import { Alert, Spin } from "antd";
import React from "react";
import styled from "styled-components";
import { LoadingOutlined } from "@ant-design/icons";

function Login({ setIsLogin, credentials, title }) {
  const [_username, setUsername] = React.useState("");
  const [_password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [invalidLogin, setInvalidLogin] = React.useState(false);
  const { username, password } = credentials;

  const handleLogin = (_username, _password) => {
    setLoading(true);
    if (_username === username && _password === password) {
      setTimeout(() => {
        setIsLogin(true);
        setLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setLoading(false);
        setInvalidLogin(true);
      }, 1000);
    }
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
      {invalidLogin && <Alert message="Invalid Login" type="error" closable />}
      <div class="login-page">
        <div class="form">
          <div className="title">{title}</div>
          <form
            class="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(_username, _password);
            }}
          >
            <input
              type="text"
              value={_username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              onFocus={() => setInvalidLogin(false)}
            />
            <input
              type="password"
              value={_password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              onFocus={() => setInvalidLogin(false)}
            />
            <button>{loading ? <Spin indicator={antIcon} /> : "Login"}</button>
          </form>
        </div>
      </div>
    </Style>
  );
}

export default Login;

const Style = styled.div`
  @import url(https://fonts.googleapis.com/css?family=Roboto:300);

  background: #76b852; /* fallback for old browsers */
  background: -webkit-linear-gradient(right, #76b852, #8dc26f);
  background: -moz-linear-gradient(right, #76b852, #8dc26f);
  background: -o-linear-gradient(right, #76b852, #8dc26f);
  background: linear-gradient(to left, #76b852, #8dc26f);
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100%;

  .login-page {
    max-width: 360px;
    padding: 4% 0 0;
    margin: auto;

    .title {
      color: #4caf50;
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
  }
  .form button {
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #4caf50;
    width: 100%;
    border: 0;
    padding: 15px;
    color: #ffffff;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }
  .form button:hover,
  .form button:active,
  .form button:focus {
    background: #43a047;
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
  .container {
    position: relative;
    z-index: 1;
    max-width: 300px;
    margin: 0 auto;
  }
  .container:before,
  .container:after {
    content: "";
    display: block;
    clear: both;
  }
  .container .info {
    margin: 50px auto;
    text-align: center;
  }
  .container .info h1 {
    margin: 0 0 15px;
    padding: 0;
    font-size: 36px;
    font-weight: 300;
    color: #1a1a1a;
  }
  .container .info span {
    color: #4d4d4d;
    font-size: 12px;
  }
  .container .info span a {
    color: #000000;
    text-decoration: none;
  }
  .container .info span .fa {
    color: #ef3b3a;
  }
`;
