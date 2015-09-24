'use strict';

app.controller("mailboxSettingsCtrl", function($scope, $rootScope, user, $http, notification) {
    $rootScope.isLoading = true;
    $scope.showMailboxCreateForm = false;
    $scope.showDomainCreateForm = false;
    $scope.domains = [];

    var init = function () {
        var req = {
            method: 'GET',
            url: '/api/v1/domain',
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function(res) {
            $rootScope.isLoading = false;
            $scope.domains = res.data.domains;
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Could not get domains.', res.data.message, 'error');
        });
        if(user.getUser().group.permissions.indexOf('mailbox.create') > -1) {
            $scope.showMailboxCreateForm = true;
        }
        if(user.getUser().group.permissions.indexOf('domain.create') > -1) {
            $scope.showDomainCreateForm = true;
        }
    }

    if(!user.getUser().username) {
        $rootScope.$on('userLoaded', function () {
            init();
        });
    } else {
        init();
    }
});
