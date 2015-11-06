var sys = require('../../../sys/main.js');
var util = require('../../../util.js');

exports.postInbox = function (req, res) {
    if(req.user.mailboxes.indexOf(req.body.mailbox) == -1) {
        return res.status(403).json({error: {name: 'EPERMS', message: 'No member of the given mailbox.'}});
    }
    sys.mailbox.isAdmin(req.body.mailbox, req.user._id, function (err, isAdmin) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        if (isAdmin == true) {
            sys.inbox.createInbox(req.body.mailbox, req.body.title, function (err, inbox) {
                if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                //TODO send creation event over Socket.IO
                return res.json({inbox: inbox});
            });
        } else {
            return res.status(403).json({error: {name: 'EPERMS', message: 'Not an admin.'}});
        }
    });
}
