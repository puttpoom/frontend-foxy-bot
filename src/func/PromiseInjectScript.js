import browser from "webextension-polyfill";

let intervalInjectScript;

export function stopIntervalInjectScript() {
  clearInterval(intervalInjectScript);
}

export default function injectScriptUntilSuccess(
  tabId,
  { function: func, args },
  delayRefresh = 800,
  maxAttempts = 5
) {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    intervalInjectScript = setInterval(async () => {
      attempts++;

      if (attempts > maxAttempts) {
        stopIntervalInjectScript();
        return reject(new Error(`Failed after ${maxAttempts} attempts`));
      }

      try {
        const [{ result }] = await browser.scripting.executeScript({
          target: { tabId },
          func,
          args,
        });

        if (result && result.status) {
          stopIntervalInjectScript();
          return resolve(result);
        } else {
          console.log(result);
        }
      } catch (error) {
        stopIntervalInjectScript();
        return reject(error);
      }
    }, delayRefresh);
  });
}
