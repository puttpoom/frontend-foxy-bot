import browser from "webextension-polyfill";

const initialValue = {
  link: "https://www.lazada.co.th/shop/health-beauty/",
  quantity: 1,
  delayRefresh: 800,
  paymentMethod: "first_payment_method",
};

function startBOT(data) {
  console.log(data);
}

async function saveData(data) {
  await browser.storage.local.set(data);
  console.log(data, "saveData storage by background.js");
}

async function getData() {
  const data = await browser.storage.local.get();
  if (Object.keys(data).length === 0) {
    saveData(initialValue);
  } else {
    console.log(data, "getData from storage by background.js");
  }
}

browser.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "START":
      startBOT(message.data);
      break;
    case "GET_DATA":
      getData();
      break;
    case "SAVE_DATA":
      saveData(message.data);
      break;
    default:
      break;
  }
});
