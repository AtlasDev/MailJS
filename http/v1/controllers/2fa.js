var sys = require('../../../sys/main.js');
var util = require('../../../util.js');
var sessions = require('../../../sessions.js');
var speakeasy = require('speakeasy');

exports.getTFA = function (req, res) {
    var key = speakeasy.generate_key({length: 15});
    var user = req.user;
    user.tfaToken = key.base32;
    user.save(function (err) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        return res.json({
            key: key.base32,
            uri: 'otpauth://totp/MailJS?secret='+key.base32
        });
    });
}

exports.postTFA = function (req, res) {
    if(!req.body.code) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'TOTP value missing.'}});
    }
    var user = req.user;
    var key = user.tfaToken;
    var code = req.body.code
    console.log(code);
    if(code.length != 6) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'TOTP value invalid.'}});
    }
    var serverCode = speakeasy.totp({key: key});
    console.log(serverCode);
    if(serverCode != code) {
        return res.status(400).json({error: {name: 'EINVALID', message: 'TOTP value invalid.'}});
    }
    user.tfa = true;
    user.save(function (err) {
        if(err) {
            return res.status(500).json({error: {name: err.name, message: err.message}});
        }
        sessions.killAll(user.username, function (err, resp) {
            if(err) {
                return res.status(500).json({error: {name: err.name, message: err.message}});
            }
            return res.json({message: "2FA has been enabled."});
        });
    })
}
