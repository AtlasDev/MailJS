var sys = require('../../../sys/main.js');
var util = require('../../../util.js');

exports.getMailboxes = function (req, res) {
    var mailboxes = req.user.mailboxes;
    var foundMailboxes = [];
    for(i = 0; i<mailboxes.length; i++) {
        sys.mailbox.find(mailboxes[i], function (err, mailbox) {
            if(err) {
                return res.status(500).json({error: {name: err.name, message: err.message}});
            }
            if(mailbox == false) {
                return res.status(500).json({error: {name: 'ENOTFOUND', message: 'Mailbox `'+mailboxes[i]+'` not found, while it should be.'}});
            }
            foundMailboxes.push(mailbox);
            if(mailboxes.length == foundMailboxes.length) {
                return res.json({mailboxes: foundMailboxes});
            }
        });
    }
}

exports.postMailbox = function (req, res) {
    if(!req.body.local || !req.body.domain) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'Request data is missing.'}});
    }
    if(typeof req.body.transferable != "boolean" && req.body.transferable) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'Transferable data is invalid.'}});
    }
    sys.perms.hasPerm('mailbox.create', req.user.group, req.authInfo, function (err, hasPerm) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        if(hasPerm == false) {
            return res.status(403).json({error: {name: 'EPERMS', message: 'Permission denied.'}});
        }
        var transferable = req.body.transferable || false;
        sys.mailbox.create(req.body.local, req.body.domain, req.user._id, transferable, false, function (err, mailbox) {
            if(err) {
                if(err.name == "EOCCUPIED") {
                    return res.status(400).json({error: {name: err.name, message: err.message}});
                }
                return res.status(500).json({error: {name: err.name, message: err.message}});
            }
            return res.json({mailbox: mailbox});
        });
    });
}

exports.getMailbox = function (req, res) {
    if (!req.params.mailbox.toString().match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'Invalid mailbox ID!'}});
    }
    if(req.user.mailboxes.indexOf(req.params.mailbox) == -1) {
        sys.perms.hasPerm('mailbox.view', req.user.group, req.authInfo, function (err, hasPerm) {
            if(err) {
                return res.status(500).json({error: {name: err.name, message: err.message}});
            }
            if(hasPerm == false) {
                return res.status(403).json({error: {name: 'EPERMS', message: 'Permission denied.'}});
            }
            runGetMailbox(req, res);
        });
    } else {
        runGetMailbox(req, res);
    }
}

function runGetMailbox(req, res) {
    sys.mailbox.find(req.params.mailbox, function (err, mailbox) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        if(mailbox == false) {
            return res.status(404).json({error: {name: 'ENOTFOUND', message: 'Could not find mailbox.'}});
        }
        mailbox = util.copyObject(mailbox);
        sys.user.findByMailbox(mailbox._id, function (err, users) {
            if(err) {
                return res.status(500).json({error: {name: err.name, message: err.message}});
            }
            if(users == false) {
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
                    return res.json({mailbox: mailbox});
                }
            }
        })
    });
}
