import { Navigate } from "react-router-dom";
import MainButton from "../components/MainButton";

export default function MenuPage() {
  return (
    <>
      <MainButton
        onClick={() => {
          window.location.href = "#/menu/lazada";
        }}
      >
        Lazada
      </MainButton>
      <MainButton
        type="orange"
        onClick={() => {
          window.location.href = "#/menu/shopee";
        }}
      >
        Shopee
      </MainButton>
    </>
  );
}
