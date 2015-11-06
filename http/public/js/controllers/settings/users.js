'use strict';

app.controller("userSettingsCtrl", function(user, $scope, $rootScope, $location, notification, $http) {
    $rootScope.isLoading = true;

    $scope.groupNames = [];
    $scope.newSelectGroup = [];

    function loadUsers(page) {
        var skip = page-1*20-1;
        if(skip < 0 ) {
            skip = 0;
        }
        var req = {
            method: 'GET',
            url: '/api/v1/user?skip='+skip,
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function(res) {
            $scope.users = res.data.users;
            $rootScope.isLoading = false;
        }, function(res) {
            notification.send('Internal Server Error', 'The server errored, please report this to your sysadmin.', 'error');
            $rootScope.isLoading = false;
        });
    }

    $scope.getGroupName = function (groupID) {
        if($scope.groupNames.indexOf(groupID) >= 0) {
            return;
        }
        var req = {
            method: 'GET',
            url: '/api/v1/group/'+groupID,
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function(res) {
            $rootScope.isLoading = false;
            $scope.groupNames[groupID] = res.data.group.name;
        }, function(res) {
            notification.send('Cannot Groups!', res.body.error.messsage, 'error');
            $rootScope.isLoading = false;
        });
    }

    $scope.changeGroup = function (user, oldGroupID) {
        var newGroup = $scope.newSelectGroup[user._id];
        if(oldGroupID == newGroup._id) {
            return notification.send('Group not changed.', 'User is already member of `'+newGroup.name+'`');
        }
        if(confirm('Are you sure you want to change the group of `'+user.username+'` to `'+newGroup.name+'`?') == true) {
            notification.send('Cannot change group!', 'Not implemented', 'info');
        } else {
            return notification.send('Group not changed.', 'Canceled on prompt.');
        }
    }

    $scope.createUser = function () {
        if(typeof $scope.username == "undefined" || !$scope.username) {
            return notification.send('Cannot create user!', 'Username empty.', 'error');
        }
        if(typeof $scope.firstName == "undefined" || !$scope.firstName) {
            return notification.send('Cannot create user!', 'First name empty.', 'error');
        }
        if(typeof $scope.lastName == "undefined" || !$scope.lastName) {
            return notification.send('Cannot create user!', 'Last name empty.', 'error');
        }
        if(typeof $scope.password == "undefined" || !$scope.password) {
            return notification.send('Cannot create user!', 'Password empty.', 'error');
        }
        if(typeof $scope.repeatPassword == "undefined" || !$scope.repeatPassword) {
            return notification.send('Cannot create user!', 'Repeat password empty.', 'error');
        }
        if($scope.password != $scope.repeatPassword) {
            return notification.send('Cannot create user!', 'Passwords do not match', 'error');
        }
        $rootScope.isLoading = true;
        var req = {
            method: 'POST',
            url: '/api/v1/user',
            headers: {
                'x-token': user.sessionID
            },
            data: {
                'username': $scope.username,
                'password': $scope.password,
                'firstName': $scope.firstName,
                'lastName': $scope.lastName
            }
        };
        $http(req).then(function(res) {
            $scope.users.push(res.data.data);
            notification.send('User created', 'User `'+$scope.username+'` has been created.', 'success');
            $rootScope.isLoading = false;
        }, function(res) {
            notification.send('An error occured!', res.data.error.message || 'The server errored, please report this to your sysadmin.', 'error');
            $rootScope.isLoading = false;
        });
    }

    function loadGroups() {
        var req = {
            method: 'GET',
            url: '/api/v1/group',
            headers: {
                'x-token': user.sessionID
            }
        };
        $http(req).then(function(res) {
            $rootScope.isLoading = false;
            $scope.groups = res.data.groups;
        }, function(res) {
            $rootScope.isLoading = false;
            notification.send('Cannot get groups!', res.body.error.messsage, 'error');
        });
    }

    function checkPerms() {
        if(user.getUser().group.permissions.indexOf('user.list') == -1) {
            notification.send('Cannot visit page!', 'Permissions denied.', 'error')
            $location.path('/mainSettings');
            return false;
        }
        return true;
    }

    if(typeof user.getUser()._id == "undefined" || typeof user.getUser().group.permissions == "undefined") {
        $rootScope.$on('userLoaded', function () {
            if(checkPerms()) {
                loadGroups();
                loadUsers(1);
            }
        });
    } else {
        if(checkPerms()) {
            loadGroups();
            loadUsers(1);
        }
    }
});
