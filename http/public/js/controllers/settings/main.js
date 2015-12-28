(function () {
'use strict';

app.controller("mainSettingsCtrl", function($scope, $rootScope, $translate, $http, $window, notification, user, $cookies) {
    $rootScope.isLoading = false;
    $scope.lang = $translate.use();
    $scope.notifyTimeout = parseInt(notification.notifyTimeout/1000);
    $scope.hasAPI = notification.hasAPI;
    $scope.notifyToggle = notification.check();

    $scope.changeLanguage = function changeLanguage() {
        $translate.use($scope.lang);
    };
    $scope.updateTimeout = function () {
        var newTimeout = notification.setTimeout($scope.notifyTimeout);
        if(newTimeout !== false) {
            $scope.notifyTimeout = newTimeout;
        }
    };
    $scope.askPerms = function () {
        $scope.notifyToggle = notification.askPermissions($scope.notifyToggle);
    };
    $scope.checkVerify = function () {
        if($scope.verifyCode.length == 7) {
            $rootScope.isLoading = true;
            var code = $scope.verifyCode.replace('-', "");
            if(user.getUser().tfa === true) {
                var req = {
                    method: 'DELETE',
                    url: '/api/v1/2fa',
                    headers: {
                        'x-token': user.sessionID,
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: {
                        'code': code
                    }
                };
                $http(req).then(function(res) {
                    $cookies.remove('MailJS');
                    $window.location.href = '/index.html?msg=2FA%20successfull%20disabled!%20Please%20login%20again.&info=true';
                    return;
                }, function(res) {
                    $rootScope.isLoading = false;
                    if(res.status == 400) {
                        notification.send('Invalid Code', 'The given code was invalid, please try again.', 'error');
                    } else {
                        notification.send('Internal Server Error', 'The server errored, please report this to your sysadmin.', 'error');
                    }
                });
            } else {
                $http({
                    method: 'POST',
                    url: '/api/v1/2fa',
                    headers: {
                        'x-token': user.sessionID
                    },
                    data: {
                        'code': code
                    }
                }).then(function(res) {
                    $cookies.remove('MailJS');
                    $window.location.href = '/index.html?msg=2FA%20successfull%20enabled!%20Please%20login%20again.&info=true';
                    return;
                }, function(res) {
                    $rootScope.isLoading = false;
                    if(res.status == 400) {
                        notification.send('Invalid Code', 'The given code was invalid, please try again.', 'error');
                    } else {
                        notification.send('Internal Server Error', 'The server errored, please report this to your sysadmin.', 'error');
                    }
                });
            }
        }
    };
    $scope.sendTransfer = function () {
        if(!$scope.transferCode || $scope.transferCode === "") {
            notification.send('Invalid code', 'Fill in a valid code to proceed.', 'error');
            return;
        }
        if(!($scope.transferCode.length == 15 || $scope.transferCode.length == 18 ||  $scope.transferCode.length == 20)) {
            notification.send('Invalid code', 'Fill in a valid code to proceed.', 'error');
            return;
        }
        $http({
            method: 'POST',
            url: '/api/v1/transfer',
            headers: {
                'x-token': user.sessionID
            },
            data: {
                'code': $scope.transferCode
            }
        }).then(function(res) {
            console.log(res);
        }, function(res) {
            if(res.data.error.message) {
                notification.send('Could not use transfer code', res.data.error.message, 'error');
                return;
            } else {
                notification.send('Could not use transfer code', 'Internal Server Error', 'error');
                return;
            }
        });
    };

    var loadTFA = function () {
        if(user.getUser().tfa === false) {
            $rootScope.isLoading = true;
            $http({
                method: 'GET',
                url: '/api/v1/2fa',
                headers: {
                    'x-token': user.sessionID
                }
            }).then(function(res) {
                $rootScope.isLoading = false;
                $scope.QRdata = res.data.uri;
                $scope.key = res.data.key;
            }, function(res) {
                if(res.status == 401) {
                    $cookies.remove('MailJS');
                    $window.location.href = '/index.html?msg=Token%20invalid.';
                    return;
                } else {
                    rootScope.isLoading = false;
                    notification.send('Internal Server Error', 'The server errored, please report this to your sysadmin.', 'error');
                }
            });
        }
    };
    if(typeof user.getUser()._id == "undefined") {
        $rootScope.$on('userLoaded', function () {
            loadTFA();
        });
    } else {
        loadTFA();
    }
});
}());
