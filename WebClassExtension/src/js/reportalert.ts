let reportName = '';
let reportUrl = '';
let reportTime = '';

$(window).on('load', () => {
    chrome.runtime.sendMessage({ type: 'reportstatus' }, response => {
        if (response.has == true) runReportAlert();
    });
});

function getMailUrl() {
    let regex = new RegExp('(.*?)/webclass/');
    return location.href.match(regex)?.[1] + '/webclass/msg_editor.php?msgappmode=inbox';
}

function runReportAlert() {
    // Create an invisible temp container
    $('body').append('<iframe class="extmail" style="visibility:hidden;width:0;height:0;border:none;" ' +
        'src="' + getMailUrl() + '"></iframe>');

    // Limit load event's run times
    let onetime = true;
    $('.extmail').on('load', () => {
        // The second load event is fired by ('input[name="UNSET_UNREADFLAG"]').trigger("click")
        // This means the operation is successful.
        if (onetime == false) {
            $('.extmail').remove();
            $('.extmail').off();

            // Finished sign
            chrome.runtime.sendMessage({ type: 'reportdone' });

            return;
        }
        onetime = false;

        checkReport().then(result => {
            if (result == false) {
                $('.extmail').remove();
                $('.extmail').off();
                alert('レポートが提出されていないようです．「成績」➝「レポート」からもう一度確認してください．');
                return;
            }

            // Read the first mail
            let mailframe = $('.extmail').contents();
            mailframe.find('input[name="id[0]"]').trigger("click");
            setTimeout(() => {
                mailframe.find('input[name="UNSET_UNREADFLAG"]').trigger("click");
            }, 20);

            embedMessage();
        });
    });
}

async function checkReport(): Promise<boolean> {
    let resolve = await getReportUrl();
    reportUrl = resolve[0];
    reportName = resolve[1];
    reportTime = resolve[2];

    let mailelem = $('.extmail').contents().find('#MsgListTable td[nowrap]');
    let mailtitle = $('span', mailelem.eq(2)).text();
    let mailtime = $('span', mailelem.eq(4)).text();

    // Check unread mail's counts
    if (unreadCount() == 0) return false;

    // Confirm title contains the following key words
    if (mailtitle.match(/レポートを受け取りました/) == null) return false;

    let regex = new RegExp(reportName);
    if (mailtitle.match(regex) == null) return false;

    // Check time
    let maildatetime = Date.parse('20' + mailtime + ':00');  // While datetime's format is '20/10/12 09:30'
    let reportdatetime = Date.parse(reportTime);
    if ((maildatetime - reportdatetime) / (1000 * 60) > 3) return false;
    if ((Date.now() - maildatetime) / (1000 * 60) > 10) return false;

    return true;
}

function unreadCount() {
    let value = $('#js-unread-message-count').text();
    if (value == '') value = '0';
    return parseInt(value);
}

function embedMessage() {
    // Change unread pop
    let count = unreadCount() - 1;
    let value = '';
    if (count > 1) value = count.toString();
    $('#js-unread-message-count').text(value);

    $('#top-info').empty();

    $('#top-info').append('<div class="container"><div class="alert alert-info">' +
        '<p>レポートが<b>' + reportTime + '</b>にて提出できました．' +
        '提出したレポートのファイル名は<b>' + reportName + '</b>です．</p>' +
        '<p>ファイルを<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default" ' +
        'onclick="location.href=\'' + reportUrl + '\'">し，内容を確認できます．</p></div></div>');
}

function getReportUrl(): Promise<[string, string, string]> {
    // Get report's url synchronously
    return new Promise(resolve => {
        let regex = new RegExp('(.*?/webclass/course.php/.*?/).*');
        let reportpageurl = location.href.match(regex)?.[1] + 'my-reports';

        // Create an invisible temp container
        $('body').append('<iframe class="extrepo" style="visibility:hidden;width:0;height:0;border:none;" ' +
            'src="' + reportpageurl + '"></iframe>');

        $('.extrepo').on('load', () => {
            let reportelem = $('.extrepo').contents().find('tbody td');
            let reporturl = $('a', reportelem.eq(2)).attr('href');
            let reportname = $('a', reportelem.eq(2)).text();
            let reporttime = reportelem.eq(5).text();
            $('.extrepo').remove();
            $('.extrepo').off();

            let regex = new RegExp('(.*?)/webclass/');
            let domain = location.href.match(regex)?.[1];
            if (reporturl != undefined && domain != undefined && reportname != undefined)
                resolve([domain + reporturl, reportname, reporttime]);
            else
                resolve(['', '', '']);
        });
    });
}