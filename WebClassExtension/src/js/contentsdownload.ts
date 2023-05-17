// frame[webclass_content] contains two contents frames
let contentsframe = $('frame[name="webclass_content"]');

// The script must be execute after content frame loaded
contentsframe.on('load', () => {
    // frame[webclass_chapter] contains chapter's name  --Updated in 2021
    // frame[webclass_chapter] always loaded before frame[webclass_content] loaded completely
    let chapterframe = $('frame[name="webclass_chapter"]');
    let chaptername = chapterframe.contents().find('#WsTitle h2').text();

    // frame[webclass_content]'s frame that does not have attr[noresize] contains file's url
    let fileurlframe = contentsframe.contents().find('frame:not([noresize])');
    if (fileurlframe.length != 0) {
        let framebody = $('body', fileurlframe.contents());
        framebody.append('<font color="black">| この<b>取り込みファイル(PDFなど)</b>を' +
            '<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default"></font>');

        // Regist onclick event   [Option:DOMSubtreeModified propertychange]
        framebody.find('#downloadbtn').on('click', () => {
            let fileurl = framebody.find('a').attr('href');
            chrome.runtime.sendMessage({ type: 'download', filename: chaptername, url: fileurl });
        });
    }
    // Add download button to the top bar
    let topbarframe = $('frame[name="webclass_title"]');
    let topbar = topbarframe.contents().find('#ContentQuitMenu > li');
    let downloadAttacmentButton = $("<input type='button' name='download_attachment' value='全ての↙︎添付資料ファイル↙︎をダウンロード' class='btn btn-default'>");
    let downloadTextButton = $("<input type='button' name='download_text' value='全ての↘︎取り込みファイル↘︎をダウンロード' class='btn btn-default'>");
    topbar.append(downloadAttacmentButton[0]);
    topbar.append(downloadTextButton[0]);
    downloadAttacmentButton.on("click", downloadAttachment);
    downloadTextButton.on("click", downloadText);



    function downloadAttachment() {
        // Loop through each row and extract the download link
        let downloadLinks = chapterframe.contents().find('a[target="download"]').map(function () {
            return $(this).prop('href');
        }).get();

        downloadLinks.forEach(downloadLink => {
            // Replace file_down.php with download.php
            downloadLink = downloadLink.replace('file_down', 'download');
            // Download the file
            // window.open(downloadLink);
            let regexSplitURL =/(\/webclass\/.*?file_name=(.*?)\..*?)&/;
            let fileName = downloadLink.match(regexSplitURL)?.[2];
            downloadLink = downloadLink.match(regexSplitURL)?.[1];
            chrome.runtime.sendMessage({
                type: 'download',
                filename: fileName,
                url: downloadLink
            });
        });
    };

    // Download all text (PDF etc. shown on the right side)
    function downloadText() {

        // Get download links

        // Select the script tag that contains the JSON data
        let textJSON = chapterframe.contents().find('#json-data')
        // Extract the JSON data from the script tag
        let jsonData = JSON.parse(textJSON.text()) as { text_urls: Record<string, string> };;
        // Get the values of text_urls from the JSON data
        let textURLs = Object.values(jsonData.text_urls);

        //Use regex to macth files
        let i = 0;
        let fileURLs = [];
        let regexFileURLs = /(?<=file=)[^&]+/;
        for (i = 0; i < textURLs.length; i++) {
            let matchedFileURL = textURLs[i].match(regexFileURLs);
            if (matchedFileURL) {
                let regexContentsURL = /&contents_url=([^&]*)/;
                let matchedContentsURL = textURLs[i].match(regexContentsURL);
                if (matchedContentsURL !== null) {
                    let fullDownloadURL = matchedContentsURL[1] + matchedFileURL;
                    fileURLs.push(decodeURIComponent(fullDownloadURL));
                };
            }
            else {
                fileURLs.push('');
            }
        };

        // Get the name of every file
        // It will be like this:
        // 第1節, 注意, 第2節, レポート, 第3節, 実験
        let COT = chapterframe.contents().find('span.size2.darkslategray').map(function () {
            return $(this).text();
        }).get();
        let fileNames = [];

        for (i = 1; i < COT.length; i += 2) {
            let chapterName = COT[i];
            if (chapterName != '') {
                // If chapter name is not empty, use it as file name
                fileNames.push(COT[i]);
            } else {
                if (fileURLs.length == 1) {
                    // If there is only one file, just click the download button added before
                    let framebody = $('body', fileurlframe.contents());
                    framebody.find('#downloadbtn').click();
                    return;
                } else {
                    // If there is not only one file, and chapter name is empty, use "第x節"
                    fileNames.push(COT[i - 1]);
                }
            }

        };


        // Download all files in fileURLs, with the name of chapterNames
        for (i = 0; i < fileURLs.length; i++) {
            if (fileURLs[i] != '') {
                chrome.runtime.sendMessage({ type: 'download', filename: fileNames[i], url: fileURLs[i] });
            }
        }
    };
});