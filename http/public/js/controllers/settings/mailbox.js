'use strict';

app.controller("mailboxSettingsCtrl", function($scope, $rootScope, user, $http, notification, mailbox) {
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

    $scope.createMailbox = function () {
        $rootScope.isLoading = true;
        if(typeof $scope.localAddress == "undefined") {
            $rootScope.isLoading = false;
            return notification.send('Mailbox creation failed!', 'Local part empty.', 'error');
        }
        if(typeof $scope.mailboxDomain == "undefined") {
            $rootScope.isLoading = false;
            return notification.send('Mailbox creation failed!', 'Please select a domain.', 'error');
        }
        var req = {
            method: 'POST',
            url: '/api/v1/mailbox',
            headers: {
                'x-token': user.sessionID
            },
            data: {
                'local': $scope.localAddress,
                'domain': $scope.mailboxDomain
            }
        };
        $http(req).then(function(res) {
            mailbox.addMailbox(res.data.mailbox);
            $rootScope.isLoading = false;
            notification.send('Mailbox created!', 'Mailbox has been added to the database.', 'success');
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Maibox creation failed!', res.data.error.message, 'error');
        });
    }

    $scope.createDomain = function () {
        if(!new RegExp(/^([a-z0-9]+\.)?[a-z0-9][a-z0-9-]*\.[a-z]{2,6}$/i).test($scope.domain)) {
            return notification.send('Invalid domain!', 'Given domain is invalid.', 'error');
        }
        $rootScope.isLoading = true;
        var req = {
            method: 'POST',
            url: '/api/v1/domain',
            headers: {
                'x-token': user.sessionID
            },
            data: {
                'domain': $scope.domain
            }
        };
        $http(req).then(function(res) {
            $scope.domains.push(res.data.domain);
            $rootScope.isLoading = false;
            notification.send('Domain added!', 'Domain has been added to the database.', 'success');
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Domain adding failed!', res.data.error.message, 'error');
        });
    }

    if(typeof user.getUser().group == 'undefined' || typeof user.getUser().group == "string") {
        $rootScope.$on('userLoaded', function () {
            init();
        });
    } else {
        init();
    }
});
