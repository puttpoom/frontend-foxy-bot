import browser from "webextension-polyfill";
import useAuth from "../hooks/use-auth";
import MainButton from "../components/MainButton";
import Spinner from "../components/Spinner";
import { useEffect, useState } from "react";
import * as authApi from "../api/auth";

export default function MenuPage() {
  const {
    authUser,
    setAuthUser,
    fingerprint,
    userSubcription,
    setUserSubcription,
  } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function getUserSubcription() {
      try {
        const token = await browser.storage.local.get("accessToken");
        if (token) {
          const res = await authApi.getUserSubcription(token);

          if (res.status === 200) {
            console.log(res.data, "res.data ------");
            setUserSubcription(res.data);
          } else {
            setUserSubcription("");
          }
        }
      } catch (error) {
        setUserSubcription("");
        console.log("Error", error);
      } finally {
        setInitialLoading(false);
      }
    }
    getUserSubcription();
  }, []);

  useEffect(() => {
    async function getAuthUser() {
      try {
        const token = await browser.storage.local.get("accessToken");
        if (token) {
          const res = await authApi.getAuthUser(token);

          if (res.status === 200) {
            const { user } = res.data;
            setAuthUser({ user, accessToken: token.accessToken });
          } else {
            setAuthUser("");
            browser.storage.local.clear();
          }
        }
      } catch (error) {
        setAuthUser("");
        browser.storage.local.clear();
        console.log("Error", error);
      } finally {
        setInitialLoading(false);
      }
    }
    getAuthUser();
  }, []);

  const getTimeLeft = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = timeDiff / (1000 * 3600 * 24);
    return days.toFixed(0) + " days left";
  };

  return (
    <div className="flex flex-col gap-2">
      {initialLoading ? (
        <Spinner />
      ) : (
        <>
          {userSubcription && userSubcription.length > 0
            ? userSubcription.map((el) => {
                if (el.package.name.includes("laz")) {
                  return (
                    <MainButton
                      key={el.id}
                      onClick={() => {
                        window.location.href = `${el.package.href}`;
                      }}
                    >
                      {el.package.name} [{getTimeLeft(el.startDate, el.endDate)}
                      ]
                    </MainButton>
                  );
                } else {
                  return null;
                }
              })
            : null}
        </>
      )}
    </div>
  );
}
