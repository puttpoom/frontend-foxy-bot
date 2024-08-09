import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import useAuth from "../hooks/use-auth";

import TextInput from "../components/TextInput";
import MainButton from "../components/MainButton";

const PROJECT_NAME = import.meta.env.VITE_PROJECT_NAME;

export default function LoginPage() {
  const {
    login,
    authUser,
    setAuthUser,
    fingerprint,
    lineLogin,
    linePostCallback,
    userSubcription,
    setInitialLoading,
  } = useAuth();
  const [userData, setUserData] = useState({ email: "", password: "" });

  useEffect(() => {
    async function getAuthUser() {
      try {
        const authUserData = await browser.storage.local.get([
          "user",
          "accessToken",
          "fingerprint",
        ]);
        const lineAuthData = await browser.storage.local.get(["code", "state"]);

        const { code } = lineAuthData;
        const { user, accessToken, fingerprint } = authUserData;

        if (accessToken) {
          console.log(accessToken, "Found accessToken in local storage");

          setAuthUser(user);
          console.log("setAuthUser in LoginPage");
        }
        if (code) {
          console.log(code, "Found code and state in local storage");
          // linePostCallback({ code });
        }
      } catch (error) {
        console.log(error, "Error in getAuthUser");
      }
    }
    getAuthUser();
  }, []);

  function handleLogin(credentials) {
    login(credentials);
  }

  function handleOnChangeInput(key, value) {
    setUserData({ ...userData, [key]: value });
  }

  return (
    <>
      {/* <p className="text-[16px] text-center font-bold">{PROJECT_NAME}</p> */}
      <TextInput
        label="Email"
        value={userData.email}
        onChange={(data) => handleOnChangeInput("email", data)}
      />
      <TextInput
        label="Password"
        type="password"
        value={userData.password}
        onChange={(data) => handleOnChangeInput("password", data)}
      />
      <MainButton onClick={() => handleLogin(userData)}>LOGIN</MainButton>

      {/* <MainButton type="line-btn" onClick={() => lineLogin()}>
        LINE LOGIN
      </MainButton> */}
    </>
  );
}
