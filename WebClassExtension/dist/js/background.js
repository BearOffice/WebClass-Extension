"use strict";
// Initialize
chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
});
// Listen request
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == 'download') {
        downloadfile(request, sender);
        sendResponse();
    }
    else if (request.type == 'report') {
        changereportstatus();
        sendResponse();
    }
    else if (request.type == 'hasreport') {
        sendResponse({ has: reportstatus() });
    }
});
// Popup
chrome.browserAction.onClicked.addListener(function () {
    getLoginUrl().then(function (loginurl) {
        chrome.tabs.create({ url: loginurl }, function (tab) {
            if (tab.id)
                injectJs(tab.id);
        });
    });
});
function injectJs(tabId) {
    chrome.tabs.executeScript(tabId, { file: "js/jquery-3.5.1.min.js" });
    chrome.tabs.executeScript(tabId, { file: "js/autologin.js" });
}
function getLoginUrl() {
    // Get url synchronously
    return new Promise(function (resolve) {
        chrome.storage.sync.get(function (item) {
            var url = item.url;
            var match = url.match('/webclass/login.php');
            if (match != null)
                resolve(url);
            else
                resolve('https://github.com/MisakiBear/WebClass-Extension');
        });
    });
}
// Execute the download request from contentsdownload.js
function downloadfile(downloadmsg, sender) {
    var _a, _b;
    if ((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.url) {
        // Create Url
        var url = getWebClassDomain(sender.tab.url) + downloadmsg.url;
        // Get file's extension
        var regex = new RegExp('.*(\\..*)');
        var ext = (_b = downloadmsg.url.match(regex)) === null || _b === void 0 ? void 0 : _b[1];
        var filename = downloadmsg.filename + ext;
        chrome.downloads.download({ url: url, filename: filename });
    }
}
function getWebClassDomain(url) {
    var _a;
    var regex = new RegExp('(.*?)/webclass/');
    return (_a = url.match(regex)) === null || _a === void 0 ? void 0 : _a[1];
}
// ------------- Report Alert -------------
var hasreport = false;
function changereportstatus() {
    hasreport = true;
}
function reportstatus() {
    if (hasreport == true) {
        hasreport = false;
        return true;
    }
    else {
        return false;
    }
}
//# sourceMappingURL=background.js.map