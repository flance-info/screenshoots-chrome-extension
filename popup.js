document.addEventListener('DOMContentLoaded', function () {

	// popup.js

	document.getElementById('captureBtn').addEventListener('click', function () {
		chrome.runtime.sendMessage({action: 'capture'});
	});
});

document.addEventListener('DOMContentLoaded', function () {
	let stream;
	let mediaRecorder;
	let recordedChunks = [];

	document.getElementById('startRecording').addEventListener('click', startRecording);
	document.getElementById('stopRecording').addEventListener('click', stopRecording);
	document.getElementById('downloadVideo').addEventListener('click', downloadVideo);

	async function startRecording() {
		try {
			stream = await getDesktopStream();
			console.log(stream);
			mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.ondataavailable = function (event) {
				if (event.data.size > 0) {
					recordedChunks.push(event.data);
				}
			};

			mediaRecorder.onstop = function () {
				console.log('recordedChunksddd', recordedChunks);
				const blob = new Blob(recordedChunks, {type: 'video/webm'});
				recordedChunks = [];
				let blobUrl = URL.createObjectURL(blob);
				chrome.storage.local.set({'recordedVideoBlob': blobUrl}, function () {
					console.log('Video Blob saved to storage');
					document.getElementById('downloadVideo').disabled = false;
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

	async function getDesktopStream() {
		return new Promise((resolve, reject) => {
			chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], (streamId) => {
				if (!streamId) {
					reject(new Error('User cancelled desktop capture.'));
					return;
				}

				navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: streamId
						}
					}
				})
					.then(resolve)
					.catch(reject);
			});
		});
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

	function downloadVideo() {
		chrome.storage.local.get(['recordedVideoBlob'], function (result) {
			const blobUrl = result.recordedVideoBlob;
			console.log(blobUrl);
			if (blobUrl) {
				chrome.downloads.download({
					url: blobUrl,
					filename: 'recorded_video.webm',
					saveAs: false
				}, function (downloadId) {
					if (chrome.runtime.lastError) {
						console.error('Error downloading video:', chrome.runtime.lastError);
					} else {
						console.log('Video download started with ID:', downloadId);
					}
				});

				// Clean up the Blob URL after the download is initiated
				URL.revokeObjectURL(blobUrl);
			} else {
				console.error('Recorded video Blob not found in storage');
			}
		});
	}


});