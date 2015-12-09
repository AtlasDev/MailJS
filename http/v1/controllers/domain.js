(function () {
'use strict';

var sys = require('../../../sys/main.js');
exports.getDomains = function (req, res) {
    sys.domain.getDomains(req.user._id, function (err, domains) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        return res.json({domains: domains});
    });
};

exports.postDomain = function (req, res) {
    if(!req.body.domain || !new RegExp(/^([a-z0-9]+\.)?[a-z0-9][a-z0-9-]*\.[a-z]{2,6}$/i).test(req.body.domain)) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'Domain missing or invalid.'}});
    }
    if(req.body.disabled && typeof req.body.disabled != "boolean") {
        return res.status(400).json({error: {name: 'EINVALID', message: 'Invalid disabled value.'}});
    }
    if(req.user.isAdmin === false) {
        return res.status(403).json({error: {name: 'EPERM', message: 'Permission denied.'}});
    }
    sys.perms.checkOauth(req, res, function (err) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        var disabled = req.body.disabled || false;
        sys.domain.create(req.body.domain, req.user._id, disabled, function (err, domain) {
            if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
            return res.json({domain: domain});
        });
    });
};
}());
