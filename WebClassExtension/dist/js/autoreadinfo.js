"use strict";
// Create a temp container
$("body").append('<p></p>');
$('body p').hide();
// Open every url 
$('.info-list a').each(function (_, htmlelem) {
    var href = $(htmlelem).attr('href');
    if (href)
        $('body p').load(href);
});
$('body p').empty();
alert('Succeeded!');
//# sourceMappingURL=autoreadinfo.js.map