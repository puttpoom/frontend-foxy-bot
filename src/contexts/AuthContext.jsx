import { createContext, useState } from "react";
import * as authApi from "../api/auth";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [authUser, setAuthUser] = useState("");

  const login = async (credential) => {
    const res = await authApi.login(credential);
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, login }}>
      {children}
    </AuthContext.Provider>
  );
}
