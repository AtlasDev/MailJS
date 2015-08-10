var User = require('../../models/user.js');
var util = require('../../util.js');
var session = require('../../redis-session.js');
var User = require('../../models/user');

exports.postLogin = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if(username == '' || password == '') {
        res.status(400).json({error: {name: "EINVALID", message: 'Username/password invalid.'}});
        return;
    }
    User.findOne({ username: username }, function (err, user) {
        if (err) {
            res.status(500).json({error: {name: err.name, message: err.message}});
            return;
        }
        if (!user) {
            res.status(400).json({error: {name: "EINVALID", message: 'Username/password invalid.'}});
            return;
        }
        user.verifyPassword(password, function(err, isMatch) {
            if (err) {
                res.status(500).json({error: {name: err.name, message: err.message}});
                return;
            }
            if (!isMatch) {
                res.status(400).json({error: {name: "EINVALID", message: 'Username/password invalid.'}});
                return;
            }
            session.create({
                app: 'mailjs',
                id: user._id,
                ip: req.ip,
                ttl: 86400,
                d: {
                    username: user.username,
                    group: user.group
                }
            }, function (err, resp) {
                if(err) {
                    res.status(500).json({error: {name: err.name, message: err.message}});
                    return;
                }
                res.json({token: resp.token, userid: user._id});
            });
        });
    });
};
