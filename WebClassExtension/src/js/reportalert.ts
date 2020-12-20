$(window).on('load', () => {
    chrome.runtime.sendMessage({ type: 'reportstatus' }, response => {
        if (response.has == true) reportAlert();
    });
});

async function reportAlert() {
    let errtrigger = new TimeTrigger(3000);

    // Monitor if the infobox exists
    if (await monitorLoadingStatus() == true) {
        loadingMessage();
    } else {
        if (lightCheck() == false) {
            warningMessage();
            return;
        }
    }

    // Pull error trigger
    errtrigger.timeCheck(errorMessage);

    // Get report detail
    let resolve = await getReportDetails();
    let reportUrl = resolve[0];
    let reportName = resolve[1];
    let reportTime = resolve[2];

    // Create an invisible temp container for reading mail contents
    $('body').append('<iframe class="extmail" style="visibility:hidden;width:0;height:0;border:none;" ' +
        'src="' + getMailUrl() + '"></iframe>');

    // Limit load event's run times
    let onetime = true;
    $('.extmail').on('load', () => {
        // The second load event is fired by ('input[name="UNSET_UNREADFLAG"]').trigger("click")
        // This means the operation is successful.
        if (onetime == false) { // Release resource
            $('.extmail').remove();
            $('.extmail').off();

            // Finished sign
            chrome.runtime.sendMessage({ type: 'reportdone' });
            return;
        }
        onetime = false;

        DeepCheck(reportName, reportTime).then(result => {
            if (result == false) {
                $('.extmail').remove();
                $('.extmail').off();
                errtrigger.clearTimeCheck();
                warningMessage();
                return;
            }

            readMail();

            errtrigger.clearTimeCheck();
            reportDetailMessage(reportName, reportTime, reportUrl);
        });
    });
}

// -------- Check if the report is uploaded successfully(light way) --------
function lightCheck() {
    // Check unread mail's counts
    if (unreadCount() == 0) return false;
    return true;
}

// -------- Check if the report is uploaded successfully(deep way) --------
async function DeepCheck(reportName: string, reportTime: string): Promise<boolean> {
    let mailelem = $('.extmail').contents().find('#MsgListTable td[nowrap]');
    let mailtitle = $('span', mailelem.eq(2)).text();
    let mailtime = $('span', mailelem.eq(4)).text();

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

function getReportPageUrl() {
    let regex = new RegExp('(.*?/webclass/course.php/.*?/).*');
    return location.href.match(regex)?.[1] + 'my-reports';
}

function getMailUrl() {
    let regex = new RegExp('(.*?)/webclass/');
    return location.href.match(regex)?.[1] + '/webclass/msg_editor.php?msgappmode=inbox';
}

function getReportDetails(): Promise<[string, string, string]> {
    // Get report's url synchronously
    return new Promise(resolve => {
        let reportpageurl = getReportPageUrl();

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

function readMail() {
    // Read the first mail
    let mailframe = $('.extmail').contents();
    mailframe.find('input[name="id[0]"]').trigger("click");
    setTimeout(() => {
        mailframe.find('input[name="UNSET_UNREADFLAG"]').trigger("click");
    }, 20);

    // Change unread pop
    let count = unreadCount() - 1;
    let value = '';
    if (count > 1) value = count.toString();
    $('#js-unread-message-count').text(value);
}

async function monitorLoadingStatus() {
    let timeout = 0;
    while ($('.alert.alert-info').length == 0 && timeout < 30) {  // Timeout 600ms
        timeout++;
        await new Promise(resolve => setTimeout(resolve, 20));
    }

    if ($('.alert.alert-info').length == 0) return false;
    return true;
}

function setInfoBox() {
    if ($('.alert.alert-info').length != 1) {
        $('#top-info').append('<div class="container"><div class="alert alert-info"></div></div>');
    }
}

function loadingMessage() {
    setInfoBox();
    $('.alert.alert-info').html('<p>レポート情報を取得中...</p>');
}

function warningMessage() {
    setInfoBox();
    $('.alert.alert-info').html('<p><b>レポートが<font color="red">提出されていません</font></b>．' +
        '<input type="button" id="reportpagebtn" value="マイレポート" class="btn btn-default" ' +
        'onclick="location.href=\'' + getReportPageUrl() + '\'">ページにてもう一度確認してください．</p>');
}

function errorMessage() {
    setInfoBox();
    $('.alert.alert-info').html('<p><b>未知の原因により，レポート情報の取得がタイムアウトになりました．</b>' +
        'レポートの提出状況は<input type="button" id="reportpagebtn" value="マイレポート" class="btn btn-default" ' +
        'onclick="location.href=\'' + getReportPageUrl() + '\'">ページにて確認できます．</p>');
}

function reportDetailMessage(reportName: string, reportTime: string, reportUrl: string) {
    setInfoBox();
    $('.alert.alert-info').html('<p>レポートが<b>' + reportTime + '</b>にて提出できました．' +
        '提出したレポートのファイル名は<b>' + reportName + '</b>です．</p>' +
        '<p>ファイルを<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default" ' +
        'onclick="location.href=\'' + reportUrl + '\'">し，内容を確認できます．</p>');
}