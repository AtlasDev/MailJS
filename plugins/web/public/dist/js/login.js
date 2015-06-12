'use strict';

$(document).ready(function() {
    if(typeof localStorage.jwt != 'undefined') {
        window.location.replace("app.html");
    }
    if(get.msg && get.info != true) {
        showInfo(get.msg);
    }
	if(get.info == true && get.msg) {
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
        if(typeof data.error !== 'undefined') {
            localStorage.setItem('jwt', data.jwt);
            window.location.replace("app.html");
        } else {
            showError(data.error);
        }
    });
    request.fail(function(data) {
        showError(JSON.parse(data.responseText).error);
    });
});

var showError = function showError(msg) {
    $("#errorMsg").replaceWith(msg);
    $("#error").removeClass('hidden');
};

var showInfo = function showInfo(msg) {
    $("#infoMsg").replaceWith(msg);
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