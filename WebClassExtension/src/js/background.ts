// Initialize
chrome.runtime.onInstalled.addListener(() => {
    //chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
});

// Listen request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
chrome.browserAction.onClicked.addListener(() => {
    getLoginUrl().then(loginurl => {
        chrome.tabs.create({ url: loginurl as string }, tab => {
            if (tab.id) injectJs(tab.id);
        });
    });
});

// Inject js to login page
function injectJs(tabId: number) {
    chrome.tabs.executeScript(tabId, { file: "js/jquery-3.5.1.min.js" });
    chrome.tabs.executeScript(tabId, { file: "js/autologin.js" });
}

// Get url asynchronously
function getLoginUrl() {
    return new Promise(resolve => {
        chrome.storage.sync.get(item => {
            let url = item.url as string
            let result = url.match('/webclass/login.php');
            if (result != null)
                resolve(url);
            else
                resolve('https://github.com/MisakiBear/WebClass-Extension');
        });
    });
}

// Execute the download request from contentsdownload.js
function downloadfile(downloadmsg: any, sender: chrome.runtime.MessageSender) {
    if (sender.tab?.url) {
        // Create Url
        let url = getDomain(sender.tab.url) + downloadmsg.url;

        // Get file's extension
        let regex = new RegExp('.*(\\..*)')
        let ext = downloadmsg.url.match(regex)?.[1];
        let filename = downloadmsg.filename + ext;

        chrome.downloads.download({ url: url, filename: filename });
    }
}

function getDomain(url: string) {
    let regex = new RegExp('(.*?)/webclass/');
    return url.match(regex)?.[1];
}

// ------------- Report Alert -------------

let hasreport = false;

function changereportstatus() {
    hasreport = true;
}

function reportstatus() {
    if (hasreport == true) {
        hasreport = false;
        return true;
    } else {
        return false;
    }
}