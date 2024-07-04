import { createContext, useState } from "react";
import browser from "webextension-polyfill";
import * as authApi from "../api/auth";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [authUser, setAuthUser] = useState("");

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

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, login }}>
      {children}
    </AuthContext.Provider>
  );
}
