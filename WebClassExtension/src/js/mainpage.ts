let infobox = $('#NewestInformations');
let title = $('#UserTopInfo .page-header');
title.text('管理者からのお知らせ　 < クリックして格納 >');

// Collapse the notifications
switchInfoboxVisibility();

// Append the notifications if there are any unread messages
$(window).on('load', () => {
    // js-unread-message-count is updated by ajax, can't catch the updated timing
    setTimeout(() => {
        let value = $('#js-unread-message-count').text();
        if (value != '') {
            switchInfoboxVisibility();
        }
    }, 200);
});

$('#UserTopInfo .page-header').on('click', () => {
    switchInfoboxVisibility();
});

function switchInfoboxVisibility() {
    if (infobox.is(':visible') == true) {
        infobox.hide();
        title.text('管理者からのお知らせ　 > クリックして展開 <');
    } else {
        infobox.show();
        title.text('管理者からのお知らせ　 < クリックして格納 >');
    }
}

// Arrange the row
$('.row > div').each((_, elem) => {
    $(elem).removeAttr('class');
});

// Easter egg
let egg = ['(。・・)_旦', 'Σ(ﾟдﾟlll)', '(±.±)', '(ヾ;￣ω￣)ヾﾔﾚﾔﾚ',
    '┐(￣～￣)┌', '(-Д-＼)=３', '！(。_。)アレレ'];
$('.course-webclass').html('WebClass&nbsp;&nbsp;' + egg[Math.floor(Math.random() * egg.length)]);

// [Obsolete]
//$('.container .row').prepend('<div id="UserTopInfo"><h4 class="page-header"></h4>' +
//    '<iframe class="extinfo" style="width:100%;height:300;border:none;" ' +
//    'src=""></iframe></div>');

// Move year selector down
let courseTaking = $('div > h3');
let timeTable = $('form > h4');
let yeasrAndSemester = $('form > div:nth-child(2)');
let addCourse = $('form > div:nth-child(7)');


courseTaking.remove();
timeTable.remove();
yeasrAndSemester.remove();
yeasrAndSemester.insertAfter(addCourse)

// Delete blank table
let tables = document.getElementsByTagName('table');

// Loop through all tables
for (let i = 0; i < tables.length; i++) {
    let table = tables[i];

    // Loop through each row
    let rows = table.getElementsByTagName('tr');

    // Loop through each columns
    for (let j = rows.length - 1; j >= 0; j--) {
        let row = rows[j];

        // If all columns 2-7 are empty
        let isEmpty = true;
        for (let k = 1; k <= 6; k++) {
            let cell = row.cells[k];
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
