(function () {
'use strict';

app.controller('mailboxCtrl', function($rootScope, $routeParams, $scope, user, inbox, mailbox, notification, $location, hotkeys) {
	$rootScope.isLoading = true;
	$scope.title = 'Mailbox';
	$scope.inbox = $routeParams.inbox;
	$scope.page = 1;

	hotkeys.bindTo($scope).add({
		combo: 'ctrl+up',
		description: 'Go to the previous inbox.',
		callback: function() {
			for (var i = 0; i < mailbox.getCurrent().inboxes.length; i++) {
				if(mailbox.getCurrent().inboxes[i]._id == $routeParams.inbox) {
					if(i === 0) {
						break;
					}
					$location.path("/mailbox/"+mailbox.getCurrent().inboxes[i-1]._id);
					break;
				}
			}
		}
	}).add({
		combo: 'crtl+down',
		description: 'Go to the next inbox.',
		callback: function() {
			console.log('h');
			for (var i = 0; i < mailbox.getCurrent().inboxes.length; i++) {
				if(mailbox.getCurrent().inboxes[i]._id == $routeParams.inbox) {
					if(mailbox.getCurrent().inboxes.length == i) {
						break;
					}
					$location.path("/mailbox/"+mailbox.getCurrent().inboxes[i+1]._id);
					break;
				}
			}
		}
	});

	var init = function() {
		inbox.get($routeParams.inbox, function (err, emails) {
			$rootScope.isLoading = false;
			if(err) {
				notification.send('Could not get mail!', err.message, 'error');
				for (var j = 0; j < mailbox.getCurrent().inboxes.length; j++) {
					if(mailbox.getCurrent().inboxes[j].type == "Inbox") {
						$location.path("/mailbox/"+mailbox.getCurrent().inboxes[j]._id);
					}
				}
			}
			$scope.mails = emails;
		});
		for (var i = 0; i < mailbox.getCurrent().inboxes.length; i++) {
			if(mailbox.getCurrent().inboxes[i]._id == $routeParams.inbox) {
				$scope.inbox = mailbox.getCurrent().inboxes[i].name;
				break;
			}
		}
	};

    if(typeof mailbox.getCurrent() == "undefined") {
        $rootScope.$on('currentMailboxChange', function () {
            init();
        });
    } else {
        init();
    }
});
}());
