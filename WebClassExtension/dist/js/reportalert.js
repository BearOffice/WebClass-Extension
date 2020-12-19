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
            reportAlert();
    });
});
function reportAlert() {
    return __awaiter(this, void 0, void 0, function () {
        var errtrigger, onetime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errtrigger = new TimeTrigger(3000);
                    return [4 /*yield*/, monitorLoadingStatus()];
                case 1:
                    // Monitor if the infobox exists
                    if ((_a.sent()) == true) {
                        loadingMessage();
                    }
                    else {
                        if (lightCheck() == false) {
                            warningMessage();
                            return [2 /*return*/];
                        }
                    }
                    // Pull error trigger
                    errtrigger.timeCheck(errorMessage);
                    // Create an invisible temp container for reading mail contents
                    $('body').append('<iframe class="extmail" style="visibility:hidden;width:0;height:0;border:none;" ' +
                        'src="' + getMailUrl() + '"></iframe>');
                    onetime = true;
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
                        DeepCheck().then(function (result) {
                            if (result == false) {
                                $('.extmail').remove();
                                $('.extmail').off();
                                errtrigger.clearTimeCheck();
                                warningMessage();
                                return;
                            }
                            readMail();
                            errtrigger.clearTimeCheck();
                            reportDetailMessage();
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// -------- Check if the report is uploaded successfully(light way) --------
function lightCheck() {
    // Check unread mail's counts
    if (unreadCount() == 0)
        return false;
    return true;
}
// -------- Check if the report is uploaded successfully(deep way) --------
function DeepCheck() {
    return __awaiter(this, void 0, void 0, function () {
        var resolve, mailelem, mailtitle, mailtime, regex, maildatetime, reportdatetime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getReportDetails()];
                case 1:
                    resolve = _a.sent();
                    reportUrl = resolve[0];
                    reportName = resolve[1];
                    reportTime = resolve[2];
                    mailelem = $('.extmail').contents().find('#MsgListTable td[nowrap]');
                    mailtitle = $('span', mailelem.eq(2)).text();
                    mailtime = $('span', mailelem.eq(4)).text();
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
function getReportPageUrl() {
    var _a;
    var regex = new RegExp('(.*?/webclass/course.php/.*?/).*');
    return ((_a = location.href.match(regex)) === null || _a === void 0 ? void 0 : _a[1]) + 'my-reports';
}
function getMailUrl() {
    var _a;
    var regex = new RegExp('(.*?)/webclass/');
    return ((_a = location.href.match(regex)) === null || _a === void 0 ? void 0 : _a[1]) + '/webclass/msg_editor.php?msgappmode=inbox';
}
function getReportDetails() {
    // Get report's url synchronously
    return new Promise(function (resolve) {
        var reportpageurl = getReportPageUrl();
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
function readMail() {
    // Read the first mail
    var mailframe = $('.extmail').contents();
    mailframe.find('input[name="id[0]"]').trigger("click");
    setTimeout(function () {
        mailframe.find('input[name="UNSET_UNREADFLAG"]').trigger("click");
    }, 20);
    // Change unread pop
    var count = unreadCount() - 1;
    var value = '';
    if (count > 1)
        value = count.toString();
    $('#js-unread-message-count').text(value);
}
function monitorLoadingStatus() {
    return __awaiter(this, void 0, void 0, function () {
        var timeout;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timeout = 0;
                    _a.label = 1;
                case 1:
                    if (!($('.alert.alert-info').length == 0 && timeout < 30)) return [3 /*break*/, 3];
                    timeout++;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 20); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    if ($('.alert.alert-info').length == 0)
                        return [2 /*return*/, false];
                    return [2 /*return*/, true];
            }
        });
    });
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
function reportDetailMessage() {
    setInfoBox();
    $('.alert.alert-info').html('<p>レポートが<b>' + reportTime + '</b>にて提出できました．' +
        '提出したレポートのファイル名は<b>' + reportName + '</b>です．</p>' +
        '<p>ファイルを<input type="button" id="downloadbtn" value="ダウンロード" class="btn btn-default" ' +
        'onclick="location.href=\'' + reportUrl + '\'">し，内容を確認できます．</p>');
}
//# sourceMappingURL=reportalert.js.map