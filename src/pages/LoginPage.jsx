import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import useAuth from "../hooks/use-auth";

import Container from "../layouts/Container";
import TextInput from "../components/TextInput";
import MainButton from "../components/MainButton";
import Navbar from "../layouts/Navbar";

export default function LoginPage() {
  const { login, setAuthUser } = useAuth();
  const [userData, setUserData] = useState({ username: "", password: "" });

  useEffect(() => {
    async function getAuthUser() {
      const authUserData = await browser.storage.local.get("authUser");
      if (authUserData) {
        console.log(authUserData, "Found authUserData in local storage");
        setAuthUser(authUserData.authUser);
      } else {
        console.log("No authUserData in local storage, Need to login");
      }
    }
    getAuthUser();
  }, []);

  async function handleLogin(credentials) {
    const res = await login(credentials);
    if (res.status === 200) {
      setAuthUser(res.data.user);
      await browser.storage.local.set({
        authUser: res.data.user,
        accessToken: res.data.accessToken,
      });
    }
  }

  function handleOnChangeInput(key, value) {
    setUserData({ ...userData, [key]: value });
  }

  return (
    <>
      <p className="text-xl font-bold">SONIC BOT LOGIN</p>
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
    </>
  );
}
