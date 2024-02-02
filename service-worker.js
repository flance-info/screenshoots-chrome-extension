function reddenPage() {
  document.body.style.backgroundColor = 'red';
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: reddenPage
    });
  }

   chrome.tabs.captureVisibleTab(null, { format: 'png' }, function (dataUrl) {
      localStorage.setItem('screenshot', dataUrl);
    });
});