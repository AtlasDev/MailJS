(function () {
'use strict';

app.controller('mailboxCtrl', function($rootScope, $routeParams, $scope, user, inbox, mailbox) {
	$rootScope.isLoading = true;
	$scope.title = 'Mailbox';
	$scope.mailbox = $routeParams.inbox;
	$scope.page = 1;
	var getMailPage = function (page, cb) {
		var req = {
			method: 'GET',
			url: '/api/v1/inbox/'+$routeParams.mailbox+'/'+(page-1)*$scope.limit+'/'+$scope.limit,
			headers: {
				'x-token': user.sessionID
			}
		};
		$http(req).then(function(res) {
			$rootScope.isLoading = false;
			return cb(res.data.emails);
		}, function(res) {
			$rootScope.isLoading = false;
			notification.send('Could not get mail!', res.data.message, 'error');
			return cb(null);
		});
	};
	var init = function() {
		getMailPage(1, function (emails) {
			$scope.mails = emails;
		});
		currentInbox = mailbox.getCurrent();
		for (var i = 0; i < currentInbox.inboxes.length; i++) {
			if(currentInbox.inboxes[i]._id == $routeParams.mailbox) {
				$scope.mailbox = currentInbox.inboxes[i].name;
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
