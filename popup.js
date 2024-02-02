document.addEventListener('DOMContentLoaded', function () {
	console.log('ttess sdfgdf sfgsdfg');
	document.getElementById('captureBtn').addEventListener('click', function () {
		console.log('ttess');
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {action: 'capture'});
		});
	});

	document.getElementById('createVideoBtn').addEventListener('click', function () {
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {action: 'createVideo'});
		});
	});
});

