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
        }
    }

    if(typeof user.getUser()._id == "undefined") {
        $rootScope.$on('userLoaded', function () {
            checkPerms();
            loadGroups();
            loadUsers(1);
        });
    } else {
        checkPerms();
        loadGroups();
        loadUsers(1);
    }
});
