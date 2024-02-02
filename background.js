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

let stream;
let mediaRecorder;
let recordedChunks = [];
let recording = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startRecording' && !recording) {
    startRecording();
  } else if (request.action === 'stopRecording' && recording) {
    stopRecording();
  }
});

async function startRecording() {
  try {
    stream = await getDesktopStream();

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (event) {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      recordedChunks = [];
      let blobUrl = URL.createObjectURL(blob);
      chrome.storage.local.set({'recordedVideoBlob': blobUrl}, function () {
        console.log('Video Blob saved to storage');
      });
    };

    mediaRecorder.start();

    // Update recording status
    recording = true;
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

    // Update recording status
    recording = false;
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

