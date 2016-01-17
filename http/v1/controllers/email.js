(function () {
'use strict';

var sys = require('../../../sys/main.js');
exports.get = function (req, res) {
    sys.email.getEmail(req.params.id, function (err, mail) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        if(req.user.mailboxes.indexOf(mail.mailbox) == -1) {
            error = new Error('Permissions denied!');
            error.name = 'EPERM';
            error.type = 401;
            return cb(error);
        }
        return res.json({mail: mail});
    });
};
}());
