"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var reportName = '';
var reportUrl = '';
var reportTime = '';
$(window).on('load', function () {
    chrome.runtime.sendMessage({ type: 'reportstatus' }, function (response) {
        if (response.has == true)
            runReportAlert();
    });
});
function getMailUrl() {
    var _a;
    var regex = new RegExp('(.*?)/webclass/');
    return ((_a = location.href.match(regex)) === null || _a === void 0 ? void 0 : _a[1]) + '/webclass/msg_editor.php?msgappmode=inbox';
}
function runReportAlert() {
    // Create an invisible temp container
    $('body').append('<iframe class="extmail" style="visibility:hidden;width:0;height:0;border:none;" ' +
        'src="' + getMailUrl() + '"></iframe>');
    // Limit load event's run times
    var onetime = true;
    $('.extmail').on('load', function () {
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
        checkReport().then(function (result) {
            if (result == false) {
                $('.extmail').remove();
                $('.extmail').off();
                alert('レポートが提出されていないようです．「成績」➝「レポート」からもう一度確認してください．');
                return;
            }
            // Read the first mail
            var mailframe = $('.extmail').contents();
            mailframe.find('input[name="id[0]"]').trigger("click");
            setTimeout(function () {
                mailframe.find('input[name="UNSET_UNREADFLAG"]').trigger("click");
            }, 20);
            embedMessage();
        });
    });
}
function checkReport() {
    return __awaiter(this, void 0, void 0, function () {
        var resolve, mailelem, mailtitle, mailtime, regex, maildatetime, reportdatetime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getReportUrl()];
                case 1:
                    resolve = _a.sent();
                    reportUrl = resolve[0];
                    reportName = resolve[1];
                    reportTime = resolve[2];
                    mailelem = $('.extmail').contents().find('#MsgListTable td[nowrap]');
                    mailtitle = $('span', mailelem.eq(2)).text();
                    mailtime = $('span', mailelem.eq(4)).text();
                    // Check unread mail's counts
                    if (unreadCount() == 0)
                        return [2 /*return*/, false];
                    // Confirm title contains the following key words
                    if (mailtitle.match(/レポートを受け取りました/) == null)
                        return [2 /*return*/, false];
                    regex = new RegExp(reportName);
                    if (mailtitle.match(regex) == null)
                        return [2 /*return*/, false];
                    maildatetime = Date.parse('20' + mailtime + ':00');
                    reportdatetime = Date.parse(reportTime);
                    if ((maildatetime - reportdatetime) / (1000 * 60) > 3)
                        return [2 /*return*/, false];
                    if ((Date.now() - maildatetime) / (1000 * 60) > 10)
                        return [2 /*return*/, false];
                    return [2 /*return*/, true];
            }
        });
    });
}
function unreadCount() {
    var value = $('#js-unread-message-count').text();
    if (value == '')
        value = '0';
    return parseInt(value);
}
function embedMessage() {
    // Change unread pop
    var count = unreadCount() - 1;
    var value = '';
    if (count > 1)
        value = count.toString();
    $('#js-unread-message-count').text(value);
    $('#top-info').empty();
    $('#top-info').append('<div class="container"><div class="alert alert-info">' +
        '<p>レポートが<b>' + reportTime + '</b>にて提出できました．' +
        '提出したレポートのファイル名は<b>' + reportName + '</b>です．</p>' +
        '<p>ファイルを<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default" ' +
        'onclick="location.href=\'' + reportUrl + '\'">し，内容を確認できます．</p></div></div>');
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
            var _a;
            var reportelem = $('.extrepo').contents().find('tbody td');
            var reporturl = $('a', reportelem.eq(2)).attr('href');
            var reportname = $('a', reportelem.eq(2)).text();
            var reporttime = reportelem.eq(5).text();
            $('.extrepo').remove();
            $('.extrepo').off();
            var regex = new RegExp('(.*?)/webclass/');
            var domain = (_a = location.href.match(regex)) === null || _a === void 0 ? void 0 : _a[1];
            if (reporturl != undefined && domain != undefined && reportname != undefined)
                resolve([domain + reporturl, reportname, reporttime]);
            else
                resolve(['', '', '']);
        });
    });
}
//# sourceMappingURL=reportalert.js.map