var sys = require('../../../sys/main.js');

exports.getSessions = function (req, res) {
    sys.sessions.sessionsOfUser(req.user._id, function (err, sess) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        var serializedSessions = [];
        for(var i = 0; i<sess.length; i++) {
            var singelSession = {};
            singelSession.id = sess[i]._id;
            singelSession.reads = sess[i].reads;
            singelSession.idle = Date.now() - sess[i].lastSeen;
            singelSession.ip = sess[i].ip;
            singelSession.finishedTFA = sess[i].session.finishTFA;
            singelSession.userAgent = sess[i].session.useragent;
            serializedSessions.push(singelSession);
            if(i == sess.length-1) {
                res.json({session: serializedSessions});
            }
        }
    });
}

exports.deleteSession = function (req, res) {
    if(!req.params.sid) {
        return res.status(400).json({error:{status:"EMISSING",message:"Request data is missing."}});
    }
    if(req.params.sid == req.session.sessionID) {
        return res.status(400).json({error:{status:"EINVALID",message:"Cannot kill current session."}});
    }
    sys.sessions.destroy(req.params.sid, req.user.id, function (err) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        return res.json({message: "Session deleted."});
    });
}
