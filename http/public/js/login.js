'use strict';

var token;

$(document).ready(function() {
    if(getCookie('MailJS') != "" && !get.setup) {
        window.location.replace("app.html");
    }
    if(get.msg && get.info != 'true') {
        showLoginError(get.msg);
    }
	if(get.info == "true" && get.msg) {
		showInfo(get.msg);
	}
    if(get.setup == "true" && getCookie('MailJS')) {
        var request = $.ajax({
            type: 'GET',
            url: '/api/v1/user/current',
            dataType: 'json',
            cache: false,
            headers: {
    			'x-token': getCookie('MailJS')
    		}
        });
        request.done(function(data) {
            var user = data.user;
            setName(user.firstName+' '+user.lastName);
            showSetup();
        });
        request.fail(function(data) {
            $.removeCookie('MailJS', { path: '/' });
            showLogin();
        });
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
        console.log('etst');
        console.log(data);
        console.log('etst');
        if(data.needTFA == true) {
            token = data.token;
            setName(data.user.firstName + ' ' + data.user.lastName);
            showTFA();
        } else {
            //window.location.replace("app.html");
        }
    });
    request.fail(function(data) {
        if(data.status == 401) {
            showLoginError('Username/password incorrect!');
        } else if (data.status == 400) {
            showLoginError('Username/password not filled in!');
        } else {
            showLoginError(JSON.parse(data.responseText).error.message);
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
        window.location.replace("app.html");
    });
    request.fail(function(data) {
        if(data.status == 401) {
            showLogin();
        }
        var text = JSON.parse(data.responseText);
        if(text.error.name == 'EDONE') {
            window.location.replace("app.html");
        } else if(text.error.name == 'EINVALID') {
            show2faError('Code invalid!');
        } else {
            show2faError(text.error.message);
        }
    });
});

var showTFA = function () {
    $('#2fa-box').show();
    $('#login-box').hide();
    $('#setup-box').hide();
}

var showLogin = function () {
    $('#2fa-box').hide();
    $('#login-box').show();
    $('#setup-box').hide();
}

var showSetup = function () {
    $('#2fa-box').hide();
    $('#login-box').hide();
    $('#setup-box').show();
}

var setName = function (name) {
    $('.name').text(name);
}

var showLoginError = function showError(msg) {
    $("#loginErrorMsg").text(msg);
    $("#loginError").removeClass('hidden');
};

var show2faError = function showError(msg) {
    $("#TFAerrorMsg").text(msg);
    $("#TFAerror").removeClass('hidden');
};

var showSetupError = function showError(msg) {
    $("#setupErrorMsg").text(msg);
    $("#setupError").removeClass('hidden');
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
