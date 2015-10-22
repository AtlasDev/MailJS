var events = require('events');
var util = require('util');
var mongoose = require('mongoose');
var sys = require('../sys/main.js');

var storage = function () {
    this.ttl = 1000*60*60*2 //2 hours
    this.interval = 1000*60*10 //10 minutes
    this.mongoose = mongoose;
};

var EventEmitter = events.EventEmitter;
util.inherits(storage, EventEmitter);

storage.prototype.destroy = function (sid, cb) {
    sys.sessions.destroy(sid, cb);
}

storage.prototype.get = function (sid, cb) {
    sys.sessions.get(sid, function (err, sess) {
        if(err) {
            return cb(err);
        }
        if(!sess) {
            return cb(null, null);
        }
        return cb(null, sess.session);
    })
}

storage.prototype.set = function (sid, session, cb) {
    sys.sessions.create(sid, session, cb);
}

storage.prototype.touch = function (sid, session, cb) {
    sys.sessions.touch(sid, cb);
}
module.exports = storage;
