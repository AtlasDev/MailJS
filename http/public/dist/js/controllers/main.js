'use strict';

app.controller("MailCtrl", function($rootScope, $scope, $window, $translate, socket) {
    $rootScope.socketStatus = 0;
	$rootScope.isLoading = false;
	$rootScope.mails = [];
	$rootScope.mailboxes = [];
    $rootScope.currentMailbox = "";
    $scope.user = {};
    $scope.user.firstName = "s";
    $scope.user.lastName = "f";
    $scope.user.email = "safasfasf";
    $scope.user.permLevel = 0;
	$scope.logout = function logout(){
		localStorage.removeItem('token');
        localStorage.removeItem('userid');
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
        localStorage.removeItem('token');
        localStorage.removeItem('userid');
		var msg;
		switch(error.message) {
            alert(error.message);
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
});
