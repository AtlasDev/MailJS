/**
 * @file The main SMTP handler
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var util = require('../util.js');
var SMTPServer = require('smtp-server').SMTPServer;
var sys = require('../sys/main.js');

var smtp = function() {
    var smtp = new SMTPServer({
        secure: true,
        banner: 'MailJS ESMTP service, welcome.',
        authMethods: ['LOGIN', 'XOAUTH2'],
        logger: false,
        onAuth: function (auth, session, cb) {
            console.log(auth);
            if(auth.method == "LOGIN") {
                sys.user.verify(auth.username, auth.password, function (err, isMatch, user) {
                    if(err) {
                        return cb(err);
                    }
                    if(!isMatch) {
                        return cb(new Error('Invalid username and/or password'));
                    }
                    return cb(null, {user: user});
                })
            } else if(auth.method == 'XOAUTH2') {
                //TODO
                return cb(new Error('Auth method not implemented.'));
            } else {
                return cb(new Error('Auth method not accepted.'));
            }
        },
        onRcptTo: function(address, session, cb){
            sys.mailbox.verify(address.address, function (err, isValid) {
                if(err) {
                    return cb(err);
                }
                if(!isValid) {
                    return cb(new Error('Mail address is not found.'));
                }
                return cb();
            });
        }
    });
    smtp.listen(465, false, function () {
        util.log('SMTP server started on port 465', true);
    });
};

module.exports = smtp;
