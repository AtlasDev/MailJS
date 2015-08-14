var config = require('./config.json');
var RedisSessions = require("redis-sessions");
var redis = require('./redis.js');
var User = require('./models/user.js');
var mongoose = require('mongoose');
var cookie = require('cookie');

function sessions() {
    this.sessions = new RedisSessions({client: redis, namespace: 'sess'});
    this.appName = 'MailJS'
    var _this = this;
    redis.get('settings:sessionKey', function (err, key) {
        _this.sessionKey = key;
    });
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
    User.findOne({username: username}, function (err, user) {
        if(err){ cb(err, null) };
        options.group = user.group;
        options.username = user.username;
        _this.sessions.create({
            app: _this.appName,
            id: user._id,
            ip: ip,
            ttl: 3600,
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
    _this.sessions.kill({
            app: _this.appName,
            token: token
        },
        function(err, resp) {
            if(err) { return cb(err) };
            cb();
        }
    );
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

sessions.prototype.express = function(req, res, next) {
    next();
}

sessions.prototype.socket = function(socket, cb) {
    var _this = this;
    var token = socket.handshake.query.session;
    if(token && token != '') {
        _this.getSession(token, function (err, session) {
            if(err) { return cb(new Error('Authentication error')); };
            User.findById(session.id, function (err, user) {
                cb(null, user, token);
            })
        })
    } else {
        cb(new Error('Authentication error'));
    }
}

module.exports = new sessions();
