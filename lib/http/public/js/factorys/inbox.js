app.factory('inbox', function ($http, user, socket) {
    var inboxes = {};

    var get = function get(inbox, cb) {
        if(inboxes[inbox]) {
            return cb(null, inboxes[inbox]);
        } else {
            reqInbox(inbox, 1, cb);
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

    socket.getSocket().onMessage(function (event) {
        var message = JSON.parse(event.data);
        if(message.type == 'event') {
            if(message.eventName == 'M:emailReceived') {
                if(inboxes[message.data.email.inbox]) {
                    inboxes[message.data.email.inbox].push(message.data.email);
                }
            } else if(message.eventName == 'M:emailDeleted') {
                if(inboxes[message.data.email.inbox]) {
                    for (var i = 0; i < inboxes[message.data.email.inbox].length; i++) {
                        if(inboxes[message.data.email.inbox][i]._id == message.data.email._id) {
                            inboxes[message.data.email.inbox].splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
    });

    return {
        get: get
    };
});
