$('frame[name="answer"]').on('load', () => {
    let isexist = $('frame[name="answer"]').contents().find('input[name="report_upload"]').length;
    if (isexist != 0)
        chrome.runtime.sendMessage({ type: 'reportfinded' });
});