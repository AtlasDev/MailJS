'use strict';

var socketio = function(http, app) {

var express = require('express');
var io = require('socket.io')(http);
var util = require('../util.js');
var config = require('../config.json');
var sys = require('../sys/main.js');
var cluster = require('cluster');
var cookieParser = require('cookie-parser');

io.use(function(socket, next){
    var _this = this;
    if(!socket.handshake.headers.cookie) {
        return next(new Error('Authentication error'));
    }
    var cookies = socket.handshake.headers.cookie.split('; ');
    for (var i = 0; i < cookies.length; i++) {
        if(cookies[i].split('=')[0]=='MailJS') {
            var token = cookies[i].split('=');
            if(token[1] && token[1] != '') {
                sys.sessions.get(token[1], function (err, session) {
                    if(err) { return next(new Error('Authentication error')); };
                    if(!session) {
                        return next(new Error('Authentication error'));
                    }
                    sys.user.findByUsername(session.id, function (err, user) {
                        if(err) {
                            return next(new Error('Authentication error'));
                        }
                        socket.data = {};
                        socket.data.user = user;
                        socket.data.sid = token[1];
                        return next();
                    });
                });
            } else {
                return next(new Error('Authentication error'));
            }
        }
    }
});

io.on('connection', function(socket) {
    if(!socket.data.user) {
        socket.emit('error:nodata');
        socket.disconnect();
        return false;
    }
    if(socket.data.user.mailboxes.length == 0) {
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
