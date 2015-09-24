'use strict';

app.controller("sessionsSettingsCtrl", function($rootScope, $scope, $http, user) {
    $rootScope.isLoading = true;
    $scope.sessions = [];
    var fetchSessions = function () {
        var req = {
            method: 'GET',
            url: '/api/v1/user/session',
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function(res) {
            $scope.sessions = res.data.session;
            $rootScope.isLoading = false;
        }, function(res) {
            notification.send('Internal Server Error', 'The server errored, please report this to your sysadmin.', 'error');
            $rootScope.isLoading = false;
        });
    }
    fetchSessions();
    $scope.reloadSessions = function () {
        fetchSessions();
    }
    $scope.getOS = function (ua) {
        var os = new UAParser().setUA(ua).getResult().os;
    }
    $scope.getBrowser = function (ua) {
        var browser = new UAParser().setUA(ua).getResult().browser;
        switch (browser.name) {
            case 'Chrome':
                return 'chrome';
                break;
            case 'Chromium':
                return 'chrome';
                break;
            case 'Android Browser':
                return 'android';
                break;
            case 'Firefox':
                return 'firefox';
                break;
            case 'Vivaldi':
                return 'vivaldi';
                break;
            default:
                return 'unknown';
        }
    }
});
