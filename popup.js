document.addEventListener('DOMContentLoaded', function () {

	// popup.js

	document.getElementById('captureBtn').addEventListener('click', function () {
		chrome.runtime.sendMessage({action: 'capture'});
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

document.addEventListener('DOMContentLoaded', function () {
	let stream;
	let mediaRecorder;
	let recordedChunks = [];

	document.getElementById('startRecording').addEventListener('click', startRecording);
	document.getElementById('stopRecording').addEventListener('click', stopRecording);

	async function startRecording() {
		try {
			stream = await chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], (id) => {
				return id;
			});
			console.log('stream', stream);
			mediaRecorder = new MediaRecorder(stream);
console.log('mediaRecorder', mediaRecorder);
			mediaRecorder.ondataavailable = function (event) {
				if (event.data.size > 0) {
					recordedChunks.push(event.data);
				}
			};

			mediaRecorder.onstop = function () {
				const blob = new Blob(recordedChunks, {type: 'video/webm'});
				recordedChunks = [];


				chrome.storage.local.set({'recordedVideo': blob}, function () {
					console.log('Video URL saved to storage');
				});
			};

			mediaRecorder.start();

			// Update UI
			document.getElementById('startRecording').disabled = true;
			document.getElementById('stopRecording').disabled = false;
		} catch (error) {
			console.error('Error starting recording:', error);
		}
	}

	function stopRecording() {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
			stream.getTracks().forEach(track => track.stop());

			// Update UI
			document.getElementById('startRecording').disabled = false;
			document.getElementById('stopRecording').disabled = true;
		}
	}

});