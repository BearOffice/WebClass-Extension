// Save the record to storage
function saveurl() {
    let value = $('#urltext').val() as string;
    let match = value.match('/webclass/login.php');
    if (match == null) {
        $("#resultlb").text('指定したリンクが無効です．');
    } else {
        $("#resultlb").text('設定が成功しました．');
        chrome.storage.sync.set({ url: value });
    }
}

$('#confirmbtn').on('click', saveurl);

// Initialize the record from storage
chrome.storage.sync.get(item => {
    $("#urltext").val(item.url);
});
