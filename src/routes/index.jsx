import { createHashRouter, RouterProvider } from "react-router-dom";
import RedirectIfAuthenticate from "../pages/RedirectIfAuthenticate";
import LazadaPage from "../pages/LazadaPage";
import LoginPage from "../pages/LoginPage";
import Container from "../layouts/Container";
import ProtectedPage from "../pages/ProtectedPage";
import MenuPage from "../pages/MenuPage";
import ShopeePage from "../pages/ShopeePage";

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
        path: "lazada",
        element: <LazadaPage />,
      },
      {
        path: "shopee",
        element: <ShopeePage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
