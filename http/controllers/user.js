var User = require('../../models/user.js');
var Perm = require('../../models/permissions.js');
var util = require('../../util.js');
var passport = require('passport');

exports.postUser = function(req, res) {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({error: {name: "EINVAILID", message: 'Username/Password is not vailid.'}});
    }
    Perm.findOne({name: 'createUser'}, function(err, permission) {
        if(permission.group <= req.user.group) {
            var user = new User({
                username: req.body.username,
                password: req.body.password,
                group: '1'
            });

            user.save(function(err) {
                if (err) {
                    res.status(500).json({error: {name: err.name, message: err.message}});
                }
                cleanUser = ({_id: user._id, username: user.username, mailboxes: user.mailboxes, group: user.group});
                res.json(cleanUser);
                util.log('New user `'+user.username+'` registered.');
            });
        } else {
            res.status(403).json({error: {name: 'EPERM', message: 'Permission denied.'}});
        }
    });
};

exports.getUser = function(req, res) {
    Perm.findOne({name: 'viewUsers'}, function(err, permission) {
        if(permission.group <= req.user.group) {
            User.find(function(err, users) {
                if (err) {
                    res.status(500).json({error: err});
                    util.error(err, true);
                }
                var cleanUsers = [];
                users.forEach(function(user) {
                    cleanUsers.push({_id: user._id, username: user.username, mailboxes: user.mailboxes, group: user.group});
                });
                res.json(cleanUsers);
            });
        } else {
            res.status(403).json({error: {name: 'EPERM', message: 'Permission denied.'}});
        }
    });
};

exports.deleteUser = function(req, res) {
    Perm.findOne({name: 'deleteUser'}, function(err, permission) {
        if(permission.group <= req.user.group) {
            if(!req.body.id) {
                res.status(400).json({error: {name: "EINVAILID", message: 'No id given.'}});
            }
            User.findById(req.body.id, function(err, user) {
                if (err) {
                    res.status(500).json({error: {name: err.name, message: err.message}});
                }
                if(user == null) {
                    res.status(400).json({error: {name: "ENOTFOUND", message: "The given user was not found."}});
                } else if(user.username == req.user.username) {
                    res.status(400).json({error: {name: "EPERMITTED", message: "You cannot delete yourself."}});
                } else if(user.name == 'admin') {
                    res.status(400).json({error: {name: "EPERMITTED", message: "You cannot delete the first user."}});
                } else {
                    util.log('User `'+user.username+'` deleted.');
                    res.json({message: "User deleted."});
                    user.remove();
                }
            });
        } else {
            res.status(403).json({error: {name: 'EPERM', message: 'Permission denied.'}});
        }
    });
};