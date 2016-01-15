(function () {
'use strict';

var socketio = function(http, app) {

var io = require('socket.io')(http);
var config = require('../config.json');
var sys = require('../sys/main.js');
var socketRedis = require('socket.io-redis');

io.adapter(socketRedis({ host: config.redis.host, port: config.redis.port }));

io.on('connection', function(socket) {
    socket.data = {};
    socket.data.isAuth = false;
    socket.on('user:auth', function (data) {
        sys.sessions.getSession(data.token, function (err, session) {
            if(err) {
                socket.emit('error:auth');
                socket.disconnect();
                return false;
            }
            sys.user.find(session.id, function (err, user) {
                socket.data.user = user;
                if(err) {
                    socket.emit('error:auth');
                    socket.disconnect();
                    return false;
                }
                if(!user) {
                    socket.emit('error:auth');
                    socket.disconnect();
                    return false;
                }
                if(user.mailboxes.length === 0) {
                    socket.emit('error:nomailbox');
                    socket.disconnect();
                    return false;
                }
                for (var i = 0; i < user.mailboxes.length; i++) {
                    socket.join('m:'+user.mailboxes[i]);
                }
                socket.join('u:'+user._id);
                socket.data.isAuth = true;
                socket.emit('user:auth');
            });
        });
    });
});

return io;

};

module.exports = socketio;
}());
