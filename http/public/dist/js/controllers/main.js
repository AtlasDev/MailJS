'use strict';

app.controller("MailCtrl", function($rootScope, $scope, $cookies, $window, $translate, socket) {
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
    socket.on('error', function (err) {
        if(err.toString() == "Authentication error") {
            localStorage.removeItem('session');
            $window.location.href = '/index.html?msg=Session%20invalid!';
        }
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
        if($rootScope.isInit == false) {
            if($rootScope.mailboxes[0]) {
                $rootScope.currentMailbox = $rootScope.mailboxes[0];
            }
        	setTimeout(function(){
        		$('body').addClass('preloaded');
        	}, 500);

            $rootScope.isInit = true;
        }
    });
});
