import { useEffect, useState } from "react";
import useAuth from "../hooks/use-auth";
import { Navigate } from "react-router-dom";
import * as authApi from "../api/auth";

export default function ProtectedPackage({ children }) {
  const packageIdFromUrl = window.location.href.split("=")[1];
  const [packageId, setPackageId] = useState(packageIdFromUrl);
  const [userPackageId, setUserPackageId] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkUserPackage = async (packageId) => {
      try {
        const res = await authApi.checkUserPackage(packageId);
        console.log(res.data.id, "checkUserPackage");
        if (res.status === 200) {
          setUserPackageId(res.data.id);
          console.log(res.data.id, "checkPackageId");
          console.log("packageId", packageId);
          console.log("userPackageId", userPackageId);
        }
      } catch (error) {
        console.log("Error", error);
      } finally {
        setInitialLoading(false);
      }
    };
    checkUserPackage(packageId);
  }, []);

  if (!initialLoading) {
    return +packageId === userPackageId ? children : <Navigate to="/menu" />;
  }
}
