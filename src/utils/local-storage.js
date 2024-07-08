import browser from "webextension-polyfill";
const ACCES_TOKEN = "accessToken";

export const storeToken = async (token) =>
  await browser.storage.local.set({ [ACCES_TOKEN]: token });
export const getToken = async () =>
  await browser.storage.local.get(ACCES_TOKEN);
export const removeToken = async () =>
  await browser.storage.local.remove(ACCES_TOKEN);
