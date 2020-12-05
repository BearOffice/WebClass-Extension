"use strict";
// The script must be execute after all frames loaded
window.onload = function () {
    // The second frame contains chapter's name
    var chaptername = $('body', window.parent.frames[1].document).find('h2').text();
    // The first frame contains navi bar
    var naviframe = $('#ContentQuitMenu', window.parent.frames[0].document);
    // Inject download button
    naviframe.append('<style>li{margin-right:15%}</style>' +
        '<li><font color="black">WebClass Extensionからファイルを' +
        '<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default"></font></li>'); //WebClass Extensionから<button id="downloadbtn">ダウンロード</button>
    // Regist onclick event        // Option:DOMSubtreeModified propertychange
    naviframe.find('#downloadbtn').on('click', function () {
        // The forth frame's first frame contains file's url
        var framebody = $('body', window.parent.frames[3].frames[0].document);
        var fileurl = framebody.find('a').attr('href');
        chrome.runtime.sendMessage({ filename: chaptername, url: fileurl });
    });
};
//# sourceMappingURL=contentsdownload.js.map