'use strict';

app.controller("mainSettingsCtrl", function($scope, $rootScope, $translate, $http) {
    $rootScope.isLoading = false;
    $scope.notifyToggle = $scope.checkNotify();
    $scope.hasNotiApi = ("Notification" in window);
    $scope.notifyTimeout = parseInt(localStorage.getItem('notifyTimeout'))/1000;
    $scope.lang = $translate.use();
    $scope.TFAactivated = false;
    $scope.changeLanguage = function changeLanguage() {
        $translate.use($scope.lang);
    };
    $scope.askPerms = function () {
        if(!("Notification" in window)) {
            $scope.notifyToggle = false;
        }
        if($scope.notifyToggle == true) {
            if((Notification.permission === "granted")) {
                $scope.notifyToggle = true;
                localStorage.setItem('notifications', true);
            } else {
                Notification.requestPermission(function (perm) {
                    if (perm === "granted") {
                        localStorage.setItem('notifications', true);
                        $scope.notifyToggle = true;
                        $scope.notifyTimeout = 1000;
                        var options = {
                              body: 'The notification system works! You will get a notification everytime you get a new E-mail. You can always disable it in the settings if it gets annoying.',
                              icon: '/favicon-96x96.png'
                        }
                        var notification = new Notification('Awesome!', options);
                        setTimeout(notification.close.bind(notification), 10000);
                        notification.onclick = function(x) {
                            window.focus();
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
    $scope.updateTimeout = function () {
        localStorage.setItem('notifyTimeout', Math.round($scope.notifyTimeout*1000));
    }
    $scope.checkVerify = function () {
        if($scope.verifyCode.length == 9) {
            //$rootScope.isLoading = true;
        }
    }
    $scope.loadTFA = function () {
        $http({
            method: 'GET',
            url: '/api/v1/2fa',
            headers: {
                'x-token': $scope.sid
            }
        }).then(function(res) {
            $scope.isLoading = false;
            $scope.TFAactivated = false;
            $scope.QRdata = res.data.uri
            $scope.key = res.data.key
        }, function(res) {
            if(res.status == 401) {
                $cookies.remove('MailJS');
                return $window.location.href = '/index.html?msg=Token%20invalid.';
            } else if(res.status == 400) {
                $scope.TFAactivated = true;
            } else {
                $scope.sendNotification('Internal Server Error', 'The server errored, please report this to your sysadmin.', 'error');
            }
        });
    }
    if($scope.sid) {
        $scope.loadTFA;
    } else {
        $rootScope.$on('tokenLoaded', function() {
            $scope.loadTFA();
        });
    }
});
