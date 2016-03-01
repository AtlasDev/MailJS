(function () {
'use strict';

app.controller("mainCtrl", function($rootScope, $scope, $cookies, $window, socket, $http, user, fullscreen, mailbox, md5, hotkeys) {
	$rootScope.isLoading = true;

    $scope.socketStatus = socket.getStatus();
    $scope.user = {};
	$scope.mailboxes = [];
	$scope.currentMailbox = {};
    $scope.notifyTimeout = localStorage.getItem('notifyTimeout');
	$scope.mailHash = "";

	hotkeys.add({
		combo: 'f',
		description: 'Toggle fullscreen.',
		callback: function() {
			fullscreen.toggleFullScreen();
		}
	});

	hotkeys.add({
		combo: 'shift+backspace',
		description: 'Logout the user.',
		callback: function() {
			user.logout();
		}
	});

    $rootScope.$on('userLoaded', function () {
        $scope.isInit = true;
        $scope.user = user.getUser();
    });

    $rootScope.$on('socketStatusChange', function () {
        $scope.socketStatus = socket.getStatus();
    });

    $rootScope.$on('currentMailboxChange', function (event, mailbox) {
        $scope.currentMailbox = mailbox;
		$scope.mailHash = md5.createHash(mailbox.address);
    });

    $rootScope.$on('mailboxesChange', function (event, mailboxes) {
        $scope.mailboxes = mailboxes;
    });

	$scope.changeMailbox = function (id) {
		mailbox.changeMailbox(id);
	};

	$scope.logout = function logout(){
        return user.logout();
	};

    $scope.toggleFullScreen = function () {
        return fullscreen.toggleFullScreen();
    };

    $scope.isFullscreen = function () {
        return fullscreen.isFullscreen();
    };
});
}());
