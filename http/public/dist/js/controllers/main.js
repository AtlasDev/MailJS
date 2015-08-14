'use strict';

app.controller("MailCtrl", function($rootScope, $scope, $cookies, $window, $translate, socket) {
    $rootScope.socketStatus = 0;
	$rootScope.isLoading = false;
	$rootScope.mails = [];
	$rootScope.mailboxes = [];
    $rootScope.currentMailbox = "";
    $scope.user = {};
    $scope.user.firstName = "Loading...";
    $scope.user.email = "Change me!";
    $scope.user.group = 0;
	$scope.logout = function logout(){
        localStorage.removeItem('session');
        $cookies.remove('session');
        socket.emit('user:logout');
        $window.location.href = '/index.html?info=true&msg=Logout Succesfull, goodbye!';
	}
    $scope.changeLanguage = function changeLanguage(langKey) {
        $translate.use(langKey);
    };
    socket.on('connect', function () {
        $rootScope.socketStatus = 2;
    });
    socket.on('disconnect', function () {
        $rootScope.socketStatus = 0;
    });
    socket.on('error', function (error) {
        localStorage.removeItem('session');
		var msg;
        console.log(error);
        alert(error);
		switch(error.toString()) {
            case 'Authentication error':
                msg = "Session invalid!";
			default:
				msg = "Socket errored!";
				break;
		}
        $window.location.href = '/index.html?msg='+msg;
    });
    socket.on('reconnecting', function (error) {
        $rootScope.socketStatus = 1;
    });
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
        $scope.user.group = data.group;
    });
});
