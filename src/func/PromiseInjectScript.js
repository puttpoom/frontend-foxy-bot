import browser from "webextension-polyfill";

let intervalInjectScript;

export function stopIntervalInjectScript() {
  clearInterval(intervalInjectScript);
  console.log(`stopIntervalInjectScript`);
}
export default function injectScriptUntilSuccess(
  tabId,
  scriptingDetails,
  delayRefresh = 800,
  loop = 5
) {
  return new Promise((resolve, reject) => {
    let i = 1;
    intervalInjectScript = setInterval(async () => {
      try {
        if (i <= loop) {
          const [{ result }] = await browser.scripting.executeScript({
            target: { tabId: tabId },
            func: scriptingDetails.function,
            args: scriptingDetails.args,
          });
          if (result.status && result.status !== null) {
            stopIntervalInjectScript();
            resolve(result);
          } else if (!result) {
            console.log("injectScriptUntilSuccess !result");
            stopIntervalInjectScript();
          } else {
            i++;
            console.log(result, "injectScriptUntilSuccess result");
          }
        } else {
          stopIntervalInjectScript();
          reject(`injectScriptUntilSuccess i > ${loop}`);
        }
      } catch (error) {
        console.log(error, "CATCH ERROR: injectScriptUntilSuccess");
        stopIntervalInjectScript();
        reject(error);
      }
    }, delayRefresh);
  });
}
