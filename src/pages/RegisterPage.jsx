import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import useAuth from "../hooks/use-auth";

import TextInput from "../components/TextInput";
import MainButton from "../components/MainButton";

export default function LoginPage() {
  const { register, setAuthUser, fingerprint } = useAuth();
  const [userData, setUserData] = useState({ username: "", password: "" });

  useEffect(() => {
    async function getAuthUser() {
      const authUserData = await browser.storage.local.get([
        "user",
        "accessToken",
        "fingerprint",
      ]);
      const { user, accessToken, fingerprint } = authUserData;
      if (accessToken) {
        console.log(accessToken, "Found accessToken in local storage");

        setAuthUser(user);
        console.log("setAuthUser in LoginPage");
      } else {
        console.log("No authUserData in local storage, Need to login");
      }
    }
    getAuthUser();
  }, []);

  async function handleRegister(credentials) {
    await register(credentials);
  }

  function handleOnChangeInput(key, value) {
    setUserData({ ...userData, [key]: value });
  }

  return (
    <>
      <p className="text-[16px] text-center font-bold">SONIC BOT</p>
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
      <TextInput
        label="Code"
        value={userData.Code}
        onChange={(data) => handleOnChangeInput("Code", data)}
      />
      <MainButton onClick={() => handleRegister(userData)}>REGISTER</MainButton>
    </>
  );
}
