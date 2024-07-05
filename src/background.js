import browser from "webextension-polyfill";
import findElementByXpath from "./func/findElementByXpath";
import { intervalInjectScript } from "./func/PromiseInjectScript";
import injectScriptUntilSuccess from "./func/PromiseInjectScript";
import queryTabs from "./func/queryTabs";

const initialValue = {
  url: "https://www.lazada.co.th/#?",
  quantity: 1,
  delayRefresh: 800,
  paymentMethod: "LazadaWallet",
};

//! ------------------ XPATH ------------------

const XPATH_BUY_NOW_BTN_TH = "//span[text()='ซื้อเลย']";
const XPATH_BUY_NOW_BTN_EN = "//span[text()='Buy Now']";
const XPATH_QUANTITY_INPUT = "//input[@value='1']";
const XPATH_ORDER_BTN_TH = "//div[text()='สั่งซื้อ']";
const XPATH_ORDER_BTN_EN = "//div[text()='Place Order']";

const XPATH_PAYMENT_METHOD = {
  LazadaWallet: "//p[text()='Lazada Wallet ']",
  QRcode: "//p[text()='QR พร้อมเพย์']",
};

//! --------------------------------------------

//tabId -> injectScript -> result:JSONserializable
//injectScript(tabId, callback) //- 1.reload 2.checkStock(show 0) or available(show 1) 3.add to cart 4.checkout

async function startBOT(data) {
  try {
    let tabs = await queryTabs(data.url);
    if (tabs.length === 0) {
      return await browser.tabs.create({ url: data.url });
    } else {
      for (const tab of tabs) {
        let changeQuantity = await injectScriptUntilSuccess(
          tab.id,
          {
            args: [XPATH_QUANTITY_INPUT, "changeValue", data.quantity],
            function: findElementByXpath,
          },
          data.delayRefresh
        );

        let clickElBuyBTN = await injectScriptUntilSuccess(
          tab.id,
          {
            args: [XPATH_BUY_NOW_BTN_TH, "click"],
            function: findElementByXpath,
          },
          data.delayRefresh
        );

        let selectPaymentMethod = await injectScriptUntilSuccess(
          tab.id,
          {
            args: [XPATH_PAYMENT_METHOD[data.paymentMethod], "click"],
            function: findElementByXpath,
          },
          data.delayRefresh
        );

        let clickOrderBTN = await injectScriptUntilSuccess(
          tab.id,
          {
            args: [XPATH_ORDER_BTN_TH, "click"],
            function: findElementByXpath,
          },
          data.delayRefresh
        );
      }
    }
  } catch (error) {
    console.log(error, "startBOT error");
  }
}

function stopBOT() {
  clearInterval(intervalInjectScript);
  console.log(`stop intervalID ${intervalInjectScript} by background.js`);
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
    default:
      break;
  }
});

browser.runtime.onInstalled.addListener(() => {
  console.log("Extension installed. Initializing extension state.");
});
