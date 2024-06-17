import browser from "webextension-polyfill";

function startBOT(data) {
  console.log(data);
}

browser.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "START":
      console.log("START");
      startBOT(message.data);
      break;
    case "STOP":
      console.log("STOP");
      break;
    case "SAVE_DATA":
      console.log("SAVE_DATA");
      break;
    default:
      break;
  }
});
