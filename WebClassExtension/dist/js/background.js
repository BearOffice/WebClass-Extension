"use strict";
// Initialize
chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
});
// Popup
chrome.browserAction.onClicked.addListener(function () {
    getUrl().then(function (loginurl) {
        chrome.tabs.create({ url: loginurl }, function (tab) {
            if (tab.id)
                injectJs(tab.id);
        });
    });
});
// Inject js to login page
function injectJs(tabId) {
    chrome.tabs.executeScript(tabId, { file: "js/jquery-3.5.1.min.js" });
    chrome.tabs.executeScript(tabId, { file: "js/autologin.js" });
}
// Get url asynchronously
function getUrl() {
    return new Promise(function (resolve) {
        chrome.storage.sync.get(function (item) {
            var url = item.url;
            var result = url.match('/webclass/login.php');
            if (result != null)
                resolve(url);
            else
                resolve('https://github.com/MisakiBear');
        });
    });
}
//# sourceMappingURL=background.js.map