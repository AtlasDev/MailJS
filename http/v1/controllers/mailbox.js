var sys = require('../../../sys/main.js');

exports.getMailbox = function (req, res) {
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
    var transferable = req.body.transferable || false;
    sys.mailbox.create(req.body.local, req.body.domain, req.user._id, transferable, false, function (err, mailbox) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        return res.json({mailbox: mailbox});
    });
}
