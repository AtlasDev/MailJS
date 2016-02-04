(function () {
'use strict';

app.controller("mailboxSettingsCtrl", function($scope, $rootScope, user, $http, notification, mailbox) {
    $rootScope.isLoading = true;
    $scope.showDomainCreateForm = false;
    $scope.domains = [];
    $scope.viewingDomain = {};
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
        if(user.getUser().isAdmin) {
            $scope.showDomainCreateForm = true;
        }
    };

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
                'title': $scope.mailboxTitle
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
    };

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
            $scope.domains.push(res.data.domain);
            $rootScope.isLoading = false;
            notification.send('Domain added!', 'Domain has been added to the database.', 'success');
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Domain adding failed!', res.data.error.message, 'error');
        });
    };

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
            $scope.viewingMailbox.transferCodes = [];
            if(user.getUser()._id == $scope.viewingMailbox.creator) {
                $scope.viewingMailbox.function = 3;
            } else if($scope.viewingMailbox.admins.indexOf(user.getUser()._id) != -1) {
                $scope.viewingMailbox.function = 2;
            } else {
                $scope.viewingMailbox.function = 1;
            }
            for (var i = 0; i < $scope.viewingMailbox.users.length; i++) {
                var userID = $scope.viewingMailbox.users[i]._id;
                if(userID == $scope.viewingMailbox.creator) {
                    $scope.viewingMailbox.users[i].function = 3;
                } else if($scope.viewingMailbox.admins.indexOf(userID) != -1) {
                    $scope.viewingMailbox.users[i].function = 2;
                } else {
                    $scope.viewingMailbox.users[i].function = 1;
                }
                if($scope.viewingMailbox.users.length == i+1) {
                    if($scope.viewingMailbox.admins.indexOf(user.getUser()._id) == -1) {
                        $rootScope.isLoading = false;
                        $('#viewMailbox').modal('show');
                    } else {
                        var req = {
                            method: 'GET',
                            url: '/api/v1/transfer/mailbox/'+res.data.mailbox._id,
                            headers: {
                                'x-token': user.sessionID
                            }
                        };
                        $http(req).then(function(res) {
                            for (var i = 0; i < res.data.codes.length; i++) {
                                $scope.viewingMailbox.transferCodes.push(res.data.codes[i]);
                            }
                            $rootScope.isLoading = false;
                            $('#viewMailbox').modal('show');
                        }, function(res) {
                            $rootScope.isLoading = false;
                            notification.send('Cannot load transfer token info!', res.data.error.message, 'error');
                        });
                    }
                }
            }
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Cannot view mailbox!', res.data.error.message, 'error');
        });
    };

    $scope.viewDomain = function (domain) {
        $rootScope.isLoading = true;
        $scope.viewingDomain = domain;
        $scope.viewingDomain.transferCodes = [];
        var req = {
            method: 'GET',
            url: '/api/v1/transfer/domain/'+$scope.viewingDomain._id,
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function(res) {
            if(res.data.codes.length > 0) {
                for (var i = 0; i < res.data.codes.length; i++) {
                    $scope.viewingDomain.transferCodes.push(res.data.codes[i]);
                    if(i == res.data.codes.length - 1) {
                        $rootScope.isLoading = false;
                        $('#viewDomain').modal('show');
                    }
                }
            } else {
                $rootScope.isLoading = false;
                $('#viewDomain').modal('show');
            }
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Cannot load transfer token info!', res.data.error.message, 'error');
        });
        return;
    };

    $scope.createDomainTransfer = function (domain) {
        $rootScope.isLoading = true;
        var req = {
            method: 'POST',
            url: '/api/v1/transfer/domain/'+domain._id,
            data: { maxUses: $scope.maxDomainTransferUses },
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function(res) {
            $rootScope.isLoading = false;
            notification.send('Transfer code created!', "Code: "+res.data.code.code, 'success');
            domain.transferCodes.push(res.data.code);
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Cannot create transfer code!', res.data.error.message, 'error');
        });
    };

    $scope.createMailboxTransfer = function (mailbox) {
        $rootScope.isLoading = true;
        var req = {
            method: 'POST',
            url: '/api/v1/transfer/mailbox/'+mailbox._id,
            data: { maxUses: $scope.maxMailboxTransferUses },
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function(res) {
            $rootScope.isLoading = false;
            notification.send('Transfer code created!', "Code: "+res.data.code.code, 'success');
            mailbox.transferCodes.push(res.data.code);
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Cannot create transfer code!', res.data.error.message, 'error');
        });
    };

    $scope.deleteMailbox = function (mailbox) {
        var confirmDelete = prompt("Are you sure? Please enter the mail address to confirm deletion.");
        if(confirmDelete == mailbox.address) {
            //TODO
            notification.send('Mailbox deletion canceled!', 'Not implemented.', 'info');
        } else if(confirmDelete !== null) {
            notification.send('Mailbox deletion canceled!', 'Mail addresses do not match.', 'error');
        }
    };

    $scope.createInbox = function () {
        if(typeof $scope.inboxTitle == "undefined" || $scope.inboxTitle === "") {
            notification.send('Cannot add inbox!', 'No title given.', 'error');
            return;
        }
        $rootScope.isLoading = true;
        var req = {
            method: 'POST',
            url: '/api/v1/inbox',
            headers: {
                'x-token': user.sessionID
            },
            data: {
                'mailbox': $scope.viewingMailbox._id,
                'title': $scope.inboxTitle
            }
        };
        $http(req).then(function(res) {
            $scope.viewingMailbox.inboxes.push(res.data.inbox);
            $rootScope.isLoading = false;
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Cannot add inbox!', res.data.error.message, 'error');
        });
    };

    if(typeof user.getUser()._id == 'undefined') {
        $rootScope.$on('userLoaded', function () {
            init();
        });
    } else {
        init();
    }
});
}());
