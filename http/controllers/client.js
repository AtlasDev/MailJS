var sys = require('../../sys/main.js');
var util = require('../../util.js');

exports.postClients = function(req, res) {
    if(!req.body.name || !req.body.description || !req.body.scopes) {
        return res.status(400).json({error: {name: "EINVALID", message: 'Missing parameters.'}});
    }
    sys.client.create(req.user, req.body.name, req.body.description, req.body.scopes, function (err, client) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        return res.json({ message: 'Client added!', data: client });
    });
};

exports.getClients = function(req, res) {
    var limitBy = null;
    var skip = null;
    if (typeof req.body.limit == "number") {
        limitBy = req.body.limit;
    }
    if (typeof req.body.skip == "number") {
        limitBy = req.body.skip;
    }
    sys.client.get(req.user._id, limitBy, skip, function (err, clients) {
        if(err) {
             return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        for (var i = 0, len = clients.length; i < len; i++) {
            delete clients[i].secret;
        }
        return res.json({message: 'Clients recieved.', amount: clients.length, data: clients});
    });
};

exports.deleteClients = function(req, res) {
    if(!req.body.id) {
        res.status(400).json({error: {name: "EINVALID", message: 'No id given.'}});
        return;
    }
    sys.client.remove(req.body.id, function (err) {
        if(err) {
             return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        return res.json({message: 'Client deleted.'});
    })
};
