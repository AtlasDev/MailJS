var sys = require('../../../sys/main.js');
var speakeasy = require('speakeasy');
var util = require('../../../util.js');

exports.postLogin = function(req, res, next) {
    sys.user.findByUsername(req.body.username, function (err, user) {
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
        req.session.useragent = req.headers['user-agent'];
        req.session.id = util.uid(50);
        sys.sessions.create(req.session.id, req.user._id, req.ip, req.session, function (err) {
            if(err) {
                return res.status(500).json({error: {name: err.name, message: err.message} });
            }
            res.cookie('MailJS', req.session.id, {signed: true});
            return res.json({token: req.session.id, needTFA: user.tfa, user: responseUser});
        });
    });
};

exports.deleteLogin = function(req, res, next) {
    sys.sessions.destroy(req.session.sessionID, null, function (err) {
        if (err) return res.status(err.type || 500).json({error: {name: err.name, message: err.message}});
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
    if(req.body.code.length != 6) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'TOTP value invalid.'}});
    }
    var serverCode = speakeasy.totp({key: req.user.tfaToken, encoding: 'base32'});
    if(serverCode != code) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'TOTP value invalid.'}});
    }
    req.session.finishTFA = true;
    return res.json({success: true});
}
