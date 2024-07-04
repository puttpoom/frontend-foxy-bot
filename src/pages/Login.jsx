import { useState } from "react";

import Container from "../layouts/Container";
import TextInput from "../components/TextInput";
import MainButton from "../components/MainButton";

export default function Login() {
  const [userData, setUserData] = useState({ username: "", password: "" });

  function handleLogin() {
    console.log("Login");
  }

  function handleOnChangeInput(key, value) {
    setUserData({ ...userData, [key]: value });
  }

  return (
    <Container>
      <p className="text-xl font-bold">Lazada Shoper</p>
      <TextInput
        label="Username"
        value={userData.username}
        onChange={(data) => handleOnChangeInput("username", data)}
      />
      <TextInput
        label="Password"
        type="password"
        value={userData.password}
        onChange={(data) => handleOnChangeInput("password", data)}
      />
      <MainButton onClick={() => handleLogin()}>LOGIN</MainButton>
    </Container>
  );
}
