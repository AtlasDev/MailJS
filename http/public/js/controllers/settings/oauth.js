(function () {
'use strict';

app.controller("oauthSettingsCtrl", function($rootScope, user, $scope, $http, notification) {
    $rootScope.isLoading = true;
    $scope.ownClients = [];
    $scope.authClients = [];
    $scope.clientInfo = {};
    $scope.scopes = [
        "user:info",
        "user:mailboxes"
    ];

    var init = function () {
        $("#scopeSelect").select2({placeholder: "Select scopes"});
        var req = {
            method: 'GET',
            url: '/api/v1/client',
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function(res) {
            $rootScope.isLoading = false;
            $scope.ownClients = res.data.clients;
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Client loading failed!', res.data.error.message, 'error');
        });
    };

    $scope.createClient = function () {
        $rootScope.isLoading = true;
        var req = {
            method: 'POST',
            url: '/api/v1/client',
            headers: {
                'x-token': user.sessionID
            },
            data: {
                'name': $scope.name,
                'description': $scope.description,
                'scopes': $scope.scopeSelect,
                'url': $scope.url
            }
        };
        $http(req).then(function(res) {
            $rootScope.isLoading = false;
            $scope.clientInfo = res.data.client;
            res.data.client.secret = undefined;
            $scope.ownClients.push(res.data.client);
            $('#clientInfo').modal('show');
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Client creation failed!', res.data.error.message, 'error');
        });
    };

    if(typeof user.getUser()._id == "undefined") {
        $rootScope.$on('userLoaded', function () {
            init();
        });
    } else {
        init();
    }
});
}());
