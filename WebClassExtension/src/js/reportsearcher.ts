// The script must be execute after all frames loaded
$(window).on('load', () => {
    $('frame[name="answer"]').on('load',()=>{
        let isexist = $('frame[name="answer"]').contents().find('#submitReportreport').length;
        if (isexist != 0)
            chrome.runtime.sendMessage({ type: 'findreport' });
    });
});