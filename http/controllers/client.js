var Client = require('../../models/client.js');
var Perm = require('../../models/permissions.js');
var util = require('../../util.js');

exports.postClients = function(req, res) {
    if(!req.body.name||!req.body.scope) {
        res.status(400).json({error: {name: "EINVALID", message: 'Missing parameters.'}});
        return;
    }
    Perm.findOne({name: 'client.create'}, function(err, permission) {
        if(permission.group <= req.user.group) {
            var client = new Client();
            var id = util.uid(10);
            var secret = util.uid(10);
            client.name = req.body.name;
            client.id = id;
            client.secret = secret;
            client.userId = req.user._id;
            client.scope = req.body.scope;
            client.save(function(err) {
                if (err) {
                    res.status(500).json({error: {name: err.name, message: err.message}});
                    return;
                }
                var responseClient = client;
                responseClient.id = id;
                responseClient.secret = secret;
                res.json({ message: 'Client added!', data: responseClient });
                util.log('New client `'+client.name+'` created');
            });
        } else {
            res.status(403).json({error: {name: 'EPERM', message: 'Permission denied.'}});
        }
    });
};

exports.getClients = function(req, res) {
    console.log(req.authInfo);
    Perm.findOne({name: 'client.list'}, function(err, permission) {
        if(permission.group <= req.user.group) {
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
        } else {
            res.status(403).json({error: {name: 'EPERM', message: 'Permission denied.'}});
        }
    });
};

exports.deleteClients = function(req, res) {
    if(!req.body.id) {
        res.status(400).json({error: {name: "EINVALID", message: 'No id given.'}});
        return;
    }
    Perm.findOne({name: 'client.delete'}, function(err, permission) {
        if(permission.group <= req.user.group) {
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
        } else {
            res.status(403).json({error: {name: 'EPERM', message: 'Permission denied.'}});
        }
    });
};
