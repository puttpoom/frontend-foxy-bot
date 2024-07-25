import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import useAuth from "../hooks/use-auth";
import { storeSession, getSession } from "../utils/session-stroage";
// import { getCurrentDateTime } from "../func/checkDateTime";

import TextInput from "../components/TextInput";
import SelectorInput from "../components/SelectorInput";
import MainButton from "../components/MainButton";

import {
  AppWindow,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";

const initialValue = {
  url: "https://www.lazada.co.th/",
  quantity: 1,
  delayRefresh: 1500,
  paymentMethod: "LazadaWallet",
  platform: "Lazada",
  dateTime: "",
};

export default function LazadaPage() {
  const [formData, setFormData] = useState(initialValue);
  const [isRunning, setIsRunning] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const { setAuthUser, logout } = useAuth();

  useEffect(() => {
    async function getURL() {
      let tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      let url = tabs[0].url;
      setFormData((prev) => ({ ...prev, url }));
    }
    getURL();
  }, [formData.url]);

  useEffect(() => {
    async function getSessionData() {
      let tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
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

      let storageKey = tabs[0].id;
      await storeSession(storageKey, formData);
      console.log(formData, "saveSessionData by useEffect");
    }
    saveSessionData();
  }, [formData]);

  const paymentMethodOptions = [
    { value: "LazadaWallet", label: "Lazada Wallet" },
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
      <button
        className="flex justify-between text-center font-bold text-[16px] items-center gap-1"
        onClick={() => setIsShow((prv) => !prv)}
      >
        <p>{isShow ? <ChevronRight size={12} /> : <ChevronDown size={12} />}</p>
        <p>Laz Shoper</p>
        <p></p>
      </button>
      <div className="border-b"></div>
      <div className={isShow ? "hidden" : "block"}>
        <div className="flex gap-2 items-end justify-between ">
          <TextInput
            disabled
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
        {/*<TextInput
          type="datetime-local"
          label={"Date Time"}
          placeholder=""
          value={formData.dateTime}
          onChange={(value) => handleOnChangeInput("dateTime", value)}
  />*/}
        <TextInput
          label={"Quantity"}
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(value) => handleOnChangeInput("quantity", Number(value))}
        />
        <TextInput
          type="number"
          min="0"
          step="100"
          label={"Delay Refresh (ms)"}
          placeholder="DelayRefresh (ms)"
          value={formData.delayRefresh}
          onChange={(value) =>
            handleOnChangeInput("delayRefresh", Number(value))
          }
        />
        <SelectorInput
          label={"Payment Method"}
          value={formData.paymentMethod}
          onChange={(value) => handleOnChangeInput("paymentMethod", value)}
          options={paymentMethodOptions}
        />
      </div>
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
    </>
  );
}
