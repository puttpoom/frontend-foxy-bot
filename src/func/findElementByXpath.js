export default async function findElementByXpath(element, action, value = 1) {
  const xpathResult = document.evaluate(
    element,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  const elementDOM = xpathResult.singleNodeValue;

  if (elementDOM) {
    switch (action) {
      case "click":
        elementDOM.click();
        return { status: true, message: "el clicked" };
      case "changeValue":
        elementDOM.value = value;
        return { status: true, message: "el changed value" };
      default:
        break;
    }
  } else {
    return { status: false, message: "Element not found" };
  }
}
