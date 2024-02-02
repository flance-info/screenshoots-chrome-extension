console.log('Content script loaded');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('onMessage');
  if (request.action === 'capture') {
    console.log('capture');
    console.log('ttess sdfgdf sfgsdfg');
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, function (dataUrl) {
      localStorage.setItem('screenshot', dataUrl);
    });
  } else if (request.action === 'createVideo') {
    const screenshots = JSON.parse(localStorage.getItem('screenshots')) || [];
    const video = document.createElement('video');

    screenshots.forEach(function (screenshot) {
      const img = document.createElement('img');
      img.src = screenshot;
      video.appendChild(img);
    });

    document.body.appendChild(video);
    video.play();
  }
});

