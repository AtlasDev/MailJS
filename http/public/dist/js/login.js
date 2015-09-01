'use strict';

$(document).ready(function() {
    if(getCookie('session') != "") {
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
        setCookie('session', data.token, 1);
        window.location.replace("app.html");
    });
    request.fail(function(data) {
        if(data.status == 401) {
            showError('Username/password incorrect!');
        } else if (data.status == 400) {
            showError('Username/password not filled in!');
        } else {
            showError(JSON.parse(data.responseText).error.message);
        }
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

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
