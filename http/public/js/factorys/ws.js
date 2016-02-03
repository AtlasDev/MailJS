app.factory('socket', function ($rootScope, $cookies, $websocket, notification) {
    var status = 1;
    var ws = $websocket('wss://'+document.location.host);

    // Events:
    // socketStatusChange
    // socketMessage

    ws.onMessage(function (event) {
        var message = JSON.parse(event.data);
        if(message.type == 'error') {
            notification.send('An error has occured!', message.error.message+' ('+message.error.name+')', 'error');
            if(message.error.name == "EAUTH") {
        		$cookies.remove('MailJS');
        		$window.location.href = '/index.html?msg=Authentication%20failure!';
            }
        } else {
            switch (message.eventName) {
                case 'S:responsive':
                    ws.send(JSON.stringify({
                        type: 'event',
                        eventName: 'auth',
                        data: {
                            token: $cookies.get('MailJS'),
                            type: 'session'
                        }
                    }));
                    break;
                case 'S:authSuccess':
                    status = 2;
                    $rootScope.$emit('socketStatusChange');
                    break;
            }
        }
    });

    ws.onClose(function () {
        status = 0;
        $rootScope.$emit('socketStatusChange');
    });

    ws.onOpen(function () {
        status = 3;
        $rootScope.$emit('socketStatusChange');
    });

    function getStatus() {
        return status;
    }

    function getSocket() {
        return ws;
    }

    return {
        getStatus: getStatus,
        getSocket: getSocket
    };
});
