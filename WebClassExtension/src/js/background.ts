// Initialize
chrome.runtime.onInstalled.addListener(() => {
    //chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
});

// Popup
chrome.browserAction.onClicked.addListener(() => {
    getUrl().then(loginurl => {
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
function getUrl() {
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
chrome.runtime.onMessage.addListener((downloadmsg, sender) => {
    if (sender.tab?.url) {
        // Create Url
        let regex = new RegExp('(.*?)/webclass/');
        let urlpart = sender.tab.url.match(regex)?.[1];
        let url = urlpart + downloadmsg.url;

        // Get file's extension
        regex = new RegExp('.*(\\..*)')
        let ext = downloadmsg.url.match(regex)?.[1];
        let filename = downloadmsg.filename + ext;
        
        chrome.downloads.download({ url: url, filename: filename });
    }
});