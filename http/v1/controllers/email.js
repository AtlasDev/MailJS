(function () {
'use strict';

var sys = require('../../../sys/main.js');
exports.get = function (req, res) {
    sys.email.getEmail(req.params.id, req.user.mailboxes, function (err, mail) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        return res.json({mail: mail});
    });
};

exports.delete = function (req, res) {
    sys.email.deleteEmail(req.params.id, req.user.mailboxes, function (err, mail) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        return res.json({mail: mail});
    });
};

exports.getAttachment = function (req, res) {
    sys.email.getAttachment(req.params.attachmentID, req.user.mailboxes, function (err, attachment) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        res.setHeader('Content-Disposition', 'attachment; filename=\"' + attachment.fileName+'\"');
        res.setHeader('Content-Type', attachment.contentType);
        res.type(attachment.contentType);
        res.end(attachment.content.buffer, 'binary');
    });
};
}());
