console.log('Content script loaded');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('onMessage');
	if (request.action === 'capture') {


		// Use chrome.tabs.captureVisibleTab directly in the background script
		chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (dataUrl) {

			// Save the captured dataUrl to chrome.storage
			chrome.storage.local.set({'screenshot': dataUrl}, function () {
				console.log('Screenshot URL saved to storage');
			});


			chrome.storage.local.get(["screenshot"]).then((result) => {
				console.log("Value is " + result.screenshot);
			});
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

