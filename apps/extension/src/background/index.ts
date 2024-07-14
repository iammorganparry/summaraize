/**
 * @description Handles sending tab updates to the content scripts
 */
console.log("Background script running 🚀");
chrome.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {
  try {
    if (changeInfo.url) {
      // only send to active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          return;
        }
        chrome.tabs.sendMessage(tabs[0].id, {
          tabChanged: true,
          title: tab.url,
        });
      });
    }
  } catch (error) {
    // silence the error as its usually just an inactive connection to a tab
    console.warn("Error sending tab update", error);
  }
});
