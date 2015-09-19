'use strict';

var token;

$(document).ready(function() {
    if(getCookie('MailJS') != "") {
        window.location.replace("app.html");
    }
    if(get.msg && get.info != 'true') {
        showError(get.msg);
    }
	if(get.info == 'true' && get.msg) {
		showInfo(get.msg);
	}
});

$("#login").submit(function(event) {
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
        console.log(data);
        if(data.needTFA != true) {
            token = data.token;
            setName(data.user.firstName + ' ' + data.user.lastName);
            showTFA();
        } else {
            window.location.replace("app.html");
        }
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

$("#2fa").submit(function(event) {
    event.preventDefault();
    var request = $.ajax({
        type: 'PATCH',
        url: '/api/v1/login',
        dataType: 'json',
        cache: false,
        headers: {
            "x-token": token
        },
        data: {
			code: $("#code").val()
		}
    });
    request.done(function(data) {
        if(data.needTFA != true) {
            setName(data.user.firstName + ' ' + data.user.lastName);
            showTFA();
        } else {
            window.location.replace("app.html");
        }
    });
    request.fail(function(data) {
        if(data.status == 401) {
            showLogin();
        }
        var text = JSON.parse(data.responseText);
        if(text.error.name == 'EDONE') {
            window.location.replace("app.html");
        } else if(text.error.name == 'EINVALID') {
            showError('Code invalid!');
        } else {
            showError(text.error.message);
        }
    });
});

var showTFA = function () {
    $('#login-box').hide();
    $('#2fa-box').show();
}

var showLogin = function () {
    $('#2fa-box').hide();
    $('#login-box').show();
}

var setName = function (name) {
    $('#name').text(name);
}

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
