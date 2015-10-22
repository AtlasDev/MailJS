var Session = require('../models/session.js');

exports.create = function (sid, session, cb) {
    Session.findOne({sid: sid}, function (err, sess) {
        if(err) {
            return cb(err);
        }
        if(!sess){
            var sess = new Session({
                sid: sid,
                session: session,
                lastSeen: Date.now()
            });
            sess.save(function (err) {
                if(err) {
                    return cb(err);
                }
                return cb();
            });
        } else {
            sess.session = session;
            sess.lastSeen = Date.now();
            sess.save(function (err) {
                if(err) {
                    return cb(err);
                }
                return cb();
            });
        }
    });
}

exports.upgrade = function (sid, user, cb) {
    Session.update({sid: sid}, {user: user, lastSeen: Date.now()}, function (err, sess) {
        if(err) {
            return cb(err);
        }
        return cb(null, sess.toObject());
    });
}

exports.get = function (sid, cb) {
    Session.findOne({sid: sid}, function (err, sess) {
        if(err) {
            return cb(err);
        }
        if(!sess) {
            return cb(null, null);
        }
        return cb(null, sess.toObject());
    });
}

exports.touch = function (sid, cb) {
    Session.update({sid: sid}, {lastSeen: Date.now()}, function (err, sess) {
        if(err) {
            return cb(err);
        }
        if(!sess) {
            return cb(new Error('Session not found.'))
        }
        return cb();
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
