(function () {
'use strict';

var sys = require('../../../sys/main.js');
exports.postClient = function(req, res) {
    sys.perms.checkOauth(req, res, function (err) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        if(!req.body.name || !req.body.description || !req.body.scopes || !req.body.url || !(req.body.scopes instanceof Array)) {
            return res.status(400).json({error: {name: "EINVALID", message: 'Invalid parameters.'}});
        }
        sys.client.create(req.user, req.body.name, req.body.description, req.body.url, req.body.scopes, function (err, client) {
            if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
            return res.json({ message: 'Client added.', client: client });
        });
    });
};

exports.getOwnClients = function(req, res) {
    if ((req.param.limitBy && isNaN(req.param.limitBy)) || (req.param.skip && isNaN(req.param.skip))) {
        return res.status(400).json({error: {name: "EINVALID", message: 'Invalid parameters.'}});
    }
    sys.client.get(req.user._id, req.param.limitBy, req.param.skip, function (err, clients) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        for (var i = 0, len = clients.length; i < len; i++) {
            clients[i].secret = undefined;
        }
        return res.json({message: 'Clients recieved.', amount: clients.length, clients: clients});
    });
};

//deprecated TODO
exports.deleteClients = function(req, res) {
    if(!req.body.id) {
        res.status(400).json({error: {name: "EINVALID", message: 'No id given.'}});
        return;
    }
    sys.client.remove(req.body.id, function (err) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        return res.json({message: 'Client deleted.'});
    });
};
}());
