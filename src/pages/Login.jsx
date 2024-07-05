import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import useAuth from "../hooks/use-auth";

import Container from "../layouts/Container";
import TextInput from "../components/TextInput";
import MainButton from "../components/MainButton";

export default function Login() {
  const { login, setAuthUser } = useAuth();
  const [userData, setUserData] = useState({ username: "", password: "" });

  useEffect(() => {
    async function getAuthUser() {
      const authUserData = await browser.storage.local.get("authUser");
      if (authUserData.authUser) {
        console.log(
          authUserData.authUser,
          "Found authUserData in local storage"
        );
        setAuthUser(authUserData.authUser);
      } else {
        console.log("No authUserData in local storage, Need to login");
      }
    }
    getAuthUser();
  }, []);

  async function handleLogin(credentials) {
    const res = await login(credentials);
    console.log(res, "login success");
  }

  function handleOnChangeInput(key, value) {
    setUserData({ ...userData, [key]: value });
  }

  return (
    <Container>
      <p className="text-xl font-bold">Lazada Shoper</p>
      <TextInput
        label="Email"
        value={userData.username}
        onChange={(data) => handleOnChangeInput("username", data)}
      />
      <TextInput
        label="Password"
        type="password"
        value={userData.password}
        onChange={(data) => handleOnChangeInput("password", data)}
      />
      <MainButton onClick={() => handleLogin(userData)}>LOGIN</MainButton>
    </Container>
  );
}
