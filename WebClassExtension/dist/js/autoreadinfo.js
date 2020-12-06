"use strict";
$('.pager').append('<li>このページのすべてのお知らせを<input type="button" id="rbtn" value="既読にする"></li>');
$('#rbtn').on('click', function () {
    var inject = '';
    var number = 0;
    $('.info-list a').each(function (_, htmlelem) {
        var href = $(htmlelem).attr('href');
        if (href) {
            // Create an invisible temp container
            inject += '<iframe class="ext" style="visibility:hidden;width:0;height:0;border:none;" ' +
                'src="' + href + '"></iframe>';
            number++;
        }
    });
    $('body').append(inject);
    // Make sure that all url have been opened
    var count = 0;
    $('.ext').on('load', function () {
        count++;
        if (count == number) {
            $('.ext').remove();
            $('.ext').off();
            alert("このページのすべてのお知らせを既読にしました!");
        }
    });
});
//# sourceMappingURL=autoreadinfo.js.map