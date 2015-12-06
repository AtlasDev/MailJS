(function () {
'use strict';

var sys = require('../../../sys/main.js');
exports.getMailboxes = function (req, res) {
    var mailboxes = req.user.mailboxes;
    var foundMailboxes = [];
    for(i = 0; i<mailboxes.length; i++) {
        sys.mailbox.find(mailboxes[i], function (err, mailbox) {
            if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
            if(mailbox === false) {
                return res.status(500).json({error: {name: 'ENOTFOUND', message: 'Mailbox `'+mailboxes[i]+'` not found, while it should be.'}});
            }
            mailbox = sys.util.copyObject(mailbox);
            sys.inbox.getInboxes(mailbox._id, function (err, inboxes) {
                if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                mailbox.inboxes = inboxes;
                foundMailboxes.push(mailbox);
                if(mailboxes.length == foundMailboxes.length) {
                    return res.json({mailboxes: foundMailboxes});
                }
            });
        });
    }
};

exports.postMailbox = function (req, res) {
    if(!req.body.local || !req.body.domain || !req.body.title) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'Request data is missing.'}});
    }
    if(typeof req.body.transferable != "boolean" && req.body.transferable) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'Transferable data is invalid.'}});
    }
    sys.perms.hasPerm('mailbox.create', req.user.group, req.authInfo, function (err, hasPerm) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        if(hasPerm === false) {
            return res.status(403).json({error: {name: 'EPERMS', message: 'Permission denied.'}});
        }
        var transferable = req.body.transferable || false;
        sys.mailbox.create(req.body.local, req.body.domain, req.user._id, req.body.title, transferable, false, function (err, mailbox) {
            if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
            return res.json({mailbox: mailbox});
        });
    });
};

exports.patchMailbox = function (req, res) {
    if(!req.body.transfercode) {
        return res.status(400).json({error: {name: 'EMISSING', message: 'Request data is missing.'}});
    }
    sys.mailbox.claimMailbox(req.body.transfercode, req.user._id, function (err, mailbox) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        return res.json({mailbox: mailbox});
    });
};

exports.getMailbox = function (req, res) {
    if(req.user.mailboxes.indexOf(req.params.mailbox) == -1) {
        sys.perms.hasPerm('mailbox.view', req.user.group, req.authInfo, function (err, hasPerm) {
            if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
            if(hasPerm === false) {
                return res.status(403).json({error: {name: 'EPERMS', message: 'Permission denied.'}});
            }
            runGetMailbox(req, res);
        });
    } else {
        runGetMailbox(req, res);
    }
};

function runGetMailbox(req, res) {
    sys.mailbox.find(req.params.mailbox, function (err, mailbox) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        if(mailbox === false) {
            return res.status(404).json({error: {name: 'ENOTFOUND', message: 'Could not find mailbox.'}});
        }
        mailbox = sys.util.copyObject(mailbox);
        sys.user.findByMailbox(mailbox._id, function (err, users) {
            if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
            if(users === false) {
                return res.status(500).json({error: {name: 'ENOTFOUND', message: 'No users found in the database!'}});
            }
            mailbox.users = [];
            for(var i = 0; i<users.length; i++) {
                var cleanUser = users[i];
                cleanUser.username = undefined;
                cleanUser.password = undefined;
                cleanUser.tfaToken = undefined;
                cleanUser.mailboxes = undefined;
                cleanUser.tfa = undefined;
                cleanUser.group = undefined;
                mailbox.users[i] = cleanUser;
                if(users.length == mailbox.users.length) {
                    sys.inbox.getInboxes(req.params.mailbox, function (err, inboxes) {
                        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                        mailbox.inboxes = inboxes;
                        return res.json({mailbox: mailbox});
                    });
                }
            }
        });
    });
}

exports.setTransferable = function (req, res) {
    sys.mailbox.setTransferable(req.body.transferable, req.params.mailbox, req.user._id, function (err, mailbox) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        return res.json({transferable: mailbox.transferable});
    });
};
}());
