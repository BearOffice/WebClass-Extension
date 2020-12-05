"use strict";
$("body").append('<p>Test</p>');
$('body p').hide();
$('.info-list a').each(function (_, htmlelem) {
    var href = $(htmlelem).attr('href');
    if (href)
        $('body p').load(href);
});
// window.close()
//# sourceMappingURL=autoreadinfo.js.map