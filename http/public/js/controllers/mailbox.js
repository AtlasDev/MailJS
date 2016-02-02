(function () {
'use strict';

app.controller('mailboxCtrl', function($rootScope, $routeParams, $scope, user, inbox, mailbox) {
	$rootScope.isLoading = true;
	$scope.title = 'Mailbox';
	$scope.mailbox = $routeParams.inbox;
	$scope.page = 1;

	var init = function() {
		inbox.get($routeParams.inbox, 1, function (err, emails) {
			$rootScope.isLoading = false;
			if(err) {
				notification.send('Could not get mail!', err.message, 'error');
			}
			$scope.mails = emails;
		});
		for (var i = 0; i < mailbox.getCurrent().inboxes.length; i++) {
			if(mailbox.getCurrent().inboxes[i]._id == $routeParams.inbox) {
				$scope.mailbox = mailbox.getCurrent().inboxes[i].name;
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
