var User = require('../../../models/user.js');
var sys = require('../../../sys/main.js');
var util = require('../../../util.js');

exports.postUser = function(req, res) {
    sys.perms.hasPerm('user.create', req.user.group, req.authInfo, function (err, hasPerm) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        if(hasPerm != true) {
            return res.status(400).json({error: {name: 'EPERM', message: 'Permission denied.'}});
        }
        if(!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName) {
            res.status(400).json({error: {name: "EINVALID", message: 'Request data is missing.'}});
            return;
        }
        sys.user.create(req.body.username, req.body.password, req.body.firstName, req.body.lastName, function (err, user) {
            if(err) {
                return res.status(500).json({error: {name: err.name, message: err.message}});
            }
            responseUser = user;
            responseUser.password = undefined;
            return res.json({ message: 'User added!', data: user });
        });
    });
};

exports.setupUser = function (req, res) {
    if(req.user.mailboxes.length > 0) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'Account has already been setup.'}});
    }
    sys.group.getGroup(req.user.group, function (err, group) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        sys.domain.getDomains(function (err, domains) {
            if(err) {
                return res.status(500).json({error: {name: err.name, message: err.message}});
            }
            var canCreate = (group.permissions.indexOf('mailbox.create') > -1) ? true : false;
            console.log(canCreate);
            res.render('setup', { username: req.user.username, canCreate: canCreate, domains: domains });
        })
    })
}

// deprecated
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

exports.getUsers = function(req, res) {
    sys.perms.hasPerm('user.list', req.user.group, req.authInfo, function (err, hasPerm) {
        if (err) {
            res.status(500).json({error: {name: err.name, message: err.message}});
            util.error(err, true);
            return;
        }
        if(hasPerm != true) {
            return res.status(400).json({error: {name: 'EPERM', message: 'Permission denied.'}});
        }
        if(req.body.limitBy) {
            if(isNaN(req.body.limitBy)) {
                res.status(400).json({error: {name: "EINVALID", message: 'LimitBy should be a number.'}});
                return;
            }
        }
        if(req.body.skip) {
            if(isNaN(req.body.skip)) {
                res.status(400).json({error: {name: "EINVALID", message: 'Skip should be a number.'}});
                return;
            }
        }
        sys.user.findAll(req.body.LimitBy, req.body.skip, function (err, users) {
            if (err) {
                res.status(500).json({error: {name: err.name, message: err.message}});
                util.error(err, true);
                return;
            }
            users.forEach(function (user) {
                user.password = undefined;
            })
            res.json({users: users});
        });
    });
};

// deprecated
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

// deprecated
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
