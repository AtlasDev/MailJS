(function () {
'use strict';

app.controller("sessionsSettingsCtrl", function($rootScope, $scope, $http, user, notification, $interval) {
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
    };
    fetchSessions();
    $scope.reloadSessions = function () {
        fetchSessions();
    };
    var intervalPromise = $interval(function () {
        fetchSessions();
    }, 10000);
    $scope.$on('$locationChangeStart', function(event) {
        $interval.cancel(intervalPromise);
    });
    $scope.getOS = function (ua) {
        var os = new UAParser().setUA(ua).getResult().os;
        switch (os.name) {
            case 'Windows':
                switch (os.version) {
                    case '7':
                        return 'win7';
                    case ('10' || '8'):
                        return 'win10';
                    default:
                        return 'win';
                }
                break;
            case 'Debian':
                return 'debian';
            case 'Android':
                return 'android';
            case 'Ubuntu':
                return 'ubuntu';
            case 'Linux':
                return 'linux';
            case 'iOS':
                return 'ios';
            case 'Mac OS':
                return 'ios';
            case ('Fedora' || 'Arch' || 'CentOS' || 'Gentoo' || 'Mint'):
                return 'linux';
            default:
                return 'unknown';
        }
    };
    $scope.getBrowser = function (ua) {
        var browser = new UAParser().setUA(ua).getResult().browser;
        switch (browser.name) {
            case 'Chrome':
                return 'chrome';
            case 'Chromium':
                return 'chrome';
            case 'Android Browser':
                return 'android';
            case 'Firefox':
                return 'firefox';
            case 'Vivaldi':
                return 'vivaldi';
            case 'Edge':
                return 'edge';
            case 'IE':
                return 'ie';
            default:
                return 'unknown';
        }
    };
});
}());
