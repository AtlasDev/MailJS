var sys = require('../../../sys/main.js');

exports.postLogin = function(req, res, next) {
    req.session.upgrade(req.body.username, 7200, function (err) {
        if(err) {
            return res.json({error: {name: err.name, message: err.message} });
        }
        sys.user.findByUsername(req.body.username, function (err, user) {
            if(err) {
                return res.json({error: {name: err.name, message: err.message} });
            }
            var responseUser = user;
            responseUser.password = undefined;
            res.json({token: req.session.id, user: responseUser});
        });
    });
};
