var Session = require('../models/session.js');
var cookieParser = require('cookie-parser');
var config = require('../config.json');

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
    signedID = signedID.replace('%3A', ':');
    signedID = signedID.replace('%2B', '+');
    signedID = signedID.replace('%2F', '/');
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

exports.destroy = function (sid, cb) {
    Session.findOneAndRemove({sid: sid}, function(err){
        if(err) {
            return cb(err);
        }
        return cb();
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
