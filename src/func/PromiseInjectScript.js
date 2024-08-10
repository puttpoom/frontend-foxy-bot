import browser from "webextension-polyfill";

let intervalInjectScript;

export function stopIntervalInjectScript(message) {
  console.log(`${message} stopIntervalInjectScript`);
  clearInterval(intervalInjectScript);
}

export default function injectScriptUntilSuccess(
  tabId,
  { function: func, args },
  delayRefresh = 100,
  maxAttempts = 5
) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    intervalInjectScript = setInterval(async () => {
      if (attempts > maxAttempts) {
        stopIntervalInjectScript("Failed injectScriptUntilSuccess");
        return reject(`Failed after ${maxAttempts} attempts`);
      }

      try {
        const [{ result }] = await browser.scripting.executeScript({
          target: { tabId },
          func,
          args,
        });

        if (result && result.status) {
          console.log(result);
          stopIntervalInjectScript("Success injectScriptUntilSuccess");
          return resolve(result);
        } else if (!result || result.status === false) {
          attempts++;
          console.log(result);
        }
      } catch (error) {
        stopIntervalInjectScript("Error injectScriptUntilSuccess");
        return reject(error);
      }
    }, delayRefresh);
  });
}
