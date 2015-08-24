var Client = require('../../models/client.js');
var Perm = require('../../models/permissions.js');
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
    sys.client.get(req.user._id)
    Client.find({ userId: req.user._id }, function(err, clients) {
        if (err) {
            res.status(500).json({error: {name: err.name, message: err.message}});
            return;
        }
        var cleanClients = [];
        clients.forEach(function(client) {
            cleanClients.push({_id: client._id, name: client.name, userId: client.userId});
        });
        res.json(cleanClients);
    });
};

exports.deleteClients = function(req, res) {
    if(!req.body.id) {
        res.status(400).json({error: {name: "EINVALID", message: 'No id given.'}});
        return;
    }
    Client.findByIdAndRemove(req.body.id, function(err, client) {
        if (err) {
            res.status(500).json({error: {name: err.name, message: err.message}});
            return;
        }
        if(client == null) {
            res.status(400).json({error: {name: "ENOTFOUND", message: "The given id was not found."}});
        } else {
            util.log('Client `'+client._id+'` deleted.');
            res.json({message: "Client deleted."});
        }
    });
};
