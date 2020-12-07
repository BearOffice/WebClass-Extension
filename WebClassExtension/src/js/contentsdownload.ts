// The frame[webclass_content] contains two contents frames
let contentsframe = $('frame[name="webclass_content"]');

// The script must be execute after content frame loaded
contentsframe.on('load', () => {
    // The frame[webclass_tool] contains chapter's name
    let chaptername = $('frame[name="webclass_tool"]').contents().find('h2').text();

    // The frame[webclass_content]'s frame that does not have attr[noresize] contains file's url
    let fileurlframe = contentsframe.contents().find('frame:not([noresize])');
    if (fileurlframe.length != 0) {
        let framebody = $('body', fileurlframe.contents());
        framebody.append('<font color="black">| このページの<b>ファイル(PDFなど)</b>を' +
            '<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default"></font>');

        // Regist onclick event   [Option:DOMSubtreeModified propertychange]
        framebody.find('#downloadbtn').on('click', () => {
            let fileurl = framebody.find('a').attr('href');
            chrome.runtime.sendMessage({ type: 'download', filename: chaptername, url: fileurl });
        });
    }
});