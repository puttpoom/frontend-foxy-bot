import MainButton from "../components/MainButton";
import useAuth from "../hooks/use-auth";

export default function Navbar() {
  const { authUser, fingerprint, initialLoading } = useAuth();
  console.log(authUser, "Navbar");

  function handleOnClickButton(type) {
    if (type === "LOG_OUT") {
      logout();
      return;
    }
  }

  if (initialLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex justify-between gap-2">
      {/* <p>{fingerprint}</p> */}
      <MainButton
        type={"danger"}
        onClick={() => handleOnClickButton("LOG_OUT")}
      >
        LOG OUT
      </MainButton>
      <p>{authUser?.user?.email}</p>
    </div>
  );
}
