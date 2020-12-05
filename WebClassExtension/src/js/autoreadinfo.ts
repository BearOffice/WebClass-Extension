// Create a temp container
$("body").append('<p></p>');
$('body p').hide();

// Open every url 
$('.info-list a').each((_, htmlelem) => {
    let href = $(htmlelem).attr('href');
    if(href) $('body p').load(href);
});
$('body p').empty();
alert('Succeeded!');