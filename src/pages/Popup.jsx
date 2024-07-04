import { useEffect, useState } from "react";
import TextInput from "../components/TextInput";
import SelectorInput from "../components/SelectorInput";
import MainButton from "../components/MainButton";
import browser from "webextension-polyfill";

const initialValue = {
  url: "https://www.lazada.co.th/#?",
  quantity: 1,
  delayRefresh: 800,
  paymentMethod: "LazadaWallet",
};

export default function () {
  const [formData, setFormData] = useState(initialValue);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    async function saveData() {
      await browser.storage.local.set(formData);
      console.log(formData, "saveData by useEffect");
    }
    saveData();
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
    browser.runtime.sendMessage({ type, data: formData });
  }

  return (
    <div className="p-4 grid gap-2 ">
      <h1 className="text-2xl font-bold">Lazada Shoper</h1>
      <TextInput
        label={"URL"}
        placeholder="URL"
        value={formData.url}
        onChange={(value) => handleOnChangeInput("url", value)}
      />
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
      <MainButton
        type={"danger"}
        onClick={() => handleOnClickButton("GET_DATA")}
      >
        GET DATA
      </MainButton>
    </div>
  );
}
