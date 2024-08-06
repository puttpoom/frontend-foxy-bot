import { useEffect, useState } from "react";
import MainButton from "../components/MainButton";
import useAuth from "../hooks/use-auth";
import { LogOut, ShoppingBag, UserRound, Wallet, Menu } from "lucide-react";

export default function Navbar() {
  const {
    authUser,
    setAuthUser,
    initialLoading,
    logout,
    userSubcription,
    setUserSubcription,
  } = useAuth();

  // const [initialLoading, setInitialLoading] = useState(true);

  function handleOnClickButton(type) {
    if (type === "LOG_OUT") {
      logout();
      return;
    }
  }

  return (
    <div className="flex justify-between gap-2 items-center">
      <div className="flex gap-2 items-center">
        <UserRound
          size={14}
          className="opacity-80 cursor-pointer"
          onClick={() => (window.location.href = "#/user")}
        />
        {authUser?.user?.email}
        <MainButton
          addClass={"p-[4px] text-[10px] font-bold opacity-80 flex gap-1"}
          type={"warning"}
          disabled={true}
        >
          <Wallet size={14} />
          {authUser.user?.point.toLocaleString()}$
        </MainButton>
      </div>
      <div className="flex gap-1">
        <MainButton
          addClass={"p-[4px] text-[12px] font-bold opacity-80"}
          onClick={() => {
            window.location.href = "#/menu";
          }}
          type={"none"}
        >
          <Menu size={14} />
        </MainButton>
        <MainButton
          addClass={"p-[4px] text-[12px] font-bold opacity-80"}
          onClick={() => {
            window.location.href = "#/package";
          }}
          type={"none"}
        >
          <ShoppingBag size={14} />
        </MainButton>
        <MainButton
          addClass={"p-[4px] text-[12px] font-bold opacity-80"}
          type={"none"}
          onClick={() => handleOnClickButton("LOG_OUT")}
        >
          <LogOut size={14} />
        </MainButton>
      </div>
    </div>
  );
}
