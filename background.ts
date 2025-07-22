chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "OPEN_MAP_TAB") {
    chrome.tabs.create({ url: request.url });
    sendResponse({ status: "Tab opened" });
  }
  return true; // 비동기 응답을 위해 필요
});
