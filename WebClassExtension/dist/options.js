"use strict";
// Save the record to storage
function saveurl() {
    var value = $('#urltext').val();
    chrome.storage.sync.set({ url: value });
    $("#resultlb").text('設定が成功しました．');
}
// Bind click event
$('#confirmbtn').on('click', saveurl);
// Initialize the record from storage
chrome.storage.sync.get(function (item) {
    $("#urltext").val(item.url);
});
//# sourceMappingURL=options.js.map