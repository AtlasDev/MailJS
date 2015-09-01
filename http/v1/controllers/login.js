var sys = require('../../../sys/main.js');

exports.postLogin = function(req, res, next) {
    sys.user.findByUsername(req.body.username, function (err, user) {
        if(err) {
            return res.json({error: {name: err.name, message: err.message} });
        }
        req.session.d.user = user;
        req.session.upgrade(req.body.username, 86400, function (err) {
            var responseUser = user;
            responseUser.password = undefined;
            if(err) {
                return res.json({error: {name: err.name, message: err.message} });
            }
            return res.json({token: req.session.id, user: responseUser});
        });
    });
};

exports.deleteLogin = function(req, res, next) {
    req.session.destroy();
    return res.json({message: 'Logout successfull.'});
}
