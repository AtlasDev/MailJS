(function () {
'use strict';

var sys = require('../../../sys/main.js');
exports.postInbox = function (req, res) {
    if(req.user.mailboxes.indexOf(req.body.mailbox) == -1) {
        return res.status(403).json({error: {name: 'EPERMS', message: 'Not a member of the given mailbox.'}});
    }
    sys.mailbox.isAdmin(req.body.mailbox, req.user._id, function (err, isAdmin) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        if (isAdmin === true) {
            sys.inbox.createInbox(req.body.mailbox, req.body.title, function (err, inbox) {
                if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                //TODO send creation event over Socket.IO
                return res.json({inbox: inbox});
            });
        } else {
            return res.status(403).json({error: {name: 'EPERMS', message: 'Not an admin.'}});
        }
    });
};

exports.getInbox = function (req, res) {
    var skip = req.params.skip || 0;
    var limit = req.params.limit || 20;
    var inboxID = req.params.inbox;
    sys.inbox.get(inboxID, function (err, inbox) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        if(!inbox) {
            return res.status(403).json({error: {name: 'EPERMS', message: 'Not a member of the given inbox.'}});
        }
        if(req.user.mailboxes.indexOf(inbox.mailbox) == -1) {
            return res.status(403).json({error: {name: 'EPERMS', message: 'Not a member of the given inbox.'}});
        }
        sys.email.getEmails(inboxID, limit, skip, function (err, emails) {
            if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
            return res.json({emails: emails});
        });
    });
};
}());
