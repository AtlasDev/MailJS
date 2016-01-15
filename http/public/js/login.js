(function () {
'use strict';

var token;
var user = {};
var domains = [];
var canCreate;

$(document).ready(function() {
    if(get.msg && get.info != 'true') {
        showLoginError(get.msg);
    }
	if(get.info == "true" && get.msg) {
		showInfo(get.msg);
	}
    if(get.setup == "true" && Cookies.get('MailJS')) {
        var request = $.ajax({
            type: 'GET',
            url: '/api/v1/user/current',
            dataType: 'json',
            cache: false,
            headers: {
    			'x-token': Cookies.get('MailJS')
    		}
        });
        request.done(function(data) {
            user = data.user;
            showSetup();
        });
        request.fail(function(data) {
            Cookies.remove('MailJS');
            showLogin();
        });
    } else if(Cookies.get('MailJS')) {
        window.location.replace("app.html");
    }
});

$(".logout").click(function() {
    var request = $.ajax({
        type: 'DELETE',
        url: '/api/v1/login',
        dataType: 'json',
        cache: false
    });
    request.done(function(data) {
        Cookies.remove('MailJS');
        showLogin();
    });
    request.fail(function(data) {
        Cookies.remove('MailJS');
        showLogin();
    });
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
        if(data.needTFA === true) {
            token = data.token;
            setName(data.user.firstName + ' ' + data.user.lastName);
            showTFA();
        } else {
            if(data.user.mailboxes.length === 0) {
                user = data.user;
                showSetup();
            } else {
                window.location.replace("app.html");
            }
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

$("#setupCreate").submit(function(event) {
    event.preventDefault();
    var local = $("#localCreate").val();
    var domain = $("#domainCreate").val();
    var title = $("#titleCreate").val();
    if(local === "") {
        return showSetupError('Please fill in a local part.');
    }
    if(title === "") {
        return showSetupError('Please fill in a mailbox title.');
    }
    if(domain === "") {
        return showSetupError('Please select a domain.');
    }
    var request = $.ajax({
        type: 'POST',
        url: '/api/v1/mailbox',
        dataType: 'json',
        cache: false,
        headers: {
            'x-token': Cookies.get('MailJS')
        },
        data: {
            'local': local,
            'domain': domain,
            'title': title
        }
    });
    request.done(function(data) {
        window.location.replace("app.html");
    });
    request.fail(function(data) {
        showSetupError(JSON.parse(data.responseText).error.message);
    });
});

$("#setupTransfer").submit(function(event) {
    event.preventDefault();
    var code = $("#transferCode").val();
    if(!(code.length == 18 || code.length == 20)) {
        showSetupError('Code must be a mailbox transfer code OR an domain transfer code.');
        return;
    }
    var type = (code.length == 18) ? 2 : 3;
    var request = $.ajax({
        type: 'POST',
        url: '/api/v1/transfer',
        dataType: 'json',
        cache: false,
        headers: {
            'x-token': Cookies.get('MailJS')
        },
        data: {
            'code': code,
            'type': type
        }
    });
    request.done(function(data) {
        if(type == 2) {
            window.location.replace("app.html");
            return;
        }
        $('#domainCreate')
            .append($("<option></option>")
            .attr("value",data.object._id)
            .text(data.object.domain));
        showSetupInfo('Domain added, you can now use it!');
    });
    request.fail(function(data) {
        showSetupError(JSON.parse(data.responseText).error.message);
    });
});

var showTFA = function () {
    $('#2fa-box').show();
    $('#login-box').hide();
    $('#setup-box').hide();
};

var showLogin = function () {
    $('#2fa-box').hide();
    $('#login-box').show();
    $('#setup-box').hide();
};

var showSetup = function () {
    setName(user.firstName+' '+user.lastName);
    var request = $.ajax({
        type: 'GET',
        url: '/api/v1/domain',
        dataType: 'json',
        cache: false,
        headers: {
            'x-token': Cookies.get('MailJS')
        }
    });
    request.done(function(data) {
        $.each(data.domains, function(key, value) {
            $('#domainCreate')
                .append($("<option></option>")
                .attr("value",value._id)
                .text(value.domain));
        });
        $('#setupCreate').show();
    });
    request.fail(function(data) {
        user = {};
        showLogin();
    });
    $('#2fa-box').hide();
    $('#login-box').hide();
    $('#setup-box').show();
};

var setName = function (name) {
    $(".name").each(function( index ) {
        $(this).text(name);
    });
};

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

var showSetupInfo = function showInfo(msg) {
    $("#infoSetupMsg").text(msg);
    $("#infoSetup").removeClass('hidden');
};

var get = (function(a) {
    if (a === "") return {};
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
}());
