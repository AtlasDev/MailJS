var Session = require('../models/session.js');
var cookieParser = require('cookie-parser');
var config = require('../config.json');
var validator = require('validator');

exports.create = function (sid, userID, ip, session, cb) {
    var sess = new Session({
        sid: sid,
        session: session,
        user: userID,
        ip: ip,
        lastSeen: Date.now()
    });
    sess.save(function (err) {
        if(err) {
            return cb(err);
        }
        return cb();
    });
}

exports.get = function (signedID, cb) {
    if(!signedID) {
        return cb(new Error('No sessionID given'));
    }
    var sid = cookieParser.signedCookie(signedID, config.secret);
    Session.findOne({sid: sid}, function (err, sess) {
        if(err) {
            return cb(err);
        }
        if(!sess) {
            return cb(null, null);
        }
        sess.reads = sess.reads++;
        sess.lastSeen = Date.now();
        sess.save(function (err) {
            if(err) {
                return cb(err);
            }
            return cb(null, sess.toObject());
        });
    });
}

exports.destroy = function (sid, user, cb) {
    if (!validator.isMongoId(sid)) {
        var error = new Error('Invalid session ID!');
        error.name = 'EVALIDATION';
        error.type = 400;
        return cb(error);
    }
    Session.findById(sid, function(err, session){
        if(err) {
            return cb(err);
        }
        if(!session) {
            var error = new Error('Session not found!');
            error.name = 'ENOTFOUND';
            error.type = 404;
            return cb(error);
        }
        if(user != session.user && user != null) {
            var error = new Error('Session not yours!');
            error.name = 'EDENIED';
            error.type = 403;
            return cb(error);
        }
        session.remove(function (err) {
            if(err) {
                return cb(err);
            }
            return cb();
        })
    });
}

exports.sessionsOfUser = function (userID, cb) {
    Session.find({user: userID}, function (err, sessions) {
        if(err) {
            return cb(err);
        }
        return cb(null, sessions);
    })
}

exports.destroyOfUser = function (userID, cb) {
    Session.findAndRemove({user: userID}, function(err){
        if(err) {
            return cb(err);
        }
        return cb();
    });
}
