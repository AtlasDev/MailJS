'use strict';

var frontend = function frontend(http, app) {

var express = require('express');
var io = require('socket.io')(http);
var sessions = require('../sessions.js');
var util = require('../util.js');
var socketRedis = require('socket.io-redis');
var redisMod = require('redis');
var config = require('../config.json');
var sys = require('../sys/main.js');

var pub = redisMod.createClient(config.redis.port, config.redis.host, {return_buffers: true});
var sub = redisMod.createClient(config.redis.port, config.redis.host, {return_buffers: true});

io.adapter(socketRedis({ key: 'events', pubClient: pub, subClient: sub }));

io.use(function(socket, next){
    sessions.socket(socket, function(err, user, SessionID) {
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
    if(socket.data.user.mailboxes.length == 0) {
        socket.emit('error:nomailbox');
        socket.disconnect();
        return false;
    }
    var userObject = {};
    userObject.username = socket.data.user.username;
    userObject.firstName = socket.data.user.firstName;
    userObject.lastName = socket.data.user.lastName;
    userObject.mailboxes = [];
    userObject.uuid = socket.data.user._id;
    userObject.group = socket.data.user.group;
    for (var i = 0; i < socket.data.user.mailboxes.length; i++) {
        socket.join(socket.data.user.mailboxes[i]);
        sys.mailbox.find(socket.data.user.mailboxes[i], function (err, mailbox) {
            if(err) {
                socket.emit('error:dberror');
                socket.disconnect();
                return false;
            }
            if(mailbox == false) {
                socket.emit('error:nomailbox');
                socket.disconnect();
                return false;
            }
            userObject.mailboxes.push(mailbox);
            if(i >= socket.data.user.mailboxes.length) {
                socket.join(socket.data.user._id);
                socket.emit('user:info', userObject);
            }
        });
    }
    socket.on('user:logout', function() {
        sessions.killSession(socket.data.sid, function (err) {
            if(err) { return util.error('Session kill errored', err)};
            socket.disconnect();
        })
    });
});

};

module.exports = frontend;
