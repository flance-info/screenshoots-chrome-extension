chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'initiateDesktopCapture') {
    initiateDesktopCapture();
  }
});

async function initiateDesktopCapture() {
  try {
    const stream = await getDesktopStream();
    // Continue with your desktop capture logic
  } catch (error) {
    console.error('Error initiating desktop capture:', error);
  }
}



