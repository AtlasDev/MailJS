var util = require('../util.js');
var SMTPServer = require('smtp-server').SMTPServer;
var sys = require('../sys/main.js');
var config = require('../config.json');

module.exports = function () {
    //MSA receives emails send by mail clients and handles them. requires auth, and accepts all RCPT TO.
    //Emails are added to a send queue.
    var smtp = new SMTPServer({
        secure: true,
        banner: 'MailJS submission service, welcome.',
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
        onMailFrom: function(address, session, callback){
            //TODO validate tue user to have access to this mailbox
        },
        onRcptTo: function(address, session, cb){
            var blocked = false;
            var uribl = new lookup.uribl(address.address.split('@')[1], config.smtp.DNSBL);
            uribl.on('error',function(error,blocklist){
                util.error('Could not check URI blacklist on '+blocklist.zone+' for '+address.address+'.', error);
                cb(new Error('Internal Server Error.'));
            });
            uribl.on('data',function(result,blocklist){
                if(result.status == "listed") {
                    util.log('Blocked '+address.address+' on MSA because of a blacklist.');
                    blocked = true;
                    return cb(new Error('URI blacklisted by '+blocklist.zone+'.'));
                }
            });
            uribl.on('done', function(){
                if(blocked == false) {
                    return cb();
                }
            });
        }
    });
    smtp.listen(config.smtp.msa, false, function () {
        util.log('SMTP MSA server started on port '+config.smtp.msa, true);
    });
}
