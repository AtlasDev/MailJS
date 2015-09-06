var sys = require('../../../sys/main.js');
var util = require('../../../util.js');
var speakeasy = require('speakeasy');

exports.getTFA = function (req, res) {
    console.log(req.user);
    console.log(req.session);
    console.log(req.session.test);
    req.session.d.test = 'this is a test';
    req.session.save();
    var key = speakeasy.generate_key({length: 15});
    console.log(key.base32)
}
