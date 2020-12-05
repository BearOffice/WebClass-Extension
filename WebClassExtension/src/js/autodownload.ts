// Find each file href except javascript
$('a').each((_, htmlelem) => {
    let href = $(htmlelem).attr('href');
    let match = href?.match('javascript:window.close();');
    if (match == null) window.open(href);
});
window.close();