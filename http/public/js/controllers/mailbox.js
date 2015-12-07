(function () {
'use strict';

app.controller('mailboxCtrl', function($rootScope, $routeParams, $scope, $http, user, notification, mailbox) {
	$rootScope.isLoading = true;
	$scope.title = 'Mailbox';
	$scope.mailbox = $routeParams.mailbox;
	$scope.page = 1;
	$scope.limit = 40;
	$scope.mailCount = 0;
	$scope.selected = [];
	var currentInbox;
	$scope.select = function (id) {
		if($scope.selected.indexOf(id) > -1) {
			$scope.selected.splice($scope.selected.indexOf(id), 1);
			return;
		} else {
			$scope.selected.push(id);
			return;
		}
	};
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
			notification.send('Internal Server Error', 'The server errored, please report this to your sysadmin.', 'error');
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
    if(typeof user.getUser()._id == "undefined") {
        $rootScope.$on('currentMailboxChange', function () {
            init();
        });
    } else {
        init();
    }
});
}());
