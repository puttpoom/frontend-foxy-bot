import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import useAuth from "../hooks/use-auth";
import { storeSession, getSession } from "../utils/session-stroage";

import TextInput from "../components/TextInput";
import SelectorInput from "../components/SelectorInput";
import MainButton from "../components/MainButton";

import { AppWindow, Play, LogOut, Bot } from "lucide-react";

const initialValue = {
  url: "https://shopee.co.th/",
  quantity: 1,
  delayRefresh: 800,
  paymentMethod: "ShoppePay",
  platform: "Shopee",
};

export default function ShopeePage() {
  const [formData, setFormData] = useState(initialValue);
  const [isRunning, setIsRunning] = useState(false);
  const { setAuthUser, logout } = useAuth();

  useEffect(() => {
    async function getSessionData() {
      let tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      // tabs = tabs.filter((tab) => tab.url === formData.url);
      let storageKey = tabs[0].id;
      console.log(storageKey, "storageKey (tabId)");
      const data = await getSession(storageKey);
      if (data[storageKey]) {
        console.log(data[storageKey], "getSessionData by useEffect");
        setFormData(data[storageKey]);
      }
    }
    getSessionData();
  }, []);

  useEffect(() => {
    async function saveSessionData() {
      let tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      // tabs = tabs.filter((tab) => tab.url === formData.url);
      let storageKey = tabs[0].id;
      await storeSession(storageKey, formData);
      console.log(formData, "saveSessionData by useEffect");
    }
    saveSessionData();
  }, [formData]);

  const paymentMethodOptions = [
    { value: "ShopeePay", label: "Shopee Pay" },
    { value: "QRcode", label: "QR Code" },
  ];

  function handleOnChangeInput(key, value) {
    setFormData({ ...formData, [key]: value });
  }

  function handleOnClickButton(type) {
    if (type === "START") setIsRunning(true);
    else setIsRunning(false);
    if (type === "LOG_OUT") {
      logout();
      return;
    }
    browser.runtime.sendMessage({ type, data: formData });
  }

  return (
    <>
      <h1 className="text-lg font-bold text-center">Shopee Shoper</h1>
      <div className="flex gap-2 items-end justify-between">
        <TextInput
          label={"URL"}
          placeholder="URL"
          value={formData.url}
          onChange={(value) => handleOnChangeInput("url", value)}
        />
        <MainButton
          type={"primary"}
          onClick={() => handleOnClickButton("OPEN")}
        >
          <p className="flex flex-grow-0 gap-1">
            <AppWindow size={16} />
            OPEN
          </p>
        </MainButton>
      </div>
      <TextInput
        label={"Quantity"}
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(value) => handleOnChangeInput("quantity", Number(value))}
      />
      <TextInput
        label={"Delay Refresh"}
        placeholder="DelayRefresh"
        value={formData.delayRefresh}
        onChange={(value) => handleOnChangeInput("delayRefresh", Number(value))}
      />
      <SelectorInput
        label={"Payment Method"}
        value={formData.paymentMethod}
        onChange={(value) => handleOnChangeInput("paymentMethod", value)}
        options={paymentMethodOptions}
      />
      {isRunning ? (
        <p className="text-red-400">STATUS: BOT IS RUNNING...</p>
      ) : null}
      {isRunning ? (
        <MainButton
          type={"primary"}
          onClick={() => handleOnClickButton("STOP")}
        >
          STOP
        </MainButton>
      ) : (
        <MainButton
          isRunning={isRunning}
          type={"success"}
          onClick={() => handleOnClickButton("START")}
        >
          START
        </MainButton>
      )}
      {/* <MainButton
        type={"danger"}
        onClick={() => handleOnClickButton("GET_DATA")}
      >
        GET DATA
      </MainButton> */}
      <MainButton
        type={"danger"}
        onClick={() => handleOnClickButton("LOG_OUT")}
      >
        LOG OUT
      </MainButton>
    </>
  );
}
