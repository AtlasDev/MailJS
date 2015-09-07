var sys = require('../../../sys/main.js');

exports.postLogin = function(req, res, next) {
    sys.user.findByUsername(req.body.username, function (err, user) {
        if(err) {
            return res.json({error: {name: err.name, message: err.message} });
        }
        req.session.upgrade(req.body.username, 86400, function (err) {
            if(err) {
                return res.json({error: {name: err.name, message: err.message} });
            }
            var responseUser = user;
            responseUser.password = undefined;
            responseUser.tfaToken = undefined;
            if(user.tfa == true) {
                req.session.finishTFA = false;
                return res.json({token: req.session.id, needTFA: user.tfa, TFAuri: "/api/v1/2fa/login", user: responseUser});
            } else {
                req.session.finishTFA = true;
                return res.json({token: req.session.id, needTFA: user.tfa, user: responseUser});
            }
        });
    });
};

exports.deleteLogin = function(req, res, next) {
    req.session.destroy();
    return res.json({message: 'Logout successfull.'});
}

exports.patchLogin = function (req, res) {

}
