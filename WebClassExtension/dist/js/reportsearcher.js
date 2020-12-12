"use strict";
// The script must be execute after all frames loaded
$(window).on('load', function () {
    $('frame[name="answer"]').on('load', function () {
        var isexist = $('frame[name="answer"]').contents().find('#submitReportreport').length;
        if (isexist != 0)
            chrome.runtime.sendMessage({ type: 'findreport' });
    });
});
//# sourceMappingURL=reportsearcher.js.map