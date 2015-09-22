'use strict';

app.controller("mainCtrl", function($rootScope, $scope, $cookies, $window, socket, $http, user, fullscreen) {
	$rootScope.isLoading = true;

    $scope.socketStatus = socket.getStatus();
    $scope.user = {};
    $scope.notifyTimeout = localStorage.getItem('notifyTimeout');

    $rootScope.$on('userLoaded', function () {
        $scope.isInit = true;
        $scope.user = user.getUser();
    });

    $rootScope.$on('socketStatusChange', function () {
        $scope.socketStatus = socket.getStatus();
    });

	$scope.logout = function logout(){
        return user.logout();
	}

    $scope.toggleFullScreen = function () {
        return fullscreen.toggleFullScreen();
    }

    $scope.isFullscreen = function () {
        return fullscreen.isFullscreen();
    }

    //error handling
    socket.on('error', function (err) {
        if(err.toString() == "Authentication error") {
            $cookies.remove('MailJS');
            $window.location.href = '/index.html?msg=Authentication%20failure!';
        }
        //If not, let it reconnect.
    });
    socket.on('error:nodata', function () {
        $cookies.remove('MailJS');
        $window.location.href = '/index.html?msg=Connection%20error!';
    })
    socket.on('error:dberror', function () {
        $cookies.remove('MailJS');
        $window.location.href = '/index.html?msg=Database%20error!';
    })
    socket.on('error:nodata', function () {
        $cookies.remove('MailJS');
        $window.location.href = '/api/v1/user/setup';
    })
	//mail handling
    socket.on('mail:star', function(data){
        for(var i in $rootScope.mails) {
            if($rootScope.mails[i].uuid == data.uuid) {
                $rootScope.mails[i].starred = data.state;
                break;
            }
        }
    });
    socket.on('mail:read', function(data){
        for(var i in $rootScope.mails) {
            if($rootScope.mails[i].uuid == data.uuid) {
                $rootScope.mails[i].read = data.state;
                break;
            }
        }
    });
    socket.on('mail:delete', function(data){
        for(var i in $rootScope.mails) {
            if($rootScope.mails[i].uuid == data.uuid) {
				delete $rootScope.mails[i];
                break;
            }
        }
    });
});
