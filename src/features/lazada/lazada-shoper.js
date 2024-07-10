import injectScriptUntilSuccess from "../../func/PromiseInjectScript";
import findElementByXpath from "../../func/findElementByXpath";

//! ------------------ XPATH Lazada ------------------

const XPATH_BUY_NOW_BTN_TH = "//span[text()='ซื้อเลย']";
const XPATH_BUY_NOW_BTN_EN = "//span[text()='Buy Now']";
const XPATH_QUANTITY_INPUT = "//input[@value='1']";
const XPATH_ORDER_BTN_TH = "//div[text()='สั่งซื้อ']";
const XPATH_ORDER_BTN_EN = "//div[text()='Place Order']";

const XPATH_PAYMENT_METHOD = {
  LazadaWallet: "//p[text()='Lazada Wallet ']",
  QRcode: "//p[text()='QR พร้อมเพย์']",
};

//! --------------------------------------------------

export default async function LazadaShoper(tabs, data) {
  try {
    for (const tab of tabs) {
      let isAvailable = await injectScriptUntilSuccess(
        tab.id,
        {
          function: () => {
            location.reload(false);
            let isStock = document.querySelector(
              "#module_quantity-input > div > div > div > div.next-number-picker-input-wrap > span > input[type=text]"
            ).value;

            let isBuyNow = document.querySelector(
              "#module_add_to_cart > div > button.add-to-cart-buy-now-btn.pdp-button.pdp-button_type_text.pdp-button_theme_yellow.pdp-button_size_xl > span"
            );

            return {
              status: isStock === "1" && isBuyNow ? true : false,
              message: `page reloaded, stock: ${isStock}, isBuyNow: ${
                isBuyNow ? true : false
              }`,
            };
          },
        },
        data.delayRefresh
      );

      console.log(isAvailable, "reload page");

      let changeQuantity = await injectScriptUntilSuccess(
        tab.id,
        {
          args: [XPATH_QUANTITY_INPUT, "changeValue", data.quantity],
          function: findElementByXpath,
        },
        data.delayRefresh
      );

      let clickElBuyBTN = await injectScriptUntilSuccess(
        tab.id,
        {
          args: [XPATH_BUY_NOW_BTN_TH, "click"],
          function: findElementByXpath,
        },
        data.delayRefresh
      );

      /*
        let selectPaymentMethod = await injectScriptUntilSuccess(
          tab.id,
          {
            args: [XPATH_PAYMENT_METHOD[data.paymentMethod], "click"],
            function: findElementByXpath,
          },
          data.delayRefresh
        );

        let clickOrderBTN = await injectScriptUntilSuccess(
          tab.id,
          {
            args: [XPATH_ORDER_BTN_TH, "click"],
            function: findElementByXpath,
          },
          data.delayRefresh
        ); 
        */
    }
  } catch (error) {
    console.log("Error: LazadaShoper", error);
  }
}
