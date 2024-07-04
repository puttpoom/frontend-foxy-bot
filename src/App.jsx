import React from "react";
import useAuth from "./hooks/use-auth";
import Login from "./pages/Login";
import Popup from "./pages/Popup";

export default function App() {
  const { authUser } = useAuth();
  return authUser ? <Popup /> : <Login />;
}
