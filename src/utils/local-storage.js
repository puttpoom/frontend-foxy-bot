import browser from "webextension-polyfill";
const ACCES_TOKEN = "accessToken";

export const storeToken = (token) =>
  browser.storage.local.set({ [ACCES_TOKEN]: token });
export const getToken = () => browser.storage.local.get(ACCES_TOKEN);
export const removeToken = () => browser.storage.local.remove(ACCES_TOKEN);
