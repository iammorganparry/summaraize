/**
 * @description Handles sending tab updates to the content scripts
 */
console.log("Background script running 🚀");

chrome.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {
  if (chrome.runtime.lastError) {
    console.log("error: ", chrome.runtime.lastError); // These are dumb
  }
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
    console.log("Error sending tab update", error);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed 🚀");
  // send to youtube.com
  if (process.env.NODE_ENV !== "development") {
    chrome.tabs.create({
      url: "https://www.youtube.com/watch?v=UqWJ6uf8AGE&rundownState=onboarding",
    });
  }
});
