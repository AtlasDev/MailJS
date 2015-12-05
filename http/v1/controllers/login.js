var sys = require('../../../sys/main.js');
var speakeasy = require('speakeasy');

exports.postLogin = function(req, res) {
    req.session.upgrade(req.user._id, 86400, function (err) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message} });
        }
        var responseUser = req.user;
        responseUser.password = undefined;
        responseUser.tfaToken = undefined;
        if(req.user.tfa == true) {
            req.session.finishTFA = false;
        } else {
            req.session.finishTFA = true;
        }
        req.session.useragent = req.headers['user-agent'];
        return res.json({token: req.session.id, needTFA: req.user.tfa, user: responseUser});
    });
};

exports.deleteLogin = function(req, res) {
    req.session.destroy(function (err) {
        if (err) return res.status(500).json({error: {name: err.name, message: err.message}});
        return res.json({message: 'Logout successfull.'});
    });
}

exports.patchLogin = function (req, res) {
    if(req.user.tfa == true && req.authInfo.type == 'session') {
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
    if(code.length != 6) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'TOTP value invalid.'}});
    }
    var serverCode = speakeasy.totp({key: req.user.tfaToken, encoding: 'base32'});
    if(serverCode != code) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'TOTP value invalid.'}});
    }
    req.session.finishTFA = true;
    return res.json({success: true});
}
