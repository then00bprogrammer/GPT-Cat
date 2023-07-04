chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("I'm from background.js");
    if (request.action === 'setValue') {
        chrome.storage.local.set({ emailValue: request.value }, function() {
            sendResponse({ success: true });
        });
    }
    if (request.action === 'getValue') {
        chrome.storage.local.get(["emailValue"], function(result) {
            sendResponse({ email : result.emailValue });
        });
    }
    return true; 
});
