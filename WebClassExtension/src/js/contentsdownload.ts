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
        framebody.append('<font color="black">| このページの<b>ファイル(PDFなど)</b>を' +
            '<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default"></font>');

        // Regist onclick event   [Option:DOMSubtreeModified propertychange]
        framebody.find('#downloadbtn').on('click', () => {
            let fileurl = framebody.find('a').attr('href');
            alert("name = " + chaptername);
            chrome.runtime.sendMessage({ type: 'download', filename: chaptername, url: fileurl });
        });
    }
});