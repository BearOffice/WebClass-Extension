"use strict";
var infobox = $('#NewestInformations');
var title = $('#UserTopInfo .page-header');
title.text('管理者からのお知らせ　 < クリックして格納 >');
// Collapse the notifications
switchInfoboxVisibility();
// Append the notifications if there are any unread messages
$(window).on('load', function () {
    // js-unread-message-count is updated by ajax, can't catch the updated timing
    setTimeout(function () {
        var value = $('#js-unread-message-count').text();
        if (value != '') {
            switchInfoboxVisibility();
        }
    }, 200);
});
$('#UserTopInfo .page-header').on('click', function () {
    switchInfoboxVisibility();
});
function switchInfoboxVisibility() {
    if (infobox.is(':visible') == true) {
        infobox.hide();
        title.text('管理者からのお知らせ　 > クリックして展開 <');
    }
    else {
        infobox.show();
        title.text('管理者からのお知らせ　 < クリックして格納 >');
    }
}
// Arrange the row
$('.row > div').each(function (_, elem) {
    $(elem).removeAttr('class');
});
// Easter egg
var egg = ['(。・・)_旦', 'Σ(ﾟдﾟlll)', '(±.±)', '(ヾ;￣ω￣)ヾﾔﾚﾔﾚ',
    '┐(￣～￣)┌', '(-Д-＼)=３', '！(。_。)アレレ'];
$('.course-webclass').html('WebClass&nbsp;&nbsp;' + egg[Math.floor(Math.random() * egg.length)]);
// [Obsolete]
//$('.container .row').prepend('<div id="UserTopInfo"><h4 class="page-header"></h4>' +
//    '<iframe class="extinfo" style="width:100%;height:300;border:none;" ' +
//    'src=""></iframe></div>');
//# sourceMappingURL=mainpage.js.map