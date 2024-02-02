document.addEventListener('DOMContentLoaded', function () {

	document.getElementById('captureBtn').addEventListener('click', function () {
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			chrome.scripting.executeScript({
				target: {tabId: tabs[0].id},
				function: captureVisibleTab
			});
		});
	});

	document.getElementById('createVideoBtn').addEventListener('click', function () {
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			chrome.scripting.executeScript({
				target: {tabId: tabs[0].id},
				function: createVideo
			});
		});
	});

	function captureVisibleTab() {
		chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (dataUrl) {
			localStorage.setItem('screenshot', dataUrl);
		});
	}

	function createVideo() {
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
