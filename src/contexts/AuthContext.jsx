import { createContext, useEffect, useState } from "react";
import browser from "webextension-polyfill";

import * as authApi from "../api/auth";
import { storeToken, getToken, removeToken } from "../utils/local-storage";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [authUser, setAuthUser] = useState("");

  useEffect(() => {
    async function getAuthUser() {
      if (getToken()) {
        const token = await getToken();
        const res = await authApi.getAuthUser(token);
        if (res.status === 200) {
          setAuthUser(res.data);
        } else {
          removeToken();
        }
      }
    }
    getAuthUser();
  }, []);

  const login = async (credential) => {
    const res = await authApi.login(credential);
    if (res.status === 200) {
      setAuthUser(res.data);
      browser.storage.local.set({ authUser: res.data });
      return res.data;
    } else {
      return res;
    }
  };

  const logout = async () => {
    removeToken();
    setAuthUser("");
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
