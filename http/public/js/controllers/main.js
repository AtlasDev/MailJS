'use strict';

app.controller("mainCtrl", function($rootScope, $scope, $cookies, $window, socket, $http) {
    $rootScope.socketStatus = 0;
	$rootScope.isLoading = true;
    $rootScope.isInit = false;
	$rootScope.mails = [];
	$rootScope.mailboxes = [];
    $rootScope.currentMailbox = "";
    $rootScope.sid;
    $scope.notifyTimeout = localStorage.getItem('notifyTimeout');
    $scope.user = {};
    $scope.user.firstName = "Loading...";
    $scope.user.group = 0;

	$scope.logout = function logout(){
        $http({
            method: 'DELETE',
            url: '/api/v1/login',
            headers: {
                'x-token': $rootScope.sid
            }
        }).then(function(res) {
            $cookies.remove('MailJS');
            $window.location.href = '/index.html?info=true&msg=Logout%20Succesfull,%20goodbye!';
        }, function(res) {
            $cookies.remove('MailJS');
            $window.location.href = '/index.html?info=true&msg=Logout%20Succesfull,%20goodbye!';
        });
	}

    $scope.toggleFullScreen = function () {
        if (!$scope.isFullscreen()) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    $scope.isFullscreen = function () {
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement ) {
            return true;
        } else {
            return false;
        }
    }

    //Socket stuff
    socket.on('connect', function () {
        $rootScope.socketStatus = 2;
    });
    socket.on('disconnect', function () {
        $rootScope.socketStatus = 0;
    });
    socket.on('reconnecting', function (error) {
        $rootScope.socketStatus = 1;
    });
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
    //User handling
    socket.on('user:info', function (data) {
        $rootScope.mailboxes = data.mailboxes;
        $scope.user = data;
        $scope.sid = data.sid;
        if($rootScope.isInit == false) {
            $rootScope.$emit('tokenLoaded');
            if($rootScope.mailboxes[0]) {
                $rootScope.currentMailbox = $rootScope.mailboxes[0];
            }
            var req = {
                method: 'GET',
                url: '/api/v1/group/'+data.group,
                headers: {
                    'x-token': $scope.sid
                }
            };
            $http(req).then(function(res) {
                $scope.user.group = res.data.group;
                $rootScope.isInit = true;
            	$('body').addClass('preloaded');
            }, function(res) {
                $cookies.remove('MailJS');
                if(res.status == 401) {
                    return $window.location.href = '/index.html?msg=Token%20invalid.';
                }
                $window.location.href = '/index.html?msg='+JSON.parse(res.data).error.message;
            });
        }
    });
});
