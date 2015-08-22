var User = require('../../models/user.js');
var Perm = require('../../models/permissions.js');
var util = require('../../util.js');

exports.postUser = function(req, res) {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({error: {name: "EINVALID", message: 'Username/Password not filled in.'}});
        return;
    }
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        group: '1'
    });
    user.save(function(err) {
        if (err) {
            res.status(500).json({error: {name: err.name, message: err.message}});
            return;
        }
        cleanUser = ({_id: user._id, username: user.username, mailboxes: user.mailboxes, group: user.group});
        res.json(cleanUser);
        util.log('New user `'+user.username+'` registered.');
    });
};

exports.getUser = function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.status(500).json({error: {name: err.name, message: err.message}});
            util.error(err, true);
            return;
        }
        var cleanUsers = [];
        users.forEach(function(user) {
            cleanUsers.push({_id: user._id, username: user.username, mailboxes: user.mailboxes, group: user.group});
        });
        res.json(cleanUsers);
    });
};

exports.deleteUser = function(req, res) {
    if(!req.body.id) {
        res.status(400).json({error: {name: "EINVALID", message: 'No id given.'}});
        return;
    }
    User.findById(req.body.id, function(err, user) {
        if (err) {
            res.status(500).json({error: {name: err.name, message: err.message}});
            return;
        }
        if(user == null) {
            res.status(400).json({error: {name: "ENOTFOUND", message: "The given user was not found."}});
        } else if(user.username == req.user.username) {
            res.status(400).json({error: {name: "EPERMITTED", message: "You cannot delete yourself."}});
        } else if(user.name == 'admin') {
            res.status(400).json({error: {name: "EPERMITTED", message: "You cannot delete the first user."}});
        } else {
            user.remove();
            util.log('User `'+user.username+'` deleted.');
            res.json({message: "User deleted."});
        }
    });
};

exports.updateUserGroup = function(req, res) {
    if(!req.body.id||!req.body.group) {
        res.status(400).json({error: {name: "EINVALID", message: 'No id/group given.'}});
        return;
    }
    if(req.body.group>3||req.body.group<1) {
        res.status(400).json({error: {name: "EINVALID", message: 'Group not valid.'}});
        return;
    }
    User.findById(req.body.id, function(err, user) {
        if (err) {
            res.status(500).json({error: {name: err.name, message: err.message}});
            return;
        }
        if(user == null) {
            res.status(400).json({error: {name: "ENOTFOUND", message: "The given id was not found."}});
        } else if(user.username == req.user.username) {
            res.status(400).json({error: {name: "EPERMITTED", message: "You cannot change your own group."}});
        } else if(user.name == 'admin') {
            res.status(400).json({error: {name: "EPERMITTED", message: "You cannot change the group of the first user."}});
        } else {
            user.group = req.body.group;
            user.save(function(err) {
                if(err) {
                    res.status(500).json({error: {name: err.name, message: err.message}});
                    return;
                }
                util.log('Group of user `'+user.username+'` updated.');
                res.json({message: "User group updated."});
            });
        }
    });
}
