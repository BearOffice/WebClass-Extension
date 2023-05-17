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
// Move year selector down
var courseTaking = $('div > h3');
var timeTable = $('form > h4');
var yeasrAndSemester = $('form > div:nth-child(2)');
var addCourse = $('form > div:nth-child(7)');
courseTaking.remove();
timeTable.remove();
yeasrAndSemester.remove();
yeasrAndSemester.insertAfter(addCourse);
// Delete blank table
var tables = document.getElementsByTagName('table');
// Loop through all tables
for (var i = 0; i < tables.length; i++) {
    var table = tables[i];
    // Loop through each row
    var rows = table.getElementsByTagName('tr');
    // Loop through each columns
    for (var j = rows.length - 1; j >= 0; j--) {
        var row = rows[j];
        // If all columns 2-7 are empty
        var isEmpty = true;
        for (var k = 1; k <= 6; k++) {
            var cell = row.cells[k];
            if (cell.textContent && cell.textContent.trim() !== '') {
                isEmpty = false;
                break;
            }
        }
        // remove the row
        if (isEmpty) {
            table.deleteRow(j);
        }
    }
}
//# sourceMappingURL=mainpage.js.map