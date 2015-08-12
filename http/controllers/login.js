var User = require('../../models/user.js');
var util = require('../../util.js');
var User = require('../../models/user');

exports.postLogin = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if(username == '' || password == '') {
        res.status(400).json({error: {name: "EINVALID", message: 'Username/password invalid.'}});
        return;
    }
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });
};
