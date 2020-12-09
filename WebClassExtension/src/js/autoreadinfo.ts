$('.pager').append('<li>このページのすべてのお知らせを<input type="button" id="rbtn" value="既読にする"></li>');

$('#rbtn').on('click', () => {
    let inject = '';
    let number = 0;

    $('.info-list a').each((_, htmlelem) => {
        let href = $(htmlelem).attr('href');
        if (href) {
            // Create an invisible temp container
            inject += '<iframe class="ext" style="visibility:hidden;width:0;height:0;border:none;" ' +
                'src="'+ href + '"></iframe>';
            number++;
        }
    });
    $('body').append(inject);

    // Make sure that all url have been opened
    let count = 0;
    $('.ext').on('load', () => {
        count++;
        if (count == number) {
            $('.ext').remove();
            $('.ext').off();
            alert("このページのすべてのお知らせを既読にしました!");
            location.reload();
        }
    });
});