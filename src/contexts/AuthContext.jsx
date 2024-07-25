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

  useEffect(() => {
    async function getAuthUser() {
      try {
        const token = await browser.storage.local.get("accessToken");
        if (token) {
          const res = await authApi.getAuthUser(token);

          if (res.status === 200) {
            const { user } = res.data;
            setAuthUser({ user, accessToken: token.accessToken });
          } else {
            setAuthUser("");
            browser.storage.local.clear();
          }
        }
      } catch (error) {
        setAuthUser("");
        browser.storage.local.clear();
        console.log("Error", error);
      } finally {
        setInitialLoading(false);
      }
    }
    getAuthUser();
  }, [userSubcription]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
