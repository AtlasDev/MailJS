(function () {
'use strict';

var User = require('../../../models/user.js');
var sys = require('../../../sys/main.js');
exports.postUser = function(req, res) {
    if(!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName) {
        res.status(400).json({error: {name: "EMISSING", message: 'Request data is missing.'}});
        return;
    }
    sys.user.create(req.body.username, req.body.password, req.body.firstName, req.body.lastName, false, function (err, user) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
        var responseUser = user;
        responseUser.password = undefined;
        responseUser.tfaToken = undefined;
        return res.json({ message: 'User added!', data: user });
    });
};

exports.currentUser = function (req, res) {
    var user = req.user;
    user.password = undefined;
    user.tfaToken = undefined;
    return res.json({user: user});
};

exports.getUser = function(req, res) {
    if(req.query.getBy && (req.query.getBy != 'ID' || req.query.getBy != 'username')) {
        return res.status(400).json({error: {name: "EINVALID", message: 'Invalid getBy parameter.'}});
    }
    if(req.query.getBy == 'username') {
        sys.user.findByUsername(req.query.user, function (err, user) {
            if(err) {
                res.status(500).json({error: {name: err.name, message: err.message}});
                sys.util.error(err, true);
                return;
            }
            if(user === false) {
                return res.status(404).json({error: {name: "ENOTFOUND", message: 'Could not find user.'}});
            }
            return res.json({user: user});
        });
    } else {
        sys.user.find(req.params.user, function (err, user) {
            if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
            if(user === false) {
                return res.status(404).json({error: {name: "ENOTFOUND", message: 'Could not find user.'}});
            }
            user.username = undefined;
            user.password = undefined;
            user.tfaToken = undefined;
            return res.json({user: user});
        });
    }
};

exports.getUsers = function(req, res) {
    if(req.query.limitBy) {
        if(isNaN(req.query.limitBy)) {
            return res.status(400).json({error: {name: "EINVALID", message: 'LimitBy should be a number.'}});
        }
    }
    if(req.query.skip) {
        if(isNaN(req.query.skip)) {
            res.status(400).json({error: {name: "EINVALID", message: 'Skip should be a number.'}});
            return;
        }
    }
    sys.user.findAll(req.query.LimitBy, req.query.skip, function (err, users) {
        if (err) {
            res.status(500).json({error: {name: err.name, message: err.message}});
            sys.util.error(err, true);
            return;
        }
        users.forEach(function (user) {
            user.password = undefined;
            user.tfaToken = undefined;
        });
        res.json({users: users});
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
        if(user === null) {
            res.status(400).json({error: {name: "ENOTFOUND", message: "The given user was not found."}});
        } else if(user.username == req.user.username) {
            res.status(400).json({error: {name: "EPERMITTED", message: "You cannot delete yourself."}});
        } else if(user.name == 'admin') {
            res.status(400).json({error: {name: "EPERMITTED", message: "You cannot delete the first user."}});
        } else {
            user.remove();
            sys.util.log('User `'+user.username+'` deleted.');
            res.json({message: "User deleted."});
        }
    });
};
}());
