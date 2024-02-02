console.log('Content script loaded');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('onMessage');
	if (request.action === 'capture') {

		function captureVisibleTabAndDownload() {
			return new Promise((resolve, reject) => {
				chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (dataUrl) {
					// Save the captured dataUrl to chrome.storage
					chrome.storage.local.set({'screenshot': dataUrl}, function () {
						console.log('Screenshot URL saved to storage');
						resolve(dataUrl);
					});
				});
			});
		}

		function downloadImage(dataUrl) {
			chrome.downloads.download({
				url: dataUrl,
				filename: 'screenshot.png',
				saveAs: false
			});
		}

// Helper function to convert data URI to Blob
		function dataURItoBlob(dataURI) {
			const byteString = atob(dataURI.split(',')[1]);
			const ab = new ArrayBuffer(byteString.length);
			const ia = new Uint8Array(ab);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			return new Blob([ab], {type: 'image/png'});
		}

// Usage
		captureVisibleTabAndDownload().then((dataUrl) => {
			console.log("Value is " + dataUrl);
			downloadImage(dataUrl);
		}).catch((error) => {
			console.log("Error capturing and saving screenshot:", error);
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

