import browser from "webextension-polyfill";

export const querryTabsAndSaveData = async (data) => {
  try {
    let tabs = await browser.tabs.query({ active: true, currentWindow: true });
    tabs = tabs.filter((tab) => tab.url === data.url);
    //tabs []
    for (const tab of tabs) {
      let storageKey = tab.id;
      let sessionStorage = await getSession(storageKey);
      if (!sessionStorage) {
        await storeSession(storageKey, data);
        console.log(data, "querryTabsAndSaveData by background.js");
      } else {
        console.log(
          `querryTabsAndSaveData already have data in sessionStorage by background.js`
        );
      }
    }
  } catch (error) {
    console.log(error, "querryTabs error");
  }
};

export const storeSession = (key, value) =>
  browser.storage.session.set({ [key]: value });
export const getSession = (key) => browser.storage.session.get(`${key}`);
export const removeSession = (key) => browser.storage.session.remove(key);
