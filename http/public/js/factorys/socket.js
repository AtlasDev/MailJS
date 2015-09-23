'use strict';

app.factory('socket', function ($rootScope) {
    var socket = io.connect(document.location.protocol+'//'+document.location.host);
    var status = 0;

    // Events:
    // socketStatusChange

    socket.on('connect', function () {
        status = 2;
        $rootScope.$emit('socketStatusChange');
    });
    socket.on('disconnect', function () {
        status = 0;
        $rootScope.$emit('socketStatusChange');
    });
    socket.on('reconnecting', function () {
        status = 1;
        $rootScope.$emit('socketStatusChange');
    });

    function on(eventName, callback) {
        socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        });
    }

    function emit(eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        });
    }

    function getStatus() {
        return status;
    }

    return {
        on: on,
        emit: emit,
        getStatus: getStatus
    };
});
