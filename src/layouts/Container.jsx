import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

import useAuth from "../hooks/use-auth";
import Footer from "./Footer";

export default function Container() {
  const { authUser } = useAuth();
  return (
    <>
      <div className="p-4 grid gap-2 bg-gray-50">
        {authUser && <Navbar />}

        <Outlet />

        <Footer />
      </div>
    </>
  );
}
