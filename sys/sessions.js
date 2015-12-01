var config = require('../config.json');
var RedisSessions = require("redis-sessions");
var redis = require('../redis.js');
var sys = require('../sys/main.js');
var mongoose = require('mongoose');

function sessions() {
    this.sessions = new RedisSessions({client: redis, namespace: 'sess'});
    this.appName = 'MailJS'
    var _this = this;
};

sessions.prototype.create = function(username, ip, other, callback) {
    var _this = this;
    var options;
    var cb;
    if(!callback) {
        cb = other;
        options = '{}';
    } else {
        cb = callback;
        options = other;
    }
    sys.user.findByUsername(username, function (err, user) {
        if(err){ cb(err, null) };
        options.group = user.group;
        options.username = user.username;
        options._id = user._id;
        options.mailboxes = user.mailboxes;
        _this.sessions.create({
            app: _this.appName,
            id: user._id,
            ip: ip,
            ttl: 86400,
            d: options
        },
        function(err, resp) {
            if(err) { return cb(err, null); }
            cb(null, resp.token);
        });
    })
}

sessions.prototype.getSessions = function (id, cb) {
    var _this = this;
    _this.sessions.soid({
            app: _this.appName,
            id: id
        },
        function(err, resp) {
            if(err) { return cb(err, null) };
            cb(null, resp.sessions);
        }
    );
}

sessions.prototype.killSession = function (token, cb) {
    var _this = this;
    this.sessions.kill({
            app: _this.appName,
            token: token
        },
        function(err, resp) {
            if(err) { return cb(err) };
            cb();
        }
    );
}

sessions.prototype.killAll = function (user, cb) {
    var _this = this;
    this.sessions.killsoid({
        app: _this.appName,
        id: user
    }, function (err, resp) {
        return cb(err, resp);
    });
}

sessions.prototype.getSession = function (token, cb) {
    var _this = this;
    _this.sessions.get({
            app: _this.appName,
            token: token
        },
        function(err, resp) {
            if(err) { return cb(err, null) };
            cb(null, resp);
        }
    );
}

sessions.prototype.socket = function(socket, cb) {
    var _this = this;
    if(!socket.handshake.headers.cookie) {
        return cb(new Error('Authentication error'));
    }
    var cookies = socket.handshake.headers.cookie.split('; ');
    for (var i = 0; i < cookies.length; i++) {
        if(cookies[i].split('=')[0]=='MailJS') {
            var token = cookies[i].split('=');
            if(token[1] && token[1] != '') {
                _this.getSession(token[1], function (err, session) {
                    if(err) { return cb(new Error('Authentication error')); };
                    sys.user.find(session.id, function (err, user) {
                        if(err) {
                            return cb(new Error('Authentication error'));
                        }
                        return cb(null, user, token[1]);
                    })
                })
            } else {
                return cb(new Error('Authentication error'));
            }
        }
    }
}

module.exports = new sessions();
