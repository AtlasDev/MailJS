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

	hotkeys.add({
		combo: 'ctrl+shift+down',
		description: 'Go to the next mailbox.',
		callback: function() {
			var current = mailbox.getCurrent()._id;
			for (var i = 0; i < mailbox.getMailboxes().length; i++) {
				if(mailbox.getMailboxes()[i]._id == current) {
					if(i+1==mailbox.getMailboxes().length) {
						break;
					}
					mailbox.changeMailbox(mailbox.getMailboxes()[i+1]._id);
					break;
				}
			}
		}
	});

	hotkeys.add({
		combo: 'ctrl+shift+up',
		description: 'Go to the previous mailbox.',
		callback: function() {
			var current = mailbox.getCurrent()._id;
			for (var i = 0; i < mailbox.getMailboxes().length; i++) {
				if(mailbox.getMailboxes()[i]._id == current) {
					if(i===0) {
						break;
					}
					mailbox.changeMailbox(mailbox.getMailboxes()[i-1]._id);
					break;
				}
			}
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
