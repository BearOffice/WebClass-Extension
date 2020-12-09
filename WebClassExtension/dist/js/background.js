"use strict";
// Initialize
chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
    // Prevent url not being set
    chrome.storage.sync.get(function (item) {
        if (item.url == undefined)
            chrome.storage.sync.set({ url: '' });
    });
});
// Listen request
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == 'download') {
        downloadfile(request, sender);
        sendResponse();
    }
    else if (request.type == 'findreport') {
        reportFinded();
        sendResponse();
    }
    else if (request.type == 'hasreport') {
        sendResponse({ has: hasReport() });
    }
});
// Popup
chrome.browserAction.onClicked.addListener(function () {
    getLoginUrl().then(function (loginurl) {
        chrome.tabs.create({ url: loginurl }, function (tab) {
            injectJs(tab);
        });
    });
});
function injectJs(tab) {
    if (tab.id) {
        chrome.tabs.executeScript(tab.id, { file: "js/jquery-3.5.1.min.js" });
        chrome.tabs.executeScript(tab.id, { file: "js/autologin.js" });
    }
}
// Get url synchronously
function getLoginUrl() {
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
    var _a, _b, _c;
    if ((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.url) {
        // Create Url
        var regex = new RegExp('(.*?)/webclass/');
        var url = ((_b = sender.tab.url.match(regex)) === null || _b === void 0 ? void 0 : _b[1]) + downloadmsg.url;
        // Get file's extension
        regex = new RegExp('.*(\\..*)');
        var ext = (_c = downloadmsg.url.match(regex)) === null || _c === void 0 ? void 0 : _c[1];
        var filename = downloadmsg.filename + ext;
        chrome.downloads.download({ url: url, filename: filename });
    }
}
// ------------- Report Alert -------------
var hasreport = false;
function reportFinded() {
    hasreport = true;
}
function hasReport() {
    if (hasreport == true) {
        hasreport = false;
        return true;
    }
    else {
        return false;
    }
}
//# sourceMappingURL=background.js.map