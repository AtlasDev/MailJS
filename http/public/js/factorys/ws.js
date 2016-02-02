app.factory('socket', function ($rootScope, $cookies, ws, notification) {
    var status = 0;

    //For testing purposes only
    ws.on('message', function (event) {
        console.log('New message', event.data);
    });

    // Events:
    // socketStatusChange

    ws.on('connect', function () {
        status = 3;
        ws.send(JSON.stringify({
            type: 'event',
            eventName: 'auth',
            data: {
                token: $cookies.get('MailJS'),
                type: 'session'
            }
        }));
        $rootScope.$emit('socketStatusChange');
    });

    ws.on('disconnect', function () {
        status = 0;
        $rootScope.$emit('socketStatusChange');
    });

    ws.on('authSuccess', function () {
        status = 2;
        $rootScope.$emit('socketStatusChange');
    });

    ws.on('message', function (event) {
        if(event.type == 'error') {
            notification.send('An error has occured!', event.error.message+' ('+event.error.name+')', 'error');
            if(event.error.name == "EAUTH") {
        		$cookies.remove('MailJS');
        		$window.location.href = '/index.html?msg=Authentication%20failure!';
            }
        } else {
            // handle events
        }
    });

    function getStatus() {
        return status;
    }

    return {
        getStatus: getStatus
    };
});
