'use strict';

app.controller("mainCtrl", function($rootScope, $scope, $cookies, $window, socket, $http) {
    $rootScope.socketStatus = 0;
	$rootScope.isLoading = false;
    $rootScope.isInit = false;
	$rootScope.mails = [];
	$rootScope.mailboxes = [];
    $rootScope.currentMailbox = "";
    $scope.notifyTimeout = localStorage.getItem('notifyTimeout');
    $scope.user = {};
    $scope.user.firstName = "Loading...";
    $scope.user.group = 0;
    $scope.sid;

	$scope.logout = function logout(){
        $http({
            method: 'DELETE',
            url: '/api/v1/login',
            headers: {
                'x-token': $scope.sid
            }
        }).then(function(res) {
            $cookies.remove('session');
            $window.location.href = '/index.html?info=true&msg=Logout%20Succesfull,%20goodbye!';
        }, function(res) {
            $cookies.remove('session');
            $window.location.href = '/index.html?info=true&msg=Logout%20Succesfull,%20goodbye!';
        });
	}

    $scope.checkNotify = function () {
        if(("Notification" in window) && (Notification.permission === "granted") && (localStorage.getItem('notifications') == 'true')) {
            return true;
        } else {
            return false;
        }
    };

    $scope.sendNotification = function (title, message, icon, callback) {
        if(typeof icon == "function") {
            callback = icon;
            icon = '/favicon-96x96.png';
        }
        if(icon == null) {
            icon = '/favicon-96x96.png';
        }
        if($scope.checkNotify() == true) {
            var options = {
                  body: message,
                  icon: icon
            }
            var notification = new Notification(title, options);
            setTimeout(notification.close.bind(notification), localStorage.getItem('notifyTimeout'));
            notification.onclick = function(x) {
                window.focus();
                if(callback) {
                    callback();
                }
            };
            return true;
        } else {
            return false;
        }
    }

    console.log($scope.sendNotification('New Mail: `RE: Proof of concept voor het profielwerkstuk` - from Dany Suijk', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim ante justo, eget viverra quam porttitor a. In vestibulum, diam vitae efficitur blandit, mi libero facilisis tortor, a ultricies orci augue quis tellus. Aliquam eget pretium diam. Praesent gravida interdum consectetur. Aliquam posuere ipsum felis, nec posuere augue commodo sed. Maecenas sapien dui, tempus quis dui et, faucibus porta mi. Vivamus at augue eget nulla mollis volutpat. Etiam mattis, leo ut viverra molestie, sem turpis mattis augue, quis consequat eros magna ac velit. Mauris tempor dui nec bibendum scelerisque. Curabitur faucibus pulvinar tellus, id rhoncus tellus tempus eget. Integer gravida velit at tincidunt rhoncus...'));

    if(localStorage.getItem('notification') == "true" || localStorage.getItem('notification') == "false") {
        localStorage.setItem('notifications', 'false');
    }
    if(localStorage.getItem('notifyTimeout') === null && typeof localStorage.getItem('notifyTimeout') === "object") {
        localStorage.setItem('notifyTimeout', '10000');
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
    //User handling
    socket.on('user:info', function (data) {
        $rootScope.mailboxes = data.mailboxes;
        $scope.user.firstName = data.firstName;
        $scope.user.lastName = data.lastName;
        $scope.user.firstName = data.firstName;
        $scope.sid = data.sid;
        if($rootScope.isInit == false) {
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
                $cookies.remove('session');
                if(res.status == 401) {
                    return $window.location.href = '/index.html?msg=Token%20invalid.';
                }
                $window.location.href = '/index.html?msg='+JSON.parse(res.data).error.message;
            });
        }
    });
});
