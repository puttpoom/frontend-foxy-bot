import browser from "webextension-polyfill";

export default async function queryTabs(url) {
  try {
    let tabs = await browser.tabs.query({ currentWindow: true });
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
