app.factory('notification', function (toastr) {
    var notifyTimeout = localStorage.getItem('notifyTimeout') | 10000;
    var screenFocus = true;

    window.onfocus = function () {
        screenFocus = true;
    };
	window.onblur = function () {
        screenFocus = false;
	};

    if(localStorage.getItem('notification') == "true" || localStorage.getItem('notification') == "false") {
        localStorage.setItem('notifications', 'false');
    }
    if(localStorage.getItem('notifyTimeout') === null && typeof localStorage.getItem('notifyTimeout') === "object") {
        localStorage.setItem('notifyTimeout', '10000');
    }

    function hasAPI() {
        return ("Notification" in window);
    }

    function check() {
        if(("Notification" in window) && (Notification.permission === "granted") && (localStorage.getItem('notifications') == 'true')) {
            return true;
        } else {
            return false;
        }
    }

    function send(title, message, type, icon, callback) {
        if(message && message.length > 150) {
            message = message.substring(0,150)+"...";
        }
        if(type == 'success') {
            toastr.success(message, title);
        } else if(type == 'error') {
            toastr.error(message, title);
        } else {
            toastr.info(message, title);
        }
        if(typeof icon == "function") {
            callback = icon;
            icon = '/dist/img/favicon-96x96.png';
        }
        if(icon === null) {
            icon = '/dist/img/favicon-96x96.png';
        }
        if(check() === true && screenFocus === false) {
            var options = {
                  body: message,
                  icon: icon
            };
            var notification = new Notification(title, options);
            notification.onshow = function() {
                setTimeout(notification.close.bind(notification), notifyTimeout);
            };
            notification.onclick = function(x) {
                if(callback) {
                    callback();
                }
                window.focus();
                notification.close();
            };
            return true;
        } else {
            return false;
        }
    }

    function setNotiTimeout(timeout) {
        timeout = parseInt(timeout);
        if(timeout*1000 < 1) {
            localStorage.setItem('notifyTimeout', 1000);
            notifyTimeout = 1000;
            return 1;
        }
        localStorage.setItem('notifyTimeout', timeout*1000);
        notifyTimeout = timeout*1000;
        return timeout;
    }


    function askPermissions (originalState) {
        if(!("Notification" in window)) {
            return false;
        }
        if(originalState === true) {
            if((Notification.permission === "granted")) {
                localStorage.setItem('notifications', true);
                return true;
            } else {
                Notification.requestPermission(function (perm) {
                    if (perm === "granted") {
                        localStorage.setItem('notifications', true);
                        var options = {
                              body: 'The notification system works! You will get a notification everytime you get a new E-mail. You can always disable it in the settings if it gets annoying.',
                              icon: '/dist/img/favicon-96x96.png'
                        };
                        var notification = new Notification('Awesome!', options);
                        setTimeout(notification.close.bind(notification), 10000);
                        notification.onclick = function(x) {
                            window.focus();
                            notification.close();
                        };
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        } else {
            localStorage.setItem('notifications', false);
            return false;
        }
    }

    return {
        send: send,
        check: check,
        setNotiTimeout: setNotiTimeout,
        hasAPI: hasAPI,
        askPermissions: askPermissions,
        notifyTimeout: notifyTimeout
    };
});
