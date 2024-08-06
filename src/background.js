import browser from "webextension-polyfill";
import { stopIntervalInjectScript } from "./func/PromiseInjectScript";
import queryTabs from "./func/queryTabs";
import LazadaShoper from "./features/lazada/lazada-shoper";
// import checkTime from "./func/checkDateTime";

const initialValue = {
  url: "",
  quantity: 1,
  delayRefresh: 800,
  paymentMethod: "",
  platform: "",
};

//! ------------------ XPATH Lazada ------------------

const XPATH_BUY_NOW_BTN_TH = "//span[text()='ซื้อเลย']";
const XPATH_BUY_NOW_BTN_EN = "//span[text()='Buy Now']";
const XPATH_QUANTITY_INPUT = "//input[@value='1']";
const XPATH_ORDER_BTN_TH = "//div[text()='สั่งซื้อ']";
const XPATH_ORDER_BTN_EN = "//div[text()='Place Order']";

const XPATH_PAYMENT_METHOD = {
  LazadaWallet: "//p[text()='Lazada Wallet ']",
  QRcode: "//p[text()='QR พร้อมเพย์']",
};

//! --------------------------------------------------

//! ------------------ XPATH Shopee ------------------

const XPATH_BUY_NOW_BTN_TH_SP = "//button[text()='ซื้อสินค้า']";
const XPATH_QUANTITY_INPUT_SP = "//input[@value='1']";

//! --------------------------------------------------

//tabId -> injectScript -> result:JSONserializable
//injectScript(tabId, callback) //- 1.reload 2.checkStock(show 0) or available(show 1) 3.add to cart 4.checkout

async function startBOT(data) {
  try {
    let tabs = await queryTabs(data.url);
    if (tabs.length === 0) {
      // return await browser.tabs.create({
      //   url: data.url,
      //   active: true,
      //   index: 0,
      // });
      return await browser.windows.create({
        url: data.url,
      });
    } else {
      switch (data.platform) {
        case "Lazada":
          await LazadaShoper(tabs, data);
          break;
        case "Shopee":
          console.log("Shopee");
          break;
        default:
          console.log("No platform selected");
          break;
      }
    }
  } catch (error) {
    console.log(error, "startBOT error");
  }
}

function stopBOT() {
  stopIntervalInjectScript();
  console.log(`stopIntervalInjectScript by background.js`);
}

async function saveData(data) {
  try {
    await browser.storage.local.set(data);
    console.log(data, "saveData by background.js");
  } catch (error) {
    console.log(error, "saveData error");
  }
}

async function getData() {
  try {
    const data = await browser.storage.local.get();
    if (Object.keys(data).length === 0) {
      await browser.storage.local.set(initialValue);
      console.log("NO DATA set to initial value getData");
    } else {
      console.log(data, "getData from storage by background.js");
    }
  } catch (error) {
    console.log(error, "getData error");
  }
}

async function logout() {
  await browser.storage.local.remove("authUser");
}

browser.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "START":
      startBOT(message.data);
      break;
    case "GET_DATA":
      getData();
      break;
    case "STOP":
      stopBOT(message.data);
      break;
    case "LOG_OUT":
      logout();
      break;
    case "OPEN":
      browser.windows.create({
        url: message.data.url,
        focused: true,
      });
      break;

    default:
      break;
  }
});

browser.webRequest.onCompleted.addListener(
  (details) => {
    console.log(details, "webRequest.onCompleted");
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame"],
  }
);

browser.webNavigation.onCommitted.addListener(async (details) => {
  if (details.url.startsWith(`${import.meta.env.VITE_LINE_REDIRECT_URI}`)) {
    const url = new URL(details.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    console.log("webNavigation.onCommitted", code, state);

    // ส่งข้อมูลกลับไปยัง extension

    await browser.storage.local.set({ code: code, state: state });

    const storage = await browser.storage.local.get(["code", "state"]);
    console.log(storage, "storage");
  }
});

browser.runtime.onInstalled.addListener(() => {
  console.log("Extension installed. Initializing extension state.");
});
