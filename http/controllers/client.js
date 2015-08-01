var Client = require('../../models/client.js');
var Perm = require('../../models/permissions.js');
var util = require('../../util.js');

exports.postClients = function(req, res) {
    if(!req.body.name) {
        res.status(400).json({error: {name: "EINVAILID", message: 'Name not filled in.'}});
    }
    Perm.findOne({name: 'createClient'}, function(err, permission) {
        if(permission.group <= req.user.group) {
            var client = new Client();

            var id = util.uid(10);
            var secret = util.uid(10);
            
            client.name = req.body.name;
            client.id = id;
            client.secret = secret;
            client.userId = req.user._id;

            client.save(function(err) {
                if (err) {
                    res.status(500).json({error: {name: err.name, message: err.message}});
                }
                var responseClient = client;
                responseClient.id = id;
                responseClient.secret = secret;
                res.json({ message: 'Client added!', data: responseClient });
                util.log('New client `'+client._id+'` created');
            });
        } else {
            res.status(403).json({error: {name: 'EPERM', message: 'Permission denied.'}});
        }
    });
};

exports.getClients = function(req, res) {
    Perm.findOne({name: 'viewClients'}, function(err, permission) {
        if(permission.group <= req.user.group) {
            Client.find({ userId: req.user._id }, function(err, clients) {
                if (err) {
                    res.status(500).json({error: {name: err.name, message: err.message}});
                }
                res.json(clients);
            });
        } else {
            res.status(403).json({error: {name: 'EPERM', message: 'Permission denied.'}});
        }
    });
};

exports.deleteClients = function(req, res) {
    Perm.findOne({name: 'deleteClient'}, function(err, permission) {
        if(permission.group <= req.user.group) {
            if(!req.body.id) {
                res.status(400).json({error: {name: "EINVAILID", message: 'No id given.'}});
            }
            Client.findByIdAndRemove(req.body.id, function(err, client) {
                if (err) {
                    res.status(500).json({error: {name: err.name, message: err.message}});
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