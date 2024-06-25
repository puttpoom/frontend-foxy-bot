import browser from "webextension-polyfill";

const initialValue = {
  url: "https://www.lazada.co.th/#?",
  quantity: 1,
  delayRefresh: 800,
  paymentMethod: "first_payment_method",
};

async function querryTabs(url) {
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

let XPATH_BUY_NOW_BTN_TH = "//span[text()='ซื้อเลย']";
let XPATH_BUY_NOW_BTN_EN = "//span[text()='Buy Now']";

function findElementByXpath(XPATH) {
  const element = document.evaluate(
    XPATH,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  return element.singleNodeValue;
}

//tabId -> injectScript -> result:JSONserializable
//injectScript(tabId, callback) //- 1.reload 2.checkStock(show 0) or available(show 1) 3.add to cart 4.checkout

async function injectScript(tabId, XPATH) {
  try {
    const result = await browser.scripting.executeScript({
      target: { tabId: tabId },
      args: [XPATH],
      func: () => {
        const element = document.evaluate(
          XPATH,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        if (element) {
          element.click();
          return "element found and clicked";
        } else {
          return "element not found";
        }
      },
    });
    console.log(result, "injectScript by background.js");
  } catch (error) {
    console.log(error, "injectScript error");
  }
}

async function startBOT(data) {
  try {
    let tabs = await querryTabs(data.url);
    if (tabs.length === 0) {
      return await browser.tabs.create({ url: data.url });
    } else {
      tabs.forEach(async (tab) => {
        await injectScript(tab.id, XPATH_BUY_NOW_BTN_TH);
      });
    }
  } catch (error) {
    console.log(error, "startBOT error");
  }
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
    case "SAVE_DATA":
      saveData(message.data);
      break;
    default:
      break;
  }
});
