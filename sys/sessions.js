var Session = require('../models/session.js');
var cookieParser = require('cookie-parser');
var config = require('../config.json');

exports.create = function (sid, userID, session, cb) {
    var sess = new Session({
        sid: sid,
        session: session,
        user: userID,
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
    if(signedID == sid) {
        return cb(null, null);
    }
    Session.findOne({sid: sid}, function (err, sess) {
        console.log(sess);
        if(err) {
            return cb(err);
        }
        if(!sess) {
            return cb(null, null);
        }
        return cb(null, sess.toObject());
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
    Sessions.find({user: userID}, function (err, sessions) {
        if(err) {
            return cb(err);
        }
        var sess = [];
        for (var i = 0; i < sessions.length; i++) {
            var session = sessions[i];
            session.sid = undefined;
            sess.push(session.toObject());
            if(i == sessions.length) {
                return cb(null, sess);
            }
        }
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
