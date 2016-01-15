(function () {
'use strict';

var sys = require('../../../sys/main.js');
var validator = require('validator');

exports.create = function (req, res) {
    var maxUses = req.body.maxUses || 0;
    switch (req.params.type) {
        case "contact":
            //type = 1;
            break;
        case "mailbox":
            //type = 2;
            sys.mailbox.isAdmin(req.params.id, req.user._id, function (err, isAdmin, mailbox) {
                if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                if(isAdmin !== true) {
                    return res.status(401).json({error: {name: "ENOTADMIN", message: "Not an admin of the given mailbox."}});
                }
                sys.transfer.create(mailbox._id, 2, maxUses, function (err, code) {
                    if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                    return res.json({code: code});
                });
            });
            break;
        case "domain":
            //type = 3;
            sys.domain.isAdmin(req.params.id, req.user._id, function (err, isAdmin, domain) {
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
        default:
            return res.status(404).json({error: {name: 'EVALIDATION', message: 'Invalid type.'}});
    }
};

exports.claim = function (req, res) {
    sys.transfer.findByCode(req.body.code, function (err, code) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        switch (code.type) {
            case 1:

                break;
            case 2:
                code.isValid(function (err) {
                    if (err) return res.status(err.type || 500).json({ error: {name: err.name, message: err.message} });
                    sys.mailbox.addUser(code.object, req.user, function (err, domain) {
                        if (err) return res.status(err.type || 500).json({ error: {name: err.name, message: err.message} });
                        sys.mailbox.find(code.object, function (err, mailbox) {
                            if (err) return res.status(err.type || 500).json({ error: {name: err.name, message: err.message} });
                            code.use(function (err) {
                                if (err) return res.status(err.type || 500).json({ error: {name: err.name, message: err.message} });
                                return res.json({type: 'mailbox', object: mailbox});
                            });
                        });
                    });
                });
                break;
            case 3:
                code.isValid(function (err) {
                    sys.domain.addUser(code.object, req.user._id, function (err, domain) {
                        if (err) return res.status(err.type || 500).json({ error: {name: err.name, message: err.message} });
                        code.use(function (err) {
                            if (err) return res.status(err.type || 500).json({ error: {name: err.name, message: err.message} });
                            return res.json({type: 'domain', object: domain});
                        });
                    });
                });
                break;
        }
    });
};

exports.find = function (req, res) {
    switch (req.params.type) {
        case "contact":
            //type = 1;
            break;
        case "mailbox":
            //type = 2;
            sys.mailbox.isAdmin(req.params.id, req.user._id, function (err, isAdmin, mailbox) {
                if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                if(isAdmin !== true) {
                    return res.status(401).json({error: {name: "ENOTADMIN", message: "Not an admin of the given mailbox."}});
                }
                sys.transfer.findByObject(mailbox._id, 2, function (err, codes) {
                    if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                    return res.json({type: "mailbox", codes: codes});
                });
            });
            break;
        case "domain":
            //type = 3;
            sys.domain.isAdmin(req.params.id, req.user._id, function (err, isAdmin) {
                if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                if(isAdmin !== true) {
                    return res.status(401).json({error: {name: "ENOTADMIN", message: "Not an admin of the given domain."}});
                }
                sys.transfer.findByObject(req.params.id, 3, function (err, codes) {
                    if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
                    return res.json({type: "domain", codes: codes});
                });
            });
            break;
        default:
            return res.status(404).json({error: {name: 'EVALIDATION', message: 'Invalid type.'}});
    }
};
}());
