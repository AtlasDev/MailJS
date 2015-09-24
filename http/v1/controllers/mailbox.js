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
            if(mailboxes.length == i) {
                return res.json({mailboxes: foundMailboxes});
            }
        });
    }
}
