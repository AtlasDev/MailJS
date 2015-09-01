'use strict';

app.controller("mainCtrl", function($rootScope, $scope, $cookies, $window, socket, $http) {
    $rootScope.socketStatus = 0;
	$rootScope.isLoading = false;
    $rootScope.isInit = false;
	$rootScope.mails = [];
	$rootScope.mailboxes = [];
    $rootScope.currentMailbox = "";
    $scope.user = {};
    $scope.user.firstName = "Loading...";
    $scope.user.group = 0;

	$scope.logout = function logout(){
        $cookies.remove('session');
        socket.emit('user:logout');
        $window.location.href = '/index.html?info=true&msg=Logout%20Succesfull,%20goodbye!';
	}

    $scope.canNotificate = false;

    $scope.initNotificate = function () {
        if (("Notification" in window) && Notification.permission === "granted") {
            return 'noSupport';
        }
    }

    $scope.sendNotification = function (message) {
        if($scope.canNotificate() == true) {
            var notification = new Notification("Hi there!");
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
            $cookies.remove('session');
            $window.location.href = '/index.html?msg=Authentication%20failure!';
        }
        //If not, let it reconnect.
    });
    socket.on('error:nodata', function () {
        $cookies.remove('session');
        $window.location.href = '/index.html?msg=Connection%20error!';
    })
    socket.on('error:dberror', function () {
        $cookies.remove('session');
        $window.location.href = '/index.html?msg=Database%20error!';
    })
    socket.on('error:nodata', function () {
        $cookies.remove('session');
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
	socket.on('mail:list', function(data) {
		$rootScope.isLoading = false;
		data.mails.forEach(function(data) {
			$rootScope.mails.push(data);
		});
	});
    //User handling
    socket.on('user:info', function (data) {
        $rootScope.mailboxes = data.mailboxes;
        $scope.user.firstName = data.firstName;
        $scope.user.lastName = data.lastName;
        $scope.user.firstName = data.firstName;
        if($rootScope.isInit == false) {
            if($rootScope.mailboxes[0]) {
                $rootScope.currentMailbox = $rootScope.mailboxes[0];
            }
            var req = {
                method: 'GET',
                url: '/api/v1/group/'+data.group,
                headers: {
                    'x-token': $cookies.get('session')
                }
            };
            $http(req).then(function(res) {
                $scope.user.group = res.data.group;
            	setTimeout(function(){
            		$('body').addClass('preloaded');
            	}, 500);
                $rootScope.isInit = true;
            }, function(res) {
                console.log(res);
                $cookies.remove('session');
                if(res.status == 401) {
                    return $window.location.href = '/index.html?msg=Token%20invalid.';
                }
                $window.location.href = '/index.html?msg='+JSON.parse(res.data).error.message;
            });
        }
    });
});
