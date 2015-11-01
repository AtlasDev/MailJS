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
        switch (os.name) {
            case 'Windows':
                switch (os.version) {
                    case '7':
                        return 'win7';
                        break;
                    case ('10' | '8'):
                        return 'win10';
                        break;
                    default:
                        return 'win';
                }
                break;
            case 'Debian':
                return 'debian';
                break;
            case 'Android':
                return 'android';
                break;
            case 'Ubuntu':
                return 'ubuntu';
                break;
            case 'Linux':
                return 'linux';
                break;
            case 'iOS':
                return 'ios';
                break;
            case 'Mac OS':
                return 'ios';
                break;
            case ('Fedora' || 'Arch' || 'CentOS' || 'Gentoo' || 'Mint'):
                return 'linux';
                break;
            default:
                return 'unknown';
        }
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
            case 'Edge':
                return 'edge';
                break;
            case 'IE':
                return 'ie';
                break;
            default:
                return 'unknown';
        }
    }
    $scope.killSession = function (id) {
        console.log(id);
    }
});
