chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'contentScriptLoaded') {
    console.log('Content script loaded');
  }
  // Add your other logic here
});
