import browser from "webextension-polyfill";

export let intervalInjectScript = null;
export default function injectScriptUntilSuccess(
  tabId,
  scriptingDetails,
  delayRefresh = 800
) {
  return new Promise((resolve, reject) => {
    let i = 1;
    intervalInjectScript = setInterval(async () => {
      try {
        if (i <= 20) {
          const [{ result }] = await browser.scripting.executeScript({
            target: { tabId: tabId },
            func: scriptingDetails.function,
            args: scriptingDetails.args,
          });
          if (result.status && result.status !== null) {
            clearInterval(intervalInjectScript);
            resolve(result);
          } else {
            i++;
            console.log(result, "injectScriptUntilSuccess result");
          }
        } else {
          clearInterval(intervalInjectScript);
          reject("injectScriptUntilSuccess i > 5");
        }
      } catch (error) {
        console.log(error, "CATCH ERROR: injectScriptUntilSuccess");
        reject(error);
      }
    }, delayRefresh);
  });
}
