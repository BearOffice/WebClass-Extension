$(window).on('load', () => {
    chrome.runtime.sendMessage({ type: 'hasreport' }, response => {
        if (response.has == true) {
            runReportAlert();
        }
    });
});

function getMailUrl() {
    return getWebClassDomain(location.href) + '/webclass/msg_editor.php?msgappmode=inbox';
}

function runReportAlert() {
    // Create an invisible temp container
    $('body').append('<iframe class="extmail" style="visibility:hidden;width:0;height:0;border:none;" ' +
        'src="' + getMailUrl() + '"></iframe>');

    // Limit load event's run times
    let onetime = true;
    $('.extmail').on('load', () => {
        // The second load event is fired by ('input[name="UNSET_UNREADFLAG"]').trigger("click")
        if (onetime == false) {
            $('.extmail').remove();
            $('.extmail').off();

            embedMessage();
            return;
        }
        onetime = false;

        let mailframe = $('.extmail').contents();

        let result = checkMainContents();
        if (result == false) {
            $('.extmail').remove();
            $('.extmail').off();
            alert('レポートがうまく提出されていないようです．ご確認ください．');
            return;
        }

        // Read the first mail
        mailframe.find('input[name="id[0]"]').trigger("click");
        mailframe.find('input[name="UNSET_UNREADFLAG"]').trigger("click");
    });
}

function checkMainContents() {
    let mailframe = $('.extmail').contents();

    let htmlelem = mailframe.find('#MsgListTable td[nowrap]').eq(2);
    let title = $('span', htmlelem).text();

    // Check title
    if (title.match(/レポートを受け取りました/) == null) return false;

    // [Deprecated] Check time
    //let date = Date.parse('20' + datetime + ':00');  // While datetime's format is '20/10/12 09:30'
    //if ((Date.now() - date) / (1000 * 60) > 3) return false;

    // Check unread
    let value = $('#js-unread-message-count').text();
    if (value == '') return false;

    return true;
}

function changeUnreadPop() {
    // The value of unread-message popup
    let value = $('#js-unread-message-count').text();
    let count = parseInt(value) - 1;
    if (count <= 0)
        value = "";
    else
        value = count.toString();

    $('#js-unread-message-count').text(value);
}

function embedMessage() {
    changeUnreadPop();

    $('#top-info').empty();

    getReportUrl().then(resolve => {
        let rtuple = resolve as [string, string];
        let fileurl = rtuple[0];
        let filename = rtuple[1];
        $('#top-info').append('<div class="container"><div class="alert alert-info">' +
            '<p>レポートがうまく提出できたようです．提出したレポートのファイル名は<b>' + filename + '</b>です．</p>' +
            '<p>ファイルを<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default" ' +
            'onclick="location.href=\'' + fileurl + '\'">し，内容を確認できます．</p></div></div>');
    });
}

function getReportUrl() {
    // Get report's url synchronously
    return new Promise(resolve => {
        let regex = new RegExp('(.*?/webclass/course.php/.*?/).*');
        let reportpageurl = location.href.match(regex)?.[1] + 'my-reports';

        // Create an invisible temp container
        $('body').append('<iframe class="extrepo" style="visibility:hidden;width:0;height:0;border:none;" ' +
            'src="' + reportpageurl + '"></iframe>');

        $('.extrepo').on('load', () => {
            let reportframe = $('.extrepo').contents();
            let fileurl = reportframe.find('tbody a').attr('href');
            let filename = reportframe.find('tbody a[href="' + fileurl + '"]').text();
            $('.extrepo').remove();
            $('.extrepo').off();

            let domain = getWebClassDomain(location.href);
            if (fileurl != undefined && domain != undefined && filename != undefined)
                resolve([domain + fileurl, filename]);
            else
                resolve(['', '']);
        });
    });
}