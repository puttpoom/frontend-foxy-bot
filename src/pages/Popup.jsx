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
  useEffect(() => {
    console.log("Hello from the popup!");
  }, []);

  const [formData, setFormData] = useState(initialValue);

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
      <MainButton type={"danger"}>STOP</MainButton>
      <MainButton type={"primary"}>SAVE DATA</MainButton>
    </div>
  );
}
