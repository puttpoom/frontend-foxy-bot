import { useEffect, useState } from "react";
import * as authApi from "../api/auth";
import Spinner from "../components/Spinner";
import { Bot, ShoppingCart, TicketCheck } from "lucide-react";
import MainButton from "../components/MainButton";
import useAuth from "../hooks/use-auth";

export default function PackagePage() {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { buyPackage } = useAuth();

  const checkForSure = async (pack) => {
    try {
      const result = window.confirm(
        "คุณแน่ใจหรือไม่ว่าต้องการซื้อ package นี้"
      );
      if (result) {
        const res = await buyPackage(pack);
        if (res.status === 200) {
          window.location.href = "#/menu";
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    async function getAllPackages() {
      try {
        const res = await authApi.getAllpackages();
        if (res.status === 200) {
          setPackages(res.data);
        }
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    }
    getAllPackages();
  }, []);
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex p-2 justify-between items-center  gap-2 bg-slate-100 rounded-lg">
            <div className="flex gap-2 items-center">
              <div>
                <Bot />
              </div>
              <div className="font-bold">LAZ Shopper</div>
            </div>
            <div className="flex gap-1">
              <select onChange={(e) => setSelectedPackage(e.target.value)}>
                <option value={0} defaultChecked>
                  -
                </option>
                {packages.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.duration === 9999
                      ? `Lifetime ${el.price}$`
                      : `${el.duration} days ${el.price}$`}
                  </option>
                ))}
              </select>
            </div>
            <MainButton
              addClass={"p-[4px] text-[10px] font-bold opacity-80"}
              type={"primary"}
              onClick={() => {
                checkForSure(selectedPackage);
              }}
            >
              <ShoppingCart size={14} />
            </MainButton>
          </div>
          {/* <div className="flex p-2 justify-between items-center  gap-2 bg-slate-100 rounded-lg">
            <div className="flex gap-2 items-center">
              <div>
                <TicketCheck />
              </div>
              <div className="font-bold">LAZ Coupon</div>
            </div>
            <div className="flex gap-1">
              <select onChange={(e) => setSelectedPackage(e.target.value)}>
                <option value={0} defaultChecked>
                  -
                </option>
                {packages.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.duration} days {el.price}$
                  </option>
                ))}
              </select>
            </div>
            <MainButton
              addClass={"p-[4px] text-[10px] font-bold opacity-80"}
              type={"primary"}
              onClick={() => {
                checkForSure(selectedPackage);
              }}
            >
              <ShoppingCart size={14} />
            </MainButton>
          </div> */}
        </div>
      )}
    </div>
  );
}
