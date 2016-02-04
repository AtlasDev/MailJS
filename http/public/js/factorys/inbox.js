app.factory('inbox', function ($http, user, socket) {
    var inboxes = {};

    var get = function getInbox(inbox, page, cb) {
        page = page || 1;
        if(inboxes[inbox]) {
            return cb(null, inboxes[inbox]);
        } else {
            reqInbox(inbox, page, cb);
        }
    };

    var reqInbox = function reqInbox(inbox, page, cb) {
        var req = {
			method: 'GET',
			url: '/api/v1/inbox/'+inbox+'/'+(page-1)*40+'/'+40,
			headers: {
				'x-token': user.sessionID
			}
		};
		$http(req).then(function(res) {
            inboxes[inbox] = res.data.emails;
			return cb(null, res.data.emails);
		}, function(res) {
            var error;
            if(res.data.error) {
                error = new Error('Could not get inbox!');
                error.name = res.data.error.message+' ('+res.data.error.name+')';
    			return cb(error);
            } else {
                error = new Error('Could not get inbox!');
                error.name = 'Internal Server Error';
    			return cb(error);
            }
		});
    };

    return {
        get: get
    };
});
