"use strict";
$(window).on('load', function () {
    chrome.runtime.sendMessage({ type: 'hasreport' }, function (response) {
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
    var onetime = true;
    $('.extmail').on('load', function () {
        // The second load event is fired by ('input[name="UNSET_UNREADFLAG"]').trigger("click")
        if (onetime == false) {
            $('.extmail').remove();
            $('.extmail').off();
            embedMessage();
            return;
        }
        onetime = false;
        var mailframe = $('.extmail').contents();
        var result = checkMainContents();
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
    var mailframe = $('.extmail').contents();
    var htmlelem = mailframe.find('#MsgListTable td[nowrap]').eq(2);
    var title = $('span', htmlelem).text();
    // Check title
    if (title.match(/レポートを受け取りました/) == null)
        return false;
    // [Deprecated] Check time
    //let date = Date.parse('20' + datetime + ':00');  // While datetime's format is '20/10/12 09:30'
    //if ((Date.now() - date) / (1000 * 60) > 3) return false;
    // Check unread
    var value = $('#js-unread-message-count').text();
    if (value == '')
        return false;
    return true;
}
function changeUnreadPop() {
    // The value of unread-message popup
    var value = $('#js-unread-message-count').text();
    var count = parseInt(value) - 1;
    if (count <= 0)
        value = "";
    else
        value = count.toString();
    $('#js-unread-message-count').text(value);
}
function embedMessage() {
    changeUnreadPop();
    $('#top-info').empty();
    getReportUrl().then(function (resolve) {
        var rtuple = resolve;
        var fileurl = rtuple[0];
        var filename = rtuple[1];
        $('#top-info').append('<div class="container"><div class="alert alert-info">' +
            '<p>レポートがうまく提出できたようです．提出したレポートのファイル名は<b>' + filename + '</b>です．</p>' +
            '<p>ファイルを<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default" ' +
            'onclick="location.href=\'' + fileurl + '\'">し，内容を確認できます．</p></div></div>');
    });
}
function getReportUrl() {
    // Get report's url synchronously
    return new Promise(function (resolve) {
        var _a;
        var regex = new RegExp('(.*?/webclass/course.php/.*?/).*');
        var reportpageurl = ((_a = location.href.match(regex)) === null || _a === void 0 ? void 0 : _a[1]) + 'my-reports';
        // Create an invisible temp container
        $('body').append('<iframe class="extrepo" style="visibility:hidden;width:0;height:0;border:none;" ' +
            'src="' + reportpageurl + '"></iframe>');
        $('.extrepo').on('load', function () {
            var reportframe = $('.extrepo').contents();
            var fileurl = reportframe.find('tbody a').attr('href');
            var filename = reportframe.find('tbody a[href="' + fileurl + '"]').text();
            $('.extrepo').remove();
            $('.extrepo').off();
            var domain = getWebClassDomain(location.href);
            if (fileurl != undefined && domain != undefined && filename != undefined)
                resolve([domain + fileurl, filename]);
            else
                resolve(['', '']);
        });
    });
}
//# sourceMappingURL=reportalert.js.map