app.factory('inbox', function ($rootScope, $http, user, notification) {
    var inboxes = {};

    var getInbox = function getInbox(inbox, page, cb) {
        if(inboxes[inbox]) {

        } else {
            reqInbox(inbox, page, function (err, inbox) {
                if(err) {

        			$rootScope.isLoading = false;
        			notification.send('Could not get mail!', res.data.message, 'error');
                }
            });
        }
		var req = {
			method: 'GET',
			url: '/api/v1/inbox/'+inbox+'/'+(page-1)*40+'/'+40,
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

    return {
        getInbox: getInbox
    };
});
