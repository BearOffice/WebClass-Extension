"use strict";
// The script must be execute after all frames loaded
window.onload = function () {
    // The second frame contains chapter's name
    var chaptername = $('frame[name="webclass_tool"]').contents().find('h2').text();
    // The first frame contains navi bar
    var naviframe = $('frame[name="webclass_title"]').contents().find('#ContentQuitMenu');
    naviframe.append('<li ><font color="black">| このページの<b>ファイル(PDFなど)</b>を' +
        '<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default"></font></li>');
    // Regist onclick event   [Option:DOMSubtreeModified propertychange]
    naviframe.find('#downloadbtn').on('click', function () {
        // The forth frame's first frame contains file's url
        var contentsframe = $('frame[name="webclass_content"]').contents().find('frame');
        if (contentsframe.length != 0) {
            var framebody = $('body', contentsframe.contents());
            var fileurl = framebody.find('a').attr('href');
            chrome.runtime.sendMessage({ type: 'download', filename: chaptername, url: fileurl });
        }
        else {
            alert('このページにはファイル(PDFなど)がありません!');
        }
    });
};
//# sourceMappingURL=contentsdownload.js.map