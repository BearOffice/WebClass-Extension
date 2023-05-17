"use strict";
// frame[webclass_content] contains two contents frames
var contentsframe = $('frame[name="webclass_content"]');
// The script must be execute after content frame loaded
contentsframe.on('load', function () {
    // frame[webclass_chapter] contains chapter's name  --Updated in 2021
    // frame[webclass_chapter] always loaded before frame[webclass_content] loaded completely
    var chapterframe = $('frame[name="webclass_chapter"]');
    var chaptername = chapterframe.contents().find('#WsTitle h2').text();
    // frame[webclass_content]'s frame that does not have attr[noresize] contains file's url
    var fileurlframe = contentsframe.contents().find('frame:not([noresize])');
    if (fileurlframe.length != 0) {
        var framebody_1 = $('body', fileurlframe.contents());
        framebody_1.append('<font color="black">| この<b>取り込みファイル(PDFなど)</b>を' +
            '<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default"></font>');
        // Regist onclick event   [Option:DOMSubtreeModified propertychange]
        framebody_1.find('#downloadbtn').on('click', function () {
            var fileurl = framebody_1.find('a').attr('href');
            chrome.runtime.sendMessage({ type: 'download', filename: chaptername, url: fileurl });
        });
    }
    // Add download button to the top bar
    var topbarframe = $('frame[name="webclass_title"]');
    var topbar = topbarframe.contents().find('#ContentQuitMenu > li');
    var downloadAttacmentButton = $("<input type='button' name='download_attachment' value='全ての↙︎添付資料ファイル↙︎をダウンロード' class='btn btn-default'>");
    var downloadTextButton = $("<input type='button' name='download_text' value='全ての↘︎取り込みファイル↘︎をダウンロード' class='btn btn-default'>");
    topbar.append(downloadAttacmentButton[0]);
    topbar.append(downloadTextButton[0]);
    downloadAttacmentButton.on("click", downloadAttachment);
    downloadTextButton.on("click", downloadText);
    function downloadAttachment() {
        // Loop through each row and extract the download link
        var downloadLinks = chapterframe.contents().find('a[target="download"]').map(function () {
            return $(this).prop('href');
        }).get();
        downloadLinks.forEach(function (downloadLink) {
            var _a, _b;
            // Replace file_down.php with download.php
            downloadLink = downloadLink.replace('file_down', 'download');
            // Download the file
            // window.open(downloadLink);
            var regexSplitURL = /(\/webclass\/.*?file_name=(.*?)\..*?)&/;
            var fileName = (_a = downloadLink.match(regexSplitURL)) === null || _a === void 0 ? void 0 : _a[2];
            downloadLink = (_b = downloadLink.match(regexSplitURL)) === null || _b === void 0 ? void 0 : _b[1];
            chrome.runtime.sendMessage({
                type: 'download',
                filename: fileName,
                url: downloadLink
            });
        });
    }
    ;
    // Download all text (PDF etc. shown on the right side)
    function downloadText() {
        // Get download links
        // Select the script tag that contains the JSON data
        var textJSON = chapterframe.contents().find('#json-data');
        // Extract the JSON data from the script tag
        var jsonData = JSON.parse(textJSON.text());
        ;
        // Get the values of text_urls from the JSON data
        var textURLs = Object.values(jsonData.text_urls);
        //Use regex to macth files
        var i = 0;
        var fileURLs = [];
        var regexFileURLs = /(?<=file=)[^&]+/;
        for (i = 0; i < textURLs.length; i++) {
            var matchedFileURL = textURLs[i].match(regexFileURLs);
            if (matchedFileURL) {
                var regexContentsURL = /&contents_url=([^&]*)/;
                var matchedContentsURL = textURLs[i].match(regexContentsURL);
                if (matchedContentsURL !== null) {
                    var fullDownloadURL = matchedContentsURL[1] + matchedFileURL;
                    fileURLs.push(decodeURIComponent(fullDownloadURL));
                }
                ;
            }
            else {
                fileURLs.push('');
            }
        }
        ;
        // Get the name of every file
        // It will be like this:
        // 第1節, 注意, 第2節, レポート, 第3節, 実験
        var COT = chapterframe.contents().find('span.size2.darkslategray').map(function () {
            return $(this).text();
        }).get();
        var fileNames = [];
        for (i = 1; i < COT.length; i += 2) {
            var chapterName = COT[i];
            if (chapterName != '') {
                // If chapter name is not empty, use it as file name
                fileNames.push(COT[i]);
            }
            else {
                if (fileURLs.length == 1) {
                    // If there is only one file, just click the download button added before
                    var framebody = $('body', fileurlframe.contents());
                    framebody.find('#downloadbtn').click();
                    return;
                }
                else {
                    // If there is not only one file, and chapter name is empty, use "第x節"
                    fileNames.push(COT[i - 1]);
                }
            }
        }
        ;
        // Download all files in fileURLs, with the name of chapterNames
        for (i = 0; i < fileURLs.length; i++) {
            if (fileURLs[i] != '') {
                chrome.runtime.sendMessage({ type: 'download', filename: fileNames[i], url: fileURLs[i] });
            }
        }
    }
    ;
});
//# sourceMappingURL=contentsdownload.js.map