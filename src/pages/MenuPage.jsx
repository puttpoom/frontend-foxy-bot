import MainButton from "../components/MainButton";
import useAuth from "../hooks/use-auth";

export default function MenuPage() {
  const { authUser, fingerprint } = useAuth();
  console.log(authUser, "MenuPage");
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
