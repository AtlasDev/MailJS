(function () {
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
            notification.send('Could not load users.', 'The server errored, please report this to your sysadmin.', 'error');
            $rootScope.isLoading = false;
        });
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
            $scope.username = "";
            $scope.password = "";
            $scope.firstName = "";
            $scope.lastName = "";
            $scope.repeatPassword = "";
            $rootScope.isLoading = false;
        }, function(res) {
            notification.send('An error occured!', res.data.error.message || 'The server errored, please report this to your sysadmin.', 'error');
            $rootScope.isLoading = false;
        });
    };

    function checkPerms() {
        if(user.getUser().isAdmin === false) {
            notification.send('Cannot visit page!', 'Permissions denied.', 'error');
            $location.path('/mainSettings');
            return false;
        }
        return true;
    }

    if(typeof user.getUser()._id == "undefined") {
        $rootScope.$on('userLoaded', function () {
            if(checkPerms()) {
                loadUsers(1);
            }
        });
    } else {
        if(checkPerms()) {
            loadUsers(1);
        }
    }
});
}());
