var sys = require('../../../sys/main.js');
var sessions = require('../../../sessions.js');

exports.getSessions = function (req, res) {
    sessions.getSessions(req.user.username, function (err, sess) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        var serializedSessions = [];
        for(var i = 0; i<sess.length; i++) {
            var singelSession = {};
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