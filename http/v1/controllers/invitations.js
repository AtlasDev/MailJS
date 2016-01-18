(function () {
'use strict';

var sys = require('../../../sys/main.js');

exports.create = function (req, res) {
    if(req.user.isAdmin != true) {
        return res.status(401).json({error: {name: 'EPERM', message: 'Permission denied'}});
    }
    sys.invitation.create(req.body.message, function (err, invite) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        return res.json({invite: invite});
    });
}
}());
