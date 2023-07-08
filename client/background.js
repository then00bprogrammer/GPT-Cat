chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'setValue') {
        chrome.storage.local.set({ email: request.email }, function() {
            sendResponse({ success: true });
        });
    }
    if (request.action === 'getValue') {
        chrome.storage.local.get(["email"], function(result) {
            sendResponse({ email : result.email });
        });
    }
    return true; 
});
