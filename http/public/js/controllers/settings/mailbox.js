'use strict';

app.controller("mailboxSettingsCtrl", function($scope, $rootScope, user, $http, notification, mailbox) {
    $rootScope.isLoading = true;
    $scope.showMailboxCreateForm = false;
    $scope.showDomainCreateForm = false;
    $scope.domains = [];
    $scope.viewingMailbox = {};

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

    $scope.claimMailbox = function () {
        if(!$scope.transferCode || typeof $scope.transferCode == "undefined") {
            return notification.send('Cannot claim mailbox!', 'Transfer code not filled in.', 'error');
        }
        $rootScope.isLoading = true;
        var req = {
            method: 'PATCH',
            url: '/api/v1/mailbox',
            headers: {
                'x-token': user.sessionID
            },
            data: {
                'transfercode': $scope.transferCode
            }
        };
        $http(req).then(function(res) {
            mailbox.addMailbox(res.data.mailbox);
            $rootScope.isLoading = false;
            notification.send('Mailbox claimed!', 'Mailbox has been added to your account.', 'success');
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Cannot claim mailbox!', res.data.error.message, 'error');
        });
    }

    $scope.createMailbox = function () {
        if(typeof $scope.localAddress == "undefined" || !$scope.localAddress) {
            return notification.send('Mailbox creation failed!', 'Local part empty.', 'error');
        }
        if(typeof $scope.mailboxDomain == "undefined" || !$scope.mailboxDomain) {
            return notification.send('Mailbox creation failed!', 'Please select a domain.', 'error');
        }
        if(typeof $scope.mailboxTitle == "undefined" || !$scope.mailboxTitle) {
            return notification.send('Mailbox creation failed!', 'Please fill in a mailbox title.', 'error');
        }
        $rootScope.isLoading = true;
        var req = {
            method: 'POST',
            url: '/api/v1/mailbox',
            headers: {
                'x-token': user.sessionID
            },
            data: {
                'local': $scope.localAddress,
                'domain': $scope.mailboxDomain,
                'title': $scope.mailboxTitle,
                'transferable': $scope.mailboxTransferable
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
                'domain': $scope.domain,
                'disabled': $scope.domainDisabled
            }
        };
        $http(req).then(function(res) {
            if(res.data.domain.disabled != true) {
                $scope.domains.push(res.data.domain);
            }
            $rootScope.isLoading = false;
            notification.send('Domain added!', 'Domain has been added to the database.', 'success');
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Domain adding failed!', res.data.error.message, 'error');
        });
    }

    $scope.viewMailbox = function (id) {
        $rootScope.isLoading = true;
        var req = {
            method: 'GET',
            url: '/api/v1/mailbox/'+id,
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function(res) {
            $scope.viewingMailbox = res.data.mailbox;
            if(user.getUser()._id == $scope.viewingMailbox.creator) {
                $scope.viewingMailbox.function = 3;
            } else if($scope.viewingMailbox.admins.indexOf(user.getUser()._id) != -1) {
                $scope.viewingMailbox.function = 2;
            } else {
                $scope.viewingMailbox.function = 1;
            }
            for (var i = 0; i < $scope.viewingMailbox.users.length; i++) {
                $scope.viewingMailbox.users[i];
                var userID = $scope.viewingMailbox.users[i]._id;
                if(userID == $scope.viewingMailbox.creator) {
                    $scope.viewingMailbox.users[i].function = 3;
                } else if($scope.viewingMailbox.admins.indexOf(userID) != -1) {
                    $scope.viewingMailbox.users[i].function = 2;
                } else {
                    $scope.viewingMailbox.users[i].function = 1;
                }
                if($scope.viewingMailbox.users.length == i+1) {
                    $rootScope.isLoading = false;
                    $('#viewModal').modal('show');
                }
            }
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Cannot view mailbox!', res.data.error.message, 'error');
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
