var User = require('../../models/user.js');
var util = require('../../util.js');
var User = require('../../models/user');
var passport = require('passport');
var sessions = require('../../sessions.js');

exports.postLogin = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if(username == '' || password == '') {
        res.status(400).json({error: {name: "EINVALID", message: 'Username/password invalid.'}});
        return;
    }
    passport.authenticate('user', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.status(400).json({error: {name: "EINVALID", message: 'Username/password invalid.'}});
        }
        if (err) { return next(err); }
        sessions.create(user.username, req.ip, {}, function (err, session) {
            if (err) { return next(err) }
            res.cookie('session', session);
            return res.json({user: user._id, session: session});
        });
    })(req, res, next);
};
