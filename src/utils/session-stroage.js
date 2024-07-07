import browser from "webextension-polyfill";

export const storeSession = (key, value) =>
  browser.storage.local.set({ [key]: value });
export const getSession = (key) => browser.storage.local.get(key);
export const removeSession = (key) => browser.storage.local.remove(key);
