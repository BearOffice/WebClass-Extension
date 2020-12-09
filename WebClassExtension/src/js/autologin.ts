// Inject this script (by using content_scripts) directly to '/webclass/login.php' will not work.
// During the login process, the login page will refresh or redirect to itself one or two times.
// If using content_scripts, this script will load during the login process unexpectedly
// and cause an infinite loop.
// Sending message to background to assure this script only be injected one time will not work too.
// chrome.runtime.sendMessage will also interrupt the login process.
$(() => {
    let loginjs = '<script>var autologin = $("<div class=\'loginFeedback\'><p>自動ログイン中です。 <img src=\'./images/loading.gif\' /></p></div>");'
        + '$.overlay({object: autologin}); $.showOverlay({ speed: 150, callback: function(){} });'
        + 'setTimeout(function(){$(document.login).trigger("submit")},200);<\/script>';

    $('body').append(loginjs);
});