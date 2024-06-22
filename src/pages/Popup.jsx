import { useEffect, useState } from "react";
import TextInput from "../components/TextInput";
import SelectorInput from "../components/SelectorInput";
import MainButton from "../components/MainButton";
import browser from "webextension-polyfill";

const initialValue = {
  link: "https://www.lazada.co.th/shop/health-beauty/",
  quantity: 1,
  delayRefresh: 800,
  paymentMethod: "first_payment_method",
};

export default function () {
  const [formData, setFormData] = useState(initialValue);

  useEffect(() => {
    async function getData() {
      const data = await browser.storage.local.get();
      if (Object.keys(data).length === 0) {
        await browser.storage.local.set(initialValue);
        console.log("NO DATA set to initial value useEffect");
      } else {
        console.log(data, "getData from storage by useEffect");
      }
    }
    getData();
  }, []);

  useEffect(() => {
    async function saveData() {
      await browser.storage.local.set(formData);
      console.log(formData, "saveData by useEffect");
    }
    saveData();
  }, [formData]);

  const paymentMethodOptions = [
    { value: "first_payment_method", label: "First Payment Method" },
    { value: "second_payment_method", label: "Second Payment Method" },
  ];

  function handleOnChangeInput(key, value) {
    setFormData({ ...formData, [key]: value });
  }

  function handleOnClickButton(type) {
    browser.runtime.sendMessage({ type, data: formData });
  }

  return (
    <div className="p-4 grid gap-2 ">
      <h1 className="text-2xl font-bold">Lazada Shoper</h1>
      <TextInput
        label={"Link"}
        placeholder="Link's Good"
        value={formData.link}
        onChange={(value) => handleOnChangeInput("link", value)}
      />
      <TextInput
        label={"Quantity"}
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(value) => handleOnChangeInput("quantity", value)}
      />
      <TextInput
        label={"Delay Refresh"}
        placeholder="DelayRefresh"
        value={formData.delayRefresh}
        onChange={(value) => handleOnChangeInput("delayRefresh", value)}
      />
      <SelectorInput
        label={"Payment Method"}
        value={formData.paymentMethod}
        onChange={(value) => handleOnChangeInput("paymentMethod", value)}
        options={paymentMethodOptions}
      />
      <MainButton type={"success"} onClick={() => handleOnClickButton("START")}>
        START
      </MainButton>
      <MainButton
        type={"danger"}
        onClick={() => handleOnClickButton("GET_DATA")}
      >
        GET DATA
      </MainButton>
      <MainButton
        type={"primary"}
        onClick={() => handleOnClickButton("SAVE_DATA")}
      >
        SAVE DATA
      </MainButton>
    </div>
  );
}
