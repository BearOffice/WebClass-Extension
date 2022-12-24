import { TimeTrigger } from "./timetrigger.js";

// Initialize
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(item => {
        if (item.url == undefined){
            chrome.storage.sync.set({ url: '' });
            chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
        }
    });
});

// Listen request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == 'download') {
        downloadfile(request, sender);
        sendResponse();
    }
    else if (request.type == 'reportfinded') {
        clearTimeCheck()
        reportStatus(true);
        sendResponse();
    }
    else if (request.type == 'reportstatus') {
        timeCheck();
        sendResponse({ has: hasReport() });
    }
    else if (request.type == 'reportdone') {
        clearTimeCheck();
        reportStatus(false);
        sendResponse();
    }
});

// Popup
chrome.action.onClicked.addListener(() => {
    getLoginUrl().then(loginurl => {
        chrome.tabs.create({ url: loginurl }, tab => {
            injectJs(tab);
        });
    });
});

function injectJs(tab: chrome.tabs.Tab) {
    if (tab.id) {
        chrome.scripting.executeScript({
            target: {tabId: tab.id, allFrames: true},
            files: ["js/jquery-3.6.3.min.js", "js/autologin.js"],
            world: "MAIN"
        });
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
let repotrigger = new TimeTrigger(5000);

function reportStatus(status: boolean) {
    hasreport = status;
}

function hasReport() {
    return hasreport;
}

function timeCheck() {
    repotrigger.timeCheck(() => { reportStatus(false); });
}

function clearTimeCheck() {
    repotrigger.clearTimeCheck();
}
