(function () {
'use strict';

var sys = require('../../../sys/main.js');
var validator = require('validator');

exports.create = function (req, res) {
    var maxUses = req.body.maxUses || 0;
    switch (req.params.type) {
        case "domain":
            sys.domain.isAdmin(req.params.domain, req.user._id, function (err, isAdmin, domain) {
                if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                if(isAdmin !== true) {
                    return res.status(401).json({error: {name: "ENOTADMIN", message: "Not an admin of the given domain."}});
                }
                sys.transfer.create(domain._id, 3, maxUses, function (err, code) {
                    if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                    return res.json({code: code});
                });
            });
            break;
        case "mailbox":
            type = 2;
            break;
        case "contact":
            type = 1;
            break;
        default:
            return res.status(404).json({error: {name: 'EVALIDATION', message: 'Invalid transfer type.'}});
    }
};

exports.claim = function (req, res) {
    sys.transfer.findByCode(req.body.code, function (err, code) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        switch (code.type) {
            case 1:

                break;
            case 2:

                break;
            case 3:

                break;
        }
    });
};
}());
