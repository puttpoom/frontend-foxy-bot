import { createContext, useEffect, useState } from "react";
import browser from "webextension-polyfill";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import * as authApi from "../api/auth";
import { removeToken } from "../utils/local-storage";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [fingerprint, setFingerprint] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function getAuthUser() {
      try {
        const token = await browser.storage.local.get("accessToken");
        if (token) {
          const res = await authApi.getAuthUser(token);

          if (res.status === 200) {
            const { user } = res.data;
            setAuthUser(user);
          } else {
            removeToken();
          }
        }
      } catch (error) {
        console.log("Error", error);
      } finally {
        setInitialLoading(false);
      }
    }
    getAuthUser();
  }, []);

  const login = async (credential) => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;
    setFingerprint(fingerprint);

    const res = await authApi.login(credential);
    if (res.status === 200) {
      setAuthUser(res.data);
      console.log(res.data, "login by AuthContextProvider");
      const { user, accessToken } = res.data;
      browser.storage.local.set({ user, accessToken, fingerprint });
      return res.data;
    } else {
      return res;
    }
  };

  const logout = async () => {
    // removeToken();
    await browser.storage.local.clear();
    setAuthUser("");
    console.log("logout by AuthContextProvider");
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        login,
        logout,
        fingerprint,
        initialLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
