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
});

};

module.exports = frontend;
