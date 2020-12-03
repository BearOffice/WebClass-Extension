"use strict";
$(document).ready(function () {
    var loginjs = '<script>var autologin = $("<div class=\'loginFeedback\'><p>自動ログイン中です。 <img src=\'./images/loading.gif\' /></p></div>");'
        + '$.overlay({object: autologin}); $.showOverlay({ speed: 150, callback: function(){} });'
        + '$(document.login).submit();<\/script>';
    $("body").append(loginjs);
});
//# sourceMappingURL=autologin.js.map