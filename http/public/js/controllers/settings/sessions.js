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
            console.log(res.data.session);
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
});
