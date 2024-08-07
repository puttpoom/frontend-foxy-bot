import { createHashRouter, RouterProvider } from "react-router-dom";
import RedirectIfAuthenticate from "../pages/RedirectIfAuthenticate";
import LazadaPage from "../pages/LazadaPage";
import LoginPage from "../pages/LoginPage";
import Container from "../layouts/Container";
import ProtectedPage from "../pages/ProtectedPage";
import MenuPage from "../pages/MenuPage";
import ShopeePage from "../pages/ShopeePage";
import PackagePage from "../pages/PackagePage";
import { User } from "lucide-react";
import UserPage from "../pages/UserPage";
import ProtectedPackage from "../pages/ProtectedPackage";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <RedirectIfAuthenticate>
        <Container />
      </RedirectIfAuthenticate>
    ),
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/menu",
    element: (
      <ProtectedPage>
        <Container />
      </ProtectedPage>
    ),
    children: [
      {
        path: "",
        element: <MenuPage />,
      },
      {
        path: "lazada/:packageId",
        element: (
          <ProtectedPackage>
            <LazadaPage />
          </ProtectedPackage>
        ),
      },
      {
        path: "shopee",
        element: <ShopeePage />,
      },
    ],
  },
  {
    path: "/package",
    element: <Container />,
    children: [
      {
        path: "",
        element: <PackagePage />,
      },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedPage>
        <Container />
      </ProtectedPage>
    ),
    children: [
      {
        path: "",
        element: <UserPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
