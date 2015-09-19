var sys = require('../../../sys/main.js');
var speakeasy = require('speakeasy');

exports.postLogin = function(req, res, next) {
    sys.user.findByUsername(req.body.username, function (err, user) {
        if(err) {
            return res.json({error: {name: err.name, message: err.message} });
        }
        req.session.upgrade(req.body.username, 86400, function (err) {
            if(err) {
                return res.status(500).json({error: {name: err.name, message: err.message} });
            }
            var responseUser = user;
            responseUser.password = undefined;
            responseUser.tfaToken = undefined;
            if(user.tfa == true) {
                req.session.finishTFA = false;
            } else {
                req.session.finishTFA = true;
            }
            return res.json({token: req.session.id, needTFA: user.tfa, user: responseUser});
        });
    });
};

exports.deleteLogin = function(req, res, next) {
    req.session.destroy();
    return res.json({message: 'Logout successfull.'});
}

exports.patchLogin = function (req, res) {
    if(req.user.tfa == true && req.authinfo.type == 'session') {
        if(req.session.finishTFA == true) {
            return req.status(400).json({error: {
                "name": "EINVALID",
                "message": "User already authenticated."
            }});
        }
    }
    if(!req.body.code) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'TOTP value missing.'}});
    }
    var code = req.body.code;
    if(req.body.code.length != 6) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'TOTP value invalid.'}});
    }
    var serverCode = speakeasy.totp({key: req.user.tfaToken});
    console.log(serverCode);
    if(serverCode != code) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'TOTP value invalid.'}});
    }
    req.session.finishTFA = true;
    return res.json({success: true});
}
