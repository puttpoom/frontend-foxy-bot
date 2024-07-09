import MainButton from "../components/MainButton";
import useAuth from "../hooks/use-auth";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { authUser, fingerprint, initialLoading, logout } = useAuth();
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
    <div className="flex justify-between items-center gap-2">
      {/* <p>{fingerprint}</p> */}
      <MainButton
        addClass={"p-[6px] text-[10px] font-bold opacity-60"}
        type={"danger"}
        onClick={() => handleOnClickButton("LOG_OUT")}
      >
        {/* <LogOut size={18} /> */}
        LOG OUT
      </MainButton>
      <p>{authUser?.user?.email}</p>
    </div>
  );
}
