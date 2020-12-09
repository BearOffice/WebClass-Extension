// Initialize
chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });

    // Prevent url not being set
    chrome.storage.sync.get(item => {
        if (item.url == undefined)
            chrome.storage.sync.set({ url: '' });
    });
});

// Listen request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
chrome.browserAction.onClicked.addListener(() => {
    getLoginUrl().then(loginurl => {
        chrome.tabs.create({ url: loginurl }, tab => {
            injectJs(tab);
        });
    });
});

function injectJs(tab: chrome.tabs.Tab) {
    if (tab.id) {
        chrome.tabs.executeScript(tab.id, { file: "js/jquery-3.5.1.min.js" });
        chrome.tabs.executeScript(tab.id, { file: "js/autologin.js" });
    }
}

// Get url synchronously
function getLoginUrl(): Promise<string> {
    return new Promise(resolve => {
        chrome.storage.sync.get(item => {
            let url = item.url as string;
            let match = url.match('/webclass/login.php');
            if (match != null)
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
        let regex = new RegExp('(.*?)/webclass/');
        let url = sender.tab.url.match(regex)?.[1] + downloadmsg.url;

        // Get file's extension
        regex = new RegExp('.*(\\..*)')
        let ext = downloadmsg.url.match(regex)?.[1];
        let filename = downloadmsg.filename + ext;

        chrome.downloads.download({ url: url, filename: filename });
    }
}


// ------------- Report Alert -------------

let hasreport = false;

function reportFinded() {
    hasreport = true;
}

function hasReport() {
    if (hasreport == true) {
        hasreport = false;
        return true;
    } else {
        return false;
    }
}