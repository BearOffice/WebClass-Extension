// The script must be execute after all frames loaded
$(window).on('load', () => {
    let isexist = $('frame[name="answer"]').contents().find('input[name="report_upload"]').length;
    if (isexist != 0)
        chrome.runtime.sendMessage({ type: 'report' });
});