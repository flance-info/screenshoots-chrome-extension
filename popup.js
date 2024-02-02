document.addEventListener('DOMContentLoaded', function () {

	// popup.js

document.getElementById('captureBtn').addEventListener('click', function () {
  chrome.runtime.sendMessage({ action: 'capture' });
});


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
