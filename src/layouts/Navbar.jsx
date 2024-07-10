import MainButton from "../components/MainButton";
import useAuth from "../hooks/use-auth";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { authUser, initialLoading, logout } = useAuth();
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
    <div className="flex justify-between gap-2 items-center">
      <p className="flex gap-2 items-center">
        {authUser?.user?.email}
        <MainButton
          addClass={"p-[4px] text-[10px] font-bold opacity-80"}
          type={"warning"}
          onClick={() => handleOnClickButton("LOG_OUT")}
        >
          Premium
          {/* <LogOut size={16} /> */}
        </MainButton>
      </p>
      <MainButton
        addClass={"p-[4px] text-[12px] font-bold opacity-80"}
        type={"none"}
        onClick={() => handleOnClickButton("LOG_OUT")}
      >
        <LogOut size={14} />
      </MainButton>
    </div>
  );
}
