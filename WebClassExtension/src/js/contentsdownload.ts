// The script must be execute after all frames loaded
window.onload = () => {
    // The second frame contains chapter's name
    let chaptername = $('frame[name="webclass_tool"]').contents().find('h2').text();

    // The first frame contains navi bar
    let naviframe = $('frame[name="webclass_title"]').contents().find('#ContentQuitMenu');

    // Inject download button
    naviframe.append('<style>li{margin-right:15%}</style>' +
        '<li><font color="black">WebClass Extensionからこのページのファイル(PDFなど)を' +
        '<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default"></font></li>');

    // Regist onclick event        // Option:DOMSubtreeModified propertychange
    naviframe.find('#downloadbtn').on('click', () => {
        // The forth frame's first frame contains file's url
        let contentsframe = $('frame[name="webclass_content"]').contents().find('frame');
        if (contentsframe.length != 0) {
            let framebody = $('body', contentsframe.contents());
            let fileurl = framebody.find('a').attr('href');
            chrome.runtime.sendMessage({ type: 'download', filename: chaptername, url: fileurl });
        }
        else {
            alert('このページにはファイル(PDFなど)がありません!');
        }
    });
};