import { Navigate } from "react-router-dom";
import useAuth from "../hooks/use-auth";

export default function RedirectIfAuthenticate({ children }) {
  const { authUser } = useAuth();
  return authUser ? <Navigate to="/menu" /> : children;
}
