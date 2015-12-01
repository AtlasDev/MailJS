var sys = require('../../../sys/main.js');

exports.getSessions = function (req, res) {
    sys.sessions.getSessions(req.user._id, function (err, sess) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        var serializedSessions = [];
        for(var i = 0; i<sess.length; i++) {
            var singelSession = {};
            singelSession.id = sess[i].id;
            singelSession.reads = sess[i].r;
            singelSession.writes = sess[i].w;
            singelSession.idle = sess[i].idle;
            singelSession.ip = sess[i].ip;
            singelSession.finishedTFA = sess[i].d.finishTFA;
            singelSession.userAgent = sess[i].d.useragent;
            serializedSessions.push(singelSession);
            if(i == sess.length-1) {
                res.json({session: serializedSessions});
            }
        }
    });
}
