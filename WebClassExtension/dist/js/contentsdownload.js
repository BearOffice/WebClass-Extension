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
        framebody_1.append('<font color="black">| このページの<b>ファイル(PDFなど)</b>を' +
            '<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default"></font>');
        // Regist onclick event   [Option:DOMSubtreeModified propertychange]
        framebody_1.find('#downloadbtn').on('click', function () {
            var fileurl = framebody_1.find('a').attr('href');
            alert("name = " + chaptername);
            chrome.runtime.sendMessage({ type: 'download', filename: chaptername, url: fileurl });
        });
    }
});
//# sourceMappingURL=contentsdownload.js.map