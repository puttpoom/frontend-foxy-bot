import { createContext, useEffect, useState } from "react";
import browser from "webextension-polyfill";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import * as authApi from "../api/auth";
import { removeToken } from "../utils/local-storage";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [userSubcription, setUserSubcription] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const buyPackage = async (packageId) => {
    const res = await authApi.userBuyPackage({ packageId: +packageId });
    if (res.status === 200) {
      console.log(res.data, "buyPackage by AuthContextProvider");
      setUserSubcription(res.data);
      return res;
    } else {
      console.log(res.data, "buyPackage by AuthContextProvider");
    }
  };

  const login = async (credential) => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;
    setUuid(fingerprint);

    const data = { ...credential, uuid: fingerprint };
    const res = await authApi.login(data);
    if (res.status === 200) {
      setAuthUser(res.data);
      console.log(res.data, "login by AuthContextProvider");
      const { user, accessToken } = res.data;

      browser.storage.local.set({ user, accessToken, fingerprint });
      const storageData = await browser.storage.local.get([
        "user",
        "accessToken",
        "fingerprint",
      ]);
      console.log(storageData, "Auth Context");
      return res.data;
    } else {
      return res;
    }
  };

  const logout = async () => {
    const res = await authApi.logout();
    if (res.status === 200) {
      await browser.storage.local.clear();
      setAuthUser("");
      console.log(res.data, "logout by AuthContextProvider");
    }
  };

  const lineLogin = async () => {
    const state = Math.random().toString(36).substring(7);
    const redirectUri = encodeURIComponent(
      `${import.meta.env.VITE_LINE_REDIRECT_URI}`
    );
    const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
      import.meta.env.VITE_LINE_CHANNEL_ID
    }&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid`;
    console.log("LINE LOGIN", lineLoginUrl);

    //navigate to line login page in current tabs
    browser.tabs.create({ url: lineLoginUrl });
  };

  const linePostCallback = async (data) => {
    try {
      const res = await authApi.linePostCallback(data);
      if (res.status === 200) {
        console.log(res.data, "linePostCallback by AuthContextProvider");
        // setAuthUser(res.data);
        // browser.storage.local.set(res.data);
      } else {
        console.log("NO res linePostCallback by AuthContextProvider");
      }
    } catch (error) {
      console.log(error, "linePostCallback error by AuthContextProvider");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        login,
        logout,
        uuid,
        initialLoading,
        userSubcription,
        setUserSubcription,
        buyPackage,
        lineLogin,
        linePostCallback,
        setInitialLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
