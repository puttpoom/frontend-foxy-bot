import browser from "webextension-polyfill";

const initialValue = {
  url: "https://www.lazada.co.th/#?",
  quantity: 1,
  delayRefresh: 800,
  paymentMethod: "LazadaWallet",
};

let intervalInjectScript = null;

const XPATH_PAYMENT_METHOD = {
  LazadaWallet: "//p[text()='Lazada Wallet ']",
  QRcode: "//p[text()='QR พร้อมเพย์']",
};

const XPATH_BUY_NOW_BTN_TH = "//span[text()='ซื้อเลย ']";
const XPATH_BUY_NOW_BTN_EN = "//span[text()='Buy Now']";
const XPATH_QUANTITY_INPUT = "//input[@value='1']";
const XPATH_ORDER_BTN_TH = "//div[text()='สั่งซื้อ']";

async function queryTabs(url) {
  try {
    let tabs = await browser.tabs.query({});
    tabs = tabs.filter((tab) => tab.url === url);
    if (tabs.length === 0) {
      console.log(
        `querryTabs NO TABS match(filter) to ${url} by background.js`
      );
      return tabs;
    } else {
      console.log(tabs, "querryTabs by background.js");
      return tabs;
    }
  } catch (error) {
    console.log(error, "querryTabs error");
  }
}

async function findElementByXpath(element, action, value = 1) {
  const xpathResult = document.evaluate(
    element,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  const elementDOM = xpathResult.singleNodeValue;

  if (elementDOM) {
    switch (action) {
      case "click":
        elementDOM.click();
        return { status: true, message: "el clicked" };
      case "changeValue":
        elementDOM.value = value;
        return { status: true, message: "el changed value" };
      default:
        break;
    }
  } else {
    return { status: false, message: "Element not found" };
  }
}

//tabId -> injectScript -> result:JSONserializable
//injectScript(tabId, callback) //- 1.reload 2.checkStock(show 0) or available(show 1) 3.add to cart 4.checkout

function injectScriptUntilSuccess(tabId, scriptingDetails, delayRefresh = 800) {
  return new Promise((resolve, reject) => {
    intervalInjectScript = setInterval(async () => {
      try {
        const [{ result }] = await browser.scripting.executeScript({
          target: { tabId: tabId },
          func: scriptingDetails.function,
          args: scriptingDetails.args,
        });
        if (result.status) {
          clearInterval(intervalInjectScript);
          resolve(result);
        } else {
          console.log(result, "injectScriptUntilSuccess result");
        }
      } catch (error) {
        // clearInterval(interval);
        console.log(error, "injectScriptUntilSuccess error");
        reject(error);
      }
    }, delayRefresh);
  });
}

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
