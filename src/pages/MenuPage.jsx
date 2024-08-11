import browser from "webextension-polyfill";
import useAuth from "../hooks/use-auth";
import MainButton from "../components/MainButton";
import Spinner from "../components/Spinner";
import { useEffect, useState } from "react";
import * as authApi from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function MenuPage() {
  const {
    authUser,
    setAuthUser,
    fingerprint,
    userSubcription,
    setUserSubcription,
  } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

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

  function calculateDaysLeft(endDate) {
    const now = new Date();
    const end = new Date(endDate);

    const diff = end - now;

    const leftTime = diff / (1000 * 60 * 60 * 24);

    return Math.round(leftTime) + " days left";
  }

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
                        navigate(
                          `${el.package.href}/:packageId=${el.package.id}`
                        );
                      }}
                    >
                      {el.package.name} [{calculateDaysLeft(el.endDate)}]
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
