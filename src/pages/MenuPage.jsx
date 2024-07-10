import useAuth from "../hooks/use-auth";
import MainButton from "../components/MainButton";
import Spinner from "../components/Spinner";

export default function MenuPage() {
  const { authUser, fingerprint, initialLoading } = useAuth();
  console.log(authUser, "MenuPage");
  return (
    <>
      {initialLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-2">
          <MainButton
            onClick={() => {
              window.location.href = "#/menu/lazada";
            }}
          >
            Lazada Shoper
          </MainButton>
          <MainButton
            type="orange"
            onClick={() => {
              window.location.href = "#/menu/shopee";
            }}
          >
            Shopee Shoper
          </MainButton>
        </div>
      )}
    </>
  );
}
