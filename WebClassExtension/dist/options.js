"use strict";
// Save the record to storage
function saveurl() {
    var value = $('#urltext').val();
    var match = value.match('/webclass/login.php');
    if (match == null) {
        $("#resultlb").text('指定したリンクが無効です．');
    }
    else {
        $("#resultlb").text('設定が成功しました．');
        chrome.storage.sync.set({ url: value });
    }
}
$('#confirmbtn').on('click', saveurl);
// Initialize the record from storage
chrome.storage.sync.get(function (item) {
    $("#urltext").val(item.url);
});
//# sourceMappingURL=options.js.map