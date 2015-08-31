'use strict';

$(document).ready(function() {
    if(typeof localStorage.session != 'undefined') {
        window.location.replace("app.html");
    }
    if(get.msg && get.info != 'true') {
        showError(get.msg);
    }
	if(get.info == 'true' && get.msg) {
		showInfo(get.msg);
	}
});

$("form").submit(function(event) {
    event.preventDefault();
    var request = $.ajax({
        type: 'POST',
        url: '/api/v1/login',
        dataType: 'json',
        cache: false,
        data: {
			username: $("#username").val(),
			password: $("#password").val()
		}
    });
    request.done(function(data) {
        window.location.replace("app.html");
    });
    request.fail(function(data) {
        showError(JSON.parse(data.responseText).error.message);
    });
});

var showError = function showError(msg) {
    $("#errorMsg").text(msg);
    $("#error").removeClass('hidden');
};

var showInfo = function showInfo(msg) {
    $("#infoMsg").text(msg);
    $("#info").removeClass('hidden');
};

var get = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));
