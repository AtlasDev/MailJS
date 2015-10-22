var util = require('util');
var sys = require('../sys/main.js');
var expressSession = require('express-session');

var storage = function () {};

util.inherits(storage, expressSession.Store);

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
