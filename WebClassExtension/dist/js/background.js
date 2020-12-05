"use strict";
// Initialize
chrome.runtime.onInstalled.addListener(function () {
    //chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
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
                resolve('https://github.com/MisakiBear/WebClass-Extension');
        });
    });
}
// Execute the download request from contentsdownload.js
chrome.runtime.onMessage.addListener(function (downloadmsg, sender) {
    var _a, _b;
    if ((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.url) {
        // Create Url
        var url = getDomain(sender.tab.url) + downloadmsg.url;
        // Get file's extension
        var regex = new RegExp('.*(\\..*)');
        var ext = (_b = downloadmsg.url.match(regex)) === null || _b === void 0 ? void 0 : _b[1];
        var filename = downloadmsg.filename + ext;
        chrome.downloads.download({ url: url, filename: filename });
    }
});
function getDomain(url) {
    var _a;
    var regex = new RegExp('(.*?)/webclass/');
    return (_a = url.match(regex)) === null || _a === void 0 ? void 0 : _a[1];
}
//# sourceMappingURL=background.js.map