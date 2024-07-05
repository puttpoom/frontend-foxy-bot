import browser from "webextension-polyfill";

export let intervalInjectScript = null;
export default function injectScriptUntilSuccess(
  tabId,
  scriptingDetails,
  delayRefresh = 800
) {
  return new Promise((resolve, reject) => {
    intervalInjectScript = setInterval(async () => {
      try {
        for (let i = 0; i < 5; i++) {
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
        }
      } catch (error) {
        // clearInterval(interval);
        console.log(error, "injectScriptUntilSuccess error");
        reject(error);
      }
    }, delayRefresh);
  });
}
