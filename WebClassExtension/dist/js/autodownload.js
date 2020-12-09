"use strict";
// Find each file's url except javascript
$('a').each(function (_, htmlelem) {
    var href = $(htmlelem).attr('href');
    var match = href === null || href === void 0 ? void 0 : href.match('javascript:window.close();');
    if (match == null)
        window.open(href);
});
window.close();
//# sourceMappingURL=autodownload.js.map