(function () {
'use strict';

var socketio = function(http, app) {

var express = require('express');
var io = require('socket.io')(http);
var config = require('../config.json');
var sys = require('../sys/main.js');
var cluster = require('cluster');
var socketRedis = require('socket.io-redis');

io.adapter(socketRedis({ host: config.redis.host, port: config.redis.port }));

io.use(function(socket, next){
    sys.sessions.socket(socket, function(err, user, SessionID) {
        if(err) {
            return next(err);
        }
        socket.data = {};
        socket.data.user = user;
        socket.data.sid = SessionID;
        return next();
    });
});

io.on('connection', function(socket) {
    if(!socket.data.user) {
        socket.emit('error:nodata');
        socket.disconnect();
        return false;
    }
    if(socket.data.user.mailboxes.length === 0) {
        socket.emit('error:nomailbox');
        socket.disconnect();
        return false;
    }
    for (var i = 0; i < socket.data.user.mailboxes.length; i++) {
        socket.join(socket.data.user.mailboxes[i]);
    }
});

return io;

};

module.exports = socketio;
}());
