document.addEventListener('DOMContentLoaded', function () {

	document.getElementById('captureBtn').addEventListener('click', function () {
		chrome.runtime.sendMessage({action: 'capture'});
	});
});

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('startRecording').addEventListener('click', function () {
  chrome.runtime.sendMessage({ action: 'startRecording' });
});

document.getElementById('stopRecording').addEventListener('click', function () {
  chrome.runtime.sendMessage({ action: 'stopRecording' });
});

document.getElementById('downloadVideo').addEventListener('click', function () {
  chrome.runtime.sendMessage({ action: 'downloadVideo' });
});


});